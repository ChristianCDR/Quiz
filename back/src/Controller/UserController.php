<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[Route('/api/user')]
class UserController extends AbstractController
{
    #[Route('/', name: 'app_user_index', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get users',
        tags: ['User'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'List users',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                            new OA\Property(property: 'userName', type: 'string', example: 'christian CDR'),
                            new OA\Property(property: 'password', type: 'string', example: 'hashedPassword')
                        ]
                    )
                )
            ),
            new OA\Response(
                response: 404,
                description: 'No categories found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'No categories found')
                    ]
                )
            )
        ]
    )]
    public function index(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];

        if (!$users) {
            return new JsonResponse ([
                'error' => 'No user found'
            ], JsonResponse:: HTTP_NOT_FOUND);
        }

        foreach($users as $user) {
            $data[] = [
                'userId' => $user->getId(),
                'email' => $user->getEmail(), 
                'userName' => $user->getUserName(), 
                'password' => $user->getPassword()
            ];
        }

        return new JsonResponse ($data, JsonResponse::HTTP_OK);
    }

    #[Route('/new', name: 'app_user_new', methods: ['POST'])]
    #[OA\Post(
        summary: 'Create a new user',
        tags: ['User'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['email', 'userName', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                    new OA\Property(property: 'userName', type: 'string', example: 'christian CDR'),
                    new OA\Property(property: 'password', type: 'string', example: 'plainTextPassword')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'User created successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                        new OA\Property(property: 'userName', type: 'string', example: 'christian CDR'),
                        new OA\Property(property: 'password', type: 'string', example: 'hashedPassword')
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid input',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Invalid user')
                    ]
                )
            )
        ]
    )]
    public function new(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();

        $user 
        ->setEmail($data['email'] ?? '')
        ->setUserName($data['userName'] ?? '')
        ->setPassword($data['password'] ?? '')
        ;

        if (empty($user->getEmail()) || empty($user->getUserName()) || empty($user->getPassword())) {
            return new JsonResponse([
                'error' => 'Les champs email, username et password sont obligatoires.'
            ], JsonResponse::HHTP_BAD_REQUEST);
        };

        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $data['password']
        );

        $user->setPassword($hashedPassword);

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse ([
            'userId' => $user->getId(),
            'email' => $user->getEmail(), 
            'userName' => $user->getUserName(), 
            'password' => $user->getPassword()
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'app_user_show', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get user by ID',
        tags: ['User'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the user to retrieve',
                example: 3
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                        new OA\Property(property: 'userName', type: 'string', example: 'christian CDR'),
                        new OA\Property(property: 'password', type: 'string', example: 'hashedPassword')
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'User not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'User not found')
                    ]
                )
            )
        ]
    )]
    public function show(User $user): JsonResponse
    {
        if(!$user) {
            return new JsonResponse([
                'error' => 'User not found'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $data = [];

        $data[] = [
            'userId' => $user->getId(),
            'email' => $user->getEmail(), 
            'userName' => $user->getUserName(), 
            'password' => $user->getPassword()
        ];

        return new JsonResponse ($data, JsonResponse::HTTP_OK);
    }

    #[Route('/{id}/edit', name: 'app_user_edit', methods: ['PUT'])]
    #[OA\Put(
        summary: 'Update an user by ID',
        tags: ['User'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the user to update',
                example: 3
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'User data to update',
            content: new OA\JsonContent(
                type: 'object',
                required: ['email', 'userName', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                    new OA\Property(property: 'userName', type: 'string', example: 'christian CDR'),
                    new OA\Property(property: 'password', type: 'string', example: 'plainTextPassword')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User updated successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                        new OA\Property(property: 'userName', type: 'string', example: 'christian CDR'),
                        new OA\Property(property: 'password', type: 'string', example: 'hashedPassword')
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'User not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'User not found')
                    ]
                )
            )
        ]
    )]
    public function edit(Request $request, User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$user) {
            return new JsonResponse([
                'error' => 'User not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $data= json_decode($request->getContent(), true);

        if (isset($data['email']) && isset($data['userName']) && isset($data['password'])) {
            $user 
            ->setEmail($data['email'])
            ->setUserName($data['userName'])
            ->setPassword($data['password'])
            ;
        }
        else {
            return new JsonResponse ([
                'error' => 'Invalid category name or image'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse ($data, JsonResponse::HTTP_OK);
    }

    #[Route('/{id}', name: 'app_user_delete', methods: ['DELETE'])]
    #[OA\Delete(
        summary: 'Delete an user by ID',
        tags: ['User'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the user to delete',
                example: 5
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'User deleted successfully'
            ),
            new OA\Response(
                response: 404,
                description: 'User not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'User not found')
                    ]
                )
            )
        ]
    )]
    public function delete(Request $request, User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        if (!$user) {
            return new JsonResponse([
                'error' => 'User not found'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'User deleted successfully'
        ], JsonResponse::HTTP_NO_CONTENT);
    }
}
