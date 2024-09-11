import Joi from "joi";

const registerValidation = Joi.object({
    first_name: Joi.string().required(),
    phone: Joi.string().pattern(/^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/).required(),
    email: Joi.string().email().required(),
    username: Joi.string().min(6).max(20).required(),
    password: Joi.string().min(8).max(20).required()
});

export default registerValidation