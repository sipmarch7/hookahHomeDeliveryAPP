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

// use of ////////////////PASSPORT//////////// for user login
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const initializePassport = require('./passport/passport-config');
initializePassport(passport);
// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(flash());
app.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

//use BODYPARSER middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(require('morgan')('combined'));


//  ALL ROUTES /////////////////////////////////////////////////////

// route Home Page -> shishahub.gr
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const faqsRouter = require('./routes/faqs');
app.use('/faqs', faqsRouter);

const contactUsRouter = require('./routes/contactUs');
app.use('/contactUs', contactUsRouter);

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);
 
const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const myAccountRouter = require('./routes/myAccount');
app.use('/myAccount', myAccountRouter);

const productRouter = require('./routes/product');
app.use('/product', productRouter);

//port number
var portNumber = process.env.port || process.env.PORT || 3006;
//server listening
app.listen(portNumber, () => {
  console.log('Server is running at port '+portNumber);
});