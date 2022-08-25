const customerRepo = require('../repos/customerRepo');
const { getAudienceFromToken } = require('../server/shared');
const Constants = require("../server/constants");


const searchCustomers = async (req, res, next) => {
    try {
        // check if user should be able to access this api
        const token = req.headers.authorization.split(" ")[1];
        let aud = getAudienceFromToken(token);
        if (!aud.includes(Constants.SEARCH_CUSTOMERS)) {
            res.status(401).send({ message: "Not Authorized to access data" });
        } else {
            let filters = req.body;
            let customers = await customerRepo.searchCustomers(filters);
            if (customers) {
                res.status(200).json({
                    "status": 200,
                    "statusText": "OK",
                    "message": customers.length+" customers found.",
                    "data": customers
                });
            } else {
                res.status(404).json({
                    "status": 404,
                    "statusText": "Not found.",
                    "message": "No customers found.",
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Not found"
                    }
                });
            }
        }
    } catch(err) {
        next(err);
    }
};

let customerController = {
    searchCustomers: searchCustomers
};

module.exports = customerController;