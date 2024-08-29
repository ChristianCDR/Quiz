<?php

namespace App\Controller;

use App\Entity\Categories;
use App\Repository\CategoriesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/api/categories')]
class CategoriesController extends AbstractController
{
    #[Route('/', name: 'app_categories_index', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get all categories',
        tags: ['Categories'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'List of all categories',
                content: new OA\JsonContent(
                    type: 'array',
                    items: new OA\Items(
                        type: 'object',
                        properties: [
                            new OA\Property(property: 'id', type: 'integer', example: 1),
                            new OA\Property(property: 'categoryName', type: 'string', example: 'Incendie'),
                            new OA\Property(property: 'categoryImage', type: 'string', example: 'fire.png')
                        ]
                    )
                )
            ),
            new OA\Response(
                response: 404,
                description: 'No categories found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'No categories found')
                    ]
                )
            )
        ]
    )]
    public function index(CategoriesRepository $categoriesRepository): JsonResponse
    {
        $categories = $categoriesRepository->findAll();

        if (!$categories) {
            return new JsonResponse ([
                'error' => 'No categories found'
            ], JsonResponse:: HTTP_NOT_FOUND);
        }

        $data = [];

        foreach ($categories as $category) {
            $data[]= [
                'id' => $category->getId(),
                'categoryName' => $category->getCategoryName(),
                'categoryImage' => $category->getCategoryImage()
            ];
        }

        return new JsonResponse($data, JsonResponse::HTTP_OK);
    }


    #[Route('/new', name: 'app_categories_new', methods: ['POST'])]
    #[OA\Post(
        summary: 'Create a new category',
        tags: ['Categories'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                type: 'object',
                required: ['categoryName', 'categoryImage'],
                properties: [
                    new OA\Property(property: 'categoryName', type: 'string', example: 'New Category'),
                    new OA\Property(property: 'categoryImage', type: 'string', example: 'fire.png')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: 'Category created successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'categoryName', type: 'string', example: 'New Category'),
                        new OA\Property(property: 'categoryImage', type: 'string', example: 'fire.png')
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'Invalid input',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Invalid category name')
                    ]
                )
            )
        ]
    )]
    public function new(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $category = new Categories();
        $category->setCategoryName($data['categoryName'] ?? '');
        $category->setCategoryImage($data['categoryImage'] ?? '');

        if (empty($category->getCategoryName()) || empty($category->getCategoryImage())) {
            return new JsonResponse([
                'error' => 'Invalid category name or image'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($category);
        $entityManager->flush();

        return new JsonResponse([
            'id' => $category->getId(),
            'categoryName' => $category->getCategoryName(),
            'categoryImage' => $category->getCategoryImage()
        ], JsonResponse::HTTP_CREATED);
    }


    #[Route('/{id}', name: 'app_categories_show', methods: ['GET'])]
    #[OA\Get(
        summary: 'Get a category by ID',
        tags: ['Categories'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the category to retrieve',
                example: 1
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Category retrieved successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'categoryName', type: 'string', example: 'Incendie'),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Category not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Category not found')
                    ]
                )
            )
        ]
    )]
    public function show(Categories $category): JsonResponse
    {
        if (!$category) {
            return new JsonResponse([
                'error' => 'Category not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'id' => $category->getId(),
            'categoryName' => $category->getCategoryName(),
            'categoryImage' => $category->getCategoryImage()
        ], JsonResponse::HTTP_OK);
    }


    #[Route('/{id}/edit', name: 'app_categories_edit', methods: ['PUT'])]
    #[OA\Put(
        summary: 'Update a category by ID',
        tags: ['Categories'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the category to update',
                example: 1
            )
        ],
        requestBody: new OA\RequestBody(
            description: 'Category data to update',
            content: new OA\JsonContent(
                type: 'object',
                required: ['categoryName', 'categoryImage'],
                properties: [
                    new OA\Property(property: 'categoryName', type: 'string', example: 'Updated Category Name'),
                    new OA\Property(property: 'categoryImage', type: 'string', example: 'new_fire.png')
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Category updated successfully',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'id', type: 'integer', example: 1),
                        new OA\Property(property: 'categoryName', type: 'string', example: 'Updated Category Name'),
                        new OA\Property(property: 'categoryImage', type: 'string', example: 'new_fire.png')
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Category not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Category not found')
                    ]
                )
            )
        ]
    )]
    public function edit(Request $request, Categories $category, EntityManagerInterface $entityManager): Response
    {
        if (!$category) {
            return new JsonResponse([
                'error' => 'Category not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $data= json_decode($request->getContent(), true);

        if (isset($data['categoryName']) && isset($data['categoryImage'])) {
            $category->setCategoryName($data['categoryName']);
            $category->setCategoryImage($data['categoryImage']);
        }
        else {
            return new JsonResponse ([
                'error' => 'Invalid category name or image'
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        $entityManager->persist($category);
        $entityManager->flush();

        return new JsonResponse ([
            'id' => $category->getId(),
            'categoryName' => $category->getCategoryName(),
            'categoryImage' => $category->getCategoryImage()
        ], JsonResponse::HTTP_OK);
    }


    #[Route('/{id}', name: 'app_categories_delete', methods: ['DELETE'])]
    #[OA\Delete(
        summary: 'Delete a category by ID',
        tags: ['Categories'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'integer'),
                description: 'The ID of the category to delete',
                example: 1
            )
        ],
        responses: [
            new OA\Response(
                response: 204,
                description: 'Category deleted successfully'
            ),
            new OA\Response(
                response: 404,
                description: 'Category not found',
                content: new OA\JsonContent(
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'error', type: 'string', example: 'Category not found')
                    ]
                )
            )
        ]
    )]
    public function delete(Request $request, Categories $category, EntityManagerInterface $entityManager): Response
    {
        if (!$category) {
            return new JsonResponse([
                'error' => 'Category not found',
            ], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($category);
        $entityManager->flush();

        return new JsonResponse(null, JsonResponse::HTTP_NO_CONTENT);
    }
}
