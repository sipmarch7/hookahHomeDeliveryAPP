const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const conn = require('../model/db.mysql');

function initialize(passport) {
    var user = {}
    const authenticateUser = (req, email, password, done)=>{
        var sql = "SELECT * FROM tbl_users WHERE email="+"'"+email+"'";
        conn.query (sql, (err, results)=>{
            if(err) throw err;
            user = results[0];
            if (user==null){
                console.log("not found")
                return done(null, false, req.flash('error','Δεν βρέθηκε ο χρήστης' ))
            }
            try {
                if (bcrypt.compareSync(password, user.password)){
                    return done(null, user);
                }else{
                    console.log("wrong number")
                    return done(null, false, req.flash('error','Λάθος Τηλέφωνο' ));
                }
            } catch (e) {
                return done(e);
            }
        })
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true}, authenticateUser));
    passport.serializeUser((user, cb)=> {
        return cb(null, user.user_id)
    })
    passport.deserializeUser((id , cb)=>{
        conn.query("select * from tbl_users where user_id="+id,function(err,rows){
            cb(err, rows[0]);
        }); 
    })
}

module.exports = initialize;