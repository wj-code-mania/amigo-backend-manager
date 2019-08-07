var classModel = require('../models/class_type');

exports.getClassTypes = function(req, res, next) {
    const body = req.body;
    classModel.get_class_types(body, function(err, data) {
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

exports.addClassType = function (req, res, next) {
    const body = req.body;
    if (body.schoolId && body.name && body.status) {
        classModel.add_class_type(body, function (err, data) {
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

exports.editClassType = function (req, res, next) {
    const body = req.body;
    if (body.name && body.status) {
        classModel.edit_class_type(body, function (err, data) {
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

exports.delClassType = function(req, res, next) {
    var id = req.params.id;
    classModel.del_class_type(id, function(err, data) {
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

exports.getClassTypeList = function(req, res, next) {
    const body = req.body;
    classModel.get_class_type_list(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        return res.json({code: 200, class_type_list: data});
    })
}