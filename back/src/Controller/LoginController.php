<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Security\RefreshTokenManager;
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
    private $refreshTokenManager;
    private $JWTManager;

    public function __construct(RefreshTokenManager $refreshTokenManager, JWTTokenManagerInterface $JWTManager)
    {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->JWTManager = $JWTManager;
    }

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
                    new OA\Property(property: 'email', type: 'string', example: 'chris@mail.com'),
                    new OA\Property(property: 'password', type: 'string', example: 'Azerty1@')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User logged successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Login successful'),
                        new OA\Property(property: 'username', type: 'string', example: 'christian CDR'),
                        new OA\Property(property: 'token', type: 'string', example: 'jwt token'),
                        new OA\Property(property: 'refreshToken', type: 'string', example: 'refresh token')
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
    public function login(Request $request, RefreshTokenManager $refreshTokenManager, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher): JsonResponse
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

        $token = $this->JWTManager->create($user);
        $refreshToken = $this->refreshTokenManager->createRefreshToken($user->getEmail());

        return new JsonResponse ([
            'message' => 'Login successful',
            'username' => $user->getUsername(),
            'token' => $token,
            'refreshToken' => $refreshToken->getToken()
        ], JsonResponse::HTTP_OK);
        
    }

    #[Route(path: '/refreshToken', name: 'app_refresh_token', methods: ['POST'])]
    public function refreshToken(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];

        $isValidToken = $this->refreshTokenManager->isValidToken($token);
       
        if (!$isValidToken) {
            return new JsonResponse(['error' => 'Refresh token invalide ou expiré'], JsonResponse::HTTP_UNAUTHORIZED);  
        }

        $userIdentifier = $this->refreshTokenManager->getUserIdentifierFromRefreshToken($token);
        $newRefreshToken = $this->refreshTokenManager->updateRefreshToken($token, $userIdentifier);

        $user = $userRepository->findOneBy(['email'=>$userIdentifier]);

        $newJWTToken = $this->JWTManager->create($user);
            
        return new JsonResponse([
            'token' => $newJWTToken,
            'refreshToken' => $newRefreshToken->getToken()
        ]);    
    }

    #[Route(path: '/api/logout', name: 'app_logout', methods: ['POST'])]
    
    public function logout(Request $request): void
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'];

        $this->refreshTokenManager->revokeRefreshToken($token);
    }
}
