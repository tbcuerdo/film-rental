select rental.return_date
from film
join inventory inv 
on film.film_id = inv.film_id
join rental rental 
on rental.inventory_id = inv.inventory_id
where film.film_id = 1;