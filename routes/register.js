const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const bcrypt = require('bcrypt');
const checkAuthentication = require('../passport/checkAuthentication');
const nodemailer = require('nodemailer');

router.get('/', checkAuthentication.checkNotAuthenticated, (req,res) => {
  res.render('register');
});

router.get('/confirm', checkAuthentication.checkNotAuthenticated, (req,res) => {
  res.render('registerConfirmation');
});



router.post('/', checkAuthentication.checkNotAuthenticated, (req,res) => {
  for (const field in req.body){
    if (req.body[field]==""){
      if (!(field=="floor")){
        res.render('register',{warning:"Δεν έχετε συμπληρώσει όλα τα πεδία της φόρμας. Παρακαλώ ξαναπροσπαθήστε.", 
        fields: req.body});
        return}}
  }
  if (!(req.body.telephone.length==10)){
    res.render('register',{warning:"Δεν έχετε συμπληρώσει σωστά το τηλέφωνο επικοινωνίας. Χωρίς κενά. Χωρίς αριθμό Χώρας", 
    fields:req.body});
    return
  }
  if(!(checkBirthday(req.body.birthday))){
    res.render('register',{warning:"Η ηλικία που δηλώσατε είναι κάτω τον 18. Δυστυχώς απαγορέυεται η εγγραφή σας.", 
    fields:req.body});
    return
  }
  bcrypt.hash(req.body.telephone,10,(err,hash)=>{
    if (err){throw(err);};
    let data = {firstname: req.body.firstname, lastname: req.body.lastname, 
      email: req.body.email, password: hash, telephone: req.body.telephone, 
      address: req.body.address, floor: req.body.floor, city: req.body.city,
      postal: req.body.postal, birthday: req.body.birthday, outOfLoutraki: checkOutOfLoutraki(req.body.city)};
    let sql0 = "SELECT * FROM `tbl_users` WHERE email="+"'"+req.body.email+"'"+";"
    let query0 = conn.query(sql0, (err,results0)=>{
      if(err) throw err;
      if (!(results0[0]==null)) {
        res.render('register',{warning:"O χρήστης υπάρχει ήδη. Μπορείτε να συνδεθείτε με το email και το τηλέφωνο που είχατε δηλώσει.",
        fields:req.body});
        return
      }
      let sql1 = "INSERT INTO tbl_users SET ?";
      let query1 = conn.query(sql1, data, (err, results1) => {
        if(err) throw err;
        res.redirect("/register/confirm")  // ADD WELCOME PAGE HERE

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
          to: req.body.email, //shishahublc@gmail.com //sipmarch7@hotmail.com
          subject: 'Ευχαριστούμε για την εγγραφή σου '+req.body.firstname+' στο Shishahub',
          text:'Ευχαριστούμε για την εγγραφή σου '+req.body.firstname+' στο Shishahub.'+
            '\n Μπορείς τώρα να συνδεθείς στο www.shishahub.online και να κάνεις την πρώτη σου παραγγελία.'+
            '\n Παρακάτω είναι τα στοιχεία του λογαριασμού σου:'+
            '\n\nACCOUNT DETAILS'+
            '\n——————————————————————————————'+
            '\n Name        : '+ req.body.firstname+" "+req.body.lastname+
            '\n Email         : '+ req.body.email+
            '\n Telephone : '+ req.body.telephone+
            '\n Address    : '+ req.body.address+
            '\n Floor         : '+ req.body.floor+
            '\n City           : '+ req.body.city+
            '\n Postal       : '+ req.body.postal
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
          to: 'shishahublc@gmail.com', //shishahublc@gmail.com //sipmarch7@hotmail.com
          subject: 'NEW REGISTRATION on Shishahub.online',
          text:'Ευχαριστούμε για την εγγραφή σου '+req.body.firstname+' στο Shishahub.'+
            '\n Παρακάτω είναι τα στοιχεία του λογαριασμού που μόλις γράφτηκε:'+
            '\n\nACCOUNT DETAILS'+
            '\n——————————————————————————————'+
            '\n Name        : '+ req.body.firstname+" "+req.body.lastname+
            '\n Email         : '+ req.body.email+
            '\n Telephone : '+ req.body.telephone+
            '\n Address    : '+ req.body.address+
            '\n Floor         : '+ req.body.floor+
            '\n City           : '+ req.body.city+
            '\n Postal       : '+ req.body.postal
        };
  
        smtpTrans.sendMail(mailOptions1, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        // email EIMAIFEAKFKEFLAEF EMAILEMAIL EMAIL EMAIL EMAIL EMAIL EMAILEMAIL

        return
      });
    });
  });
});

module.exports = router;


function checkBirthday(birthday){
  var currentDate = new Date();
  var currentMonth = parseFloat(currentDate.getMonth())    //0
  var currentYear = parseFloat(currentDate.getFullYear()) //2021  
  var currentDay = parseFloat(currentDate.getDate())      //15
  var mm = parseFloat(birthday.slice(5,7))
  var yy = parseFloat(birthday.slice(0,4))
  var dd = parseFloat(birthday.slice(8))
  if ((currentYear-yy)>18){
    return 1
  }else if ((currentYear-yy)===18){
    if ((currentMonth+1-mm)>0){
      return 1
    }else if((currentMonth+1-mm)===0){
      if ((currentDay-dd)>=0){
        return 1
      }
      return 0
    }else{
      return 0
    }
  }else{
    return 0
  }
}

function checkOutOfLoutraki(city){
  if (city==="Λουτράκι"){
    return 0
  }
  return 1
}