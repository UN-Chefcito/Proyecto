import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller";
import validationMiddleware from "../middlewares/validation.middleware";
import { loginSchema } from "../schemas/login.schema";
import { userSchema } from "../schemas/user.schema";

const router = Router();

router.post("/login", validationMiddleware(loginSchema, "body"), login);
router.post("/signup", validationMiddleware(userSchema, "body"), signUp);

export default router;