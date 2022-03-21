//use mySQL MODULE for db
const mysql = require('mysql');
    //Create connection
const conn = mysql.createConnection({
    host: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_HOST
});
    //connect to DB
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

module.exports = conn;
