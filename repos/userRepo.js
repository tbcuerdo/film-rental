const mysql = require('../helpers/mysqlconn');

const getStaff = async (email) => {
    console.log('getStaff...');

    let sql = `select * from staff where email = ?`;
    let results =  await mysql.exec(sql, [email]);
    if (results && results.length > 0)
        return results[0];
    return null;
};

const getCustomer = async (email) => {
    console.log('getCustomer...');

    let sql = `select * from customer where email = ?`;

    let results = await mysql.exec(sql, [email]);
    if (results && results.length > 0)
        return results[0];
    return null;
};

const getUser = async (email) => {
    console.log('getUser...');

    let user = {};
    let staff = await getStaff(email);
    if (staff) {
        user = staff;
        user.role = 'Staff';
    } else {
        let customer = await getCustomer(email);
        if (customer) {
            user = customer;
            user.role = 'Customer';
        }
    }
    return user;
 
};

let userRepo = {
    getUser: getUser
};

module.exports = userRepo;
