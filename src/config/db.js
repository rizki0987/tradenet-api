const sql = require('mysql')

const con = sql.createConnection({
    host: '34.128.127.93',
    user: 'root',
    password: 'rahasia',
    database: 'tradenetdatabase'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports=con
