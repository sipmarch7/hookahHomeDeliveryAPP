const express = require('express');
const passport = require('passport');
const router = express.Router();
const checkAuthentication = require('../passport/checkAuthentication');

router.get('/', checkAuthentication.checkNotAuthenticated, (req, res) => {
  const error = req.flash().error
  res.render('login',{error});
});

router.post('/', checkAuthentication.checkNotAuthenticated, passport.authenticate('local', 
  { successRedirect: 'back',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', checkAuthentication.checkAuthenticated,
  function(req, res){
    req.logout();
    res.redirect('/');
  }
);


module.exports = router;
