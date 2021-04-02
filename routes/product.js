const express = require("express");
const router = express.Router();
const conn = require("../model/db.mysql");
const checkAuthentication = require("../passport/checkAuthentication");
const nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  let sql2 =
    "SELECT action_value FROM `tbl_site` WHERE action_name='hookah_single_quantity'";
  let query2 = conn.query(sql2, (err, results2) => {
    if (results2[0].action_value == 0) {
      res.redirect("product/orderFailure");
    } else {
      let sql0 = "SELECT * FROM tbl_flavors WHERE flavor_online=1;";
      let query0 = conn.query(sql0, (err, results0) => {
        let sql1 = "SELECT * FROM tbl_site WHERE action_name='time_slot';";
        let query1 = conn.query(sql1, (err, results1) => {
          if (err) throw err;
          res.render("product", {
            user: req.user,
            flavors: results0,
            time_slot: results1,
          });
        });
      });
    }
  });
});

router.get("/productList", (req, res) => {
  // we check for available quantity for each hookah
  let sql0 =
    "SELECT action_value FROM `tbl_site` WHERE action_name='hookah_single_quantity'";
  let query0 = conn.query(sql0, (err, results0) => {
    let sql1 =
      "SELECT action_value FROM `tbl_site` WHERE action_name='hookah_double_quantity'";
    let query1 = conn.query(sql1, (err, results1) => {
      if (err) throw err;
      if (results0[0].action_value == 0) {
        singleQuantity = null;
      } else {
        singleQuantity = results0[0].action_value;
      }
      if (results1[0].action_value == 0) {
        doubleQuantity = null;
      } else {
        doubleQuantity = results1[0].action_value;
      }
      res.render("productList", {
        user: req.user,
        singleQuantity: singleQuantity,
        doubleQuantity: doubleQuantity,
      });
    });
  });
});

router.get("/productDouble", (req, res) => {
  let sql2 =
    "SELECT action_value FROM `tbl_site` WHERE action_name='hookah_double_quantity'";
  let query2 = conn.query(sql2, (err, results2) => {
    if (results2[0].action_value == 0) {
      res.redirect("orderFailure");
    } else {
      let sql0 = "SELECT * FROM tbl_flavors WHERE flavor_online=1;";
      let query0 = conn.query(sql0, (err, results0) => {
        let sql1 = "SELECT * FROM tbl_site WHERE action_name='time_slot';";
        let query1 = conn.query(sql1, (err, results1) => {
          if (err) throw err;
          res.render("productDouble", {
            user: req.user,
            flavors: results0,
            time_slot: results1
          });
        });
      });
    }
  });
});

router.get(
  "/orderPreview",
  checkAuthentication.checkAuthenticated,
  (req, res) => {
    let sql0 = "SELECT * FROM tbl_flavors WHERE flavor_online=1;";
    let query0 = conn.query(sql0, (err, results0) => {
      if (err) throw err;
      let sql1 = "SELECT * FROM tbl_site WHERE action_name='time_slot';";
      let query1 = conn.query(sql1, (err, results1) => {
        if (err) throw err;      
      
        let warning = "Συμπλήρωσε όλα τα απαραίτητα πεδία";
        if (req.query.time === "") {
          res.render("product", {
            user: req.user,
            warning: warning,
            flavors: results0,
            time_slot: results1
          });
          return;
        }
        if (req.query.date === "") {
          res.render("product", {
            user: req.user,
            warning: warning,
            flavors: results0,
            time_slot: results1
          });
          return;
        }
        if (req.query.quantity === "3" && req.query.flavor3 === "") {
          res.render("product", {
            user: req.user,
            warning: warning,
            flavors: results0,
            time_slot: results1
          });
          return;
        }
        if (
          req.query.quantity === "4" &&
          req.query.flavor3 === "" &&
          req.query.flavor4 === ""
        ) {
          res.render("product", {
            user: req.user,
            warning: warning,
            flavors: results0,
            time_slot: results1
          });
          return;
        }

        if (
          !(
            req.user.city == "Λουτράκι" ||
            req.user.city == "Κόρινθος" ||
            req.user.city == "Πάτρα"
          )
        ) {
          if (req.query.double_hookah == 1 && req.query.quantity == "3") {
            res.redirect("orderFailure");
            return;
          } else if (req.query.quantity == "2") {
            res.redirect("orderFailure");
            return;
          }
        }

        req.query.date = dateForEurope(req.query.date);

        res.render("orderPreview", {
          user: req.user,
          fields: req.query,
          price: findPrice(
            req.query.quantity,
            req.user.outOfLoutraki,
            req.user.numberOfOrders,
            req.query.double_hookah
          )
        });
      });
    });
  }
);

