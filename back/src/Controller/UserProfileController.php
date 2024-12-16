<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ResetPasswordType;
use App\Security\EmailVerifier;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Service\PasswordResetService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\HttpFoundation\JsonResponse;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Mailer\MailerInterface;

class UserProfileController extends AbstractController
{
    private $tokenStorageInterface;
    private $jwtManager;
    private $entityManager;
    private $passwordHasher;
    private $validator;
    private $userRepository;
    private $passwordResetService;
    private $mailer;
    
    public function __construct (
        JWTTokenManagerInterface $jwtManager, 
        TokenStorageInterface $tokenStorageInterface, 
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        EmailVerifier $emailVerifier,
        PasswordResetService $passwordResetService,
        MailerInterface $mailer,
    ) 
    {
        $this->entityManager = $entityManager;
        $this->jwtManager = $jwtManager;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->tokenStorageInterface = $tokenStorageInterface;
        $this->emailVerifier = $emailVerifier;
        $this->passwordResetService = $passwordResetService;
        $this->mailer = $mailer;
    }
    
    #[Route('/api/v1/reset/password', name: 'app_reset_password', methods: ['PUT'])]
    #[OA\Put(
        summary: 'Reset password',
        tags: ['Profile'],
        requestBody: new OA\RequestBody(
            description: '',
            content: new OA\JsonContent(
                type: 'object',
                required: ['oldPassword', 'newPassword'],
                properties: [
                    new OA\Property(property: 'oldPassword', type: 'string', example: 'plain text old password'),
                    new OA\Property(property: 'newPassword', type: 'string', example: 'plain text new password')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User password updated successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'User password updated' ),
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
    public function reset_password (Request $request): JsonResponse 
    {
        $data = json_decode($request->getContent(), true);

        $old_password = $data['oldPassword']?? '';
        $new_password = $data['newPassword']?? '';

        if ($old_password === '' || $new_password === '') {
            return new JsonResponse(['Error' => 'Veuillez fournir l\'ancien et le nouveau mot de passe.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $user= $this->userRepository->findOneBy(['email' => $decodedJwtToken['email']]);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        if(!$this->passwordHasher->isPasswordValid($user, $old_password)) {
            return new JsonResponse(['Error' => 'L\'ancien mot de passe est incorrect.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $this->passwordResetService->resetPassword($new_password);
            return new JsonResponse(['message' => 'Mot de passe modifié avec succès!'], JsonResponse::HTTP_OK);
        }
        catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_BAD_REQUEST);
        }      
    }

    #[Route('/api/v1/reset/user_infos', name: 'app_reset_user_infos', methods: ['PUT'])]
    #[OA\Put(
        summary: 'Change email or username',
        tags: ['Profile'],
        requestBody: new OA\RequestBody(
            description: '',
            content: new OA\JsonContent(
                type: 'object',
                required: ['email', 'username'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'mail@example.com'),
                    new OA\Property(property: 'username', type: 'string', example: 'cooler_username')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User informations updated successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'email', type: 'string', example: 'mail@example.com'),
                        new OA\Property(property: 'username', type: 'string', example: 'cooler_username')
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
    public function reset_user_infos (Request $request): JsonResponse 
    {
        $data = json_decode($request->getContent(), true);

        $newEmail = $data['email']?? '';
        $newUsername = $data['username']?? '';

        if ($newEmail === '' || $newUsername === '') {
            return new JsonResponse(['Error' => 'Veuillez des informations valides'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $user= $this->userRepository->findOneBy(['email' => $decodedJwtToken['email']]);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        $errors = $this->validator->validate(
            $user
                ->setEmail($newEmail)
                ->setUsername($newUsername)
        );

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['Errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $userFromNewEmail = $this->userRepository->findOneBy(['email' => $newEmail]);

        if ($userFromNewEmail) return new JsonResponse(['error' => 'Cette adresse e-mail est déjà utilisée.'], JsonResponse::HTTP_BAD_REQUEST);

        $user
            ->setEmail($newEmail)
            ->setUsername($newUsername)
            ->setIsVerified(false)
        ;
        
        try {
            $this->entityManager->persist($user);
            $this->entityManager->flush();

            $this->emailVerifier->sendEmailConfirmation(
                'app_verify_email', 
                $user, 
                (new TemplatedEmail())
                    ->from(new Address('no-reply@resq18.com', 'ResQ 18'))
                    ->to($user->getEmail())
                    ->subject('Confirmez votre nouveau mail')
                    ->htmlTemplate('/registration/confirmation_email.html.twig')
            );

            return new JsonResponse([
                'message' => 'Vos informations ont été mis à jour.',
                'email' => $user->getEmail()
            ], JsonResponse::HTTP_OK);        
        }
        catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue.'], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        } 
    }

    #[Route('/api/v1/reset/send_password_email', name: 'app_send_password_email', methods: ['POST'])]
    #[OA\Post(
        summary: 'Send password reset email',
        tags: ['Profile'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['email'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'chris1@mail.com')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Un email vous a été envoyé.')
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'User not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Utilisateur introuvable.')
                    ]
                )
            )
        ]
    )]
    #[Security(name: null)]
    public function send_password_email(Request $request): JsonResponse
    {
        $data=json_decode($request->getContent(), true);
        $email= $data['email'];

        if (!$email) {
            return new JsonResponse(
                ['error' => "Merci d'indiquer l'adresse email associée à votre compte."], 
                JsonResponse::HTTP_BAD_REQUEST
            );
        }
   
        $user = $this->userRepository->findOneBy(['email' => $email]);

        if(!$user) {
            return new JsonResponse([
                'error' => 'Utilisateur introuvable!'
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $this->emailVerifier->sendEmailConfirmation(
            'app_reset_forgot_password', 
            $user, 
            (new TemplatedEmail())
                ->from(new Address('no-reply@resq18.com', 'RESQ18'))
                ->to($user->getEmail())
                ->subject('Réinitialiser votre mot de passe')
                ->htmlTemplate('/emails/forgot_password.html.twig')
                ->context([
                    'username' => $user->getUsername()
                ])
        );

        return new JsonResponse (['message' => "Un email vous a été envoyé."], JsonResponse::HTTP_OK);
    }

    #[Route('/forgot_password', name:'app_reset_forgot_password')]
    public function reset_forgot_password (Request $request): Response
    {
        $user_id = $request->query->get('id');
        $user = $this->userRepository->find($user_id);

        if (!$user) {
            return $this->render('email_confirmation.html.twig', ['message' => 'Utilisateur non trouvé. Veuillez réessayer.']);
        }
        else $user->setPassword('');

        $form = $this->createForm(ResetPasswordType::class, $user);
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $new_password = $form->get('password')->getData();
            
            $this->passwordResetService->reset_password($new_password, $user);

            $email = (new TemplatedEmail())
                ->from(new Address('no-reply@resq18.com', 'RESQ18'))
                ->to($user->getEmail())
                ->subject('Mot de passe modifié')
                ->htmlTemplate('/emails/changed_password.html.twig')
                ->context([
                    'username' => $user->getUsername()
                ]);
            
            $this->mailer->send($email);

            return $this->render('email_confirmation.html.twig', ['message' => 'Votre mot de passe a été modifié avec succès.']);
        }
        // else {
        //     foreach ($form->getErrors(true) as $error) {
        //         echo $error->getMessage() . '<br>';
        //     }
        // }

        return $this->render('/reset_password.html.twig', [
            'form' => $form,
        ]);
    }

    //ecrire la route des photos de profil ici
}