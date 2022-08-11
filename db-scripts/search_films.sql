SELECT distinct film.*
FROM film film
left join film_category film_category 
on film_category.film_id = film.film_id
left join category category
on category.category_id = film_category.category_id
left join film_actor f_actor 
on f_actor.film_id = film.film_id
left join actor actor 
on actor.actor_id = f_actor.actor_id
where lower(category.name) = lower('action') 
or lower(film.title) = lower('amadeus holy') 
or lower(actor.last_name)=lower('LOLLOBRIGIDA');


