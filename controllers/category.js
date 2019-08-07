var categoryModel = require('../models/category');

exports.getCategories = function(req, res, next) {
    const body = req.body;
    categoryModel.get_categories(body, function(err, data) {
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

exports.addCategory = function (req, res, next) {
    const body = req.body;
    if (body.schoolId && body.name && body.status) {
        categoryModel.add_category(body, function (err, data) {
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

exports.editCategory = function (req, res, next) {
    const body = req.body;
    if (body.id && body.schoolId && body.name && body.status) {
        categoryModel.edit_category(body, function (err, data) {
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

exports.delCategory = function(req, res, next) {
    var id = req.params.id;
    categoryModel.del_category(id, function(err, data) {
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

exports.getCategoryList = function(req, res, next) {
    const body = req.body;
    categoryModel.get_category_list(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        return res.json({code: 200, category_list: data});
    })
}

exports.getCategoriesCnt = function(req, res, next) {
    const body = req.body;
    categoryModel.get_categories_cnt(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        return res.json({code: 200, categories_cnt: data});
    })
}