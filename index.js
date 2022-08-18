const express = require('express');
const app = express();
const filmRepo = require('./repos/filmRepo')
const userRepo = require('./repos/userRepo')
const router = express.Router();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require("dotenv").config({ path: "./server/variables.env" });
const cors = require("cors");
const {
    getUserByUsername,
    isEmptyObject,
    isPasswordCorrect,
    getAllUsers,
    verifyToken,
    getAudienceFromToken,
    generateToken,
  } = require("./server/shared");
  const Constants = require("./server/constants");

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Sakila API',
            description: 'Sakila API Information',
            servers: ['http://localhost:4242'] 
        }
    },
    apis: ['index.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Configure middleware to support JSON data parsing in the request object
app.use(express.json())

// Add cors for api accesses
app.use(cors());

// Configure swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /films:
 *  get:
 *      description: Search films by genre, title or actor's last name
 *      responses:
 *          '200':
 *              description: Get films successful.
 *          '404':
 *              description: No films found.
 */
router.route('/films')
.get(verifyToken, (req, res, next) => {
    let filters = req.body;
    filmRepo.searchFilms(filters, (films) => {
        if (films) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": films.length+" films found.",
                "data": films
            });
        } else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not found.",
                "message": "No films matched by genre "+filters.genre+", title "+filters.title+" or actor "+filters.actorLastName,
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Not found"
                }
            })
        }
    }, (err) => { next(err); });
});

// Search films by actor's first name and/or last name
router.route('/films/actor')
.get(verifyToken, (req, res, next) => {
    let filters = req.body;
    filmRepo.searchFilmsByActor(filters, (films) => {
        if (films) {
            res.status(200).json({
                "status": 200,
                "statusText": "OK",
                "message": films.length+" films found.",
                "data": films
            });
        } else {
            res.status(404).json({
                "status": 404,
                "statusText": "Not found.",
                "message": "No films matched by first name "+filters.firstName+" or last name "+filters.lastName,
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Not found"
                }
            })
        }
    }, (err) => { next(err); });
});

// login
router.route("/login")
.post((req, res, next) => {
    let base64Encoding = req.headers.authorization.split(" ")[1];
    let credentials = Buffer.from(base64Encoding, "base64").toString().split(":");
    const username = credentials[0];
    const password = credentials[1];
    userRepo.getUser(username,(user) => {
        if (user && !isEmptyObject(user)) {
            isPasswordCorrect(user.password, password).then((result) => {
            if (!result)
            res
                .status(401)
                .send({ message: "username or password is incorrect" });
            else {
            generateToken(null, username).then((token) => {
                res
                .status(200)
                .send({ username: user.username, role: user.role, token: token });
            });
            }
        });
        } else
        res.status(401).send({ message: "username or password is incorrect" });
    }, (err) => { next(err) });
});

// logout
router.route("/logout")
.get(verifyToken, (req, res) => {
    res.status(200).send({ message: "Signed out" });
});

// set base url
app.use('/api', router);

app.listen('4242', () => {
    console.log('Express server is running...');
});