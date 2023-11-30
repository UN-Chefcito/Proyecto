import { Router } from "express";
import {
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipes,
  getRecipeById,
  getRecipesByKeywords,
  getRecipesByCost,
  uploadRecipe
} from "../controllers/recipe.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import { recipeSchema } from "../schemas/recipe.schema";
import { authorizationMiddleware } from "../middlewares/authorization.middleware"; 


const router = Router();

//router.use(authorizationMiddleware); NO estoy muys eguro de como manejar el token desde el front, de momento lo dejo así

router.post("/recipes", /*validationMiddleware(recipeSchema, "body"),*/ createRecipe); 
//Estoy tenienod problemas porque s eagrega un paylod y me jode la verificación, entonces de momento lo dejo así y saco los datos que necesito en el controlador
router.get("/recipes", getRecipes);
router.get('/recipes/cost', getRecipesByCost);
router.get("/recipes/:id", getRecipeById); 
router.get("/recipes/keywords/:keywords", getRecipesByKeywords); 
router.put("/recipes/:id", updateRecipe);
router.delete("/recipes/:id", deleteRecipe);
router.get("/upload/recipes", uploadRecipe);

export default router;
