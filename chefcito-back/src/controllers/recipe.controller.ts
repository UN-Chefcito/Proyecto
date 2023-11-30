import { Request, Response } from "express";
import { PrismaClient, Recipe } from "@prisma/client";
import { randomInt } from "crypto";

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
          calories: randomInt(100, 500),
          protein: randomInt(100, 300),
          buks: randomInt(10, 300),
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

      // Group recipes by keywords
      const groupedRecipes: any = {};
      recipes.forEach((recipe: any) => {
        recipe.keywords.split(', ').forEach((keyword: string) => {
          if (!groupedRecipes[keyword]) {
            groupedRecipes[keyword] = [];
          }
          groupedRecipes[keyword].push(recipe);
        });
      });

      // // Print keywords and number of recipes
      // Object.keys(groupedRecipes).forEach((keyword: string) => {
      //   console.log(`${keyword}: ${groupedRecipes[keyword].length}`);
      // });

      // Return group with two or more recipes
      Object.keys(groupedRecipes).forEach((keyword: string) => {
        if (groupedRecipes[keyword].length < 2) {
          delete groupedRecipes[keyword];
        }
      });
  
      return res.status(200).json(groupedRecipes);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getRecipesByCost = async (req: Request, res: Response) => {
    try {
      const { costType, cost } = req.query;
  
      if (!costType || !cost) {
        return res.status(400).json({ message: 'Missing parameters: costType and cost are required.' });
      }
  
      // Convierte el costo de la cadena a un número
      const costValue = parseFloat(cost as string);

      let recipes = {};
  
      // Obtiene todas las recetas que tienen el mismo tipo de costo y un costo en el rango especificado
      if(costType === 'Calories'){
        recipes = await prisma.recipe.findMany({
          where: {
            calories: {
              gte: costValue * 0.8,  // 80% del costo suministrado
              lte: costValue * 1.2,  // 120% del costo suministrado
            },
          },
        });
      } else if(costType === 'Protein'){
        recipes = await prisma.recipe.findMany({
          where: {
            protein: {
              gte: costValue * 0.8,  // 80% del costo suministrado
              lte: costValue * 1.2,  // 120% del costo suministrado
            },
          },
        });
      } else {
        recipes = await prisma.recipe.findMany({
          where: {
            buks: {
              gte: costValue * 0.8,  // 80% del costo suministrado
              lte: costValue * 1.2,  // 120% del costo suministrado
            },
          },
        });
      }

  
      return res.status(200).json(recipes);
    } catch (error) {
      console.error('Error fetching recipes by cost:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
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
        calories: updatedRecipe.calories,
        protein: updatedRecipe.cost,
        buks: updatedRecipe.buks,
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


export const uploadRecipe = async (req: Request, res: Response): Promise<Response> => {

  const fileSystem = require('fs');

  fileSystem.readFile('./src/utils/recipes.json', 'utf8', (err: any, jsonString: string) => {

      if (err) {
          console.log("File read failed:", err)
          return
      }
      
      try {
          const data = JSON.parse(jsonString)

          // Filter recipes with description and steps not null and slice the array to 300 recipes
          const slicedData = data.filter((recipe: any) => recipe.desc && recipe.directions && recipe.calories && recipe.protein).slice(0, 100)

          uploadRecipes(slicedData)
      }
      catch(err) {
          console.log('Error parsing JSON string:', err)
      }
  })

  return res.status(200).json({ message: "Data upload" });

};

function uploadRecipes(data: any) {
  
  // Add to each recipe a randum buks value
  data.forEach((recipe: any) => {
    recipe.buks = Math.floor(Math.random() * 100) + 1;
  });

  // Upload recipes to database
  data.forEach(async (recipe: any) => {
    try {
      let id = await prisma.recipe.create({
        data: {
          title: recipe.title,
          description: recipe.desc || '',
          ingredients: recipe.ingredients.join(', '),
          steps: recipe.directions.join('----'),
          calories: recipe.calories,
          protein: recipe.protein,
          buks: recipe.buks,
          keywords: recipe.categories.join(', ')
        },
      });

      console.log(`Recipe ${id.recipe_id} uploaded`);
    } catch (error) {
      console.error(error);
    }
  });
}
