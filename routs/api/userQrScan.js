const isEmpty = require("../../validation/is-empty");

const Qr = require('../../models/QR');
const UserQrScan = require('../../models/UserQRScan');
const express = require("express");
const router = express.Router();


async function extracted(user, dataForUpdate, options, otherUser, res) {
    await otherUser.delete()
        .then(status => console.log(status))
        .catch(err => console.log(err));

    await UserQrScan.findByIdAndUpdate(user._id, dataForUpdate, options)
        .then(updatedUser => {
                res.json(updatedUser);
            }
        )
        .catch(err => res.status(500).json(err));
}

// @Route   Post api/user
// @desc    add user to database
// @access  Public
router.post('/', (req, res) => {

    const errors = {};

    const {phone, email, name, qr_id, scanned_code} = req.body;

    const phoneToCheck = !isEmpty(phone) ? phone : '';
    const emailToCheck = !isEmpty(email) ? email : '';


    if (isEmpty(phoneToCheck) && isEmpty(emailToCheck)) {
        errors.validation = 'At least one of the phone/email field(s) must be filled';
        return res.status(400).json(errors);
    } else if (!isEmpty(phoneToCheck) && !isEmpty(emailToCheck)) {

        /* Check if that the off code is anyones database
         * we don't let it to attach to the user or another user again
        */
        UserQrScan.find({"off_codes.code": scanned_code})
            .then(user => {
                if (!isEmpty(user)) {
                    errors.used = 'This code was attached to a user before';
                    res.status(400).json(errors)
                } else {

                    // We get the qr details from the database
                    Qr.findById(qr_id)
                        .then(qr => {

                            // We try to create a new user if it fails it means there is a duplicate
                            new UserQrScan({
                                email: emailToCheck,
                                phone: phoneToCheck,
                                name,
                                user_points: qr.point,
                                off_codes: {
                                    qr: qr_id,
                                    code: scanned_code
                                }
                            }).save()
                                .then(data => res.json(data))
                                .catch(err => {

                                    // Handling the duplicate stuff
                                    if (!isEmpty(err.errors.phone) || !isEmpty(err.errors.email)) {

                                        if (isEmpty(err.errors.phone)) {

                                            /*
                                             * We have a user entry by this email. so we want to update its phone
                                             * number with the given phone number and update its data
                                             */
                                            UserQrScan.findOne({email: emailToCheck})
                                                .then(user => {

                                                    let point_to_add;
                                                    let points = user.user_points;

                                                    point_to_add = qr.point;
                                                    points = point_to_add + points;
                                                    user.user_points = points;

                                                    const updateUser = {
                                                        name,
                                                        user_points: points,
                                                        phone: phoneToCheck,
                                                        $push: {
                                                            off_codes: {
                                                                qr: qr_id,
                                                                code: scanned_code
                                                            }
                                                        }

                                                    };
                                                    const options = {new: true};

                                                    UserQrScan.findByIdAndUpdate(user._id, updateUser, options)
                                                        .then(updateUser => res.json(updateUser))
                                                        .catch(err => console.log(err));

                                                }).catch(err => console.log(err));


                                        } else if (isEmpty(err.errors.email)) {

                                            /*
                                             * We have a user entry by this phone. so we want to update its email
                                             * number with the given email and update its data
                                             */
                                            UserQrScan.findOne({phone: phoneToCheck})
                                                .then(user => {

                                                    let point_to_add;
                                                    let points = user.user_points;

                                                    point_to_add = qr.point;
                                                    points = point_to_add + points;
                                                    user.user_points = points;

                                                    const updateUser = {
                                                        name,
                                                        user_points: points,
                                                        email: emailToCheck,
                                                        $push: {
                                                            off_codes: {
                                                                qr: qr_id,
                                                                code: scanned_code
                                                            }
                                                        }

                                                    };
                                                    const options = {new: true};

                                                    UserQrScan.findByIdAndUpdate(user._id, updateUser, options)
                                                        .then(updateUser => res.json(updateUser))
                                                        .catch(err => console.log(err));

                                                }).catch(err => console.log(err));


                                            // If the user has email and phone
                                        } else {

                                            /*
                                             * Check if the user has phone number and email attached to its database
                                             */
                                            UserQrScan.findOne({email: emailToCheck})
                                                .then(user => {
                                                    /* Here we check if the phone part is empty that means the user has another account with his/her phone.
                                                     * We must merge them together and delete the other one
                                                     */
                                                    if (isEmpty(user.phone)) {

                                                        UserQrScan.findOne({phone: phoneToCheck})
                                                            .then(otherUser => {

                                                                let point_to_add;
                                                                let points = user.user_points;


                                                                point_to_add = qr.point;
                                                                points = point_to_add + points;
                                                                points = otherUser.user_points + points;
                                                                user.user_points = points;


                                                                const dataForUpdate = {

                                                                    phone: phoneToCheck,
                                                                    name,
                                                                    user_points: points,
                                                                    $push: {
                                                                        off_codes: {
                                                                            $each: [...otherUser.off_codes, {
                                                                                qr: qr_id,
                                                                                code: scanned_code
                                                                            }],
                                                                        }
                                                                    }
                                                                };

                                                                const options = {new: true};
                                                                extracted(user, dataForUpdate, options, otherUser, res)
                                                                    .then(ok => console.log(ok));

                                                            })
                                                            .catch(err => console.log(err));

                                                        // There is phone and email attached to this user we just want to update its record
                                                    } else {

                                                        UserQrScan.findOne({phone: phoneToCheck})
                                                            .then(user => {

                                                                if (user.email !== emailToCheck) {
                                                                    errors.validation = 'The entered use and email do not match';
                                                                    return res.status(400).json(errors);
                                                                }

                                                                let point_to_add;
                                                                let points = user.user_points;

                                                                point_to_add = qr.point;
                                                                points = point_to_add + points;
                                                                user.user_points = points;

                                                                const updateUser = {
                                                                    name,
                                                                    user_points: points,
                                                                    $push: {
                                                                        off_codes: {
                                                                            qr: qr_id,
                                                                            code: scanned_code
                                                                        }
                                                                    }

                                                                };
                                                                const options = {new: true};

                                                                UserQrScan.findByIdAndUpdate(user._id, updateUser, options)
                                                                    .then(updateUser => res.json(updateUser))
                                                                    .catch(err => console.log(err));

                                                            }).catch(err => console.log(err));


                                                    }
                                                })
                                                .catch(err => console.log(err));
                                        }

                                    } else {
                                        res.status(500).json(err);
                                    }


                                }).catch(err => console.log(err));
                        });
                }
            })
            .catch(err => console.log(err));

        // If the user entered one of the email/phone
    } else {

        /* Check if that the off code is anyones database
         * we don't let it to attach to the user or another user again
        */
        UserQrScan.find({"off_codes.code": scanned_code})
            .then(user => {
                if (!isEmpty(user)) {
                    errors.used = 'This code was attached to a user before';
                    res.status(400).json(errors)
                } else {
                    // Check if the phone/email that is entered is in the database
                    UserQrScan.findOne({
                        $or:
                            [
                                {phone: phoneToCheck},
                                {email: emailToCheck}
                            ]
                    })
                        .then(user => {
                            // User found lets update the users info
                            if (user) {
                                Qr.findById(qr_id)
                                    .then(qr => {
                                        let point_to_add;
                                        let points = user.user_points;

                                        point_to_add = qr.point;
                                        points = point_to_add + points;
                                        user.user_points = points;

                                        const updateUser = {
                                            name,
                                            user_points: points,
                                            $push: {
                                                off_codes: {
                                                    qr: qr_id,
                                                    code: scanned_code
                                                }
                                            }

                                        };
                                        const options = {new: true};

                                        UserQrScan.findByIdAndUpdate(user._id, updateUser, options)
                                            .then(updateUser => res.json(updateUser))
                                            .catch(err => console.log(err));

                                    }).catch(err => console.log(err));

                                // There is no user lets create one
                            } else {
                                Qr.findById(qr_id)
                                    .then(qr => {
                                        const user = new UserQrScan({
                                            email: emailToCheck,
                                            phone: phoneToCheck,
                                            name,
                                            user_points: qr.point,
                                            off_codes: {
                                                qr: qr_id,
                                                code: scanned_code
                                            }
                                        });

                                        user.save()
                                            .then(user => res.json(user))
                                            .catch(err => console.log(err));


                                    }).catch(err => console.log(err));

                            }
                        }).catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }

});


module.exports = router;

