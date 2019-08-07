var schoolModel = require('../models/school');
const request = require('request');

exports.getSchoolList = function(req, res, next) {
    const body = req.body;
    schoolModel.get_school_list(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        return res.json({code: 200, school_list: data});
    })
}

exports.getSchools = function(req, res, next) {
    const body = req.body;
    schoolModel.get_schools(body, function(err, data) {
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

exports.addSchool = function (req, res, next) {
    const body = req.body;
    if (body.name && body.status) {
        schoolModel.add_school(body, function (err, data) {
            if (err) {
                var resp = {
                    code: 401,
                    msg: 'Failed',
                    data: null
                };
                return res.json(resp);
            }
            if (!data){
                var resp = {
                    code: 200,
                    msg: 'Failed',
                    data: null
                };
            }else{    
                var resp = {
                    code: 200,
                    msg: 'Success'
                };
            }
            return res.json(resp);
        })
    } else {
        var resp = {
            code: 400,
            msg: 'Failed',
            data: null
        };
        return res.json(resp);
    }
};

exports.editSchool = function (req, res, next) {
    const body = req.body;    
    if (body.schoolId && body.name && body.address && body.onDays) {
        schoolModel.edit_school(body, function (err, data) {
            if (err) {
                var resp = {
                    code: 401,
                    msg: 'Failed',
                    data: null
                };
                return res.json(resp);
            }
            if (!data){
                var resp = {
                    code: 200,
                    msg: 'Failed',
                    data: null
                };
            }else{    
                var resp = {
                    code: 200,
                    msg: 'Success'
                };
            }
            return res.json(resp);
        })
    } else {
        var resp = {
            code: 400,
            msg: 'Failed',
            data: null
        };
        return res.json(resp);
    }
};

exports.delSchool = function(req, res, next) {
    var id = req.params.id;
    schoolModel.del_school(id, function(err, data) {
        if (err)
            return next(new Error(err));
        var resp = {
            code: 200,
            msg: 'Deleted!'
        };

        return res.json(resp);
    })
    return;
}

exports.getSchoolInfo = function(req, res, next) {
    const body = req.body;
    schoolModel.get_school_info(body, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});

        return res.json({code: 200, school_info: data[0]});
    })
}

exports.uploadSchoolLogo = function(req, res, next) {
    schoolModel.upload_school_logo(req, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});
        return res.json({code: 200, msg: "Success", data : data});
    })
}

exports.authStripe = function(req, res, next) {
    var body = req.body;
    var schoolId = body.schoolId;
    var secret = body.secret;
    var code = body.code;
    var scope = body.scope;

    request.post('https://connect.stripe.com/oauth/token', {
        json: {
            client_secret: secret,
            grant_type: 'authorization_code',
            code: code,
            scope: scope
        }
        }, (error, response, body) => {
        if (error) {
            var resp = {
                code: 401,
                msg: 'Failed',
                data: null
            };
            return res.json(resp);
        }
        if(body.error){
            var resp = {
                code: 401,
                msg: 'Failed',
                data: null
            };
            return res.json(resp);
        }else{
            schoolModel.auth_stripe(schoolId, body, function(err, data) {
                if (err) {
                    var resp = {
                        code: 401,
                        msg: 'Failed',
                        data: null
                    };
                    return res.json(resp);
                }
                if (!data){
                    var resp = {
                        code: 200,
                        msg: 'Failed',
                        data: null
                    };
                }else{    
                    var resp = {
                        code: 200,
                        msg: 'Success'
                    };
                }
                return res.json(resp);
            })
        }
    })
}