router.post(
  "/orderPreview",
  checkAuthentication.checkAuthenticated,
  (req, res) => {
    let data = {
      user_id: req.user.user_id,
      date: dateForSQL(req.body.date),
      time: req.body.time,
      quantity: req.body.quantity,
      flavors: req.body.flavors,
      price: findPrice(
        req.body.quantity,
        req.user.outOfLoutraki,
        req.user.numberOfOrders,
        req.body.double_hookah
      ),
      status: "pending",
      otherAddress: req.body.textArea,
      double_hookah: req.body.double_hookah,
    };
    if (req.body.double_hookah == "1") {
      var dualHose = "Yes";
    } else {
      var dualHose = "No";
    }

    let sql = "INSERT INTO tbl_orders SET ?";
    let query = conn.query(sql, data, (err, result0) => {
      if (err) throw err;
      res.redirect("orderConfirmation");

      //update number of orders at tbl_users
      var sql =
        "UPDATE tbl_users SET numberOfOrders = numberOfOrders + 1 WHERE user_id=" +
        req.user.user_id;
      let query = conn.query(sql, (err, result1) => {
        if (err) throw err;
        var numOfOrders = req.user.numberOfOrders + 1;
        // email EIMAIFEAKFKEFLAEF EMAILEMAIL EMAIL EMAIL EMAIL EMAIL EMAILEMAIL
        var smtpTrans = nodemailer.createTransport({
          service: "gmail",
          port: 465,
          secure: true,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        var mailOptions = {
          from: "sender",
          to: "sipmarch7@hotmail.com", //shishahublc@gmail.com //sipmarch7@hotmail.com
          subject:
            "NEW ORDER From: " + req.user.firstname + " " + req.user.lastname,
          text:
            "DAY : " +
            req.body.date +
            " at " +
            req.body.time +
            "\n——————————————————————————————" +
            "\n\nORDER DETAILS" +
            "\n——————————————————————————————" +
            "\n Order ID  : " +
            "32" +
            result0.insertId +
            "47" +
            " " +
            " No." +
            numOfOrders +
            "\n Date       : " +
            req.body.date +
            "\n Time       : " +
            req.body.time +
            "\n Double    : " +
            dualHose +
            //'\n Quantity  : '+ req.body.quantity+' γεύσεις'+
            "\n Flavors    : " +
            req.body.flavors +
            "\n Price      : " +
            findPrice(
              req.body.quantity,
              req.user.outOfLoutraki,
              req.user.numberOfOrders,
              req.body.double_hookah
            ) +
            "\n Other Address : " +
            req.body.textArea +
            "\n\nACCOUNT DETAILS" +
            "\n——————————————————————————————" +
            "\n User ID     : " +
            req.user.user_id +
            "\n Name       : " +
            req.user.firstname +
            " " +
            req.user.lastname +
            "\n Email        : " +
            req.user.email +
            "\n Telephone : " +
            req.user.telephone +
            "\n Address    : " +
            req.user.address +
            "\n Floor        : " +
            req.user.floor +
            "\n City         : " +
            req.user.city +
            "\n Postal      : " +
            req.user.postal,
        };

        smtpTrans.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        var mailOptions1 = {
          from: "sender",
          to: req.user.email, //shishahublc@gmail.com //sipmarch7@hotmail.com
          subject: "Your Shishahub Order " + req.user.firstname,
          text:
            "Ευχαριστούμε για την παραγγελία σου στο Shishahub." +
            "\nΣύντομα θα ακολουθήσει email επιβεβαίωσης και αποδοχής της παραγγελίας σου." +
            "\nΠαρακάτω υπάρχουν τα στοιχεία της παραγγελίας σου." +
            "\nΓια οποιαδήποτε αλλαγή επικοινώνησε μαζί μας στο DM του instagram @shishahub.lc ή στο email εδώ." +
            "\n\nORDER DETAILS" +
            "\n——————————————————————————————" +
            "\n Order ID  : " +
            "32" +
            result0.insertId +
            "47" +
            " " +
            " No." +
            numOfOrders +
            "\n Date        : " +
            req.body.date +
            "\n Time        : " +
            req.body.time +
            "\n Διπλός     : " +
            dualHose +
            //'\n Quantity  : '+ req.body.quantity+' γεύσεις'+
            "\n Flavors    : " +
            req.body.flavors +
            "\n Price        : " +
            findPrice(
              req.body.quantity,
              req.user.outOfLoutraki,
              req.user.numberOfOrders,
              req.body.double_hookah
            ) +
            "\n Other Address : \n" +
            req.body.textArea +
            "\n\nACCOUNT DETAILS" +
            "\n——————————————————————————————" +
            "\n Name        : " +
            req.user.firstname +
            " " +
            req.user.lastname +
            "\n Email         : " +
            req.user.email +
            "\n Telephone : " +
            req.user.telephone +
            "\n Address    : " +
            req.user.address +
            "\n Floor          : " +
            req.user.floor +
            "\n City            : " +
            req.user.city +
            "\n Postal        : " +
            req.user.postal,
        };

        smtpTrans.sendMail(mailOptions1, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        // email EIMAIFEAKFKEFLAEF EMAILEMAIL EMAIL EMAIL EMAIL EMAIL EMAILEMAIL
      });
    });
  }
);

router.get("/orderConfirmation", (req, res) => {
  res.render("orderConfirmation", { user: req.user });
});

router.get("/orderFailure", (req, res) => {
  res.render("orderFailure", { user: req.user });
});

module.exports = router;

//////////////functions //////////////////////////////////////////////

function findPrice(quantity, outOfLoutraki, numberOfOrders, double) {
  let price = 25;

  if (!outOfLoutraki && !numberOfOrders) {
    price = price - 5;
  }

  if (quantity == "3") {
    if (double == 1) {
      price = price + 10;
    } else {
      price = price + 5;
    }
  } else if (quantity == "4") {
    price = price + 15;
  } else if (quantity == "5") {
    price = price + 25;
  }

  return price;
}

/* 
function happyHour(price, time) {
  if (time == "15:00" || time == "16:00" || time == "17:00") {
    var priceInt = parseInt(price) - 5;
    return priceInt.toString();
  }
  return price;
} */

function dateForSQL(date) {
  var dd = date.slice(0, 2);
  var mm = date.slice(3, 5);
  var yy = date.slice(6);
  return yy + "-" + mm + "-" + dd;
}

function dateForEurope(date) {
  var dd = date.slice(8);
  var mm = date.slice(5, 7);
  var yy = date.slice(0, 4);
  return dd + "-" + mm + "-" + yy;
}
