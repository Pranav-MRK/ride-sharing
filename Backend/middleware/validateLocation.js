const Joi = require("joi");
const AppError = require("../errors/appErr");

module.exports = (req, res, next) => {

    const schema = Joi.object({
        longitude: Joi.number().min(-180).max(180).required(),
        latitude: Joi.number().min(-90).max(90).required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
        return next(new AppError(error.details[0].message,400));
    }

    req.body = value;
    next();
};