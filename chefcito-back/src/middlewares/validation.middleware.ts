import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const validationMiddleware = (schema: Joi.Schema, property: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.validate(req[property as keyof Request]);
        
        result.error
        ? res.status(400).json({message: "Invalid or missing data"})
        : next();
    }
}

export default validationMiddleware;