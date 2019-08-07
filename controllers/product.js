var productModel = require('../models/product');

exports.getProducts = function(req, res, next) {
    const body = req.body;
    productModel.get_products(body, function(err, data) {
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

exports.getAllProducts = function(req, res, next) {
    const body = req.body;
    productModel.get_all_products(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        return res.json({code: 200, product_list: data});
    })
}

exports.addProduct = function (req, res, next) {
    const body = req.body;
    if (body.schoolId && body.name && body.status) {
        productModel.add_product(body, function (err, data) {
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

exports.editProduct = function (req, res, next) {
    const body = req.body;
    if (body.id && body.schoolId && body.name && body.status) {
        productModel.edit_product(body, function (err, data) {
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

exports.updateProductOption = function (req, res, next) {
    const body = req.body;
    if (body.id && body.schoolId) {
        productModel.update_product_option(body, function (err, data) {
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

exports.delProduct = function(req, res, next) {
    var id = req.params.id;
    productModel.del_product(id, function(err, data) {
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

exports.uploadProductImg = function(req, res, next) {
    productModel.upload_product_img(req, function(err, data) {
        if (err)
            return res.json({code: 500, msg: err});
        return res.json({code: 200, msg: "Success", data: data});
    })
}

exports.delProductImg = function (req, res, next) {
    const body = req.body;
    if (body.id && body.imgUrl) {
        productModel.del_product_img(body, function (err, data) {
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

exports.getProductsCntInfo = function(req, res, next) {
    const body = req.body;
    productModel.get_products_cnt_info(body, function(err, data) {
        if (err)
            return next(new Error('Failed to get orders table: \n' + err));
        return res.json({code: 200, products_cnt_info: data});
    })
}