import Joi from "joi";

export const loginSchema = Joi.object({
  full_name: Joi.string().alphanum().min(5).max(20).required(),
  password: Joi.string().alphanum().min(6).max(20).required(),
});