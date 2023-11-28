import { Router } from "express";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipes,
  getRecipeById,
  getRecipesByKeywords,
} from "../controllers/recipe.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import { recipeSchema } from "../schemas/recipe.schema";
import { authorizationMiddleware } from "../middlewares/authorization.middleware"; 


const router = Router();

router.use(authorizationMiddleware);

router.post("/recipes", /*validationMiddleware(recipeSchema, "body"),*/ createRecipe); 
//Estoy tenienod problemas porque s eagrega un paylod y me jode la verificación, entonces de momento lo dejo así y saco los datos que necesito en el controlador
router.get("/recipes", getRecipes);
router.get("/recipes/:id", getRecipeById); 
router.get("/recipes/keywords/:keywords", getRecipesByKeywords); 
router.put("/recipes/:id", updateRecipe);
router.delete("/recipes/:id", deleteRecipe);

export default router;
