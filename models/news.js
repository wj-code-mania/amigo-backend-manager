var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var moment = require('moment');

exports.get_news = function (body, callback) {

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
        mongodb.collection('news').aggregate([
            { 
                $match: {
                    "schoolId": schoolId,
                    "subject" : {$regex:search}
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
            
            mongodb.collection('news').aggregate([
                { 
                    $match: {
                        "schoolId": schoolId,
                        "subject" : {$regex:search}
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

exports.add_news = function (body, callback) {
    var schoolId = body.schoolId;
    var subject = body.subject;
    var content = body.content;
    var status = body.status;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('news', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'subject': subject}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1){
                    return callback(null, null);
                    client.close();
                }else{
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
                        var insert_data = {id: str_new_id, schoolId: schoolId, subject: subject, content: content, status: status, createdAt: createdAt, changedAt: changedAt, timestamp: str_timestamp}
                        collection.insertOne(insert_data, function(err, res) {
                            if (err) return callback(err);
                            return callback(null, res);
                            client.close();
                        });
                    });
                }
            });
        });
    });
}

exports.edit_news = function (body, callback) {
    var id = body.id;
    var schoolId = body.schoolId;
    var subject = body.subject;
    var content = body.content;
    var status = body.status;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('news', function (err, collection) {
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
                    var value_query = {$set: {schoolId: schoolId, subject: subject, content: content, status: status, changedAt: changedAt}};
                    collection.updateOne(key_query, value_query, function(err, res) {
                        if (err) return callback(err);
                        return callback(null, res);
                        client.close();
                    });
                }
            });
        });
    });
}

exports.del_news = function(id, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('news', {safe: true}, function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
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