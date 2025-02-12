<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank(message: "L'adresse email ne peut pas être vide.")]
    #[Assert\Email(
        mode: 'html5', 
        message: "Veuillez entrer une adresse email valide."
    )]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Assert\NotBlank(message: "Le mot de passe ne peut pas être vide.", groups: ['reset_password'])]
    #[Assert\Length(
        min: 8,
        minMessage: "Votre mot de passe doit comporter au moins {{ limit }} caractères."
    )]
    #[Assert\Regex(
        pattern: "/[A-Z]/",
        match: true,
        message: "Votre mot de passe doit contenir au moins une lettre majuscule."
    )]
    #[Assert\Regex(
        pattern: "/[a-z]/",
        match: true,
        message: "Votre mot de passe doit contenir au moins une lettre minuscule."
    )]
    #[Assert\Regex(
        pattern: "/\d/",
        match: true,
        message: "Votre mot de passe doit contenir au moins un chiffre."
    )]
    #[Assert\Regex(
        pattern: "/[@$!%*?&]/",
        match: true,
        message:"Votre mot de passe doit contenir au moins un caractère spécial."
    )]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le nom d'utilisateur ne peut pas être vide.")]
    #[Assert\Length(
        min: 1,
        minMessage: "Votre nom d'utilisateur doit comporter au moins {{ limit }} caractère.",
        max: 30,
        maxMessage: "Votre nom d'utilisateur doit comporter au maximum {{ limit }} caractères."
    )]
    #[Assert\Regex(
        pattern: "/^[\w\s\-]+$/",
        match: true,
        message: "Votre nom d'utilisateur peut contenir des lettres, chiffres, underscores, tirets et espaces"
    )]
    private ?string $username = null;

    #[ORM\Column]
    private ?bool $isVerified = null;

    #[ORM\OneToMany(mappedBy: 'player', targetEntity: UserScore::class, orphanRemoval: true)]
    private Collection $userScores;

    #[ORM\Column(length: 255)]
    private ?string $profile_photo = null;

    #[ORM\OneToOne(mappedBy: 'userIdentifier', cascade: ['persist', 'remove'])]
    private ?RefreshToken $refreshToken = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $oldEmail = null;

    public function __construct()
    {
        $this->userScores = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function isVerified(): ?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    /**
     * @return Collection<int, UserScore>
     */
    public function getUserScores(): Collection
    {
        return $this->userScores;
    }

    public function addUserScore(UserScore $userScore): static
    {
        if (!$this->userScores->contains($userScore)) {
            $this->userScores->add($userScore);
            $userScore->setPlayer($this);
        }

        return $this;
    }

    public function removeUserScore(UserScore $userScore): static
    {
        if ($this->userScores->removeElement($userScore)) {
            // set the owning side to null (unless already changed)
            if ($userScore->getPlayer() === $this) {
                $userScore->setPlayer(null);
            }
        }

        return $this;
    }

    public function getProfilePhoto(): ?string
    {
        return $this->profile_photo;
    }

    public function setProfilePhoto(string $profile_photo): static
    {
        $this->profile_photo = $profile_photo;

        return $this;
    }

    public function getRefreshToken(): ?RefreshToken
    {
        return $this->refreshToken;
    }

    public function setRefreshToken(?RefreshToken $refreshToken): static
    {
        $this->refreshToken = $refreshToken;

        return $this;
    }

    public function getOldEmail(): ?string
    {
        return $this->oldEmail;
    }

    public function setOldEmail(?string $oldEmail): static
    {
        $this->oldEmail = $oldEmail;

        return $this;
    }
}
