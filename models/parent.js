var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');

var moment = require('moment');

exports.get_parents = function (body, callback) {

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
        mongodb.collection('parent').aggregate([
            { 
                $match: {
                    "schoolId": schoolId
                }
            },
            { 
                $match: { 
                    $or: [ 
                        { username: {$regex:search} }, 
                        { email: {$regex:search} },
                        { name: {$regex:search} } 
                    ] 
                }
            },
            { $lookup:
                {
                    from: 'student',
                    localField: 'id',
                    foreignField: 'parentId',
                    as: 'students'
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
            mongodb.collection('parent').aggregate([
                { 
                    $match: {
                        "schoolId": schoolId
                    }
                },
                { 
                    $match: { 
                        $or: [ 
                            { username: {$regex:search} }, 
                            { email: {$regex:search} },
                            { name: {$regex:search} } 
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

exports.add_parent = function (body, callback) {
    var schoolId = body.schoolId;
    var username = body.username;
    var email = body.email;
    var name = body.name;
    var password = body.password;
    var status = body.status;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('parent', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'username': username}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1){
                    return callback(null, null);
                    client.close();
                }else{
                    collection.find({'email': email}).toArray(function(err, items) {
                        if (err) {
                            return callback(err);
                            client.close();
                        }
                        if(items.length == 1){
                            return callback(null, null);
                            client.close();
                        }else{
                            collection.find().sort({id:-1}).limit(1).toArray(function(err, res) {
                                if (err) {
                                    return callback(err);
                                    client.close();
                                };
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
                                var insert_data = {id: str_new_id, schoolId: schoolId, username: username, email: email, name: name, password: cryptr.encrypt(password), stripeCustomerId: "", status: status, createdAt: createdAt, changedAt: changedAt, timestamp: str_timestamp}
                                collection.insertOne(insert_data, function(err, res) {
                                    if (err) return callback(err);
                                    return callback(null, res);
                                    client.close();
                                });
                            });
                        }
                    });
                }
            });
        });
    });
}

exports.edit_parent = function (body, callback) {
    var id = body.id;
    var username = body.username;
    var email = body.email;
    var name = body.name;
    var password = body.password;
    var status = body.status;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('parent', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'username': username}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1 && items[0].id != id){
                    return callback(null, null);
                    client.close();
                }else{
                    collection.find({'email': email}).toArray(function(err, items) {
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
                            var value_query = {$set: {username: username, email: email, name: name, password: cryptr.encrypt(password), stripeCustomerId: "", status: status, changedAt: changedAt}};
                            collection.updateOne(key_query, value_query, function(err, res) {
                                if (err) return callback(err);
                                return callback(null, res);
                                client.close();
                            });
                        }
                    });
                }
            });
        });
    });
}

exports.del_parent = function(id, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('parent', {safe: true}, function (err, collection) {
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

exports.get_parent = function(body, callback) {
    var parentId = parseInt(body.parentId);
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('parent', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({id:parentId}).toArray(function(err, items) {
                if(err) return callback(err);
                return callback(null, items[0]);
                client.close();
            });
        });
    });
}

exports.get_parent_email_list = function(body, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('parent', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find().toArray(function(err, items) {
                if(err) return callback(err);
                var data = [];
                items.forEach(function(value){
                    data.push(value.email);
                })
                return callback(null, data);
                client.close();
            });
        });
    });
}