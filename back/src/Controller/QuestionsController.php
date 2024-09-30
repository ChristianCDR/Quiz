<?php

namespace App\Controller;

use App\Entity\Questions;
use App\Entity\Options;
use App\Entity\Categories;
use App\Repository\CategoriesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;


#[Route('/api/questions')]
class QuestionsController extends AbstractController
{
    #[Route('/', name: 'api_question_index', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get all questions',
        tags: ['Questions'],
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
                                property: 'categories', 
                                type: 'array',
                                items: new OA\Items(
                                    properties: [
                                        new OA\Property(property: 'category', type: 'integer', example: 1)
                                    ]
                                )
                            ),
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
        $cat= [];

        foreach ($questions as $question) {
            $options = $question->getOptions();
            $categories = $question->getCategories();

            foreach($options as $option) {
                $opt[]= [
                    'text' => $option->getOptionText(),
                    'is_correct' => $option->isIsCorrect()
                ];
            } 

            foreach($categories as $category) {
                $cat[]= [
                    'category' => $category->getCategoryName()
                ];
            }

            $data[]= [
                'questiontext' => $question->getQuestionText(), 
                'categories' => $cat,
                'options' => $opt,
            ];
            $opt= [];
            $cat= [];
        }
        
        return new JsonResponse ($data, JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'app_question_new', methods: ['POST'])]
    #[OA\Post(
        summary: 'Create a new question',
        tags: ['Questions'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['questionText', 'options', 'categories'],
                properties: [
                    new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                    new OA\Property(
                        property: 'categories', 
                        type: 'array',
                        items: new OA\Items(
                            properties: [
                                new OA\Property(property: 'category', type: 'integer', example: 1)
                            ]
                        )
                    ),
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
                description: 'Question created successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [      
                        new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                        new OA\Property(
                            property: 'categories', 
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'category', type: 'integer', example: 1)
                                ]
                            )
                        ),
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
                        new OA\Property(property: 'error', type: 'string', example: 'Invalid question')
                    ]
                )
            )
        ]
    )]
    public function new (Request $request, CategoriesRepository $categoriesRepository, EntityManagerInterface $entityManager): JsonResponse 
    {
        /*{
            "questionText": "Quelle est la  capitale de la France?",
            "categories": [
              {
                "category": 1
              },
            ],
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

        if (isset($data['categories']) && is_array($data['categories'])) {
            $categories = $data['categories'];
            
            foreach($categories as $categoryData) {
                $categoryId = intVal($categoryData['category']);   
                $category = $categoriesRepository->find($categoryId);            
                $question->addCategory($category);
            }     
        }
        
        $entityManager->persist($question);
        $entityManager->flush();

        return new JsonResponse([
            'questionText' => $question->getQuestionText(),
            'categories' => $data['categories'],
            'options' => $data['options']
        ], Jsonresponse::HTTP_CREATED);
    }

    #[Route('/{id}/show', name:'app_question_show', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get a question by ID',
        tags: ['Questions'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the question to retrieve',
                example: 12
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Question retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                        new OA\Property(
                            property: 'categories', 
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'category', type: 'integer', example: 1)
                                ]
                            )
                        ),
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
                response: 404,
                description: 'Question not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Question not found')
                    ]
                )
            )
        ]
    )]
    public function show (Questions $question) :JsonResponse
    {
        if (!$question) {
            return new JsonResponse([
                'error' => 'Question not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        
        $options = $question->getOptions();
        $categories = $question->getCategories();

        $opt = [];
        $cat = [];

        foreach($options as $option) {
            $opt[]= [
                'text' => $option->getOptionText(),
                'is_correct' => $option->isIsCorrect()
            ];
        }

        foreach($categories as $category) {
            $cat[]= [
                'category' => $category->getCategoryName()
            ];
        }

        return new JsonResponse([
            'questionText' => $question->getQuestionText(),
            'categories' => $cat,
            'options' => $opt
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/{id}/edit', name: 'app_question_edit', methods: ['PUT'])]
    #[OA\Put(
        summary: 'Update a question by ID',
        tags: ['Questions'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the question to update',
                example: 9
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Question data to update',
            content: new OA\JsonContent(
                type: 'object',
                required: ['questionText', 'options'],
                properties: [
                    new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                    new OA\Property(
                        property: 'categories', 
                        type: 'array',
                        items: new OA\Items(
                            properties: [
                                new OA\Property(property: 'category', type: 'integer', example: 1)
                            ]
                        )
                    ),
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
                response: 200,
                description: 'Question updated successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                        new OA\Property(
                            property: 'categories', 
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'category', type: 'integer', example: 1)
                                ]
                            )
                        ),
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
                response: 404,
                description: 'Question not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Question not found')
                    ]
                )
            )
        ]
    )]
    public function edit (Request $request, Questions $question, CategoriesRepository $categoriesRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        if(!$question) {
            return new JsonResponse([
                'error' => 'Question not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $data= json_decode($request->getContent(), true);
        // echo json_encode($data, JSON_PRETTY_PRINT);
        
        $question->setQuestionText($data['questionText'] ?? '');

        if (empty($question->getQuestionText())) {
            return new JsonResponse([
                'error' => 'Invalid question text'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if(isset($data['options']) && is_array($data['options'])) {
            $options = $data['options'];

            foreach ($question->getOptions() as $existingOption) {
                $question->removeOption($existingOption);
                $entityManager->remove($existingOption);
            }

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

        if(isset($data['categories']) && is_array($data['categories'])) {
            $categories = $data['categories'];

            foreach ($question->getCategories() as $existingCategory) {
                $question->removeCategory($existingCategory);
            }
   
            foreach($categories as $categoryData) {
                $categoryId = intVal($categoryData['category']);   
                $category = $categoriesRepository->find($categoryId);            
                $question->addCategory($category);
            }               
        }

        $entityManager->persist($question);
        $entityManager->flush();

        return new JsonResponse ([
            'questionText' => $question->getQuestionText(),
            'categories' => $data['categories'],
            'options' => $data['options']
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/{id}/delete', name: 'app_question_delete', methods: ['DELETE'])]
    #[OA\Delete(
        summary: 'Delete a question by ID',
        tags: ['Questions'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the question to delete',
                example: 9
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Question deleted successfully'
            ),
            new OA\Response(
                response: 404,
                description: 'Question not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Question not found')
                    ]
                )
            )
        ]
    )]
    public function delete (Questions $question, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$question) {
            return new JsonResponse([
                'error' => 'Question not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($question);
        $entityManager->flush();

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }


    #[OA\Get(
        summary: 'Get a questions by categoryId',
        tags: ['Questions'],
        parameters: [
            new OA\Parameter(
                name: 'categoryId',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                example: 7
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Questions retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'questionText', type: 'text', example: 'New question text'),
                        new OA\Property(
                            property: 'categories', 
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'category', type: 'integer', example: 1)
                                ]
                            )
                        ),
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
                response: 404,
                description: 'No Question found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'No Question found')
                    ]
                )
            )
        ]
    )]
    #[route('/category/{categoryId}',name: 'app_questions_by_category', methods:['GET'])]
    public function getQuestionsByCategory (int $categoryId, QuestionsRepository $questionsRepository) : JsonResponse
    {
        $questions = $questionsRepository->findByCategoryId($categoryId);

        $data = [];
        $opt= [];
        $cat= [];

        foreach ($questions as $question) {
            $options = $question->getOptions();
            $categories = $question->getCategories();

            foreach($options as $option) {
                $opt[]= [
                    'text' => $option->getOptionText(),
                    'is_correct' => $option->isIsCorrect()
                ];
            } 

            foreach($categories as $category) {
                $cat[]= [
                    'category' => $category->getCategoryName()
                ];
            }

            $data[]= [
                'questiontext' => $question->getQuestionText(), 
                // 'categories' => $cat,
                'options' => $opt,
            ];
            $opt= [];
            $cat= [];
        }
        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }
}
