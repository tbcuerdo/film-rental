const mysql = require('../helpers/mysqlconn');

const getUser = (email, resolve, reject) => {
    console.log('searchFilms...');

    let sql = `select * from customer where email = ?`;

    mysql.exec(sql, (results) => {
        resolve(results[0]);
    },(err) => {
        reject(err)
    },[email]);
};

let userRepo = {
    getUser: getUser
};

module.exports = userRepo;
