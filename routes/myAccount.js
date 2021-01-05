const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const bcrypt = require('bcrypt');
const checkAuthentication = require('../passport/checkAuthentication');

router.get('/', checkAuthentication.checkAuthenticated, (req, res) => {
    res.render('myAccount',{user: req.user, fields: req.user});
});

router.post('/update', checkAuthentication.checkAuthenticated, (req, res) => {
  for (const field in req.body){
      if (req.body[field]==""){
        if (!(field=="floor")){
          res.render('myAccount',{error:"empty", user: req.user});
          return}}
    }
    if (!(req.body.telephone.length==10)){
      res.render('myAccount',{error:"tel", user: req.user});
      return
    }
    bcrypt.hash(req.body.telephone,10,(err,hash)=>{
      if (err){throw(err);};
      console.log(req.user.isAdmin)
      if (req.user.isAdmin){
        let data = {firstname: req.body.firstname, lastname: req.body.lastname, 
          email: req.body.email, telephone: req.body.telephone, 
          address: req.body.address, floor: req.body.floor, city: req.body.city};
        let sql0 = "UPDATE tbl_users SET ? WHERE user_id="+req.user.user_id;
        let query = conn.query(sql0, data, (err, results0) => {
          if(err) throw err;
          res.render('myAccount', {error:"success", user: req.user, fields: req.body});
          return
        });
      }else{
        let data = {firstname: req.body.firstname, lastname: req.body.lastname, 
          email: req.body.email, password: hash, telephone: req.body.telephone, 
          address: req.body.address, floor: req.body.floor, city: req.body.city};
        let sql0 = "UPDATE tbl_users SET ? WHERE user_id="+req.user.user_id;
        let query = conn.query(sql0, data, (err, results0) => {
          if(err) throw err;
          res.render('myAccount', {error:"success", user: req.user, fields: req.body});
          return
        });
      }
    });
});

module.exports = router;