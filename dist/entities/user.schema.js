import Joi from 'joi';
export const userCreateDtoSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    birthDate: Joi.string(),
});
export const userUpdateDtoSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
    birthDate: Joi.string(),
});
