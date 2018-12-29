const Qr = require('../../models/QR');
const UserScan = require('../../models/UserQRScan');

// For routing api
const express = require('express');
const router = express.Router();

// Passport is for checking the authentication
const passport = require('passport');


// @Route   /api/query/qr
// @desc    getting the query for generated qrs
// @access  Private
router.get('/qr', passport.authenticate('jwt', {session: false}, null), (req, res) => {

    Qr.find()
        .populate('off_codes')
        .then(qr => {

            const responseArray = [];
            qr.forEach((qr) => {
                const resObject = {
                    type: qr.type,
                    is_generated: qr.off_codes ? qr.off_codes.length > 0 : null,
                    is_used: qr.off_codes ? qr.off_codes.length > 0 ? qr.off_codes[0].is_used : null : null
                };
                responseArray.push(resObject)
            });


            res.json(responseArray);
        }).catch(err => console.log(err));

});

// @Route   /api/query/user
// @desc    getting the query for users
// @access  Private
router.get('/user', passport.authenticate('jwt', {session: false}, null), (req, res) => {

    UserScan.find()
        .sort({date_scanned: -1})
        .populate('off_codes.off_codes off_codes.qr')
        .then(users => {

            const responseArray = [];

            users.forEach(user => {

                const inner = user.off_codes.map(offCode => {
                    return {
                        type: offCode.qr.type,
                        is_used: offCode.off_codes.is_used
                    }
                });

                const resObject = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    offCodes: inner
                };

                responseArray.push(resObject);

            });


            res.json(responseArray);
        }).catch(err => console.log(err));

});

module.exports = router;





