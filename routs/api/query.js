const Qr = require('../../models/QR');
const UserScan = require('../../models/UserQRScan');

// For routing api
const express = require('express');
const router = express.Router();

// Passport is for checking the authentication
const passport = require('passport');


router.get('/', passport.authenticate('jwt', {session: false}, null), (req,res) => {


});

module.exports = router;





