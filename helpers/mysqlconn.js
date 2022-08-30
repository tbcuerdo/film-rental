const mysql = require('mysql2');

const exec = async (sql, values) => {

    let connection;
    return new Promise(function(resolve, reject) {
        connection = mysql.createConnection({
            host     : process.env.SQL_HOST,
            user     : process.env.SQL_USER,
            password : process.env.SQL_PASSWORD,
            database : process.env.SQL_DATABASE
        });
           
        connection.connect();
    
        connection.query(sql, values, function (err, rows, _fields) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    }).finally(() => { connection.end(); } );
};

let mysqlconn = {
    exec: exec
};

module.exports = mysqlconn;