const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {

    let errors = {};

    if (!Validator.isLength(data.text, {min: 2, max: undefined})) {
        errors.name = 'text must be between 2 and 30 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
