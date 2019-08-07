var settings = require('../config/settings');
var jwt = require('jsonwebtoken');
var managerModel = require('../models/manager');
var common = require('./common');

exports.login = function (req, res, next) {
    const body = req.body;
    if (body.username && body.password) {
        managerModel.auth_user(body, function (err, data) {
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
                var id = data.id;
                var schoolId = data.schoolId;
                var username = data.username;
                var token = jwt.sign(
                    { 
                        managerId : id, 
                        schoolId : schoolId 
                    },
                    settings.TOKEN_SECRET
                );

                var resp = {
                    code: 200,
                    msg: 'Success',
                    data: {
                        username: username,
                        token: token
                    }
                };
            }
            return res.json(resp);
        })
    } else {
        var err = new Error('Wrong username and password.');
        err.status = 400;
        return next(err);
    }    
};

exports.logout = function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.json('success');
            }
        });
    }else{
        return res.json('success');
    }
};

exports.changePwd = function (req, res, next) {
    const body = req.body;
    if (body.managerId && body.curPwd && body.newPwd) {
        managerModel.change_pwd(body, function (err, data) {
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
                    msg: 'Success',
                    data: data
                };
            }
            return res.json(resp);
        })
    } else {
        var resp = {
            code: 400,
            msg: 'Wrong username and password.',
            data: null
        };
        return res.json(resp);
    }    
};

exports.getDashboardInfo = function (req, res, next) {
    const body = req.body;
    if (body.dateTime && body.managerId && body.schoolId) {
        managerModel.get_dashboard_info(body, function (err, data) {
            if (err) {
                var resp = {
                    code: 401,
                    msg: 'Failed',
                    data: null
                };
                return res.json(resp);
            }
            var resp = {
                code: 200,
                msg: 'Success',
                data: data
            };
            return res.json(resp);
        })
    } else {
        var err = new Error('Serviec Denied.');
        err.status = 400;
        return next(err);
    }    
};