import Joi from "joi";

export const createOrderSchema = Joi.object({
  car_id: Joi.string().required(),
  customer_id: Joi.string().required(),
  start_time: Joi.date().required(),
  finish_time: Joi.date().required(),
  total_amount: Joi.number().required(),
});
