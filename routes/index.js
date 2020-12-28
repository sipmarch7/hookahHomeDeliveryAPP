const express = require('express');
const router = express.Router();
const conn = require('../server');

router.get('/', (req,res) => {
  
  res.render('index');

});

module.exports = router;