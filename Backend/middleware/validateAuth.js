const AppError = require("../errors/appErr");
const Joi = require("joi");

const ValidateAuth =(req,res,next)=>{
    const schema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required().lowercase().trim(),
        password: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });
    if (error) {
        return next(new AppError(error.details[0].message, 400));
    }
    req.body = value;
    next();
}
module.exports = ValidateAuth;