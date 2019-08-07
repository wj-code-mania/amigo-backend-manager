var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var moment = require('moment');

exports.get_order_history = function (body, callback) {

    var start = parseInt(body.start);
    var length = parseInt(body.length);
    var search = body.search.value;

    var schoolId = body.schoolId;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        };
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('order').aggregate([
            { 
                $match: {
                    "schoolId": schoolId
                }
            },
            { 
                $match: { 
                    $or: [ 
                        { className: {$regex:search} }, 
                        { parentName: {$regex:search} },
                        { studentName: {$regex:search} } 
                    ] 
                }
            },
            { $lookup:
                {
                    from: 'class',
                    localField: 'classId',
                    foreignField: 'id',
                    as: 'classInfo'
                }
            },
            { $lookup:
                {
                    from: 'parent',
                    localField: 'parentId',
                    foreignField: 'id',
                    as: 'parentInfo'
                }
            },
            { $lookup:
                {
                    from: 'student',
                    localField: 'studentId',
                    foreignField: 'id',
                    as: 'studentInfo'
                }
            },
            { $lookup:
                {
                    from: 'class',
                    localField: 'classId',
                    foreignField: 'id',
                    as: 'classInfo'
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
            };
            if(items.length == 0){
                return callback(null, {
                    total:0,
                    data:[]
                });
                client.close();
            }
            var totalCnt = 0;
            mongodb.collection('order').aggregate([
                { 
                    $match: {
                        "schoolId": schoolId
                    }
                },
                { 
                    $match: { 
                        $or: [ 
                            { className: {$regex:search} }, 
                            { parentName: {$regex:search} },
                            { studentName: {$regex:search} } 
                        ] 
                    }
                }
            ]).toArray(function(err, allItems) {
                if (err) {
                    return callback(err);
                    client.close();
                };
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

exports.get_orders = function (parentId, callback) {

    var start = parseInt(body.start);
    var length = parseInt(body.length);
    var search = body.search.value;

    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        };
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('order').aggregate([
            { 
                $match: {
                    "parentId": parentId
                }
            },
            { 
                $match: { 
                    $or: [ 
                        { className: {$regex:search} }, 
                        { parentName: {$regex:search} },
                        { studentName: {$regex:search} } 
                    ] 
                }
            },
            { $lookup:
                {
                    from: 'class',
                    localField: 'classId',
                    foreignField: 'id',
                    as: 'classInfo'
                }
            },
            { $lookup:
                {
                    from: 'parent',
                    localField: 'parentId',
                    foreignField: 'id',
                    as: 'parentInfo'
                }
            },
            { $lookup:
                {
                    from: 'student',
                    localField: 'studentId',
                    foreignField: 'id',
                    as: 'studentInfo'
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
            };
            if(items.length == 0)
                return callback(null, {
                    total:0,
                    data:[]
                });
            items.length
            var result = {
                total: items.length,
                data: items
            };
            return callback(null, result);
            client.close();
        });
        client.close();
    });
};

exports.get_orders_count = function(body, callback) {
    var parentId = parseInt(body.parentId);
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        };
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('order', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            };
            collection.find({parentId:parentId}).toArray(function(err, items) {
                if(err) return callback(err);
                return callback(null, items.length);
                client.close();
            });
        });
        client.close();
    });
}

exports.get_order_detail = function(body, callback) {
    var orderId = parseInt(body.orderId);
    var id = orderId.toFixed();
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        };
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('order').aggregate([
            { 
                $match: {
                    "id": id
                }
            },
            { $lookup:
                {
                    from: 'school',
                    localField: 'schoolId',
                    foreignField: 'id',
                    as: 'schoolInfo'
                }
            },
            { $lookup:
                {
                    from: 'class',
                    localField: 'classId',
                    foreignField: 'id',
                    as: 'classInfo'
                }
            },
            { $lookup:
                {
                    from: 'parent',
                    localField: 'parentId',
                    foreignField: 'id',
                    as: 'parentInfo'
                }
            },
            { $lookup:
                {
                    from: 'student',
                    localField: 'studentId',
                    foreignField: 'id',
                    as: 'studentInfo'
                }
            }
        ]).toArray(function(err, items) {
            if(err) return callback(err);
            return callback(null, items[0]);
            client.close();
        });
    });
}

exports.cancel_order = function (schoolId, body, callback) {
    var id = body.id;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('order', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
            var key_query = { id: id};
            var value_query = {$set: {status: "cancelledByManager", changedAt: changedAt}};
            collection.updateOne(key_query, value_query, function(err, res) {
                if (err) return callback(err);
                return callback(null, res);
                client.close();
            });
        });
    });
}

