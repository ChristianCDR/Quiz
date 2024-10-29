<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserScore;
use App\Repository\UserRepository;
use App\Repository\UserScoreRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;

    // s'assurer le token presenté appartient bien au user
    // empecher un meme user de creer plusieurs scores sur le meme quiz 

class UserScoreController extends AbstractController
{
    private $entityManager;
    private $userRepository;
    private $userScoreRepository;

    public function __construct(EntityManagerInterface $entityManager, UserRepository $userRepository, UserScoreRepository $userScoreRepository)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->userScoreRepository = $userScoreRepository;
    }

    #[Route('/api/users/scores', name: 'app_users_score', methods: ['GET'])]
    #[OA\Get(
        summary: 'All users scores ',
        tags: ['User score'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Scores retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(
                            property: 'scores', 
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 29),
                                    new OA\Property(property: 'player_id', type: 'integer', example: 1),
                                    new OA\Property(property: 'quiz_id', type: 'integer', example: 1),
                                    new OA\Property(property: 'score_rate', type: 'integer', example: 90)
                                ]
                            )
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Scores not found !',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Scores not found')
                    ]
                )
            )
        ]
    )]
    public function index(): JsonResponse
    {
        $userScores = $this->userScoreRepository->findAll();
        $data = [];

        foreach($userScores as $userScore) {
            $data[] = [
                'id' => $userScore->getId(),
                'player_id' => $userScore->getPlayer()->getId(),
                'quiz_id' => $userScore->getQuizId(),
                'score_rate' => $userScore->getScoreRate()
            ];
        }

        return new JsonResponse([
            'scores' => $data
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/api/newScore', name: 'app_new_score', methods: ['POST'])]
    #[OA\Post(
        summary: 'New user score ',
        tags: ['User score'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['player_id', 'quiz_id', 'score_rate'],
                properties: [
                    new OA\Property(property: 'player_id', type: 'integer', example: 1),
                    new OA\Property(property: 'quiz_id', type: 'integer', example: 1),
                    new OA\Property(property: 'score_rate', type: 'integer', example: 90)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Score created successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'player_id', type: 'integer', example: 1),
                        new OA\Property(property: 'quiz_id', type: 'integer', example: 1),
                        new OA\Property(property: 'score_rate', type: 'integer', example: 90)
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid data',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Invalid data')
                    ]
                )
            )
        ]
    )]
    public function newScore(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $player_id = $data['player_id'] ?? '';
        $quiz_id = $data['quiz_id'] ?? ''; 
        $score_rate = $data['score_rate'] ?? ''; 

        $values = array ($player_id, $quiz_id, $score_rate);

        foreach ($values as $value) {
            if(empty($value)) {
                return new JsonResponse([
                    'error' => 'Empty request payload !'
                ]);
            }
            else if(!is_int($value)) {
                return new JsonResponse([
                    'error' => 'Request must contain integers !'
                ]);
            }
        }

        if ($score_rate > 100) {
            return new JsonResponse(['Error' => 'Le taux de réussite ne peut pas dépasser 100%!'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $this->userRepository->find($player_id);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }
        
        $userScore = new UserScore();

        $userScore
            ->setPlayer($user)
            ->setQuizId($quiz_id)
            ->setScoreRate($score_rate)
        ;
        
        $this->entityManager->persist($userScore);
        $this->entityManager->flush();
        
        return new JsonResponse([
            'player_id'=> $userScore->getPlayer()->getId(),
            'score' => $userScore->getScoreRate()
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/editScore', name:'app_edit_score', methods:['PUT'])]
    #[OA\Put(
        summary: 'Update user score ',
        tags: ['User score'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['player_id', 'quiz_id', 'score_rate'],
                properties: [
                    new OA\Property(property: 'player_id', type: 'integer', example: 1),
                    new OA\Property(property: 'quiz_id', type: 'integer', example: 1),
                    new OA\Property(property: 'score_rate', type: 'integer', example: 100)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Score updated successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'player_id', type: 'integer', example: 1),
                        new OA\Property(property: 'quiz_id', type: 'integer', example: 1),
                        new OA\Property(property: 'score_rate', type: 'integer', example: 90)
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid data',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Invalid data')
                    ]
                )
            )
        ]
    )]
    public function edit (Request $request): JsonResponse
    {
        // Lorsque le user refait un  quiz
        $data = json_decode($request->getContent(), true);
        
        $player_id = $data['player_id'] ?? '';
        $quiz_id = $data['quiz_id'] ?? ''; 
        $score_rate = $data['score_rate'] ?? ''; 

        $values = array ($player_id, $quiz_id, $score_rate);

        foreach ($values as $value) {
            if(empty($value)) {
                return new JsonResponse(['Error' => 'Empty request payload !'], JsonResponse::HTTP_BAD_REQUEST);
            }
            else if(!is_int($value)) {
                return new JsonResponse(['Error' => 'Request must contain integers !'], JsonResponse::HTTP_BAD_REQUEST);
            }
        }

        if ($score_rate > 100) {
            return new JsonResponse(['Error' => 'Le taux de réussite ne peut pas dépasser 100%!'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $userScore = $this->userScoreRepository->findOneBy(['player' => $player_id, 'quiz_id' => $quiz_id]);

        if (!$userScore) {
            throw $this->createNotFoundException("Score utilisateur non trouvé");
        }
        
        $userScore
            ->setPlayer($userScore->getPlayer())
            ->setQuizId($quiz_id)
            ->setScoreRate($score_rate)
        ;
        
        $this->entityManager->persist($userScore);
        $this->entityManager->flush();
        
        return new JsonResponse([
            'player_id'=> $userScore->getPlayer()->getId(),
            'score' => $userScore->getScoreRate()
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/api/showScore/{player_id}', name:'app_show_score', methods:['GET'])] 
    #[OA\Get(
        summary: 'Get scores by player ',
        tags: ['User score'],
        parameters: [
            new OA\Parameter(
                name: 'player_id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: '',
                example: 1
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Scores retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(
                            property: 'scores', 
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer', example: 29),
                                    new OA\Property(property: 'player_id', type: 'integer', example: 1),
                                    new OA\Property(property: 'quiz_id', type: 'integer', example: 1),
                                    new OA\Property(property: 'score_rate', type: 'integer', example: 90)
                                ]
                            )
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Scores not found !',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Scores not found')
                    ]
                )
            )
        ]
    )]
    public function show (int $player_id): JsonResponse
    {
        $player = $this->userRepository->findOneBy(['id' => $player_id]);
        $userScores = $this->userScoreRepository->findBy(['player' => $player]);
        
        $data = [];

        foreach($userScores as $userScore) {
            $data[] = [
                'id' => $userScore->getId(),
                'player_id' => $userScore->getPlayer()->getId(),
                'quiz_id' => $userScore->getQuizId(),
                'score_rate' => $userScore->getScoreRate()
            ];
        }
        
        return new JsonResponse([
            'scores' => $data
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/api/deleteScore/', name:'app_delete_score', methods:['DELETE'])] 
    #[OA\Delete(
        summary: 'Delete score',
        tags: ['User score'],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Score deleted'
            ),
            new OA\Response(
                response: 404,
                description: 'Score not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Score not found')
                    ]
                )
            )
        ]
    )]
    public function delete (Request $request): JsonResponse
    {
        // Leave empty for now
    }
}
