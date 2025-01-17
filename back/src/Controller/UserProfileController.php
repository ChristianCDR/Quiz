<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\ResetPasswordType;
use App\Form\ResetCredentialsType;
use App\DTO\ResetCredentialsDTO;
use App\Security\EmailVerifier;
use App\Service\FileHandler;
use App\Service\PasswordResetService;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
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
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
    private $fileHandler;
    
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
        FileHandler $fileHandler,
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
        $this->fileHandler = $fileHandler;
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
            return new JsonResponse(['error' => 'Veuillez fournir l\'ancien et le nouveau mot de passe.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $user= $this->userRepository->findOneBy(['email' => $decodedJwtToken['email']]);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        if(!$this->passwordHasher->isPasswordValid($user, $old_password)) {
            return new JsonResponse(['error' => 'L\'ancien mot de passe est incorrect.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        try {
            $this->passwordResetService->resetPassword($new_password, $user);

            $email = (new TemplatedEmail())
                ->from(new Address('contact@resq18.fr', 'RESQ18'))
                ->to($user->getEmail())
                ->subject('Mot de passe modifié')
                ->htmlTemplate('/emails/changed_password.html.twig')
                ->context([
                    'username' => $user->getUsername()
                ]);

            $this->mailer->send($email);

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
        $isVerified = false;

        $newEmail = $data['email']?? '';
        $newUsername = $data['username']?? '';
        
        if ($newEmail === '' || $newUsername === '') {
            return new JsonResponse(['error' => 'Veuillez saisir des informations valides'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

        $user= $this->userRepository->findOneBy(['email' => $decodedJwtToken['email']]);

        if (!$user) {
            throw $this->createNotFoundException('Utilisateur non trouvé');
        }

        $oldEmail = $user->getEmail();
        $oldUsername = $user->getUsername();

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
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $userExists = $this->userRepository->findOneBy(['email' => $newEmail]);

        if ($newEmail !== $oldEmail && $userExists) {
            return new JsonResponse(['error' => 'Cette adresse e-mail est déjà utilisée.'], JsonResponse::HTTP_BAD_REQUEST);
        }

        if ($newEmail === $oldEmail && $newUsername !== $oldUsername) {
            $isVerified = true;
        }

        $user
            ->setEmail($newEmail)
            ->setUsername($newUsername)
            ->setIsVerified($isVerified)
            ->setOldEmail($oldEmail)
        ;

        if ($newEmail !== $oldEmail) {
            $this->emailVerifier->sendEmailConfirmation(
                'app_confirm_email_reset', 
                $user,
                (new TemplatedEmail())
                    ->from(new Address('contact@resq18.fr', 'RESQ18'))
                    ->to($user->getOldEmail())
                    ->subject('Modification de votre adresse email')
                    ->htmlTemplate('/emails/reset_credentials.html.twig')
                    ->context(['username' => $oldUsername])
            );
        }   

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Vos informations ont été mis à jour.',
            'email' => $user->getEmail()
        ], JsonResponse::HTTP_OK);        
        
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
                ->from(new Address('contact@resq18.fr', 'RESQ18'))
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
            return $this->render('/pages/email_confirmation.html.twig', ['message' => 'Utilisateur non trouvé. Veuillez réessayer.']);
        }
        else $user->setPassword('');

        $form = $this->createForm(ResetPasswordType::class, $user);
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $new_password = $form->get('password')->getData();
            
            $this->passwordResetService->resetPassword($new_password, $user);

            $email = (new TemplatedEmail())
                ->from(new Address('contact@resq18.fr', 'RESQ18'))
                ->to($user->getEmail())
                ->subject('Mot de passe modifié')
                ->htmlTemplate('/emails/changed_password.html.twig')
                ->context([
                    'username' => $user->getUsername()
                ]);
            
            $this->mailer->send($email);

            return $this->render('/pages/email_confirmation.html.twig', ['message' => 'Votre mot de passe a été modifié avec succès.']);
        }
        // else {
        //     foreach ($form->getErrors(true) as $error) {
        //         echo $error->getMessage() . '<br>';
        //     }
        // }

        return $this->render('/pages/reset_password.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/api/v1/set_profile_photo', name:'app_set_profile_photo', methods:['POST'])]
    #[OA\Post(
        summary:"Upload profile photo",
        tags: ['Profile'],
        requestBody: new OA\RequestBody(
            content: [
                new OA\MediaType(
                    mediaType: "multipart/form-data",
                    schema: new OA\Schema(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'profile_photo', type: 'string', format: 'binary')
                        ]
                    )
                )
            ]
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Image téléchargée et enregistrée.',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Image téléchargée et enregistrée.')
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Aucun fichier reçu',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Aucun fichier reçu.')
                    ]
                )
            )
        ]
    )]
    public function set_profile_photo (Request $request): JsonResponse
    {
        $file = $request->files->get('profile_photo');

        $max_file_size = 10 * 1024 * 1024;

        $mimeType = $file->getClientMimeType();

        switch (true) {
            case (!$file): 
                return new JsonResponse(['error' => 'Fichier non reçu.'], JsonResponse::HTTP_BAD_REQUEST);
                break;
            case ($file->getSize() > $max_file_size): 
                return new JsonResponse(['error' => 'Le fichier est trop volumineux.'], JsonResponse::HTTP_BAD_REQUEST);
                break;
            case (!in_array($mimeType, ['image/jpg', 'image/jpeg', 'image/png'])): 
                return new JsonResponse('Type MIME non supporté : ' . $mimeType, JsonResponse::HTTP_BAD_REQUEST);
                break;
        }

        $response = $this->fileHandler->upload($file);

        if($response['status'] == 'success') {
            $decodedJwtToken = $this->jwtManager->decode($this->tokenStorageInterface->getToken());

            $user= $this->userRepository->findOneBy(['email' => $decodedJwtToken['email']]);

            if (!$user) {
                throw $this->createNotFoundException('Utilisateur non trouvé');
            }

            $oldPhotoName = $user->getProfilePhoto();

            $this->fileHandler->delete($oldPhotoName);

            $user->setProfilePhoto($response['filename']);

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return new JsonResponse(['message' => $response['message'], 'filename' => $response['filename']], JsonResponse::HTTP_OK);
        }
        else return new JsonResponse(['error' => $response['message']], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);   
    }

    #[Route('/api/v1/delete_profile_photo/{id}', name:'app_delete_profile_photo', methods:['DELETE'])]
    #[OA\Delete(
        summary:"Delete profile photo",
        tags: ['Profile'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the user',
                example: 5
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Image supprimée.'
            ),
            new OA\Response(
                response: 404,
                description: 'Fichier introuvable.',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Fichier introuvable.')
                    ]
                )
            )
        ]
    )]
    public function delete_profile_photo (User $user): JsonResponse
    {
        if(!$user) {
            return new JsonResponse(['error' => 'Utilisateur introuvable.'], JsonResponse::HTTP_NOT_FOUND);
        }

        $filename = $user->getProfilePhoto();

        $this->fileHandler->delete($filename);

        $user->setProfilePhoto('default.png');

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([], JsonResponse::HTTP_NO_CONTENT);
    }

    #[Route('/confirm_email_reset', name: 'app_confirm_email_reset')]
    public function confirm_email_reset (Request $request)
    {
        $id = $request->query->get('id'); 

        //if (!$id)
        if ($id === null) {
            return $this->render('/pages/email_confirmation.html.twig', ['message' => 'Le lien ne contient pas votre identifiant.']);
        }
    
        $user = $this->userRepository->find($id);

        try {

            $this->emailVerifier->handleEmailConfirmation($request, $user);   
        }
        catch (VerifyEmailExceptionInterface $exception) {
            return $this->render('/pages/invalid_link.html.twig', ['id' => $id]);
        }

        $this->emailVerifier->sendEmailConfirmation(
            'app_verify_email', 
            $user, 
            (new TemplatedEmail())
                ->from(new Address('contact@resq18.fr', 'RESQ18'))
                ->to($user->getEmail())
                ->subject('Confirmation de votre inscription')
                ->htmlTemplate('/emails/confirmation_inscription.html.twig')
                ->context([
                    'username' => $user->getUsername()
                ])
        );

        return $this->render('/pages/email_confirmation.html.twig', ['message' => 'Merci d\'avoir confirmé. Vous allez bientôt recevoir un email sur votre nouvelle adresse.']);
    }

    #[Route('/reset_credentials', name: 'app_reset_credentials', methods: ['GET', 'POST'])]
    public function reset_credentials (Request $request): Response
    {

        // $email = (new TemplatedEmail())
            //     ->from(new Address('contact@resq18.fr', 'RESQ18'))
            //     ->to($user->getOldEmail())
            //     ->subject('Modification de votre adresse email')
            //     ->htmlTemplate('/emails/reset_credentials.html.twig')
            //     ->context(['username' => $oldUsername])
            // ;

            // $this->mailer->send($email);

        $resetCredentialsDTO = new ResetCredentialsDTO();

        $form = $this->createForm(ResetCredentialsType::class, $resetCredentialsDTO);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $email = $resetCredentialsDTO->email;
            $password = $resetCredentialsDTO->password;

            $user = $this->userRepository->findOneBy(['oldEmail' => $email]);
            
            if(!$user) {    
                $this->addFlash('error', 'Utilisateur introuvable.');
                return $this->redirectToRoute('app_reset_credentials');
            }

            $errors = $this->validator->validate(
                $user
                    ->setEmail($email)
                    ->setPassword($password)
            );
    
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[] = $error->getMessage();
                }
                $this->addFlash('errors', $errorMessages);
                return $this->redirectToRoute('app_reset_credentials');
            }

            if ($this->passwordHasher->isPasswordValid($user, $user->getPassword())) {
                $this->addFlash('error', 'Veuillez fournir un mot de passe différent.');
                return $this->redirectToRoute('app_reset_credentials');
            }

            $hashedPassword = $this->passwordHasher->hashPassword(
                $user,
                $password
            );

            $user
                ->setEmail($email)
                ->setPassword($hashedPassword)
                ->setIsVerified(true)
                ->setOldEmail(null)
            ;

            $this->entityManager->persist($user);
            $this->entityManager->flush();

            return $this->render('/pages/email_confirmation.html.twig', ['message' => 'Vos identifiants ont été modifié avec succès.']);
        }

        return $this->render('/pages/reset_credentials.html.twig', [
            'form' => $form
        ]);
    }
}