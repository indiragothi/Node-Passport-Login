const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const path = require('path');
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const {connectToMongoDB} = require('./config/keys');
 
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB config
// const db = require('./config/keys').mongoURI;

// Connect to MongoDB
connectToMongoDB('mongodb://127.0.0.1:27017/welcome')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));