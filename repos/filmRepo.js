const mysql = require('../helpers/mysqlconn');

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

const searchFilmsByActor = (data, resolve, reject) => {
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
    searchFilmsByActor: searchFilmsByActor
};

module.exports = filmRepo;