const mysql = require('mysql2');

const exec = async (sql, values) => {

    let connection;
    return new Promise(function(resolve, reject) {
        connection = mysql.createConnection({
            host     : '172.17.0.4',
            user     : 'root',
            password : 'my-secret-pw',
            database : 'sakila'
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