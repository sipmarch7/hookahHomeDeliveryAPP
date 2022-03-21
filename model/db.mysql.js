//use mySQL MODULE for db
const mysql = require('mysql');
    //Create connection
const conn = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DB
});
    //connect to DB
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

module.exports = conn;
