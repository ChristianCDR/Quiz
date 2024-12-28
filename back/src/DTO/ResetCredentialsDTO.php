<?php 

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class ResetCredentialsDTO
{
    #[ORM\Column(length: 180, unique: true)]
    #[Assert\NotBlank(message: "L'adresse email ne peut pas être vide.")]
    #[Assert\Email(
        mode: 'html5', 
        message: "Veuillez entrer une adresse email valide."
    )]
    public ?string $email = null;

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
    public ?string $password = null;
    
    #[Assert\NotBlank(message: "Le mot de passe ne peut pas être vide.", groups: ['reset_password'])]
    public $passwordConfirm;

    public function __construct(string $email='', string $password='', string $passwordConfirm='')
    {
        $this->email = $email;
        $this->password = $password;
        $this->passwordConfirm = $passwordConfirm;
    }
}