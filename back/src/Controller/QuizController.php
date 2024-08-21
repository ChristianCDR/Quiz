<?php

namespace App\Controller;

use App\Entity\Questions;
use App\Entity\Options;
use App\Repository\QuestionsRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;


#[Route('/api/quiz')]
class QuizController extends AbstractController
{
    #[Route('/', name: 'api_quiz_index', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get all questions',
        tags: ['Quiz'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'List of all questions',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                            new OA\Property(
                                property: 'options',
                                type: 'array',
                                items: new OA\Items(
                                    properties: [
                                        new OA\Property(property: 'text', type: 'string', example: 'Paris'),
                                        new OA\Property(property: 'isCorrect', type: 'boolean', example: true)
                                    ]
                                )
                            )
                        ]
                    )
                )
            ),
            new OA\Response(
                response: 404,
                description: 'No question found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'No question found')
                    ]
                )
            )
        ]
    )]
    public function index(QuestionsRepository $QuestionsRepository): JsonResponse
    {
        $questions = $QuestionsRepository->findAll();

        if(!$questions){
            return new JsonResponse ([
                'error' => 'No question found'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = [];
        $opt= [];

        foreach ($questions as $question) {
            $options = $question->getOptions();

            foreach($options as $option) {
                $opt[]= [
                    'text' => $option->getOptionText(),
                    'is_correct' => $option->isIsCorrect()
                ];
            } 
            $data[]= [
                'questiontext' => $question->getQuestionText(), 
                'options' => $opt  
            ];
            $opt= [];
        }
        
        return new JsonResponse ($data, JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'app_quiz_new', methods: ['POST'])]
    #[OA\Post(
        summary: 'Create a new quiz',
        tags: ['Quiz'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['questionText'],
                properties: [
                    new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                    new OA\Property(
                        property: 'options',
                        type: 'array',
                        items: new OA\Items(
                            properties: [
                                new OA\Property(property: 'text', type: 'string', example: 'Paris'),
                                new OA\Property(property: 'isCorrect', type: 'boolean', example: true)
                            ]
                        )
                    )
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Quiz created successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                        new OA\Property(
                            property: 'options',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'text', type: 'string', example: 'Paris'),
                                    new OA\Property(property: 'isCorrect', type: 'boolean', example: true)
                                ]
                            )
                        )
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid input',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Invalid category name')
                    ]
                )
            )
        ]
    )]
    public function new (Request $request, EntityManagerInterface $entityManager): JsonResponse 
    {
        /*{
            "questionText": "Quelle est la  capitale de la France?",
            "options": [
              {
                "text": "Bordeaux",
                "isCorrect": false
              },
          {
                "text": "Lyon",
                "isCorrect": false
              },
          {
                "text": "Paris",
                "isCorrect": true
              },
          {
                "text": "Toulouse",
                "isCorrect": false
              }
            ]
          }*/
        $data = json_decode($request->getContent(), true);
        
        $question = new Questions();
        $question->setQuestionText($data['questionText'] ?? '');

        if (empty($question->getQuestionText())) {
            return new JsonResponse([
                'error' => 'Invalid question text'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (isset($data['options']) && is_array($data['options'])) {
            $options = $data['options'];
            echo json_encode($options, JSON_PRETTY_PRINT);
            
            foreach ($options as $optionData) {
                $option = new Options();
                $option->setOptionText($optionData['text'] ?? '');

                if (empty($option->getOptionText())) {
                    return new JsonResponse([
                        'error' => 'Invalid option text'
                    ], JsonResponse::HTTP_BAD_REQUEST);
                }
                
                $option->setIsCorrect($optionData['isCorrect'] ?? false);

                $question->addOption($option);  
            }
        }

        $entityManager->persist($question);
        $entityManager->flush();

        return new JsonResponse([
            'questionText' => $question->getQuestionText()
        ], Jsonresponse::HTTP_CREATED);
    }
}
