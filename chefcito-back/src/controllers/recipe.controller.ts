import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createRecipe = async (req: Request, res: Response) => {
    const newRecipe = req.body;
  
    try {
      const createdRecipe = await prisma.recipe.create({
        data: {
          title: newRecipe.title,
          description: newRecipe.description,
          ingredients: newRecipe.ingredients,
          steps: newRecipe.steps,
          cost_type: newRecipe.cost_type,
          cost: newRecipe.cost,
          keywords: newRecipe.keywords,
        },
      });
  
      return res.status(201).json({
        message: 'Recipe created successfully',
        recipe: createdRecipe,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }
  };
export const getRecipes = async (_: Request, res: Response): Promise<Response> => {
    try {
      const recipes = await prisma.recipe.findMany();
  
      return res.status(200).json(recipes);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getRecipeById = async (req: Request, res: Response): Promise<Response> => {
    const recipeId = parseInt(req.params.id);
  
    try {
      const recipe = await prisma.recipe.findUnique({
        where: { recipe_id: recipeId },
      });
  
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
  
      return res.status(200).json(recipe);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const getRecipesByKeywords = async (req: Request, res: Response): Promise<Response> => {
    const keywords = req.params.keywords;
  
    try {
      const recipes = await prisma.recipe.findMany({
        where: { keywords: { contains: keywords } },
      });
  
      return res.status(200).json(recipes);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const updateRecipe = async (req: Request, res: Response): Promise<Response> => {
  const recipeId = parseInt(req.params.id);
  const updatedRecipe = req.body;

  try {
    const existingRecipe = await prisma.recipe.findUnique({
      where: { recipe_id: recipeId },
    });

    if (!existingRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const updatedRecipeResult = await prisma.recipe.update({
      where: { recipe_id: recipeId },
      data: { ...existingRecipe,   
        title: updatedRecipe.title,
        description: updatedRecipe.description,
        ingredients: updatedRecipe.ingredients,
        steps: updatedRecipe.steps,
        cost_type: updatedRecipe.cost_type,
        cost: updatedRecipe.cost,
        keywords: updatedRecipe.keywords,
       },
    });

    return res.status(200).json(updatedRecipeResult);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteRecipe = async (req: Request, res: Response): Promise<Response> => {
  const recipeId = parseInt(req.params.id);

  try {
    const deletedRecipe = await prisma.recipe.delete({
      where: { recipe_id: recipeId },
    });

    return res.status(200).json(deletedRecipe);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
