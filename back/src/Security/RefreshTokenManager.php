<?php

namespace App\Security;

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

    public function createRefreshToken (string $userIdentifier): RefreshToken 
    {
        $token = bin2hex(random_bytes(32));
        $refreshToken = new RefreshToken ();
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

    public function getUserIdentifierFromRefreshToken (string $token): ?RefreshToken
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['token' => $token]);

        $refreshToken->getUserIdentifier();

        return $refreshToken;
    }

    public function updateRefreshToken(string $token, string $userIdentifier): ?RefreshToken
    {
        $refreshToken = $this->refreshTokenRepository->findOneBy(['token' => $token]);

        if (!$refreshToken || new \DateTime() > $refreshToken->getExpiresAt()) {
            return null; 
        }

        $this->revokeRefreshToken($token);

        $newToken = bin2hex(random_bytes(32));

        $newRefreshToken = new RefreshToken ();
        $newRefreshToken
            ->setToken($newToken)
            ->setExpiresAt((new \DateTime())->modify('+30 days'))
            ->setUserIdentifier($userIdentifier)
        ;

        try {
            $this->entityManager->persist($newRefreshToken);
            $this->entityManager->flush();
        }
        catch (Exception $exception) {
            throw new Exception ($exception);
        }

        return $newRefreshToken;
    }
}