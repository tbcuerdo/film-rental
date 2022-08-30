// repos
const actorRepo = require('../repos/actorRepo')
const { getAudienceFromToken } = require('../server/shared');
const Constants = require("../server/constants");

const addActor = async (req, res, next) => {
    
    try {
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.ADD_ACTOR)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let newData = req.body;
            let id = await actorRepo.insert(newData);
            if (id) {
                res.status(201).json({
                    "status": 201,
                    "statusText": "CREATED",
                    "message": "Actor successfully saved.",
                    "data": { "id": id }
                })
            }
        }
    } catch(err) { 
        next(err) 
    }
    
};

const editActor = async (req, res, next) => {
    
    try {
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.EDIT_ACTOR)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let newData = req.body;
            let id = parseInt(req.params.id);
            let updated = await actorRepo.update(id, newData);
            if (updated > 0) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "UPDATED",
                    "message": "Actor successfully updated.",
                    "data": { "id": id }
                });
            } else {
                res.status(500).json({
                    "status": 500,
                    "statusText": "FAILED",
                    "message": "Actor not successfully udpated."
                });
            }
        }
    } catch(err) { 
        next(err) 
    }
    
};

const removeActor = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.REMOVE_ACTOR)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let id = parseInt(req.params.id);
            let removed = await actorRepo.remove(id);
            if (removed > 0) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "DELETED",
                    "message": "Actor successfully removed.",
                    "data": { "id": id}
                })
            } else {
                res.status(500).json({
                    "status": 500,
                    "statusText": "FAILED",
                    "message": "Actor not successfully removed."
                });
            }
        }
    } catch(err) { 
        next(err) 
    }
};

let actorController = {
    addActor: addActor,
    editActor: editActor,
    removeActor: removeActor
};

module.exports = actorController;

