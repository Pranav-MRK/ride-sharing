const Joi = require("joi");
const AppError = require("../errors/appErr");

const validateDriver = (req, res, next) => {

    const schema = Joi.object({

        licenseNumber: Joi.string()
            .trim()
            .required(),

        licenseExpiry: Joi.date()
            .greater("now")
            .required(),

        vehicle: Joi.object({

            vehicleType: Joi.string()
                .valid("bike", "auto", "car", "suv")
                .required(),

            brand: Joi.string()
                .trim()
                .min(2)
                .max(50)
                .required(),

            model: Joi.string()
                .trim()
                .min(1)
                .max(50)
                .required(),

            color: Joi.string()
                .trim()
                .required(),

            vehicleNumber: Joi.string()
                .trim()
                .uppercase()
                .required(),

            registrationCertificate: Joi.string()
                .trim()
                .required(),

            insuranceNumber: Joi.string()
                .trim()
                .required(),

            insuranceExpiry: Joi.date()
                .greater("now")
                .required(),

            capacity: Joi.number()
                .integer()
                .min(1)
                .max(8)
                .required()

        }).required()

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

module.exports = validateDriver;