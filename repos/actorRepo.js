const mysql = require('../helpers/mysqlconn');
const _ = require("lodash");

const insert = async (data) => {
    console.log('insert');
    let sql = `insert into actor SET ?`;

    let data2 = {};
    _.mapKeys(data, (v, k) => {
            data2[_.snakeCase(k)] = v;
        }
    );

    let results = await mysql.exec(sql,data2);
    return results.insertId;
};

const getById = async (id) => {
    console.log('getById...')
    let sql = `select * from actor where actor_id = ?`;
    let results = await mysql.exec(sql,[id]);
    if (results.length > 0)
        return results[0];
    return null;
};

const buildUpdateData = (id, currentData, updateData) => {
    return [
        updateData.firstName ? updateData.firstName : currentData.first_name,
        updateData.lastName ? updateData.lastName : currentData.last_name,
        id
    ];
};

const update = async (id, updateData) => {
    console.log('update...');
    let currentData = await getById(id);
    let sql = `update actor set first_name=?, last_name = ? where actor_id = ?`;
    let affectedRows = 0;
    if (currentData) {
        let data = buildUpdateData(id, currentData, updateData);
        let results = await mysql.exec(sql,data);
        affectedRows = results.affectedRows;
    }
    return affectedRows;
};

const remove = async (id) => {
    console.log('remove...');
    let sql = `delete from actor where actor_id = ?`;
    let sql2 = `delete from film_actor where actor_id = ?`;
    let film = await getById(id);
    let affectedRows = 0;
    if (film) {
        let results = await mysql.exec(sql,[id]);
        affectedRows = results.affectedRows;
        if (affectedRows > 0) {
            await mysql.exec(sql2,[id]);
        }
    }
    
    return affectedRows;
};

let actorRepo = {
    insert: insert,
    update: update,
    remove: remove
};

module.exports = actorRepo;