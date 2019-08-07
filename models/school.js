var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var moment = require('moment');

exports.get_school_list = function (body, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find().toArray(function(err, items) {
                if (err) return callback(err);
                return callback(null, items);
                client.close();
            });
        });
    });
};

exports.get_schools = function (body, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find().toArray(function(err, items) {
                if (err) return callback(err);
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
        });       
    });
};

exports.add_school = function (body, callback) {
    var name = body.name;
    var status = body.status;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'name': name}).toArray(function(err, items) {
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
                        var insert_data = {id: str_new_id, name: name, status: status, createdAt: createdAt, changedAt: changedAt, timestamp: str_timestamp}
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

exports.edit_school = function (body, callback) {
    var id = body.schoolId;
    var name = body.name;
    var address = body.address;
    var onDays = body.onDays;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'name': name}).toArray(function(err, items) {
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
                    var value_query = {$set: {name: name, address: address, onDays: onDays, changedAt: changedAt}};
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

exports.del_school = function(id, callback) {
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', {safe: true}, function (err, collection) {
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

exports.get_school_info = function (body, callback) {
    var schoolId = body.schoolId;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({id : schoolId}).toArray(function(err, items) {
                if (err) return callback(err);
                return callback(null, items);
                client.close();
            });
        });
    });
};

exports.upload_school_logo = function (req, callback) {
    var schoolId = req.body.schoolId;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
            var key_query = { id: schoolId};
            var fileObjects = req.files.uploads;
            var img = fileObjects[0].path;
            var splited_array = img.split('\\');
            var str_img = '';
            for(var i = 0; i < splited_array.length - 1; i++){
                str_img += splited_array[i] + '/';
            }
            str_img += splited_array[splited_array.length-1];
            var value_query = {$set: {img: str_img, changedAt: changedAt}};
            collection.updateOne(key_query, value_query, function(err, res) {
                if (err) return callback(err);
                return callback(null, str_img);
                client.close();
            });
        });
    });
};

exports.auth_stripe = function (schoolId, body, callback) {
    var access_token = body.access_token;
    var refresh_token = body.refresh_token;
    var token_type = body.token_type;
    var stripe_publishable_key = body.stripe_publishable_key;
    var stripe_user_id = body.stripe_user_id;
    var scope = body.scope;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('school', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'id': schoolId}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1 && items[0].id != schoolId || items.length == 0){
                    return callback(null, null);
                    client.close();
                }else{
                    var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
                    var key_query = { id: schoolId};
                    var value_query = {$set: {access_token: access_token, refresh_token: refresh_token, token_type: token_type, stripe_publishable_key: stripe_publishable_key, stripe_user_id: stripe_user_id, scope: scope, authorized: true, changedAt: changedAt}};
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