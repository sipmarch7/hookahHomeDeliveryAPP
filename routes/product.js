const express = require('express');
const router = express.Router();
const checkAuthentication = require('../passport/checkAuthentication');

router.get('/', (req, res) => {
  res.render('product', { user: req.user});
});


module.exports = router;
