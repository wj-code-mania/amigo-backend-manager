var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

exports.get_students = function (parentId, callback) {

    var start = parseInt(body.start);
    var length = parseInt(body.length);
    var search = body.search.value;

    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('student').aggregate([
            { 
                $match: {
                    "parentId": parentId
                }
            },
            { 
                $match: { 
                    $or: [ 
                        { name: {$regex:search} }
                    ] 
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
            { 
                $skip : start 
            },
            { 
                $limit : length 
            }
        ]).toArray(function(err, items) {
            if (err) return callback(err);
            if(items.length == 0){
                return callback(null, {
                    total:0,
                    data:[]
                });
            }                
            var result = {
                total: items.length,
                data: items
            };
            return callback(null, result);
            client.close();
        });
    });
};

exports.get_students_count = function(body, callback) {
    parentId = parseInt(body.parentId);
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('student', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({parentId:parentId}).toArray(function(err, items) {
                if(err) return callback(err);
                return callback(null, items.length);
                client.close();
            });
        });
    });
}