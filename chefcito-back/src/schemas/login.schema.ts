import Joi from 'joi';

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

interface LoginInterface {
    email: string;
    password: string;
}

export { loginSchema, LoginInterface };