// repos
const rentalRepo = require('../repos/rentalRepo');
const { getAudienceFromToken } = require('../server/shared');
const Constants = require("../server/constants");

const addRental = async (req, res, next) => {
    
    try {
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.ADD_RENTAL)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let newData = req.body;
            let data = await rentalRepo.addRental(newData);
            if (data) {
                res.status(201).json({
                    "status": 201,
                    "statusText": "CREATED",
                    "message": "Rental successfully saved.",
                    "data": { id: data.id, inventoryId: data.inventoryId }
                })
            }
        }
    } catch(err) { 
        next(err) 
    }
    
};

const editRental = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.EDIT_RENTAL)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let newData = req.body;
            let id = parseInt(req.params.id);
            let updated = await rentalRepo.editRental(id, newData);
            if (updated > 0) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "UPDATED",
                    "message": "Rental successfully updated.",
                    "data": { "id": id }
                });
            } else {
                res.status(500).json({
                    "status": 500,
                    "statusText": "FAILED",
                    "message": "Rental not successfully udpated."
                });
            }
        }
    } catch(err) { 
        next(err) 
    }
    
};

const searRentals = async (req, res, next) => {
    let filters = req.body;
    try {
       const token = req.headers.authorization.split(" ")[1];
       let aud = getAudienceFromToken(token);
       if (!aud.includes(Constants.SEARCH_RENTALS)) {
           res.status(401).send({ message: "Not Authorized to access data" });
       } else {
           let films = await rentalRepo.searchRentals(filters);
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
       }
    } catch(err) {
        next(err);
    }
};

const getOutOfStockFilms = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.SHOW_OUT_OF_STOCK_FILMS)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let films = await rentalRepo.getOutOfStockFilms();
            if (films) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": films.length+" out-of-stock films found.",
                    "data": films
                });
            } else {
                res.status(404).json({
                    "status": 404,
                    "statusText": "Not found.",
                    "message": "No out-of-stock films found.",
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Not found"
                    }
                })
            }
        }
    } catch(err) {
        next(err);
    }
};

const getOverdueRentals = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.SHOW_OVERDUE_RENTALS)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let filters = req.body;
            let films = await rentalRepo.getOverdueRentals(filters);
            if (films) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": films.length+" overdue film rentals found.",
                    "data": films
                });
            } else {
                res.status(404).json({
                    "status": 404,
                    "statusText": "Not found.",
                    "message": "No out-of-stock films found.",
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Not found"
                    }
                })
            }
        }
    } catch(err) {
        next(err);
    }
};

let rentalController = {
    addRental: addRental,
    editRental: editRental,
    searRentals: searRentals,
    getOutOfStockFilms: getOutOfStockFilms,
    getOverdueRentals: getOverdueRentals
};

module.exports = rentalController;