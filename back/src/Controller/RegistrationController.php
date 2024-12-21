<?php
namespace App\Controller;

use App\Entity\User;
use App\Security\EmailVerifier;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use SymfonyCasts\Bundle\VerifyEmail\Exception\VerifyEmailExceptionInterface;
use Symfony\Component\Mime\Address;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegistrationController extends AbstractController 
{   
    private EmailVerifier $emailVerifier;

    public function __construct(EmailVerifier $emailVerifier)
    {
        $this->emailVerifier = $emailVerifier;
    }

    #[Route('/api/v1/register', name: 'app_register', methods: ['POST'])]
    #[OA\Post(
        summary: 'Create a new user',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['email', 'username', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', example: 'chris@mail.com'),
                    new OA\Property(property: 'username', type: 'string', example: 'christian CDR'),
                    new OA\Property(property: 'password', type: 'string', example: 'Azerty1@')
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
                        new OA\Property(property: 'username', type: 'string', example: 'christian CDR'),
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
    #[Security(name: null)]
    public function register (Request $request, UserPasswordHasherInterface $passwordHasher, ValidatorInterface $validator, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = new User();

        $user 
            ->setEmail($data['email'] ?? '')
            ->setUsername($data['username'] ?? '')
            ->setPassword($data['password'] ?? '')
            ->setProfilePhoto('default.png')
            ->setIsVerified(false)
        ;

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], JsonResponse::HTTP_BAD_REQUEST);
        }

        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $data['password']
        );

        $user->setPassword($hashedPassword);            

        try {
            $entityManager->persist($user);
            $entityManager->flush();

            $this->emailVerifier->sendEmailConfirmation(
                'app_verify_email', 
                $user, 
                (new TemplatedEmail())
                    ->from(new Address('no-reply@resq18.com', 'RESQ18'))
                    ->to($user->getEmail())
                    ->subject('Confirmation de votre inscription')
                    ->htmlTemplate('/emails/confirmation_inscription.html.twig')
                    ->context([
                        'username' => $user->getUsername()
                    ])
            );

            return new JsonResponse($user, JsonResponse::HTTP_CREATED);         
        } 
        catch (UniqueConstraintViolationException $e) {
            return new JsonResponse(['error' => 'Cette adresse e-mail est déjà utilisée.'], JsonResponse::HTTP_BAD_REQUEST);
        } 
        catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }  
    }

    #[Route('/verify/email', name: 'app_verify_email')]
    public function verifyEmail (Request $request, UserRepository $userRepository): Response
    {  
        $id = $request->query->get('id'); 

        if (null === $id) {
            return $this->render('email_confirmation.html.twig', ['message' => 'Le lien ne contient pas votre identifiant.']);
        }
    
        $user = $userRepository->find($id);

        try {
            $this->emailVerifier->handleEmailConfirmation($request, $user);
        }
        catch (VerifyEmailExceptionInterface $exception) {
            return $this->render('invalid_link.html.twig', ['id' => $id]);
        }

        return $this->render('email_confirmation.html.twig', ['message' => 'Votre adresse email a été confirmée.']);
    }

    #[Route('/invalid_link/{id}', name: 'app_invalid_link', methods:['GET'])]

    public function invalidConfirmationLink (User $user): Response
    {

        if (!$user) {
            return $this->render('email_confirmation.html.twig', ['message' => 'Utilisateur inconnu.']);
        }
    
        $this->emailVerifier->sendEmailConfirmation(
            'app_verify_email', 
            $user, 
            (new TemplatedEmail())
                ->from(new Address('no-reply@resq18.com', 'RESQ18'))
                ->to($user->getEmail())
                ->subject('Nouveau lien de confirmation')
                ->htmlTemplate('/emails/invalid_link.html.twig')
                ->context([
                    'username' => $user->getUsername()
                ])
        );

        return $this->render('email_confirmation.html.twig', ['message' => 'Un nouveau lien de confirmation vous a été envoyé.']);
    }
}