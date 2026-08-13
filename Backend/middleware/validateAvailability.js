const Joi = require("joi");
const AppError = require("../errors/appErr");

module.exports = (req,res,next)=>{

    const schema = Joi.object({
        availabilityStatus:Joi.string()
            .valid("online","offline","busy")
            .required()
    });

    const {error,value}=schema.validate(req.body);

    if(error){
        return next(new AppError(error.details[0].message,400));
    }

    req.body=value;

    next();
}