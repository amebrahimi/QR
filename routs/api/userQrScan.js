const isEmpty = require("../../validation/is-empty");

const Qr = require('../../models/QR');
const UserQrScan = require('../../models/UserQRScan');
const OffCode = require('../../models/OffCode');
const express = require("express");
const router = express.Router();

const validateOffCode = require('../../validation/off_code');

const checkOffCodeInUserDatabases = async (off_id) => {

    return await UserQrScan.findOne({'off_codes.off_codes': off_id});
};

const findUserByEmail = async email => {

    return await UserQrScan.findOne({email});

};

const findUserByPhone = async phone => {

    return await UserQrScan.findOne({phone});

};

const getQrDetails = async qr_id => {

    return await Qr.findById(qr_id);
};

const createUser = (res, email, phone, name, qr_id, off_id, point) => {

    new UserQrScan({
        email,
        phone,
        name,
        user_points: point,
        off_codes: {
            qr: qr_id,
            off_codes: off_id
        }
    }).save()
        .then(user => res.json(user))
        .catch(err => res.status(500).json(err));

};

const updateData = async (updatedData, userId) => {

    const options = {new: true};
    return await UserQrScan.findByIdAndUpdate(userId, updatedData, options);

};

const deleteUser = async userId => {
    return await UserQrScan.findByIdAndDelete(userId);
};

