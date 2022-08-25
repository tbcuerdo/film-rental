const mysql = require('../helpers/mysqlconn');
const _ = require("lodash");

const getAllFilms = () => {
    console.log('getAllFilms...')
    let sql = `select * from film`;
    return mysql.exec(sql,[]);
}

const insert = async (data) => {
    console.log('insert');
    let sql = `insert into film SET ?`;

    let data2 = {};
    _.mapKeys(data, (v, k) => {
            data2[_.snakeCase(k)] = v;
        }
    );

    let results = await mysql.exec(sql,data2);
    return results.insertId;
};

const getById = async (id) => {
    console.log('getById...');
    let sql = `select * from film where film_id = ?`;
    let results = await mysql.exec(sql,[id]);
    if (results.length > 0)
        return results[0];
    return null;
};

const buildUpdateData = (id, currentData, updateData) => {
    return [
        updateData.title ? updateData.title : currentData.title,
        updateData.description ? updateData.description : currentData.description,
        updateData.releaseYear ? updateData.releaseYear : currentData.release_year,
        updateData.languageId ? updateData.languageId : currentData.language_id,
        updateData.originalLanguageId ? updateData.originalLanguageId : currentData.original_language_id,
        updateData.rentalDuration ? updateData.rentalDuration : currentData.rental_duration,
        updateData.rentalRate ? updateData.rentalRate : currentData.rental_rate,
        updateData.length ? updateData.length : currentData.length,
        updateData.replacementCost ? updateData.replacementCost : currentData.replacement_cost,
        updateData.rating ? updateData.rating : currentData.rating,
        updateData.specialFeatures ? updateData.specialFeatures : currentData.special_features,
        id
    ];
};

const update = async (id, updateData) => {
    console.log('update...');
    let currentData = await getById(id);
    let affectedRows = 0;
    let sql = `UPDATE film SET 
    title = ?, 
    description = ?, 
    release_year = ?, 
    language_id = ?, 
    original_language_id = ?,
    rental_duration = ?,
    rental_rate = ?,
    length = ?,
    replacement_cost = ?,
    rating = ?,
    special_features = ?
    where film_id = ?`;
    if (currentData) {
        let data = buildUpdateData(id, currentData, updateData);
        let results = await mysql.exec(sql,data);
        affectedRows = results.affectedRows;
    }
    return affectedRows;
};

const remove = async (id) => {
    console.log('remove...');
    let sql = `delete from film where film_id = ?`;
    let sql2 = `delete from film_actor where film_id = ?`;
    let film = await getById(id);
    console.log('film: '+film);
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

const searchFilms = (data) => {
    console.log('searchFilms...');

    let sql = `select film.*,
    case when available_films.film_id is not null then 'yes' else 'no' end as is_available
    from film film
    left join (select inv.inventory_id, inv.film_id
        from inventory inv 
        join rental rental 
        on rental.inventory_id = inv.inventory_id
        where rental.return_date is null
    ) as available_films
    on film.film_id = available_films.film_id
    where film.film_id in (
        SELECT film_category.film_id
        FROM film_category film_category 
        join category category 
        on category.category_id = film_category.category_id
        where lower(category.name) = lower(?)
    )
    OR film.film_id in (
        select f_actor.film_id
        from film_actor f_actor 
        left join actor actor 
        on actor.actor_id = f_actor.actor_id
        where lower(actor.last_name) = LOWER(?) 
    )
    OR lower(film.title) = ?`;

    return mysql.exec(sql, [data.genre ? data.genre : '', data.actorLastName ? data.actorLastName : '', data.title ? data.title : '']);
};

const searchFilmsByActor = (data) => {
    console.log('searchFilmsByActor...');

    let sql = `select film.*,
    case when available_films.film_id is not null then 'yes' else 'no' end as is_available
    from film film
    left join (select inv.inventory_id, inv.film_id
        from inventory inv 
        join rental rental 
        on rental.inventory_id = inv.inventory_id
        where rental.return_date is null
    ) as available_films
    on film.film_id = available_films.film_id
    where film.film_id in (
        select f_actor.film_id
        from film_actor f_actor 
        left join actor actor 
        on actor.actor_id = f_actor.actor_id
        where lower(actor.first_name) = lower(?) 
    )
    OR film.film_id in (
        select f_actor.film_id
        from film_actor f_actor 
        left join actor actor 
        on actor.actor_id = f_actor.actor_id
        where lower(actor.last_name) = lower(?) 
    )
    OR film.film_id in (
        select f_actor.film_id
        from film_actor f_actor 
        left join actor actor 
        on actor.actor_id = f_actor.actor_id
        where lower(actor.first_name) = lower(?) and lower(actor.last_name) = lower(?))`;

    return mysql.exec(sql, [data.firstName ? data.firstName : '', data.lastName ? data.lastName : '', data.firstName ? data.firstName : '', data.lastName ? data.lastName : '']);
};

let filmRepo = {
    searchFilms: searchFilms,
    searchFilmsByActor: searchFilmsByActor,
    getAllFilms: getAllFilms,
    insert: insert,
    update: update,
    remove: remove
};

module.exports = filmRepo;