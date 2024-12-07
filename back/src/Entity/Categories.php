<?php

namespace App\Entity;

use App\Repository\CategoriesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoriesRepository::class)]
class Categories
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
 
    #[ORM\Column(length: 255)]
    private ?string $categoryName = null;

    #[ORM\ManyToMany(targetEntity: Questions::class, mappedBy: 'Categories')]
    private Collection $questions;

    // #[ORM\Column(length: 255, nullable: true)]
    // private ?string $categoryImage = null;

    #[ORM\OneToMany(mappedBy: 'category', targetEntity: UserScore::class, orphanRemoval: true)]
    private Collection $userScores;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
        $this->userScores = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCategoryName(): ?string
    {
        return $this->categoryName; 
    }

    public function setCategoryName(string $categoryName): static
    {
        $this->categoryName = $categoryName;

        return $this;
    }

    // public function getCategoryImage(): ?string
    // {
    //     return $this->categoryImage;
    // }

    // public function setCategoryImage(?string $categoryImage): static
    // {
    //     $this->categoryImage = $categoryImage;

    //     return $this;
    // }

    /**
     * @return Collection<int, Questions>
     */
    public function getQuestions(): Collection
    {
        return $this->questions;
    }

    public function addQuestion(Questions $question): static
    {
        if (!$this->questions->contains($question)) {
            $this->questions->add($question);
            $question->addCategory($this);
        }

        return $this;
    }

    public function removeQuestion(Questions $question): static
    {
        if ($this->questions->removeElement($question)) {
            $question->removeCategory($this);
        }

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
            $userScore->setCategory($this);
        }

        return $this;
    }

    public function removeUserScore(UserScore $userScore): static
    {
        if ($this->userScores->removeElement($userScore)) {
            // set the owning side to null (unless already changed)
            if ($userScore->getCategory() === $this) {
                $userScore->setCategory(null);
            }
        }

        return $this;
    }
}