const mergeUser = (res, email, phone, name, qr_id, off_id, emailUser, phoneUser, point) => {

    const points = emailUser.user_points + phoneUser.user_points + point;

    const updatedData = {
        name,
        email,
        phone,
        user_points: points,
        $push: {
            off_codes: {
                $each: [...phoneUser.off_codes, {
                    qr: qr_id,
                    off_codes: off_id
                }]
            }
        }
    };

    deleteUser(phoneUser._id)
        .then(u => {
            updateData(updatedData, emailUser._id)
                .then(updatedUser => res.json(updatedUser))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

const updateUser = (res, email, phone, name, qr_id, off_id, user, point) => {

    if (email !== null && phone !== null) {

        const points = user.user_points + point;

        const updatedData = {
            name,
            email,
            phone,
            user_points: points,
            $push: {
                off_codes: {
                    qr: qr_id,
                    off_codes: off_id
                }
            }
        };

        updateData(updatedData, user._id)
            .then(updatedUser => res.json(updatedUser))
            .catch(err => console.log(err));

    } else {
        const points = user.user_points + point;

        const updatedData = {
            name,
            user_points: points,
            $push: {
                off_codes: {
                    qr: qr_id,
                    off_codes: off_id
                }
            }
        };

        updateData(updatedData, user._id)
            .then(updatedUser => res.json(updatedUser))
            .catch(err => console.log(err));
    }

};

// @Route   Post api/user
// @desc    add user to database
// @access  Public
// router.post('/', (req, res) => {
router.post('/', (req, res) => {

    const errors = {};
    const {phone, email, name, qr_id, off_id} = req.body;

    const phoneToCheck = !isEmpty(phone) ? phone : '';
    const emailToCheck = !isEmpty(email) ? email : '';

    if (isEmpty(phoneToCheck) && isEmpty(emailToCheck)) {
        errors.validation = 'At least one of the phone/email fields must be filled';
        return res.status(400).json(errors);
    }
    checkOffCodeInUserDatabases(off_id)
        .then(codeUser => {
            if (!isEmpty(codeUser)) {
                errors.duplicate = 'Sorry this off code is attached to another user';
                return res.status(404).json(errors);
            } else {
                getQrDetails(qr_id)
                    .then(qr => {
                        if (!isEmpty(phoneToCheck) && !isEmpty(emailToCheck)) {
                            findUserByPhone(phoneToCheck)
                                .then(phoneUser => {
                                    findUserByEmail(emailToCheck)
                                        .then(emailUser => {
                                            if (!phoneUser) {
                                                if (!emailUser) {
                                                    createUser(res, emailToCheck, phoneToCheck, name, qr_id, off_id, qr.point);
                                                } else {
                                                    if (isEmpty(emailUser.phone)) {
                                                        updateUser(res, emailToCheck, phoneToCheck, name, qr_id, off_id, emailUser, qr.point);
                                                    } else {
                                                        errors.phone = 'Sorry the email and phone mismatch';
                                                        res.status(400).json(errors);
                                                    }
                                                }
                                            } else {
                                                if (!emailUser) {
                                                    updateUser(res, emailToCheck, phoneToCheck, name, qr_id, off_id, phoneUser, qr.point);
                                                } else {
                                                    if (emailUser.phone) {
                                                        if (emailUser.phone === phoneToCheck) {
                                                            updateUser(res, emailToCheck, phoneToCheck, name, qr_id, off_id, emailUser, qr.point);
                                                        } else {
                                                            errors.phone = 'Sorry the email and phone mismatch';
                                                            res.status(400).json(errors);
                                                        }
                                                    } else {
                                                        if (phoneUser.email) {

                                                            if (phoneUser.email === emailUser.email) {
                                                                updateUser(res, emailToCheck, phoneToCheck, name, qr_id, off_id, emailUser, qr.point);
                                                            } else {
                                                                errors.phone = 'Sorry the email and phone mismatch';
                                                                res.status(400).json(errors);
                                                            }

                                                        } else {

                                                            mergeUser(res, emailToCheck, phoneToCheck, name, qr_id, off_id, emailUser, phoneUser, qr.point);

                                                        }
                                                    }
                                                }
                                            }
                                        }).catch(err => console.log(err));
                                }).catch(err => console.log(err));

                        } else {
                            if (!isEmpty(emailToCheck)) {
                                findUserByEmail(emailToCheck)
                                    .then(user => {
                                        if (!user) {
                                            createUser(res, emailToCheck, null, name, qr_id, off_id, qr.point)
                                        } else {
                                            updateUser(res, emailToCheck, null, name, qr_id, off_id, user, qr.point)
                                        }
                                    }).catch(err => console.log(err));
                            } else {
                                findUserByPhone(phoneToCheck)
                                    .then(user => {
                                        if (!user) {
                                            createUser(res, null, phoneToCheck, name, qr_id, off_id, qr.point)
                                        } else {

                                            updateUser(res, null, phoneToCheck, name, qr_id, off_id, user, qr.point)
                                        }
                                    }).catch(err => console.log(err));
                            }


                        }

                    }).catch(err => console.log(err));
            }

        }).catch(err => console.log(err));
});


// @Route   Post api/user/use
// @desc    use the off code that is generated by the user / Check if it used before
// @access  Public
router.post('/use', (req, res) => {

    const {code} = req.body;
    const {errors, isValid} = validateOffCode(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors)
    }


    OffCode.findOne({code})
        .then(data => {


            if (!data) {
                errors.error = "The code you have entered is incorrect...";
                return res.status(400).json(errors);
            }

            if (data.is_used) {

                errors.used = 'Sorry the Code you have entered has been used';
                res.status(400).json(errors);

            } else {

                UserQrScan.find()
                    .populate({
                        path: 'off_codes.off_codes',
                        match: {code: `${code}`},
                        select: '_id',
                    }).populate({
                    path: 'off_codes.qr',
                    select: 'type -_id'
                }).then(users => {

                    users.forEach(user => {
                        user.off_codes.forEach((offCode) => {
                            if (offCode.off_codes !== null) {

                                const offCodeId = offCode.off_codes._id;

                                const updatedData = {
                                    is_used: true
                                };

                                OffCode.findByIdAndUpdate(offCodeId, updatedData)
                                    .then(offC => {
                                        res.json({
                                            type: offCode.qr.type,
                                            is_used: offC.is_used
                                        });
                                    })
                                    .catch(err => console.log(err));
                            }

                        });
                    });
                }).catch(err => console.log(err));
            }

        })
        .catch(err => console.log(err));

});


module.exports = router;

