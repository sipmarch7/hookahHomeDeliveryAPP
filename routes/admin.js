const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const checkAuthentication = require('../passport/checkAuthentication');

router.get('/adminOrders', checkAuthentication.checkAuthenticated, (req, res) => {
    let sql = "SELECT * FROM tbl_orders INNER JOIN tbl_users ON tbl_orders.user_id=tbl_users.user_id ORDER BY order_id DESC;"
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        if (req.user.isAdmin){
            res.render('adminOrders',{user: req.user, result: results});
            return
        }
        res.redirect('/')
    })
});

router.post('/adminOrders/cancelOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='canceled' WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})

router.post('/adminOrders/acceptOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='accepted', admin='"+req.user.firstname+"' WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})

router.post('/adminOrders/doneOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='completed' WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})




module.exports = router;