import Joi from "joi";

export const createWalletSchema = Joi.object({
  customer_id: Joi.string().required(),
  type: Joi.string().valid("credit_card", "debit_card", "paypal", "stripe").required(),
  card: Joi.string().required(),
});
