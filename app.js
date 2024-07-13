const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('./config/key').MongoURL;
const app = express();
const ejs = require('ejs');
ejs.clearCache();

const secretKey = crypto.randomBytes(64).toString('hex');
app.use(session({
    secret: secretKey, // replace with your own secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to true if using HTTPS
}));
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Use express-ejs-layouts
app.use(expressLayouts);

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const Port = process.env.PORT || 3000;

// Connect to the database
mongoose.connect(config)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(Port, () => {
      console.log(`Server started on http://localhost:${Port}`);
    });
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
