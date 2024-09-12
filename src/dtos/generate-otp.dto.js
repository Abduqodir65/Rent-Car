import Joi from "joi";

export const generateOTPDto = Joi.object({
  email: Joi.string().email().required(),
});