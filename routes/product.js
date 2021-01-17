const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const checkAuthentication = require('../passport/checkAuthentication');
const nodemailer = require('nodemailer');

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
  /* var mm = req.query.date.slice(5,7)
  var yy = req.query.date.slice(0,4)
  var dd = req.query.date.slice(8)*/
  req.query.date = dateForEurope(req.query.date)
  res.render('orderPreview', { user: req.user, fields: req.query, price: price(req.query.duration, req.user.outOfLoutraki, req.user.numberOfOrders)}); 
});


router.post('/orderPreview', checkAuthentication.checkAuthenticated,  (req, res) => {
  let data = {  user_id : req.user.user_id, date : dateForSQL(req.body.date), 
    time : req.body.time, duration : req.body.duration, 
    flavors : req.body.flavors, price : price(req.body.duration, req.user.outOfLoutraki, req.user.numberOfOrders), 
    status : "pending", otherAddress: req.body.textArea
  }
  let sql = "INSERT INTO tbl_orders SET ?";
  let query = conn.query(sql, data,(err, result0) => {
    if(err) throw err;
    res.redirect('orderConfirmation');
    
    //update number of orders at tbl_users 
    var sql = "UPDATE tbl_users SET numberOfOrders = numberOfOrders + 1 WHERE user_id="+req.user.user_id
    let query = conn.query(sql, (err, result1) => {
      if(err) throw err;
      var numOfOrders = req.user.numberOfOrders+1
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
        to: 'panweq@gmail.com', //shishahublc@gmail.com //sipmarch7@hotmail.com
        subject: 'NEW ORDER From: '+req.user.firstname+" "+req.user.lastname,
        text: 'DAY : '+req.body.date+' at '+req.body.time+
          '\n——————————————————————————————'+
          '\n\nORDER DETAILS'+
          '\n——————————————————————————————'+
          '\n Order ID  : '+'32'+ result0.insertId+'47'+" "+" No."+numOfOrders+
          '\n Date       : '+ req.body.date+
          '\n Time       : '+ req.body.time+
          '\n Duration  : '+ req.body.duration+
          '\n Flavors    : '+ req.body.flavors+
          '\n Price      : '+ price(req.body.duration, req.user.outOfLoutraki, req.user.numberOfOrders)+
          '\n Other Address : '+ req.body.textArea+
          '\n\nACCOUNT DETAILS'+
          '\n——————————————————————————————'+
          '\n User ID     : '+ req.user.user_id+
          '\n Name       : '+ req.user.firstname+" "+req.user.lastname+
          '\n Email        : '+ req.user.email+
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
      var mailOptions1 = {
        from: 'sender',
        to: req.user.email, //shishahublc@gmail.com //sipmarch7@hotmail.com
        subject: 'Your Shishahub Order '+req.user.firstname,
        text: 'Ευχαριστούμε για την παραγγελία σου στο Shishahub.'+
          '\nΣύντομα θα ακολουθήσει email επιβεβαίωσης και αποδοχής της παραγγελίας σου.'+
          '\nΠαρακάτω υπάρχουν τα στοιχεία της παραγγελίας σου.'+
          '\nΓια οποιαδήποτε αλλαγή επικοινώνησε μαζί μας στο DM του instagram @shishahub.lc ή στο email εδώ.'+
          '\n\nORDER DETAILS'+
          '\n——————————————————————————————'+
          '\n Order ID  : '+'32'+ result0.insertId+'47'+" "+" No."+numOfOrders+
          '\n Date       : '+ req.body.date+
          '\n Time       : '+ req.body.time+
          '\n Duration  : '+ req.body.duration+
          '\n Flavors    : '+ req.body.flavors+
          '\n Price      : '+ price(req.body.duration, req.user.outOfLoutraki, req.user.numberOfOrders)+
          '\n Other Address : '+ req.body.textArea+
          '\n\nACCOUNT DETAILS'+
          '\n——————————————————————————————'+
          '\n Name       : '+ req.user.firstname+" "+req.user.lastname+
          '\n Email        : '+ req.user.email+
          '\n Telephone : '+ req.user.telephone+
          '\n Address    : '+ req.user.address+
          '\n Floor        : '+ req.user.floor+
          '\n City         : '+ req.user.city+
          '\n Postal      : '+ req.user.postal
      };

      smtpTrans.sendMail(mailOptions1, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      // email EIMAIFEAKFKEFLAEF EMAILEMAIL EMAIL EMAIL EMAIL EMAIL EMAILEMAIL
    })
  });
});

router.get('/orderConfirmation', (req, res) => {
  res.render('orderConfirmation', { user: req.user});
});


module.exports = router;

function price(duration, outOfLoutraki, numberOfOrders){
  if (duration==='4'){
    if (outOfLoutraki && numberOfOrders){
      return "30"
    }else if ((outOfLoutraki && !numberOfOrders) || (!outOfLoutraki && numberOfOrders)){
      return "25"
    }
    return "20"
  }else if (duration==='6'){
    if (outOfLoutraki && numberOfOrders){
      return "40"
    }else if ((outOfLoutraki && !numberOfOrders) || (!outOfLoutraki && numberOfOrders)){
      return "35"
    }
    return "30"
  }else{
    if (outOfLoutraki && numberOfOrders){
      return "55"
    }else if ((outOfLoutraki && !numberOfOrders) || (!outOfLoutraki && numberOfOrders)){
      return "50"
    }
    return "45"
  }
}

function dateForSQL(date){
  var dd = date.slice(0,2)
  var mm = date.slice(3,5)
  var yy = date.slice(6)
  return yy+"-"+mm+"-"+dd
}

function dateForEurope(date){
  var dd = date.slice(8)
  var mm = date.slice(5,7)
  var yy = date.slice(0,4)
  return dd+"-"+mm+"-"+yy 
}