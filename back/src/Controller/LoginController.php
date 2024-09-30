<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\HttpFoundation\JsonResponse;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class LoginController extends AbstractController
{
    #[Route(path: '/api/login', name: 'app_login', methods: ['POST'])]
    #[OA\Post(
        summary: 'Log user',
        tags: ['User'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'azerty3@mail.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'azerty')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'User logged successfully',
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
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        $data=json_decode($request->getContent(), true);
        $email= $data['email'];
        $password= $data['password'];

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Veuillez renseigner votre e-mail et votre mot de passe'], JsonResponse::HTTP_BAD_REQUEST);
        }
   
        $user = $userRepository->findOneBy(['email'=>$email]);
        
        if (!$user->isVerified()) {
            return new JsonResponse(['error' => 'Veuillez confirmer votre adresse mail avant de vous connecter '], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (!$user || !$passwordHasher->isPasswordValid($user, $password)) {
            return new JsonResponse(['error' => 'E-mail ou mot de passe invalide'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        return new JsonResponse ([
            'message' => 'Login successful',
            'userName' => $user->getUsername(),
            'token' => $JWTManager->create($user)
        ], JsonResponse::HTTP_OK);
        
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
