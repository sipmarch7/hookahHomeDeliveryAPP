const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const checkAuthentication = require('../passport/checkAuthentication');
const nodemailer = require('nodemailer')

router.get('/', (req, res) => {
  res.render('product', { user: req.user});
});

router.get('/orderPreview', checkAuthentication.checkAuthenticated, (req, res) => {
  let warning = "Συμπλήρωσε όλα τα απαραίτητα πεδία"
  if (req.query.time===""){
    res.render('product', { user: req.user, warning: warning});
    return
  }
  if (req.query.date===""){
    res.render('product', { user: req.user, warning: warning});
    return
  }
  if (req.query.duration==='6' && req.query.flavor3===''){
    res.render('product', { user: req.user, warning: warning});
    return
  }
  if (req.query.duration==='36' && req.query.flavor3==='' && req.query.flavor4===''){
    res.render('product', { user: req.user, warning: warning});
    return
  }
  var mm = req.query.date.slice(5,7)
  var yy = req.query.date.slice(0,4)
  var dd = req.query.date.slice(8)
  req.query.date = dd+"-"+mm+"-"+yy
  res.render('orderPreview', { user: req.user, fields: req.query, price: price(req.query.duration, req.user.postal)}); 
});


router.post('/orderPreview', checkAuthentication.checkAuthenticated,  (req, res) => {
  let data = {  user_id : req.user.user_id, date : req.body.date, 
    time : req.body.time, duration : req.body.duration, 
    flavors : req.body.flavors, price : price(req.body.duration, req.user.postal), 
    status : "pending"
  }
  let sql = "INSERT INTO tbl_orders SET ?";
  let query = conn.query(sql, data,(err, result) => {
    if(err) throw err;
    res.redirect('orderConfirmation');
    
    // email EIMAIFEAKFKEFLAEF EMAILEMAIL EMAIL EMAIL EMAIL EMAIL EMAILEMAIL
    var smtpTrans = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    var mailOptions = {
      from: 'sender',
      to: 'shishahublc@gmail.com',
      subject: 'NEW ORDER From: '+req.user.firstname+" "+req.user.lastname,
      text: 'DAY : '+req.body.date+' at '+req.body.time+
        '\n\nORDER DETAILS'+
        '\n——————————————————'+
        '\n Order ID  : '+ result.insertId+
        '\n Date       : '+ req.body.date+
        '\n Time       : '+ req.body.time+
        '\n Duration  : '+ req.body.duration+
        '\n Flavors    : '+ req.body.flavors+
        '\n Price      : '+ price(req.body.duration, req.user.postal)+
        '\n\nACCOUNT DETAILS'+
        '\n——————————————————'+
        '\n User ID     : '+ req.user.user_id+
        '\n Name       : '+ req.user.firstname+" "+req.user.lastname+
        '\n Email      : '+ req.user.email+
        '\n Telephone : '+ req.user.telephone+
        '\n Address    : '+ req.user.address+
        '\n Floor        : '+ req.user.floor+
        '\n City         : '+ req.user.city+
        '\n Postal      : '+ req.user.postal
    };
    
    smtpTrans.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    // email EIMAIFEAKFKEFLAEF EMAILEMAIL EMAIL EMAIL EMAIL EMAIL EMAILEMAIL

  });
});

router.get('/orderConfirmation', (req, res) => {
  res.render('orderConfirmation', { user: req.user});
});


module.exports = router;

function price(duration, postal){
  if (duration==='4'){
    if (postal===20100){return '30'}
    if (postal===20006 || postal===20001){return '30'}
    return '25'
  }
  if (duration==='6'){
    if (postal===20100){return '40'}
    if (postal===20006 || postal===20001){return '40'}
    return '35'
  }
  if (postal===20100){return '55'}
  if (postal===20006 || postal===20001){return '55'}
  return '50'
}