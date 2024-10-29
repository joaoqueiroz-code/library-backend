const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectTimeout: 10000,
}).promise();

connection.connect((error) => {
    if (error) throw error;
    console.log('Connected to MySQL database.');
});

module.exports = connection;
