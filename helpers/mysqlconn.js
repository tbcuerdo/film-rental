const mysql = require('mysql2');

const exec = (sql, resolve, reject, values) => {
    let connection = mysql.createConnection({
        host     : '172.17.0.4',
        user     : 'root',
        password : 'my-secret-pw',
        database : 'sakila'
    });
       
    connection.connect();

    connection.query(sql, values, function (error, results, fields) {
        if (error) reject(error);
        resolve(results);
    });

    connection.end();
};

mysqlconn = {
    exec: exec
};

module.exports = mysqlconn;