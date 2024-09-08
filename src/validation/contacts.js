import Joi from 'joi';

export const contactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string(),
  isFavourite: Joi.boolean().required(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .min(3)
    .max(20)
    .required(),
});

export const patchSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').min(3).max(20),
});
