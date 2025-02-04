<?php

namespace App\Security;

use App\Entity\User;
use App\Entity\RefreshToken;
use App\Repository\RefreshTokenRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Exception;


class RefreshTokenManager
{
    private $entityManager;
    private $refreshTokenRepository;

    public function __construct (EntityManagerInterface $entityManager, RefreshTokenRepository $refreshTokenRepository)
    {
        $this->entityManager = $entityManager;
        $this->refreshTokenRepository = $refreshTokenRepository;
    }

    public function createRefreshToken (User $userIdentifier): RefreshToken 
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['userIdentifier' => $userIdentifier]);

        if (!$refreshToken) $refreshToken = new RefreshToken ();
        
        $token = bin2hex(random_bytes(32));
        
        $refreshToken
            ->setToken($token)
            ->setExpiresAt((new \DateTime())->modify('+30 days'))
            ->setUserIdentifier($userIdentifier)
        ;

        try {
            $this->entityManager->persist($refreshToken);
            $this->entityManager->flush();
        }
        catch (Exception $exception) {
            throw new Exception ($exception);
        }

        return $refreshToken;
    }

    public function revokeRefreshToken (string $token): void
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['token' => $token]);
        
        try {
            $this->entityManager->remove($refreshToken);
            $this->entityManager->flush();
        }
        catch (Exception $exception) {
            throw new Exception ($exception);
        }
    }

    public function isValidToken (string $token): bool
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['token' => $token]);

        if (!$refreshToken || new \DateTime() > $refreshToken->getExpiresAt()) {
            return false;
        }

        return true;
    }

    public function getUserIdentifierFromRefreshToken (string $token): ?User
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['token' => $token]);

        $userIdentifier = $refreshToken->getUserIdentifier();

        return $userIdentifier;
    }

    public function updateRefreshToken(string $token, User $userIdentifier): ?RefreshToken
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['token' => $token]);

        if (!$refreshToken || new \DateTime() > $refreshToken->getExpiresAt()) {
            return null; 
        }

        $newToken = bin2hex(random_bytes(32));

        $refreshToken
            ->setToken($newToken)
            ->setExpiresAt((new \DateTime())->modify('+30 days'))
            ->setUserIdentifier($userIdentifier)
        ;

        try {
            $this->entityManager->persist($refreshToken);
            $this->entityManager->flush();
        }
        catch (Exception $exception) {
            throw new Exception ($exception);
        }

        return $refreshToken;
    }
}