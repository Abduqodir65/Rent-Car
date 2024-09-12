import Joi from "joi";

export const forgotPasswordDto = Joi.object({
    email: Joi.string().email().required(),
});