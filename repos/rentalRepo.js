const mysql = require('../helpers/mysqlconn');
const _ = require("lodash");
const { addToInventory } = require('./inventoryRepo');

const searchRentals = async (data) => {
    console.log('searchRentals...')
    let sql = `select r.*
    from rental r 
    join inventory i 
    on r.inventory_id = i.inventory_id 
    join film f 
    on i.film_id = f.film_id
    where f.title = ?`;

    return mysql.exec(sql,[data.title ? data.title : '']);
};

const getCurrentByInventoryId = async (id) => {
    console.log('getCurrentByInventoryId...');
    let sql = `select * from rental where inventory_id = ? and return_date is null`;
    let results = await mysql.exec(sql,[id]);
    if (results.length > 0)
        return results[0];
    return null;
}

const addRental = async (data) => {
    console.log('addRental');

    // check if film is already in the inventory
    if (!data.inventoryId) {
        if (data.filmId && data.storeId) {
            let inventoryId = await addToInventory(data);
            data.inventoryId = inventoryId;
        } else {
            throw new Error('Cannot create an inventory record without the film id and store id.');
        }
    }

    let currentRental = await getCurrentByInventoryId(data.inventoryId);

    if (!currentRental && data.inventoryId) {

        let sql = `insert into rental SET ?`;
        let data2 = {
            'rental_date': data.rentalDate,
            'inventory_id': data.inventoryId,
            'customer_id': data.customerId,
            'return_date': data.returnDate,
            'staff_id': data.staffId
        };

        let results = await mysql.exec(sql,data2);
        return results.insertId;
    } else {
        throw new Error('Inventory item is not yet returned.');
    }
};

const getById = async (id) => {
    console.log('getById...')
    let sql = `select * from rental where rental_id = ?`;
    let results = await mysql.exec(sql,[id]);
    if (results.length > 0)
        return results[0];
    return null;
};

const buildUpdateData = (id, currentData, updateData) => {
    console.log("updateData.rentalDate: "+updateData.rentalDate)
    return [
        updateData.rentalDate ? updateData.rentalDate : currentData.rental_date,
        updateData.inventoryId ? updateData.inventoryId : currentData.inventory_id,
        updateData.customerId ? updateData.customerId : currentData.customer_id,
        updateData.returnDate ? updateData.returnDate : currentData.return_date,
        updateData.staffId ? updateData.staffId : currentData.staff_id,
        id
    ];
};

const editRental = async (id, updateData) => {
    console.log('updateRental...');
    let currentData = await getById(id);
    let sql = `update rental set rental_date=?, inventory_id = ?, customer_id = ?, return_date = ?, staff_id = ? where rental_id = ?`;
    let affectedRows = 0;
    if (currentData) {
        let data = buildUpdateData(id, currentData, updateData);

        console.log('data: '+data);
        let results = await mysql.exec(sql,data);
        affectedRows = results.affectedRows;
    }
    return affectedRows;
};

const getOutOfStockFilms = async () => {
    let sql = `select film_id, category, title, next_available_at, concat(address,', ',city,' City') as next_available_in from (
        select
                f.film_id,
                c.name as 'category',
                f.title,
                (film_inv.orig_units - count(i.inventory_id)) as on_hand,
                return_dates.earliest as next_available_at,
                return_dates.address,
                return_dates.city
        from
                inventory i
        join film f 
        on
                i.film_id = f.film_id
        join film_category fc 
        on f.film_id = fc.film_id 
        join category c 
        on fc.category_id = c.category_id
        join rental r 
        on
                r.inventory_id = i.inventory_id
        left join (
            select
                f.film_id,
                f.title,
                count(i.inventory_id) as orig_units
            from
                    inventory i
            join film f 
            on
                    i.film_id = f.film_id
            group by
                f.film_id,
                f.title
        ) film_inv
        on
            f.film_id = film_inv.film_id
        left join (
            select f.film_id, MIN(DATE_ADD(r.rental_date, INTERVAL f.rental_duration DAY)) as earliest, a.address, c2.city 
            from rental r 
            join inventory i 
            on r.inventory_id = i.inventory_id 
            join film f 
            on i.film_id = f.film_id
            join staff s2
            on r.staff_id = s2.staff_id
            join store s3
            on s2.store_id = s3.store_id  
            join address a
            on s3.address_id  = a.address_id
            join city c2 
            on a.city_id = c2.city_id
            group by f.film_id, a.address, c2.city
        ) return_dates
        on f.film_id = return_dates.film_id 
        where
                r.return_date is null
        group by
                f.film_id,
                f.title,
                c.name,
                return_dates.earliest,
                return_dates.address,
                return_dates.city
        order by
            c.name,
            f.title
        ) stock
        where stock.on_hand = 0`;

        return mysql.exec(sql,[]);
};

const getOverdueRentals = (data) => {
    let sql = `select f.film_id, f.title, r.rental_date, DATE_ADD(r.rental_date, INTERVAL f.rental_duration DAY) as due_date, concat(c.first_name, ' ', c.last_name) as customer
    from rental r 
    join inventory i 
    on r.inventory_id = i.inventory_id 
    join film f 
    on i.film_id = f.film_id
    join customer c 
    on r.customer_id = c.customer_id
    where r.return_date is null
    and ? > DATE_ADD(r.rental_date, INTERVAL f.rental_duration DAY)`;

    return mysql.exec(sql,[data.cutOff ? data.cutOff : new Date()]);
};

let rentalRepo = {
    searchRentals: searchRentals,
    addRental: addRental,
    editRental: editRental,
    getOutOfStockFilms: getOutOfStockFilms,
    getOverdueRentals: getOverdueRentals
};


module.exports = rentalRepo;
