var newsModel = require('../models/news');

exports.getNews = function(req, res, next) {
    const body = req.body;
    newsModel.get_news(body, function(err, data) {
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

exports.addNews = function (req, res, next) {
    const body = req.body;
    if (body.schoolId && body.subject && body.status) {
        newsModel.add_news(body, function (err, data) {
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

exports.editNews = function (req, res, next) {
    const body = req.body;
    if (body.id && body.schoolId && body.subject && body.status) {
        newsModel.edit_news(body, function (err, data) {
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

exports.delNews = function(req, res, next) {
    var id = req.params.id;
    newsModel.del_news(id, function(err, data) {
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