const customerRepo = require('../repos/customerRepo');

const searchCustomers = async (req, res, next) => {
    try {
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
    } catch(err) {
        next(err);
    }
};

let customerController = {
    searchCustomers: searchCustomers
};

module.exports = customerController;