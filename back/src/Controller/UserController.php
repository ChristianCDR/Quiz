<?php

namespace App\Controller;

use App\Entity\User;
use App\Security\EmailVerifier;
use App\Service\FileHandler;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

#[Route('/api/v1/user')]
class UserController extends AbstractController
{
    private $tokenStorageInterface;
    private $jwtManager;
    private $entityManager;
    private $passwordHasher;
    private $validator;
    private $userRepository;
    private $fileHandler;
    
    public function __construct (
        JWTTokenManagerInterface $jwtManager, 
        TokenStorageInterface $tokenStorageInterface, 
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        FileHandler $fileHandler
    ) 
    {
        $this->entityManager = $entityManager;
        $this->jwtManager = $jwtManager;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->tokenStorageInterface = $tokenStorageInterface;
        $this->fileHandler = $fileHandler;
    }

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
                            new OA\Property(property: 'username', type: 'string', example: 'christian CDR'),
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
    public function index(): JsonResponse
    {
        $users = $this->userRepository->findAll();
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
                'username' => $user->getUsername(), 
                'password' => $user->getPassword()
            ];
        }

        return new JsonResponse ($data, JsonResponse::HTTP_OK);
    }

    #[Route('/infos', name: 'app_user_infos', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get user infos',
        tags: ['User'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'User retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                        new OA\Property(property: 'username', type: 'string', example: 'christian CDR'),
                        new OA\Property(property: 'profilePhoto', type: 'string', example: 'profilePhoto.jpg')
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
    public function show(): JsonResponse
    {
        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $user = $this->userRepository->findOneBy(['email' => $decodedJwtToken['email']]) ;

        if(!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        $data = [];

        $data[] = [
            'userId' => $user->getId(),
            'email' => $user->getEmail(), 
            'username' => $user->getUsername(),
            'profilePhoto' => $user->getProfilePhoto()
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
                required: ['email', 'username', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'mail@mail.com'),
                    new OA\Property(property: 'username', type: 'string', example: 'christian CDR'),
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
                        new OA\Property(property: 'username', type: 'string', example: 'christian CDR'),
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
    public function edit(Request $request, User $user): JsonResponse
    {
        if (!$user) {
            return new JsonResponse([
                'error' => 'User not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $data= json_decode($request->getContent(), true);

        if (isset($data['email']) && isset($data['username']) && isset($data['password'])) {
            $user 
            ->setEmail($data['email'])
            ->setusername($data['username'])
            ->setPassword($data['password'])
            ;
        }
        else {
            return new JsonResponse ([
                'error' => 'Invalid category name or image'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse ($data, JsonResponse::HTTP_OK);
    }

    #[Route('/delete', name: 'app_user_delete', methods: ['DELETE'])]
    #[OA\Delete(
        summary: 'Delete an user by ID',
        tags: ['User'],
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
    public function delete(): JsonResponse
    {
        $decodedToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $user = $this->userRepository->findOneBy(['email' => $decodedToken['email']]);

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $profilePhoto = $user->getProfilePhoto();

        $this->fileHandler->delete($profilePhoto);

        $this->entityManager->remove($user);
        $this->entityManager->flush();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
