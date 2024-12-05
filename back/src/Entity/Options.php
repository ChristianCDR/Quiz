<?php

namespace App\Entity;

use App\Repository\OptionsRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OptionsRepository::class)]
class Options
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $is_correct = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $optionText = null;

    #[ORM\ManyToOne(inversedBy: 'options')]
    #[ORM\JoinColumn(nullable: false)]
    private ?questions $question = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isIsCorrect(): ?bool
    {
        return $this->is_correct;
    }

    public function setIsCorrect(bool $is_correct): static
    {
        $this->is_correct = $is_correct;

        return $this;
    }

    public function getOptionText(): ?string
    {
        return $this->optionText;
    }

    public function setOptionText(string $optionText): static
    {
        $this->optionText = $optionText;

        return $this;
    }

    public function getQuestion(): ?questions
    {
        return $this->question;
    }

    public function setQuestion(?questions $question): static
    {
        $this->question= $question;

        return $this;
    }
}
