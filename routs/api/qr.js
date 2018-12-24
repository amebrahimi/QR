const express = require('express');
const passport = require("passport");
const qr = require('qrcode');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');


const validator = require('../../validation/qr');
const scanValidator = require('../../validation/scanning_qr');

const QR = require('../../models/QR');

// @Route   POST api/qr/generate
// @desc    Gets the type and amount of barcodes and generates them based on that
// @access  Private
router.post('/generate',
    passport.authenticate('jwt', {session: false}, null),
    (req, res) => {

        const {errors, isValid} = validator(req.body);
        const {text, amount, expire_date, max_use} = req.body;

        if (!isValid) {
            return res.status(400).json(errors);
        }

        generateQrCode(amount, text, expire_date, max_use)
            .then(res.json({success: true}))
            .catch(err => console.log(err))
    });

// @Route   GET api/qr/generate_off?code=
// @desc    Generates the off code based on the qrcodes hash
// @access  public
router.get('/generate_off', (req, res) => {

    QR.findOne({generated_hash: req.query.code})
        .then(qr => {
            if (!qr) {
                errors.code = 'Code not found';
                res.status(400).json(errors)
            } else {

                const {errors, isValid} = scanValidator(qr);

                if (!isValid) {
                    return res.status(400).json(errors)
                }


                const m = String.random(8);


                const scannedTimes = qr.scanned_times + 1;
                const remainingUse = qr.max_use - scannedTimes < 0 ? 0 : qr.max_use - scannedTimes;


                const list = [
                    ...qr.generated_off_codes, {
                        code: m,
                    }];

                const updateFields = {
                    generated_off_codes: [...list],
                    scanned_times: scannedTimes,
                    remaining_use: remainingUse
                };

                QR.findOneAndUpdate({generated_hash: req.query.code}, updateFields, {new: true})
                    .then(newQr => res.json({
                        id: newQr._id,
                        type: newQr.type,
                        codes: newQr.generated_off_codes,
                        code: m
                    }))
                    .catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
});

// @Route   GET api/qr
// @desc    Get the list of types that are already created
// @access  Private
router.get('/', passport.authenticate('jwt', {session: false}, null), (req, res) => {

    QR.aggregate([
        {
            $group: {
                _id: '$type',
            }
        }
    ]).sort({'_id': 1}).then(qr => {

        res.json({types: qr});

    }).catch(err => res.json(err));
});

String.random = function (length) {
    let radom13chars = function () {
        return Math.random().toString(16).substring(2, 15)
    };
    let loops = Math.ceil(length / 13);
    return new Array(loops).fill(radom13chars).reduce((string, func) => {
        return string + func()
    }, '').substring(0, length)
};

const generateQrCode = async (amount, type, expireDate, maxUse) => {

    const url = 'http://192.168.1.101:3000';
    const salt = await bcrypt.genSalt(10);

    if (!fs.existsSync(path.join(__dirname, `../../generated_qrs/${type}`))) {
        await fs.mkdirSync(path.join(__dirname, `../../generated_qrs/${type}`));
    }
    for (let i = 0; i < amount; i++) {
        const hashedQr = await bcrypt.hash(`${type},${Date.now()}`, salt);
        qr.toFile(path.join(__dirname, `../../generated_qrs/${type}/${type}-${Date.now()}${i}.png`), `${url}/scan?code=${hashedQr}`)
            .then(a => {
                const qr = new QR({
                    generated_hash: hashedQr,
                    expire_date: expireDate,
                    max_use: maxUse,
                    type
                });

                qr.save()
                    .then(qr => console.log(qr))
                    .catch(err => console.log(err))
            })
    }
};

module.exports = router;

