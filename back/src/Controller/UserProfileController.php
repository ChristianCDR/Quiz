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

class UserProfileController extends AbstractController
{
    private $tokenStorageInterface;
    private $jwtManager;
    private $entityManager;
    private $passwordHasher;
    private $validator;
    private $userRepository;
    
    public function __construct (
        JWTTokenManagerInterface $jwtManager, 
        TokenStorageInterface $tokenStorageInterface, 
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        UserRepository $userRepository,
        EmailVerifier $emailVerifier
    ) 
    {
        $this->entityManager = $entityManager;
        $this->jwtManager = $jwtManager;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
        $this->tokenStorageInterface = $tokenStorageInterface;
        $this->emailVerifier = $emailVerifier;
    }
    
    #[Route('/change/password', name: 'app_change_password', methods: ['PUT'])]
    #[OA\Put(
        summary: 'Change password',
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
    public function change_password (Request $request): JsonResponse 
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

        $errors = $this->validator->validate($user->setPassword($new_password));

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['Errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $new_password
        );

        $user->setPassword($hashedPassword);  

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Mot de passe changé avec succès!'
        ], JsonResponse::HTTP_OK);
    }

    #[Route('/change/userInfos', name: 'app_change_user_infos', methods: ['PUT'])]
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
    public function change_user_infos (Request $request): JsonResponse 
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

    //ecrire la route des photos de profil ici
}