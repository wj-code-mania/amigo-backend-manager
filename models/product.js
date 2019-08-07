var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var moment = require('moment');
var fs = require('fs');

exports.get_products = function (body, callback) {

    var start = parseInt(body.start);
    var length = parseInt(body.length);
    var search = body.search.value;

    var schoolId = body.schoolId;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product').aggregate([
            { 
                $match: {
                    "schoolId": schoolId
                }
            },
            { 
                $match: { 
                    $or: [ 
                        { name: {$regex:search} }, 
                        { description: {$regex:search} }
                    ] 
                }
            },
            { $lookup:
                {
                    from: 'product',
                    localField: 'categoryId',
                    foreignField: 'id',
                    as: 'categoryInfo'
                }
            },
            { 
                $skip : start 
            },
            { 
                $limit : length 
            }
        ]).toArray(function(err, items) {
            if (err) {
                return callback(err);
                client.close();
            }

            if(items.length == 0){
                return callback(null, {
                    total:0,
                    data:[]
                });
                client.close();
            }          
            
            var totalCnt = 0;
            mongodb.collection('product').aggregate([
                { 
                    $match: {
                        "schoolId": schoolId
                    }
                },
                { 
                    $match: { 
                        $or: [ 
                            { name: {$regex:search} }, 
                            { description: {$regex:search} }
                        ] 
                    }
                }
            ]).toArray(function(err, allItems) {
                if (err) {
                    return callback(err);
                }
                totalCnt = allItems.length;
                var result = {
                    total: totalCnt,
                    data: items
                };
                return callback(null, result);
                client.close();
            })
        });
    });
};

exports.add_product = function (body, callback) {
    var schoolId = body.schoolId;
    var categoryId = body.categoryId;
    var name = body.name;
    var currency = body.currency;
    var price = parseFloat(body.price);
    var maxQty = parseFloat(body.maxQty);
    var description = body.description;
    var availableClasses = body.availableClasses;
    var availableMeals = body.availableMeals;
    var onDays = body.onDays;
    var onClass = body.onClass;
    var status = body.status;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find().sort({id:-1}).limit(1).toArray(function(err, res) {
                var max = 0;
                var int_max = 0;
                if(res.length > 0){
                    max = res[0].id;
                    int_max = parseInt(max);
                }
                var new_id = int_max + 1;
                var str_new_id = new_id.toString();
                var createdAt = moment().format('YYYY-MM-DD hh:mm:ss');
                var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
                var date_time = new Date();
                var timestamp = date_time.getTime();
                var str_timestamp = timestamp.toString();
                var insert_data = {id: str_new_id, schoolId: schoolId, categoryId: categoryId, img: [], name: name, currency: currency, price: price, maxQty: maxQty, description: description, availableClasses: availableClasses, availableMeals: availableMeals, onDays: onDays, onClass: onClass, options: [], status: status, createdAt: createdAt, changedAt: changedAt, timestamp: str_timestamp}
                collection.insertOne(insert_data, function(err, res) {
                    if (err) return callback(err);
                    return callback(null, res);
                    client.close();
                });
            });
        });
    });
}

exports.edit_product = function (body, callback) {
    var id = body.id;
    var schoolId = body.schoolId;
    var categoryId = body.categoryId;
    var name = body.name;
    var currency = body.currency;
    var price = parseFloat(body.price);
    var maxQty = parseFloat(body.maxQty);
    var description = body.description;
    var availableClasses = body.availableClasses;
    var availableMeals = body.availableMeals;
    var onDays = body.onDays;
    var onClass = body.onClass;
    var status = body.status;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'id': id}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1 && items[0].id != id){
                    return callback(null, null);
                    client.close();
                }else{
                    var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
                    var key_query = { id: id};
                    var value_query = {$set: {schoolId: schoolId, categoryId: categoryId, name: name, currency: currency, price: price, maxQty: maxQty, description: description, availableClasses: availableClasses, availableMeals: availableMeals, onDays: onDays, onClass: onClass, status: status, changedAt: changedAt}};
                    collection.updateOne(key_query, value_query, function(err, res) {
                        if (err) {
                            return callback(err);
                            client.close();
                        }
                        return callback(null, res);
                        client.close();
                    });
                }
            });
        });
    });
}

exports.update_product_option = function (body, callback) {
    var id = body.id;
    var options = body.options.options;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'id': id}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1 && items[0].id != id){
                    return callback(null, null);
                    client.close();
                }else{
                    var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
                    var key_query = { id: id};
                    var value_query = {$set: {options: options, changedAt: changedAt}};
                    collection.updateOne(key_query, value_query, function(err, res) {
                        if (err) {
                            return callback(err);
                            client.close();
                        }
                        return callback(null, res);
                        client.close();
                    });
                }
            });
        });
    });
}


exports.del_product = function(id, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', {safe: true}, function (err, collection) {
            collection.deleteOne({
                id: id
            }, function(err, res) {
                if (err) return callback(err);
                return callback(null);
                client.close();
            });
        });
    });
}

exports.upload_product_img = function (req, callback) {
    var productId = req.params.productId;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({id: productId}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
                var fileObjects = req.files.uploads;
                var thisProductData = items[0];
                var imgList = thisProductData.img;
                fileObjects.forEach(function(value){                
                    var img = value.path;
                    var splited_array = img.split('\\');
                    var str_img = '';
                    for(var i = 0; i < splited_array.length - 1; i++){
                        str_img += splited_array[i] + '/';
                    }
                    str_img += splited_array[splited_array.length-1];
                    imgList.push(str_img);
                });
                var key_query = { id: productId};
                var value_query = {$set: {img: imgList, changedAt: changedAt}};
                collection.updateOne(key_query, value_query, function(err, res) {
                    if (err) return callback(err);
                    return callback(null, imgList);
                    client.close();
                });
            });
        });
    });
};

exports.del_product_img = function (body, callback) {
    var id = body.id;
    var imgUrl = body.imgUrl;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'id': id}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1 && items[0].id != id){
                    return callback(null, null);
                    client.close();
                }else{
                    var thisProductData = items[0];
                    var thisProductImgList = thisProductData.img;
                    thisProductImgList.splice(imgUrl, 1);
                    var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
                    var key_query = { id: id};
                    var value_query = {$set: {img: thisProductImgList, changedAt: changedAt}};
                    collection.updateOne(key_query, value_query, function(err, res) {
                        if (err) {
                            return callback(err);
                            client.close();
                        }
                        fs.unlink('../assets/uploades/img/products/'+imgUrl, function(err, value){
                            if (err) {
                                return callback(err);
                                return callback(null, res);
                            }
                        });
                        client.close();
                    });
                }
            });
        });
    });
}

exports.get_products_cnt_info = function (body, callback) {
    var schoolId = body.schoolId;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({schoolId : schoolId}).toArray(function(err, items) {
                if (err) return callback(err);
                return callback(null, items.length);
                client.close();
            });
        });
    });
};

exports.get_all_products = function (body, callback) {
    var schoolId = body.schoolId;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('product', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({schoolId : schoolId}).toArray(function(err, items) {
                if (err) return callback(err);
                return callback(null, items);
                client.close();
            });
        });
    });
};