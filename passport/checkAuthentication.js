exports.checkAuthenticated = function (req,res,next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

exports.checkNotAuthenticated = function (req,res,next){
    if (req.isAuthenticated()){
        res.redirect('/')
        return
    }
    next()
}