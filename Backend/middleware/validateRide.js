const Joi = require("joi");
const AppError = require("../errors/appErr");

const locationSchema = Joi.object({
    address: Joi.string()
        .trim()
        .min(2)
        .required(),

    location: Joi.object({
        type: Joi.string()
            .valid("Point")
            .required(),

        coordinates: Joi.array()
            .items(Joi.number())
            .length(2)
            .required()
    }).required(),

    placeId: Joi.string()
        .trim()
        .optional()
});

const validateRide = (req, res, next) => {

    const schema = Joi.object({

        vehicleType: Joi.string()
            .valid("bike", "auto", "car", "suv")
            .required(),

        pickup: locationSchema.required(),

        destination: locationSchema.required()

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

    // Extra GeoJSON validation
    const locations = [
        value.pickup.location,
        value.destination.location
    ];

    for (const location of locations) {

        const [longitude, latitude] = location.coordinates;

        if (
            longitude < -180 ||
            longitude > 180 ||
            latitude < -90 ||
            latitude > 90
        ) {
            return next(
                new AppError(
                    "Invalid latitude or longitude",
                    400
                )
            );
        }
    }

    req.body = value;

    next();
};

module.exports = validateRide;