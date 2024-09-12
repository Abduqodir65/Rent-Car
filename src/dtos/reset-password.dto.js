import Joi from "joi";

export const resetPasswordDto = Joi.object({
  password: Joi.string().alphanum().min(6).max(20).required(),
});