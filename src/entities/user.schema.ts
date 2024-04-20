import Joi from 'joi';
import { type UserCreateDto, type UserUpdateDto } from './user';

export const userCreateDtoSchema = Joi.object<UserCreateDto>({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  birthDate: Joi.string().required(),
});

export const userUpdateDtoSchema = Joi.object<UserUpdateDto>({
  name: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string(),
  birthDate: Joi.string(),
});
