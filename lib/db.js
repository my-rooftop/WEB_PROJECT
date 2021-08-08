var mysql = require('mysql');
var DB = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'tatamo4532',
    database:'friends'
});

DB.connect();
module.exports = DB;