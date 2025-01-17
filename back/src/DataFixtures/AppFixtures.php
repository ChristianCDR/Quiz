<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Options;
use App\Entity\Questions;
use App\Entity\Categories;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Repository\CategoriesRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $hasher;
    private CategoriesRepository $categoriesRepository;

    public function __construct(UserPasswordHasherInterface $hasher, CategoriesRepository $categoriesRepository)
    {
        $this->hasher = $hasher;
        $this->categoriesRepository = $categoriesRepository;
    }

    public function load(ObjectManager $manager): void
    {
        // Table User
        for ($i = 1; $i < 6; $i++) {

            $user = new User();
            $user->setEmail('chris'.$i.'@mail.com');
            $user->setUsername('User '.$i);

            $password = $this->hasher->hashPassword($user, 'Azerty1@');
            $user->setPassword($password);
            $user->setIsVerified(true);

            $manager->persist($user);
        }
        
        // Table Categories
        $categoryNames = array ('Secourisme', 'Incendie', 'Secours routier','Opérations diverses');
        $categories = [];

        foreach ($categoryNames as $cat) {

            $category = new Categories();

            $category->setCategoryName($cat);

            $manager->persist($category);

            $categories[] = $category;
        }

        // Table Questions
        $index = 1; 
        $questions = [];

        for ($i = 1; $i <=20; $i++) {
            $question = new Questions();

            $question->setQuestionText('Question '.$index);
            
            $question->addCategory($categories[0]);

            $index++;

            if ($index > 10) $index = 1;

            $manager->persist($question);

            $questions[] = $question;
        }
  
        $qst = 0; 
        $rand_nb = rand(1, 4);

        for ($i = 1; $i < 80; $i++) {       
            
            $option = new Options();

            $option->setIsCorrect(false);
            $option->setOptionText('Option '.$index);
            $option->setQuestion($questions[$qst]);

            if ($index === $rand_nb) $option->setIsCorrect(true);

            $index++;

            if ($index > 4) {
                $index = 1;
                $qst++;
                $rand_nb = rand(1, 4);
            }

            $manager->persist($option);
        }

        $manager->flush();
    }
}
