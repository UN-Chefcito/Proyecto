// schemas/recipe.schema.ts
import Joi from 'joi';

const recipeSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  ingredients: Joi.string().required(),
  steps: Joi.string().required(),
  cost_type: Joi.string().required(),
  cost: Joi.number().positive().required(),
  keywords: Joi.string().required(),
});

interface RecipeInterface {
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  cost_type: string;
  cost: number;
  keywords: string;
}

export { recipeSchema, RecipeInterface };
