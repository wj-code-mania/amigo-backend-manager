var settings = require('../config/settings');
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var moment = require('moment');

var Cryptr = require('cryptr');
var cryptr = new Cryptr('myTotalySecretKey');

exports.auth_user = function (body, callback) {
    var username = body.username;
    var password = body.password;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
    var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('manager', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'username': username}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                }
                if(items.length == 1){
                    var userInfo = items[0];
                    if(password == cryptr.decrypt(userInfo.password)) {
                        return callback(null, userInfo);
                    }else{
                        return callback(null, null);
                    }
                }else{
                    return callback(null, null);
                }
                client.close();
            });
        });
    });
}

exports.change_pwd = function (body, callback) {
    var userid = body.managerId;
    var curPwd = body.curPwd;
    var newPwd = body.newPwd;
    mongoClient.connect(settings.mongodb_host, { useNewUrlParser: true }, function(err, client) {
        if (err) {
            return callback(err);
            client.close();
        }
        assert.equal(null, err);
        var mongodb = client.db(settings.mongodb_dbname);
        mongodb.collection('manager', function (err, collection) {
            if (err) {
                return callback(err);
                client.close();
            }
            collection.find({'id': userid}).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                if(items.length == 1){
                    var userInfo = items[0];
                    if(curPwd == cryptr.decrypt(userInfo.password)) {
                        var newCryptPwd = cryptr.encrypt(newPwd);
                        var changedAt = moment().format('YYYY-MM-DD hh:mm:ss');
                        var key_query = { id: userid};
                        var value_query = {$set: {password: newCryptPwd, changedAt: changedAt}};
                        collection.updateOne(key_query, value_query, function(err, res) {
                            if (err) {
                                return callback(err);
                                client.close();
                            }
                            return callback(null, res);
                            client.close();
                        });
                    }else{
                        return callback(null, null);
                        client.close();
                    }
                }else{
                    return callback(null, null);
                    client.close();
                }
            });
        });        
    });
}


exports.get_dashboard_info = function (body, callback) {
    var schoolId = body.schoolId;
    var dateTime = body.dateTime;
    var orderCnt, totalSales;
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
            var regexDateTime = new RegExp(dateTime);
            collection.find( {schoolId : schoolId, createdAt: regexDateTime } ).toArray(function(err, items) {
                if (err) {
                    return callback(err);
                    client.close();
                }
                orderCnt = items.length;
                totalSales = 0;
                if(orderCnt > 0){
                    items.forEach(function(value){
                        totalSales += parseFloat(value.orderPrice);
                    })
                }
                var res = {
                    orderCnt : orderCnt,
                    totalSales : totalSales
                }
                return callback(null, res);
                client.close();
            });
        });        
    });
}