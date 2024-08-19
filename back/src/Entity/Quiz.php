<?php

namespace App\Entity;

use App\Repository\QuizRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuizRepository::class)]
class Quiz
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $questions = null;

    #[ORM\Column(type: Types::ARRAY)]
    private array $options = [];

    #[ORM\Column]
    private ?int $answer = null;

    #[ORM\Column]
    private ?int $quizCategory = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $lastPlay = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getQuestions(): ?int
    {
        return $this->questions;
    }

    public function setQuestions(int $questions): static
    {
        $this->questions = $questions;

        return $this;
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    public function setOptions(array $options): static
    {
        $this->options = $options;

        return $this;
    }

    public function getAnswer(): ?int
    {
        return $this->answer;
    }

    public function setAnswer(int $answer): static
    {
        $this->answer = $answer;

        return $this;
    }

    public function getQuizCategory(): ?int
    {
        return $this->quizCategory;
    }

    public function setQuizCategory(int $quizCategory): static
    {
        $this->quizCategory = $quizCategory;

        return $this;
    }

    public function getLastPlay(): ?\DateTimeInterface
    {
        return $this->lastPlay;
    }

    public function setLastPlay(\DateTimeInterface $lastPlay): static
    {
        $this->lastPlay = $lastPlay;

        return $this;
    }
}
