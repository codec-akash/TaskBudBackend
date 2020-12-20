const jwt = require('jsonwebtoken');
const express = require('express');

var methods = {};
methods.getAuthUser = function (req) {
    var token = req.headers['x-access-token'];
    var userid;
    console.log("reached getAuth");
    console.log(token);
    if (token) {
        jwt.verify(token, process.env.SECERTKEY, function (err, decoded) {
            if (err) {
                let errordata = {
                    message: err.message,
                    // expiredAt: err.expiredAt
                };
                console.log(errordata);
                return res.status(401).json({
                    message: 'Unauthorized Access',
                    error: errordata
                });
            }
            req.decoded = decoded;
            userid = decoded.userid;
            console.log(decoded.userid);
        });
    }
    return userid;
}

module.exports = methods;