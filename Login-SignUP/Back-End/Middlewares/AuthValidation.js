const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(100).required(),
        lastName: Joi.string().max(100).allow(''), // lastName is allowed to be empty
        DOB: Joi.date().required(),
        email: Joi.string().email().when('phoneNumber', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required()
        }),
        phoneNumber: Joi.string().length(10).when('email', {
            is: Joi.exist(),
            then: Joi.forbidden(),
            otherwise: Joi.required()
        }),
        createPassword: Joi.string().min(4).max(100).required(),
        Password: Joi.string().min(4).max(100).required(),
        fourdigitPin: Joi.string().length(4).pattern(/^[0-9]+$/).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        fourdigitPin: Joi.string().length(4).pattern(/^[0-9]+$/).required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation

}