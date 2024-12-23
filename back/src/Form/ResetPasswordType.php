<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormError;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Event\PostSubmitEvent;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;


class ResetPasswordType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('password', TextType::class, [
                'label' => 'Nouveau mot de passe',
                'attr' => ['placeholder' => 'Entrez votre nouveau mot de passe'],
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un mot de passe.',
                    ]),
                ]
            ])
            ->add('confirm_password', TextType::class, [
                'label' => 'Confirmez votre mot de passe',
                'attr' => ['placeholder' => 'Confirmez votre nouveau mot de passe'],
                'mapped' => false,
                'constraints' => [
                    new NotBlank([
                        'message' => 'Veuillez entrer un mot de passe.',
                    ])
                ]
            ])
            ->addEventListener(FormEvents::POST_SUBMIT, function (PostSubmitEvent $event) {
                $form = $event->getForm();
                $password = $form->get('password')->getData();
                $confirm_password = $form->get('confirm_password')->getData();

                if($password !== $confirm_password) {
                    $form->get('confirm_password')->addError(new FormError('Les mots de passe ne correspondent pas.'));
                }
            })
            ->add('submit', SubmitType::class, ['label' => 'Réinitialiser'])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'validation_groups' => ['/pages/reset_password']
        ]);
    }
}
