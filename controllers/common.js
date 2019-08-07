var settings = require('../config/settings');
var jwt = require('jsonwebtoken');

exports.decodeToken = function(token) {
    var tokenDecodedData = jwt.decode(token, settings.TOKEN_SECRET);
    if(tokenDecodedData == undefined){
        return false;
    }else{
        if(tokenDecodedData.managerId && tokenDecodedData.schoolId){
            return tokenDecodedData;
        }else{
            return false;
        }
    }
}
