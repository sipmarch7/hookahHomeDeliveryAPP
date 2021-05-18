const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const nodemailer = require('nodemailer')

router.get('/', (req,res) => {
  res.render('contactUs',{ user: req.user});
});

router.get('/contactUsConfirm', (req,res) => {
  res.render('contactUsConfirm',{ user: req.user});
});

router.get('/contactUsFailed', (req,res) => {
  res.render('contactUsFailed',{ user: req.user});
});

router.post('/sendEmail', (req,res) => {
  
  for (const field in req.body){
    if (req.body[field]==""){
      if (field=="textArea"){
        res.render('contactUs',{warning:'Δεν συμπλυρώσες τίποτα στο μήνυμα', fields: req.body});
        return}}
  }

  var smtpTrans = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });
  var mailOptions = {
    from: 'sender',
    to: 'shishahublc@gmail.com',
    subject: 'ContactUs Form on ShishaHub.gr',
    text: `${req.body.firstname} ${req.body.lastname} (${req.body.email}) (@${req.body.telephone}) (${req.body.instagram}) says: ${req.body.textArea}`
  };
  
  smtpTrans.sendMail(mailOptions, function(error, info){
    if (error) {
      res.redirect('contactUsFailed')
      console.log(error);
    } else {
      res.redirect('contactUsConfirm')
      console.log('Email sent: ' + info.response);
    }
  });
  
});

module.exports = router;