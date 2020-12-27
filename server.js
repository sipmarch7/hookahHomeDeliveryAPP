//use EXPRESS MODULE 
const express = require('express');
const app = express();

//use PATH MODULE for 
const path = require('path');

//use HBS view engine
const hbs = require('hbs');

// .env file 
const dotenv = require("dotenv");
dotenv.config();

//set view engine
app.set('view engine', 'hbs');

//set views file
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

//set public folder as static folder for static file
app.use(express.static(__dirname + '/public'));


//use mySQL MODULE for db
const mysql = require('mysql');
    //Create connection
const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB
});
//connect to DB
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});
module.exports = conn;


// use PASSPORT MODULE for user log in and session + bcrypt for password protection
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
    // PASSPORT configuration
passport.use('local',new Strategy(
    // by default, local strategy uses username and password, we will override with email
  function(username, password, done) { // callback with email and password from our form
    conn.query("SELECT * FROM tbl_users WHERE username = ?",username, function(err, rows){
      if (err)
        return done(err);
      if (!rows.length) { return done(null, false); }
      // req.flash is the way to set flashdata using connect-flash
      // if the user is found but the password is wrong
      if (!bcrypt.compareSync(password, rows[0].password))
        return done(null, false); 
      // create the loginMessage and save it to session as flashdata
      // all is well, return successful user
      return done(null, rows[0]);
    });
  })
);
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
    cb(null, user.user_id);
});  
passport.deserializeUser(function(id, cb) {
    conn.query("select * from tbl_users where user_id = "+id,function(err,rows){
        cb(err, rows[0]);
    });
});
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//use BODYPARSER middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//  ALL ROUTES /////////////////////////////////////////////////////

// route Home Page -> nargilesstospiti.gr



//port number
var portNumber = process.env.port || process.env.PORT || 3030;
//server listening
app.listen(portNumber, () => {
  console.log('Server is running at port '+portNumber);
});