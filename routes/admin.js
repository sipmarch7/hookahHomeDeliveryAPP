const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const checkAuthentication = require('../passport/checkAuthentication');
const nodemailer = require('nodemailer');

router.get('/adminOrders', checkAuthentication.checkAuthenticated, (req, res) => {
    let sql0 = "SELECT * FROM tbl_orders INNER JOIN tbl_users ON tbl_orders.user_id=tbl_users.user_id ORDER BY date DESC, order_id DESC;"
    let query0 = conn.query(sql0, (err, results0) => {
        if(err) throw err;

        let sql1 = "SELECT price FROM `tbl_orders` WHERE status='completed'"
        let query1 = conn.query(sql1, (err, results1) => {
            if(err) throw err;
            var totalEarnings = 0;
            for (i in results1){
                totalEarnings = Number(results1[i].price) + totalEarnings;
            }
            var totalOrdersCompleted = results1.length
            if (req.user.isAdmin){
                for (i in results0){
                    results0[i].date = dateForEurope(results0[i].date)
                }
                res.render('adminOrders',{user: req.user, result: results0, totalEarnings: totalEarnings, totalOrdersCompleted: totalOrdersCompleted});
                return
            }
            res.redirect('/');
        })
    })
});

router.post('/adminOrders/cancelOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='canceled', canceled=1 WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        var sql = "UPDATE tbl_users SET numberOfOrders = numberOfOrders - 1 WHERE user_id="+req.body.user_id
        let query = conn.query(sql, (err, result) => {
            if(err) throw err;
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
                to: req.user.email, //shishahublc@gmail.com //sipmarch7@hotmail.com
                subject: 'CANCELED Shishahub Order '+req.user.firstname,
                text: 'Δυστυχώς η παραγγελία σου με αριθμό 32'+req.body.order_id+'47 ακυρώθηκε.'+
                  '\nΖητούμενη συγνώμη αλλά δεν μπορούμε να σε εξυπηρετήσουμε αυτή τη χρονική στιγμή που έχεις διαλέξει.'+
                  '\nΕάν μπορούμε να σε εξυπηρετήσουμε κάποια άλλη ώρα για την ίδια ημέρα που έχεις διαλέξει,'+
                  '\nθα επικοινωνήσουμε άμεσα μαζί σου, στο τηλέφωνο που έχεισ δηλώσει.'+
                  '\nΕάν δεν είναι ούτε αυτό εφικτό μπορείς να προσπαθήσεις ξανά κάποια άλλη μέρα.'+
                  '\nΣε ευχαριστούμε για την προτίμησή σου στο Shishahub.'+
                  '\n\nORDER DETAILS'+
                  '\n——————————————CANCELED————————————————'+
                  '\n Order ID  : '+'32'+ req.body.order_id+'47'+" "+" No."+req.user.numberOfOrders+
                  '\n Date       : '+ req.body.date+
                  '\n Time       : '+ req.body.time+
                  '\n Duration  : '+ req.body.duration+
                  '\n Flavors    : '+ req.body.flavors+
                  '\n Price      : '+ price(req.body.duration, req.user.outOfLoutraki, req.user.numberOfOrders)+
                  '\n Other Address : '+ req.body.otherAddress+
                  '\n\nACCOUNT DETAILS'+
                  '\n——————————————————————————————'+
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
            res.redirect('/admin/adminOrders')
        })
    })
})

router.post('/adminOrders/acceptOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='accepted', accepted=1, admin='"+req.user.firstname+"' WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
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
            to: req.user.email, //shishahublc@gmail.com //sipmarch7@hotmail.com
            subject: 'ACCEPTED Shishahub Order '+req.user.firstname,
            text: 'H παραγγελία σου με αριθμό 32'+req.body.order_id+'47 έγινε δεκτή.'+
              '\nΚατά την ώρα που επέλεξες ο ειδικός μας θα σε καλέσει, στο τηλέφωνο που έχεις δηλώσει,'+
              '\nώστε να σε ειδοποιήσει ότι έχει φτάσει ή ότι είναι πολύ κοντά στον χώρο σου.'+
              '\nΣε ευχαριστούμε για την προτίμησή σου στο Shishahub.'+
              '\n\nORDER DETAILS'+
              '\n——————————————————————————————'+
              '\n Order ID  : '+'32'+ req.body.order_id+'47'+" "+" No."+req.user.numberOfOrders+
              '\n Date       : '+ req.body.date+
              '\n Time       : '+ req.body.time+
              '\n Duration  : '+ req.body.duration+
              '\n Flavors    : '+ req.body.flavors+
              '\n Price      : '+ price(req.body.duration, req.user.outOfLoutraki, req.user.numberOfOrders)+
              '\n Other Address : '+ req.body.otherAddress+
              '\n\nACCOUNT DETAILS'+
              '\n——————————————————————————————'+
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
        res.redirect('/admin/adminOrders')
    })
})

router.post('/adminOrders/doneOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='completed', completed=1 WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})

router.post('/adminOrders/deliveredOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='delivered', delivered=1 WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})




module.exports = router;

function dateForEurope(date){
    var dd = date.slice(8)
    var mm = date.slice(5,7)
    var yy = date.slice(0,4)
    return dd+"-"+mm+"-"+yy 
  }

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