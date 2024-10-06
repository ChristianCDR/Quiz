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
    private $userRepository;
    private $JWTManager;

    public function __construct(RefreshTokenManager $refreshTokenManager, JWTTokenManagerInterface $JWTManager,  UserRepository $userRepository)
    {
        $this->refreshTokenManager = $refreshTokenManager;
        $this->userRepository =$userRepository;
        $this->JWTManager = $JWTManager;
    }

    #[Route(path: '/api/login', name: 'app_login', methods: ['POST'])]
    #[OA\Post(
        summary: 'Log user',
        tags: ['Auth'],
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
    #[Security(name: null)]
    public function login(Request $request, RefreshTokenManager $refreshTokenManager, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data=json_decode($request->getContent(), true);
        $email= $data['email'];
        $password= $data['password'];

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Veuillez renseigner votre e-mail et votre mot de passe'], JsonResponse::HTTP_BAD_REQUEST);
        }
   
        $user = $this->userRepository->findOneBy(['email'=>$email]);
        
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
            'accessToken' => $token,
            'refreshToken' => $refreshToken->getToken()
        ], JsonResponse::HTTP_OK);
        
    }

    #[Route(path: '/api/refreshToken', name: 'app_refresh_token', methods: ['POST'])]
    #[OA\Post(
        summary: 'Refresh token',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['token'],
                properties: [
                    new OA\Property(property: 'token', type: 'string', example: 'b3a79766cb948ccdfbc9e23fda70461dff08db79da831a1ac5e31ecffe84608b'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Token refreshed successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'token', type: 'string', example: 'jwt token'),
                        new OA\Property(property: 'refreshToken', type: 'string', example: 'refresh token')
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid token',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Invalid Token')
                    ]
                )
            )
        ]
    )]
    public function refreshToken(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $refreshToken = $data['refreshToken'];

        $isValidToken = $this->refreshTokenManager->isValidToken($refreshToken);
       
        if (!$isValidToken) {
            return new JsonResponse(['error' => 'Refresh token invalide ou expiré'], JsonResponse::HTTP_UNAUTHORIZED);  
        }

        $refreshTokenUser = $this->refreshTokenManager->getUserIdentifierFromRefreshToken($refreshToken);

        $userIdentifier = $refreshTokenUser->getUserIdentifier();
        
        $user = $this->userRepository->findOneBy(['email'=>$userIdentifier]);

        $newJWTToken = $this->JWTManager->create($user);
        $newRefreshToken = $this->refreshTokenManager->updateRefreshToken($refreshToken, $userIdentifier);
            
        return new JsonResponse([
            'accessToken' => $newJWTToken,
            'refreshToken' => $newRefreshToken->getToken()
        ]);    
    }

    #[Route(path: '/api/logout', name: 'app_logout', methods: ['POST'])]
    #[OA\Post(
        summary: 'Logout user',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['token'],
                properties: [
                    new OA\Property(property: 'token', type: 'string', example: '9fc8a9c7945daf1fa65a8956103809b2dd3560656fc2626aec508f8babd72117'),
                ]
            )
        )
    )]
    #[Security(name: null)]
    public function logout(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $refreshToken = $data['refreshToken'];

        $this->refreshTokenManager->revokeRefreshToken($refreshToken);

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }
}
