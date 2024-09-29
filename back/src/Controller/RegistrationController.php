<?php
namespace App\Controller;

use App\Entity\User;
use App\Security\EmailVerifier;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;

class RegistrationController extends AbstractController 
{   
    private EmailVerifier $emailVerifier;

    public function __construct(EmailVerifier $emailVerifier)
    {
        $this->emailVerifier = $emailVerifier;
    }

    #[Route('/api/register', name: 'app_register', methods: ['POST'])]
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
    public function register (Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();

        $user 
        ->setEmail($data['email'] ?? '')
        ->setUserName($data['userName'] ?? '')
        ->setPassword($data['password'] ?? '')
        ->setIsVerified(false)
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
        
        $this->emailVerifier->sendEmailConfirmation(
            'app_verify_email', 
            $user, 
            (new TemplatedEmail())
            ->from(new Address('no-reply@resq.com', 'ResQ 18'))
            ->to($user->getEmail())
            ->subject('E-mail de confirmation')
            ->htmlTemplate('/registration/confirmation_email.html.twig')
        );

        return new JsonResponse ([
            'message' => 'Inscription réussie, veuillez confirmer votre e-mail.',
            'userId' => $user->getId()
        ], JsonResponse::HTTP_CREATED);
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyEmail (Request $request, UserRepository $userRepository): Response
    {
        try {
            $id = $request->query->get('id'); 
            if ($id) $user = $userRepository->find($id);
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        }
        catch (VerifyEmailExceptionInterface $exception) {
            $this->addFlash('verify_email_error', $exception->getReason());
        }

        $this->addFlash('success', 'Votre adresse e-mail a été vérifiée.');

        return $this->render('email_confirmation.html.twig');
    }

    #[Route('/api/jwt', name: 'app_create_jwt', methods: ['POST'])]
    #[OA\Post(
        summary: 'Create token',
        tags: ['User'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['id'],
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 13),
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
                        new OA\Property(property: 'id', type: 'integer', example: 13),
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
    public function createJWTToken (Request $request, JWTTokenManagerInterface $JWTManager, UserRepository $userRepository): JsonResponse
    {
        $data=json_decode($request->getContent(), true);

        $id = $data['id'];

        if ($id) $user = $userRepository->find($id);
        else {
            return new JsonResponse ([
                'error' => 'Utilisateur introuvable'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($user && $user->isVerified()) $token = $JWTManager->create($user);

        return new JsonResponse ([
            'token' => $token,
            'userName' => $user->getUsername()
        ], JsonResponse::HTTP_OK);
    }
}