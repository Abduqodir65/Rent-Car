import Joi from "joi";

export const createCarSchema = Joi.object({
  model: Joi.string().required(),
  price_daily: Joi.number().required(),
  color: Joi.string().required(),
  fuel_type: Joi.string().valid("petrol", "diesel", "electric", "hybrid").required(),
  status: Joi.boolean().required(),
});
