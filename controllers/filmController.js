// repos
const filmRepo = require('../repos/filmRepo')

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
 const searchFilms = async (req, res, next) => {
     let filters = req.body;
     try {
         let films = await filmRepo.searchFilms(filters);
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
     } catch(err) {
         next(err);
     }
 };

 

const getAllFilms = async (_req, res, next) => {
    try {
        let films = await filmRepo.getAllFilms();
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
                "message": "No films found.",
                "error": {
                    "code": "NOT_FOUND",
                    "message": "Not found"
                }
            })
        }
    } catch(err) {
        next(err);
    }
};

// Search films by actor's first name and/or last name
const searchFilmsByActor = async (req, res, next) => {
    let filters = req.body;
    let films = await filmRepo.searchFilmsByActor(filters);
    try {
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
    } catch (err) {
        next(err);
    }
};

const addFilm = async (req, res, next) => {
    
    try {
        let newData = req.body;
        let id = await filmRepo.insert(newData);
        if (id) {
            res.status(201).json({
                "status": 201,
                "statusText": "CREATED",
                "message": "Film successfully saved.",
                "data": id
            })
        }
    } catch(err) { 
        next(err) 
    }
    
};

const editFilm = async (req, res, next) => {
    
    try {
        let newData = req.body;
        let id = parseInt(req.params.id);
        let updated = await filmRepo.update(id, newData);
        if (updated) {
            res.status(200).json({
                "status": 200,
                "statusText": "UPDATED",
                "message": "Film successfully updated.",
                "data": { id }
            });
        } else {
            res.status(500).json({
                "status": 500,
                "statusText": "FAILED",
                "message": "Film not successfully udpated."
            });
        }
    } catch(err) { 
        next(err) 
    }
    
};

const removeFilm = async (req, res, next) => {
    try {
        let id = parseInt(req.params.id);
        let removed = await filmRepo.remove(id);
        console.log('removed: '+removed);
        if (removed > 0) {
            res.status(200).json({
                "status": 200,
                "statusText": "DELETED",
                "message": "Film successfully removed.",
                "data": { id }
            });
        } else {
            res.status(500).json({
                "status": 500,
                "statusText": "FAILED",
                "message": "Film not successfully removed."
            });
        }
    } catch(err) { 
        next(err) 
    }
};

let filmController = {
    searchFilms: searchFilms,
    searchFilmsByActor: searchFilmsByActor,
    getAllFilms: getAllFilms,
    addFilm: addFilm,
    editFilm: editFilm,
    removeFilm: removeFilm
};

module.exports = filmController;

