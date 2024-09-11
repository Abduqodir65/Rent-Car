import Joi from "joi";

export const createAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string().required(),
  hashed_password: Joi.string().required(),
});
