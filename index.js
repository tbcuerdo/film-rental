const express = require('express');
const app = express();
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

// controllers
const filmController = require('./controllers/filmController')
const customerController = require('./controllers/customerController');
const actorController = require('./controllers/actorController');
const rentalController = require('./controllers/rentalController');

// Configure middleware to support JSON data parsing in the request object
app.use(express.json())

// Add cors for api accesses
app.use(cors());

// Configure swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// films api
router.route('/films').get(verifyToken, filmController.searchFilms);
router.route('/films/actor').get(verifyToken, filmController.searchFilmsByActor);
router.route('/films/all').get(verifyToken, filmController.getAllFilms);
router.route('/films').post(verifyToken, filmController.addFilm);
router.route('/films/:id').put(verifyToken, filmController.editFilm);
router.route('/films/:id').delete(verifyToken, filmController.removeFilm);

// customer api
router.route('/customers').get(verifyToken, customerController.searchCustomers);

// actors api
router.route('/actors').post(verifyToken, actorController.addActor);
router.route('/actors/:id').put(verifyToken, actorController.editActor);
router.route('/actors/:id').delete(verifyToken, actorController.removeActor);

// rentals api
router.route('/rentals').get(verifyToken, rentalController.searRentals);
router.route('/rentals/out-of-stock').get(verifyToken, rentalController.getOutOfStockFilms);
router.route('/rentals/overdue').get(verifyToken, rentalController.getOverdueRentals);
router.route('/rentals').post(verifyToken, rentalController.addRental);
router.route('/rentals/:id').put(verifyToken, rentalController.editRental);

// login
router.route("/login")
.post(async (req, res, next) => {
    let base64Encoding = req.headers.authorization.split(" ")[1];
    let credentials = Buffer.from(base64Encoding, "base64").toString().split(":");
    const username = credentials[0];
    const password = credentials[1];

    try {
        let user = await userRepo.getUser(username);
        if (user && !isEmptyObject(user)) {
            isPasswordCorrect(user.password, password).then((result) => {
                if (!result) {
                    res
                        .status(401)
                        .send({ message: "username or password is incorrect" });
                } else {
                    generateToken(null, username).then((token) => {
                        res
                        .status(200)
                        .send({ username: user.username, role: user.role, token: token });
                    });
                }
            });
        } else {
            res.status(401).send({ message: "username or password is incorrect" });
        }
    } catch (err) {
        next(err);
    }
});

// logout
router.route("/logout")
.get(verifyToken, (_req, res) => {
    res.status(200).send({ message: "Signed out" });
});

// set base url
app.use('/api', router);

app.listen('4242', () => {
    console.log('Express server is running...');
});