const express = require("express");
const router = express.Router();
const conn = require("../model/db.mysql");

router.get("/", (req, res) => {
  let sql0 ="SELECT action_value FROM `tbl_site` WHERE action_name='day_offline'";
  let query0 = conn.query(sql0, (err, results0) => {
    if (err) throw err;

    let sql1 ="SELECT * FROM `tbl_reviews` WHERE active=1";
    let query1 = conn.query(sql1, (err, results1) => {
      if (err) throw err;

      if (results0[0].action_value == "") {
        res.render("index", { user: req.user, reviews: results1 });
      } else {
        res.render("siteOffline", {
          user: req.user,
          day: results0[0].action_value
        });
      }

    });
  });
});

router.get("/home", (req, res) => {
  res.render("index", { user: req.user });
});

module.exports = router;
