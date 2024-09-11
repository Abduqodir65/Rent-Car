import Joi from "joi";

export const createPaymentSchema = Joi.object({
  order_id: Joi.string().required(),
  customer_id: Joi.string().required(),
  wallet_id: Joi.string().required(),
  payment_date: Joi.date().required(),
});
