SELECT distinct actor.*, film.film_id
FROM actor actor 
left join film_actor f_actor 
on f_actor.actor_id = actor.actor_id
join film film
on f_actor.film_id = film.film_id 
where lower(actor.last_name)=lower('LOLLOBRIGIDA')
or lower(actor.first_name)=lower('JOHNNY');