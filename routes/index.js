const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');

router.get('/', (req,res) => {
  res.render('index',{ user: req.user});
});

module.exports = router;