const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Rentals'
});

db.connect(err => {
    if (err) throw err;
    console.log("Successful Connection.");
});

module.exports = db;
