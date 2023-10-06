<?php

namespace App\Controller;

use App\Form\QuizFormType;
use App\Entity\Answer;
use App\Entity\Question;
use App\Repository\AnswerRepository;
use App\Repository\QuestionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\VarDumper\VarDumper;

#[Route('/quiz')]
class QuizController extends AbstractController
{
    #[Route('/', name: 'app_quiz_index', methods: ['GET'])]
    public function index(QuestionRepository $questionRepository, AnswerRepository $answerRepository) : Response
    {
        return $this->render('quiz/index.html.twig', [
            'questions' => $questionRepository->findAll(),
            'answers'   => $answerRepository->findAll()
        ]);
    }

    #[Route('/new', name: 'app_quiz_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(QuizFormType::class);

        $form->handleRequest($request);
        

        if ($form->isSubmitted() && $form->isValid()) {      

            $formData = $form->getData();

            //answer text data
            $answer_array = array($formData['answer1'],$formData['answer2'],$formData['answer3'],$formData['answer4']);

            //checkbox data
            $answer_status = array($formData['answer1_status'],$formData['answer2_status'],$formData['answer3_status'],$formData['answer4_status']);

            //Save the question and get it ID
            $questionId = $this->saveQuestion ($formData['question'], $entityManager);

            // Save the answers and its status
            $this->saveAnswers($answer_array, $answer_status, $questionId, $entityManager);
        }

        return $this->render('quiz/new.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/{id}/edit', name: 'app_quiz_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Answer $answer, Question $question, EntityManagerInterface $entityManager, AnswerRepository $answerRepository, $id): Response
    {
        $ans_id_array = $answerRepository->findByQuestionId($id);

        // dump($ans_id_array[$ans_id]);

        $form = $this->createForm(QuizFormType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $formData = $form->getData();

            //answer text data
            $answer_array = array($formData['answer1'],$formData['answer2'],$formData['answer3'],$formData['answer4']);

            //checkbox data
            $answer_status = array($formData['answer1_status'],$formData['answer2_status'],$formData['answer3_status'],$formData['answer4_status']);

            //Edit question_text
            $this->editQuestion ($formData['question'], $id, $entityManager);

            // Save the answers and its status
            $this->editAnswers($answer_array, $answer_status, $ans_id_array, $entityManager, $id);

            return $this->redirectToRoute('app_quiz_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('quiz/edit.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/{id}/delete', name: 'app_quiz_delete', methods: ['GET','POST'])]
    public function delete(Request $request, Question $question, EntityManagerInterface $entityManager, AnswerRepository $answerRepository, $id): Response
    {
        // dump($question);
        if ($this->isCsrfTokenValid('delete'.$question->getId(), $request->request->get('_token'))) {

            $ans_id_array = $answerRepository->findByQuestionId($id);

            foreach($ans_id_array as $ans_id) {   
                $answer = $entityManager->getRepository(Answer::class)->find($ans_id['id']);
                $entityManager->remove($answer);
                $entityManager->flush();
            }
            $entityManager->remove($question);
            $entityManager->flush();

            return $this->redirectToRoute('app_quiz_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('quiz/show.html.twig', [
            'question' => $question
        ]);
    }

    private function editAnswers($answer_array, $answer_status, $ans_id_array, $entityManager, $id): void
    {
        foreach($ans_id_array as $indice => $ans_id) {   

            // Retrieve the Answer entity by ID
            $answer = $entityManager->getRepository(Answer::class)->find($ans_id['id']);
            
            // Check if the answer exists
            if (!$answer) {
                throw $this->createNotFoundException('Réponse introuvable!');
            }
            if ($indice < 4 ) {
                $answer
                ->setAnswerText($answer_array[$indice])
                ->setQuestionId($id)
                ->setStatus($answer_status[$indice]);
                $entityManager->persist($answer);
                $entityManager->flush();
            }
        }   
    }

    private function editQuestion(string $sqt_text, $id, $entityManager): void
    {

        // Retrieve the Question entity by ID
        $question = $entityManager->getRepository(Question::class)->find($id);

        // Check if the question exists
        if (!$question) {
            throw $this->createNotFoundException('Question introuvable!');
        }

        // Update the question_text property with the new value
        $newQuestionText = $sqt_text;
        $question->setQuestionText($newQuestionText);

        // Persist and flush the changes to the database
        $entityManager->persist($question);
        $entityManager->flush();
    }

    private function saveQuestion(string $qst_text, $entityManager): int
    {
        $question = new Question();
            $question 
            ->setQuestionText($qst_text); 
            $entityManager->persist($question);
            $entityManager->flush();
        
        return $question->getId();
    }

    private function saveAnswers($answer_array, $answer_status, $questionId,  $entityManager): void 
    {
        foreach ($answer_array as $indice => $answer_text) {
                
            $answer = new Answer();
            $answer
            ->setAnswerText($answer_text)
            ->setQuestionId($questionId)
            ->setStatus($answer_status[$indice]);
            $entityManager->persist($answer);
            $entityManager->flush();
        }
        return;
    }

}