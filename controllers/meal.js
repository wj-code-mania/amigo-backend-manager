var mealModel = require('../models/meal');

exports.getMeals = function(req, res, next) {
    const body = req.body;
    mealModel.get_meals(body, function(err, data) {
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

exports.addMeal = function (req, res, next) {
    const body = req.body;
    if (body.schoolId && body.name && body.status) {
        mealModel.add_meal(body, function (err, data) {
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

exports.editMeal = function (req, res, next) {
    const body = req.body;
    if (body.schoolId && body.name && body.status) {
        mealModel.edit_meal(body, function (err, data) {
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

exports.delMeal = function(req, res, next) {
    var id = req.params.id;
    mealModel.del_meal(id, function(err, data) {
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

exports.getMealList = function(req, res, next) {
    const body = req.body;
    mealModel.get_meal_list(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        return res.json({code: 200, meal_list: data});
    })
}
