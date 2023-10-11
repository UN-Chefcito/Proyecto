import { Router, Request, Response } from 'express';
import * as jose from 'jose';

const router = Router();

router.get("/user", (request: Request, response: Response) => {
    response.json("Hello");
});

export default router;