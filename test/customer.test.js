const request = require("supertest");
const server = require("../index");
const mysql = require('../helpers/mysqlconn');

describe("When customer is logged in", () => {

    beforeEach(async () => {
        await mysql.exec(`delete from rental where rental_id = 
            ( 
                select * from (
                    select r.rental_id 
                    from rental r 
                    join inventory i 
                    on r.inventory_id = i.inventory_id 
                    where i.film_id = ?
                ) as t
            )`, [14]);
        await mysql.exec('delete from inventory where film_id = ?', [14]);
    });

    afterEach( () => {
        server.close();
    });

    const customer = {
        username: "MARY.SMITH@sakilacustomer.org",
        password: "Password123!"
    };

    test("should be assigned the role of 'Customer'", async () => {
        let response = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let auth = JSON.parse(response.text);
        expect(auth.role).toBe("Customer");
        expect(response.status).toBe(200);

    });

    test("should be able to search films", async () => {
        const body = {
            "genre": "ACTION",
            "title": "amadeus holy",
            "actorLastName": "LOLLOBRIGIDA"
        };

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        let response = await request(server)
        .get("/api/films")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(92);
    });

    test("should be able to search films by actor", async () => {
        const body = {
            "firstName":"JOHN",
            "lastName": "LOLLOBRIGIDA"
        };

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        let response = await request(server)
        .get("/api/films/actor")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(58);
    });

    test("should NOT be able to get all films", async () => {

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        let response = await request(server)
        .get("/api/films/all")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

        expect(response.status).toBe(401);
    });

    test("should NOT be able to search customers", async () => {

        const body = {
            "lastName": "SMITH"
        };

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        let response = await request(server)
        .get("/api/customers")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(401);
    });

    test("should NOT be able to add, update and remove a film", async () => {

        const body = {
            "title": "THE BRAVE LITTLE TOASTER (1987)",
            "languageId": 1,
            "rentalDuration": 5,
            "rentalRate": 0.99,
            "length": 184,
            "replacementCost": 9.99,
            "rating": "PG-13",
            "specialFeatures": "Trailers,Commentaries"
        }

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        // add
        let response = await request(server)
        .post("/api/films")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(401);

        const update = {
            "rentalRate": 1.99
        };

        // edit
        let response2 = await request(server)
        .put(`/api/films/1`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(update);

        expect(response2.status).toBe(401);

        // delete
        let response3 = await request(server)
        .delete(`/api/films/1`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(update);

        expect(response3.status).toBe(401);
    });

    test("should NOT be able to add, update and remove an actor", async () => {

        const body = {
            "firstName": "Christian",
            "lastName": "Pale"
        };

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        // add
        let response = await request(server)
        .post("/api/actors")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(401);

        const update = {
            "lastName": "BALE"
        };

        // edit
        let response2 = await request(server)
        .put(`/api/actors/1`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(update);

        expect(response2.status).toBe(401);

        // delete
        let response3 = await request(server)
        .delete(`/api/actors/1`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(update);

        expect(response3.status).toBe(401);
    });

    test("should NOT be able to search for rentals", async () => {

        const body = {
            "title" : "BLANKET BEVERLY"
        };

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        // add
        let response = await request(server)
        .get("/api/rentals")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(401);
    });

    test("should NOT be able to get out-of-stock films", async () => {

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        // add
        let response = await request(server)
        .get("/api/rentals/out-of-stock")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json');

        expect(response.status).toBe(401);
    });

    test("should NOT be able to get overdue rentals", async () => {

        const body = {
            "cutOff": "2006-01-01"
        };

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        // add
        let response = await request(server)
        .get("/api/rentals/overdue")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(401);
    });

    test("should NOT be able to add then edit film if first time included in inventory", async () => {

        const body = {
            "rentalDate": "2021-12-31 03:34:29",
            "customerId": 2,
            "staffId": 1,
            "filmId": 14,
            "storeId": 1
        };

        // get auth token
        let loginResponse = await request(server).post("/api/login").auth(customer.username, customer.password).set('Accept', 'application/json');
        let token = loginResponse.body.token;

        // add rental on a film that is not yet returned
        let response = await request(server)
        .post("/api/rentals")
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(body);

        expect(response.status).toBe(401);

        const update = {
            "rentalDate": "2021-12-31 03:34:29"
        };

        // edit
        let response2 = await request(server)
        .put(`/api/rentals/1`)
        .set('Authorization', `Bearer ${token}`)
        .set('Accept', 'application/json')
        .send(update);

        expect(response2.status).toBe(401);
    });

});
