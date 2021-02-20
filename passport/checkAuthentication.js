exports.checkAuthenticated = function (req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    res.render('login', {shop: req.query})
}

exports.checkNotAuthenticated = function (req,res,next){
    if (req.isAuthenticated()){
        res.redirect('/')
        return
    }
    next()
}

