const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BT_NodeJS',
    port:'42333'
});

module.exports = connection