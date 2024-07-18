<?php

namespace App\Controller;

use App\Entity\User;
use App\Form\RegistrationFormType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
 
class RegistrationController extends AbstractController
{
    #[Route('/api/users', name: 'app_quiz_index', methods: ['GET'])]
    #[OA\Response(
        response: 200,
        description: ''
    )]
    public function index(QuestionRepository $questionRepository, AnswerRepository $answerRepository) : Response
    {
        return $this->render('quiz/index.html.twig', [
            // 'questions' => $questionRepository->findAll(),
            // 'answers'   => $answerRepository->findAll()
        ]);
    }

    #[Route('/api/register', name: 'app_register', methods: ['GET', 'POST'])]
    #[OA\Post(
        path: '/api/register',
        summary: 'Register new user',
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'example@mail.com'),
                    new OA\Property(property: 'password', type: 'string', format:'password', example: 'solidPassword234'),
                    new OA\Property(property: 'agreeTerms', type: 'boolean', example: true)
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'User registered successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'User registered successfully')
                    ]
                )
            )            
        ]
    )]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): Response
    {
        $contentType = $request->headers->get('Content-Type');
        $user = new User();
        $form = $this->createForm(RegistrationFormType::class, $user);

        if ($contentType === 'application/json') {
            // Path for Swagger requests
            // Convert JSON data to form data
            $data = json_decode($request->getContent(), true);
            $form->submit($data);
        } else {
            // Handle traditional form request
            $form->handleRequest($request);
        }

        if ($form->isSubmitted() && $form->isValid()) {
            // Encode the plain password
            $user->setPassword(
                $userPasswordHasher->hashPassword(
                    $user,
                    $form->get('password')->getData()
                )
            );

            $entityManager->persist($user);
            $entityManager->flush();

            if ($contentType === 'application/json') return $this->json(['message' => 'User registered successfully'], 200);
            else return $this->redirectToRoute('app_user_index');
        }

        return $this->render('registration/register.html.twig', [
            'registrationForm' => $form->createView(),
        ]);
    }
}
