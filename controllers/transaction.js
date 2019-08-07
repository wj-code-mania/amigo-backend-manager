var managerModel = require('../models/transaction');

exports.getTxns = function(req, res, next) {
    const body = req.body;
    managerModel.get_txns(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        var resp = {
            draw: body.draw,
            recordsTotal: data.total,
            recordsFiltered: data.total,
            data: data.data
        };
        return res.json(resp);
    })
}