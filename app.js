const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const users = require('./routs/api/admin_user');
const qr = require('./routs/api/qr');
const userQrScan = require('./routs/api/userQrScan');
const query = require('./routs/api/query');
const app = express();
const path = require('path');

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
app.use('/api/user', userQrScan);
app.use('/api/query', query);

port = 5000;

if (process.env.NODE_ENV === 'production') {

    app.use(express.static('client/build'))

    app.get('*' , (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(port, () => console.log(`Server Running on port ${port}`));