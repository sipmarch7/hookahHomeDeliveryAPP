const express = require('express');
const router = express.Router();
const conn = require('../model/db.mysql');
const checkAuthentication = require('../passport/checkAuthentication');

router.get('/adminOrders', checkAuthentication.checkAuthenticated, (req, res) => {
    let sql0 = "SELECT * FROM tbl_orders INNER JOIN tbl_users ON tbl_orders.user_id=tbl_users.user_id ORDER BY date DESC, order_id DESC;"
    let query0 = conn.query(sql0, (err, results0) => {
        if(err) throw err;

        let sql1 = "SELECT price FROM `tbl_orders` WHERE status='completed'"
        let query1 = conn.query(sql1, (err, results1) => {
            if(err) throw err;
            var totalEarnings = 0;
            for (i in results1){
                totalEarnings = Number(results1[i].price) + totalEarnings;
            }
            var totalOrdersCompleted = results1.length
            if (req.user.isAdmin){
                res.render('adminOrders',{user: req.user, result: results0, totalEarnings: totalEarnings, totalOrdersCompleted: totalOrdersCompleted});
                return
            }
            res.redirect('/');
        })
    })
});

router.post('/adminOrders/cancelOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='canceled', canceled=1 WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        var sql = "UPDATE tbl_users SET numberOfOrders = numberOfOrders - 1 WHERE user_id="+req.body.user_id
        let query = conn.query(sql, (err, result) => {
            if(err) throw err;
            res.redirect('/admin/adminOrders')
        })
    })
})

router.post('/adminOrders/acceptOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='accepted', accepted=1, admin='"+req.user.firstname+"' WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})

router.post('/adminOrders/doneOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='completed', completed=1 WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})

router.post('/adminOrders/deliveredOrder', checkAuthentication.checkAuthenticated, (req,res)=>{
    let sql = "UPDATE tbl_orders SET status='delivered', delivered=1 WHERE order_id="+req.body.order_id;
    let query = conn.query(sql, (err,results) => {
        res.redirect('/admin/adminOrders')
    })
})




module.exports = router;