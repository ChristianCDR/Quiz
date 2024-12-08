<?php

namespace App\Controller;

use App\Entity\Questions;
use App\Form\QuestionsType;
use App\Repository\QuestionsRepository;
use App\Entity\Answers;
use App\Form\AnswersType;
use App\Repository\AnswersRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DashboardController extends AbstractController
{
    #[Route('/dashboard', name: 'app_dashboard', methods: ['GET'])]
    public function index(QuestionsRepository $questionsRepository, AnswersRepository $answersRepository): Response
    {
        return $this->render('dashboard/index.html.twig', [
            'questions' => $questionsRepository->findAll(),
            'answers' => $answersRepository->findAll()
        ]);
    }
}