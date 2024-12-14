<?php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class PasswordResetService 
{
    private $entityManager;
    private $passwordHasher;
    private $validator;
    private $userRepository;

    public function __construct (
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        UserRepository $userRepository
    )
    {
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
        $this->userRepository = $userRepository;
    }

    public function reset_password (string $new_password, $user): void
    {
        
        $errors = $this->validator->validate($user->setPassword($new_password));

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            throw new Exception ($errorMessages);
        }

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $new_password
        );

        $user->setPassword($hashedPassword);  

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }
}