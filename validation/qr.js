const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {

    let errors = {};


    data.text = !isEmpty(data.text) ? data.text : '';
    data.amount = !isEmpty(data.amount) ? data.amount : '';
    data.max_use = !isEmpty(data.max_use) ? data.max_use : '';
    data.expire_date = !isEmpty(data.expire_date) ? data.expire_date : '';


    if (!Validator.isLength(data.text, {min: 2, max: undefined})) {
        errors.text = 'text must be between 2 and 30 characters';
    }

    if (!Validator.isInt(data.amount, {min: 1, max: 100})) {
        errors.amount = 'The input amount must be between 1 and 100';
    }

    if (!Validator.isInt(data.max_use, {min: 1, max: 100})) {
        errors.max_use = 'The input amount must be between 1 and 100';
    }

    if (!Validator.isInt(data.expire_date)) {
        errors.expire_date = 'Date must be of time timestamp';
    }

    if (Validator.isBefore(new Date(data.expire_date).toString())) {
        errors.expire_date = 'The date must be after now';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
};
