<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserScore;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;

class UserScoreController extends AbstractController
{
    private $entityManager;
    private $userRepository;

    public function __construct(EntityManagerInterface $entityManager, UserRepository $userRepository)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
    }

    #[Route('/api/user/scores', name: 'app_user_score', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->render('user_score/index.html.twig', [
            'controller_name' => 'UserScoreController',
        ]);
    }

    #[Route('/api/newScore', name: 'app_new_score', methods: ['POST'])]
    #[OA\Post(
        summary: 'New user score ',
        tags: ['User score'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['userId', 'score'],
                properties: [
                    new OA\Property(property: 'userId', type: 'integer', example: 1),
                    new OA\Property(
                        property: 'score', 
                        type: 'object',   
                        required: ['quizNumber', 'scoreRate'],
                        properties: [
                            new OA\Property(property: 'quizNumber', type: 'integer', example: 1),
                            new OA\Property(property: 'scoreRate', type: 'integer', example: 100)
                        ]
                        
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
                        new OA\Property(property: 'userId', type: 'integer', example: 1),
                        new OA\Property(
                            property: 'score', 
                            type: 'object',   
                            required: ['quizNumber', 'scoreRate'],
                            properties: [
                                new OA\Property(property: 'quizNumber', type: 'integer', example: 1),
                                new OA\Property(property: 'scoreRate', type: 'integer', example: 100)
                            ]
                            
                        )
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
        
        $userId = $data['userId'] ?? '';
        $score = $data['score'] ?? '';
        $quizNumber = $score['quizNumber'] ?? ''; 
        $scoreRate = $score['scoreRate'] ?? ''; 

        $values = array ($userId, $quizNumber, $scoreRate);

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

        $user = $this->userRepository->find($userId);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }
        
        $userScore = new UserScore();

        $userScore
            ->setPlayer($user)
            ->setScores($score)
        ;
        
        $this->entityManager->persist($userScore);
        $this->entityManager->flush();

        return new JsonResponse([
            'userId'=> $userScore->getPlayer()->getId(),
            'scores' => $userScore->getScores()
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/api/showScore', name:'app_show_score', methods:['GET'])] 
    public function show (Request $request): JsonResponse
    {

    }
}
