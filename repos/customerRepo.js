const mysql = require('../helpers/mysqlconn');

const searchCustomers = async (data) => {
    let sql = `select c.*
    FROM customer c 
    where LOWER(c.first_name) = LOWER(?)
    or LOWER(c.last_name) = LOWER(?)
    or c.customer_id in 
    (select c.customer_id 
    from customer c 
    join address a 
    on c.address_id = a.address_id 
    join city c2 
    on a.city_id = c2.city_id 
    join country c3 
    on c2.country_id = c3.country_id 
    where LOWER(c3.country) = LOWER(?))`;

    return mysql.exec(sql, [data.firstName ? data.firstName : '', data.lastName ? data.lastName : '', data.country ? data.country : '']);
};

let customerRepo = {
    searchCustomers: searchCustomers
};

module.exports = customerRepo;