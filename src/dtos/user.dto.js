import Joi from "joi";

export const createUserrSchema = Joi.object({
  full_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  email: Joi.string().email().required(),
  hashed_password: Joi.string().required(),
  address: Joi.string().required(),
});
