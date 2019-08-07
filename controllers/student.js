var studentModel = require('../models/student');

exports.getStudents = function(req, res, next) {
    body = req.body;
    parentId = req.params.parentId;
    studentModel.get_students(parentId, function(err, data) {
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

exports.getStudentsCount = function(req, res, next) {
    body = req.body;
    studentModel.get_students_count(body, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});
        return res.json({code: 200, students_count: data});
    })
    return;
}