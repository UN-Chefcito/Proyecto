import { Router, Request, Response, response } from 'express';
import * as jose from 'jose';
import { authorizationMiddleware } from '../middlewares/authorization.middleware';
import { userInfo } from '../controllers/user.controller';

const router = Router();

router.get("/user", authorizationMiddleware, userInfo);

export default router;