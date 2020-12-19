const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.use(function (req, res, next) {
    var token = req.headers['x-access-token'];
    console.log(token);
    if (token) {
        jwt.verify(token, process.env.SECERTKEY, function (err, decoded) {
            if (err) {
                let errordata = {
                    message: err.message,
                    expiredAt: err.expiredAt
                };
                console.log("errordata");
                return res.status(401).json({
                    message: 'Unauthorized Access',
                    error: errordata
                });
            }
            req.decoded = decoded;
            console.log(decoded);
            console.log(decoded.userid);
            next();
        });
    } else {
        return res.status(403).json({
            message: 'Forbidden Access',
            error: errordata
        });
    }
});


module.exports = router;