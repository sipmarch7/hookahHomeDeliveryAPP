const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const bcrypt = require('bcrypt');
const checkAuthentication = require('../passport/checkAuthentication');

router.get('/', checkAuthentication.checkNotAuthenticated, (req,res) => {
  res.render('register');
});

router.post('/', checkAuthentication.checkNotAuthenticated, (req,res) => {
  for (const field in req.body){
    if (req.body[field]==""){
      if (!(field=="floor")){
        res.render('register',{warning:'empty', fields: req.body});
        return}}
  }
  if (!(req.body.postal==20300 || req.body.postal==20100 || req.body.postal==20001 || req.body.postal==20006)){
    res.render('register',{warning:"tk", fields:req.body});
    return
  }
  if (!(req.body.telephone.length==10)){
    res.render('register',{warning:"tel", fields:req.body});
    return
  }
  bcrypt.hash(req.body.telephone,10,(err,hash)=>{
    if (err){throw(err);};
    let data = {firstname: req.body.firstname, lastname: req.body.lastname, 
      email: req.body.email, password: hash, telephone: req.body.telephone, 
      address: req.body.address, floor: req.body.floor, city: req.body.city,
      postal: req.body.postal, birthday: req.body.birthday};
    let sql0 = "SELECT * FROM `tbl_users` WHERE email="+"'"+req.body.email+"'"+";"
    let query0 = conn.query(sql0, (err,results0)=>{
      if(err) throw err;
      if (!(results0[0]==null)) {
        res.render('register',{warning:"user", fields:req.body});
        return
      }
      let sql1 = "INSERT INTO tbl_users SET ?";
      let query1 = conn.query(sql1, data, (err, results1) => {
        if(err) throw err;
        res.render('login');  // ADD WELCOME PAGE HERE
        return
      });
    });
  });
});

module.exports = router;