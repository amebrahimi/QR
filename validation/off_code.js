const isEmpty = require("./is-empty");
const Validator = require('validator');


module.exports = function validateOffCode(data) {

    let errors = {};


    data.code = !isEmpty(data.code) ? data.code : '';

    if (!Validator.isLength(data.code, {min: 2, max: 10})) {
        errors.code = 'The generated code length you Entered is invalid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};