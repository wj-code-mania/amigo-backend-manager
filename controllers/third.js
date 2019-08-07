var parentModel = require('../models/parent');
const request = require('request');

exports.sendEmail = function(req, response, next) {
    body = req.body;
    parentModel.get_parent_email_list(body, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});
        request.post('http://localhost:5000/api/email/send_email_parent', {
            json: {
                email_data : body,
                email_list : data
            }
        }, (error, res, body) => {
            if (error)
                return response.json({code: 500, msg: err});
            return response.json({code: 200, msg: "Success"});
        })
    })  
    return;
}

exports.checkTokenValid = function(req, response, next) {
    return response.json({code: 200, msg: "Success"});
}