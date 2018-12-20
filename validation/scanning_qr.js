const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateScanInput(data) {

    let errors = {};

    if (!Validator.isAfter(data.expire_date.toString())) {
        errors.expire = 'Sorry the QR has been expired';
    }

    if (data.remaining_use === 0) {
        errors.max_use = 'Sorry the QR has been depleted';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
