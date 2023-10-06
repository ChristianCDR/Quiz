<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

class QuizFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            // Question quiz
            ->add('question', TextType::class, ['required' => true ])

            // Réponses proposées
            ->add('answer1', TextType::class, ['required' => false ])
            ->add('answer2', TextType::class, ['required' => false ])
            ->add('answer3', TextType::class, ['required' => false ])
            ->add('answer4', TextType::class, ['required' => false ])
            
            //Checkbox vrai/faux
            ->add('answer1_status', CheckboxType::class, ['label' => 'La réponse 1 est-elle vraie?', 'required' => false ])
            ->add('answer2_status', CheckboxType::class, ['label' => 'La réponse 2 est-elle vraie?', 'required' => false ])
            ->add('answer3_status', CheckboxType::class, ['label' => 'La réponse 3 est-elle vraie?', 'required' => false ])
            ->add('answer4_status', CheckboxType::class, ['label' => 'La réponse 4 est-elle vraie?', 'required' => false ])
            
            ->add('Envoyer', SubmitType::class)

            ->getForm();
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            // Configure your form options here
        ]);
    }
}
