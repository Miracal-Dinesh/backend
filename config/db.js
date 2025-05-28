const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: "Localhost",
  user:"root",
  password: "root",
  database: "server",
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected!');
});

module.exports = db;
