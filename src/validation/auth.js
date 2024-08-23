import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(20).required(),
  password: Joi.string().min(3).max(20).required(),
});
