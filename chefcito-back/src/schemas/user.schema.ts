import Joi from 'joi';

const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

interface UserInterface {
    user_id?: number;
    name: string;
    email: string;
    password: string;
}

export { userSchema, UserInterface };