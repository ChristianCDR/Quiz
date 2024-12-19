<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileHandler
{
    public function __construct(
        private string $targetDirectory,
        private SluggerInterface $slugger,
    ) {
    }

    public function upload(UploadedFile $file): array
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            $file->move($this->getTargetDirectory(), $fileName);

            return [
                'status' => 'success',
                'message' => 'Image téléchargée et enregistrée.',
                'filename' => $fileName
            ];
            
        } catch (FileException $e) {
            return [
                'status' => 'error',
                'message' => 'Erreur lors du téléchargement de l\'image.',
            ];
        }
    }

    public function getTargetDirectory(): string
    {
        return $this->targetDirectory;
    }

    public function delete ($filename) : void
    {
        $filePath = $this->getTargetDirectory().$filename;
        
        if(file_exists($filePath)) {
            unlink($filePath);
        } 
    }
}