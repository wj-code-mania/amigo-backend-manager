var parentModel = require('../models/parent');
var common = require('./common');

exports.getParents = function(req, res, next) { 
    const body = req.body;
    parentModel.get_parents(body, function(err, data) {
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

exports.addParent = function (req, res, next) {  
    const body = req.body;
    if (body.schoolId && body.username && body.email && body.name && body.password && body.status) {
        parentModel.add_parent(body, function (err, data) {
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

exports.editParent = function (req, res, next) {
    const body = req.body;
    if (body.schoolId && body.id && body.username && body.email && body.name && body.password && body.status) {
        parentModel.edit_parent(body, function (err, data) {
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

exports.delParent = function(req, res, next) {
    var id = req.body.id;
    parentModel.del_parent(id, function(err, data) {
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

exports.getParent = function(req, res, next) {
    const body = req.body;
    parentModel.get_parent(body, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});

        return res.json({code: 200, parent_info: data});
    })
    return;
}