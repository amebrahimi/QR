const express = require('express');
const passport = require("passport");
const qr = require('qrcode');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const mail = require('../../mail/nodeMailer');
const {mail_options, mail_config} = require('../../config/mail');


const validator = require('../../validation/qr');
const scanValidator = require('../../validation/scanning_qr');

const QR = require('../../models/QR');
const OffCode = require('../../models/OffCode');

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

    const errors = {};

    QR.findOne({generated_hash: req.query.code})
        .then(qr => {
            if (!qr) {
                errors.code = 'QR Code not found';
                res.status(400).json(errors)
            } else {

                const {errors, isValid} = scanValidator(qr);

                if (!isValid) {

                    return res.status(400).json(errors)

                }


                const m = String.random(8);

                new OffCode({
                    code: m
                }).save()
                    .then(code => {

                        const scannedTimes = qr.scanned_times + 1;
                        const remainingUse = qr.max_use - scannedTimes < 0 ? 0 : qr.max_use - scannedTimes;

                        const list = [...qr.off_codes, code._id];

                        const updateFields = {
                            off_codes: [...list],
                            scanned_times: scannedTimes,
                            remaining_use: remainingUse
                        };

                        QR.findOneAndUpdate({generated_hash: req.query.code}, updateFields, {new: true})
                            .then(newQr => res.json({
                                id: newQr._id,
                                off_id: code._id,
                                type: newQr.type,
                                code: m
                            }))
                            .catch(err => console.log(err))

                    }).catch(err => console.log(err));
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

    const url = 'https://vp.mrclover.tk';
    const salt = await bcrypt.genSalt(10);

    if (!fs.existsSync(path.join(__dirname, `../../generated_qrs/${type}`))) {
        await fs.mkdirSync(path.join(__dirname, `../../generated_qrs/${type}`));
    }
    const filePathArray = [];
    for (let i = 0; i < amount; i++) {
        const hashedQr = await bcrypt.hash(`${type},${Date.now()}`, salt);
        const file_name = `${type}-${Date.now()}${i}.png`;
        const sending_path = `../../generated_qrs/${type}/${file_name}`;
        const file_path = path.join(__dirname, `${sending_path}`);
        qr.toFile(file_path, `${url}/scan?code=${hashedQr}`)
            .then(a => {

                filePathArray.push({
                    filename: file_name,
                    path: file_path
                });

                const qr = new QR({
                    generated_hash: hashedQr,
                    expire_date: expireDate,
                    max_use: maxUse,
                    type
                });

                if (i === amount - 1) {
                    // Send the files as email
                    mail_options.attachments = filePathArray;
                    mail(mail_options, nodemailer, mail_config);
                }

                qr.save()
                    .then(qr => console.log())
                    .catch(err => console.log(err))
            })
    }
};

module.exports = router;

