const AppError = require("../errors/appErr");
const Joi = require("joi");

const validateUser = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .required(),

        email: Joi.string()
            .email({ tlds: { allow: false } })
            .lowercase()
            .trim()
            .required(),

        phone: Joi.string()
            .trim()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({
                "string.pattern.base": "Phone number must be a valid 10-digit Indian mobile number"
            }),

        password: Joi.string()
            .min(8)
            .max(32)
            .required(),

        role: Joi.string()
            .valid("user", "driver", "admin")
            .optional()
    });

    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
    });

    if (error) {
        return next(
            new AppError(
                error.details.map(err => err.message).join(", "),
                400
            )
        );
    }

    req.body = value;
    next();
};

module.exports = validateUser;