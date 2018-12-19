const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');

const users = require('./routs/api/admin_user');
const qr = require('./routs/api/qr');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());


// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log('Mongo DB Successfully Connected'))
    .catch(err => console.log(err));

// Passport Config
require('./config/passport')(passport);

// Use Routs
app.use('/api/admin', users);
app.use('/api/qr', qr);

port = 5000;

app.listen(port, () => console.log(`Server Running on port ${port}`));

