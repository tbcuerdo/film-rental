// repos
const actorRepo = require('../repos/actorRepo')

const addActor = async (req, res, next) => {
    
    try {
        let newData = req.body;
        let id = await actorRepo.insert(newData);
        if (id) {
            res.status(201).json({
                "status": 201,
                "statusText": "CREATED",
                "message": "Actor successfully saved.",
                "data": id
            })
        }
    } catch(err) { 
        next(err) 
    }
    
};

const editActor = async (req, res, next) => {
    
    try {
        let newData = req.body;
        let id = parseInt(req.params.id);
        let updated = await actorRepo.update(id, newData);
        if (updated > 0) {
            res.status(200).json({
                "status": 200,
                "statusText": "UPDATED",
                "message": "Actor successfully updated.",
                "data": { id }
            });
        } else {
            res.status(500).json({
                "status": 500,
                "statusText": "FAILED",
                "message": "Actor not successfully udpated."
            });
        }
    } catch(err) { 
        next(err) 
    }
    
};

const removeActor = async (req, res, next) => {
    try {
        let id = parseInt(req.params.id);
        let removed = await actorRepo.remove(id);
        if (removed > 0) {
            res.status(200).json({
                "status": 200,
                "statusText": "DELETED",
                "message": "Actor successfully removed.",
                "data": {id}
            })
        } else {
            res.status(500).json({
                "status": 500,
                "statusText": "FAILED",
                "message": "Actor not successfully removed."
            });
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

