const express = require('express');
const router = express.Router();
const User = require('../../models/AdminUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');


// @Route POST api/qr_admin/register
// @desc Register User
// @access Public
router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({name: req.body.user})
        .then(user => {
                if (user) {
                    errors.user = 'User already exists';
                    res.status(404).json(errors)
                } else {

                    const newUser = new User({
                        name: req.body.user,
                        password: req.body.password
                    });

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                throw err
                            } else {
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => res.json(user))
                                    .catch(err => console.log(err))
                            }
                        })
                    })
                }
            }
        )

});


// @Route POST api/qr_admin/login
// @desc Login User / Return JWT Token
// @access Public
router.post('/login', (req, res) => {

    const user = req.body.user.toLowerCase();
    const password = req.body.password;


    // Find user by email
    User.findOne({name: user})
        .then(user => {
            // Check for user
            if (!user) {
                return res.status(404).json({user: 'User not found'})
            }

            // Check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {

                        // User matched

                        const payload = {
                            id: user.id,
                            name: user.name
                        }; // create jwt payload

                        // Sign Token
                        jwt.sign(payload,
                            require('../../config/keys').secret,
                            {expiresIn: 86400}, // about a day
                            (err, token) => {

                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                });
                            });

                    } else {
                        return res.status(400).json({password: 'Password incorrect'})
                    }
                });
        })
        .catch(err => console.log(err));
});


module.exports = router;