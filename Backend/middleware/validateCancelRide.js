const Joi = require("joi");
const AppError = require("../errors/appErr");

const validateCancelRide = (req, res, next) => {

    const schema = Joi.object({
        reason: Joi.string()
            .trim()
            .min(3)
            .max(200)
            .required()
    });

    const { error, value } =
        schema.validate(req.body);

    if (error) {
        return next(
            new AppError(
                error.details[0].message,
                400
            )
        );
    }

    req.body = value;

    next();
};

module.exports = validateCancelRide;