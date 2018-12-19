const express = require('express');
const passport = require("passport");
const qr = require('qrcode');
const router = express.Router();

const validator = require('../../validation/qr');

// @Route   POST api/qr/generate
// @desc    Gets the type and amount of barcodes and generates them based on that
// @access  Private
router.post('/generate',
    passport.authenticate('jwt', {session: false}, null),
    (req, res) => {

        const {errors, isValid} = validator(req.body);

        if (!isValid) {
            return res.json(errors);
        }

        qr.toDataURL(req.body.text)
            .then(name => res.json({name}))
            .catch(err => console.log(err))
    });

module.exports = router;

