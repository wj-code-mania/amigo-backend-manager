var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

exports.get_txns = function (body, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }            
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('transaction', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find().toArray(function(err, items) {
                if (err) {
                    return callback(err);
                }
                if(items.length == 0)
                    return callback(null, {
                        total:0,
                        data:[]
                    });
                var result = {
                    total: items.length,
                    data: items
                };
                return callback(null, result);
                client.close();
            });
        });
    });
};