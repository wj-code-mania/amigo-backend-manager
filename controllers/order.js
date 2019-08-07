var orderModel = require('../models/order');
var common = require('./common');

exports.getOrderHistory = function(req, res, next) {
    var body = req.body;
    orderModel.get_order_history(body, function(err, data) {
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

exports.cancelOrder = function(req, res, next) {
    const body = req.body;    
    var schoolId = body.schoolId;
    orderModel.cancel_order(schoolId, body, function(err, data) {
        if (err)
            return next(new Error(err));
        var resp = {
            code: 200,
            msg: 'Canceled!'
        };    
        return res.json(resp);
    })
}

exports.getOrders = function(req, res, next) {
    const body = req.body;
    parentId = req.params.parentId;
    orderModel.get_orders(parentId, function(err, data) {
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

exports.getOrdersCount = function(req, res, next) {
    const body = req.body;
    orderModel.get_orders_count(body, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});

        return res.json({code: 200, orders_count: data});
    })
    return;
}

exports.getOrderDetail = function(req, res, next) {
    const body = req.body;
    orderModel.get_order_detail(body, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});

        return res.json({code: 200, data: data});
    })
    return;
}