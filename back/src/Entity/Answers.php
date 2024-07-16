<?php

namespace App\Entity;

use App\Repository\AnswersRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AnswersRepository::class)]
class Answers
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $answerText = null;

    #[ORM\ManyToOne(inversedBy: 'answers')]
    private ?questions $questions = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAnswerText(): ?string
    {
        return $this->answerText;
    }

    public function setAnswerText(string $answerText): static
    {
        $this->answerText = $answerText;

        return $this;
    }

    public function getQuestions(): ?questions
    {
        return $this->questions;
    }

    public function setQuestions(?questions $questions): static
    {
        $this->questions = $questions;

        return $this;
    }
}
