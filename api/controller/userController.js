// const db = require('../../db')
const db = require('../database/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const gAuth = require('../middleware/getAuth');

// exports.getAllUser = async (req, res, next) => {
//     try {
//         const allTodos = await db.query("SELECT * from users");
//         res.status(200).json({
//             "message": allTodos.rows
//         });
//     } catch (err) {
//         console.error(err);
//     }
// }
exports.getAllUser = (req, resp, next) => {
    try {
        db.query("SELECT * from users", (err, res) => {
            if (err) {
                return next(err)
            }
            resp.json({
                message: res.rows
            })
        });
    } catch (err) {
        console.error(err);
    }
};

exports.register = (req, res, next) => {
    var { first_name, last_name, email, password, phonenumber } = req.body;
    userid = first_name[0] + Math.floor(Math.random() * 10000) + 1 + (new Date().getTime()).toString(36);
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        actuall_password = password;
        password = hash;

        let data = { userid, first_name, last_name, email, password, phonenumber, actuall_password };
        db.query("SELECT * FROM users where email = $1 or phonenumber = $2", [email, phonenumber], (err, result) => {
            if (err) {
                console.log(err);
                throw err;
            };
            if (result.rowCount > 0) {
                res.status(404).json({
                    "message": "User Already Exists with this email"
                });
            } else {
                let sqlQuery = "insert into users (userid,first_name,last_name,email,password,phonenumber,actuall_password) values ($1,$2,$3,$4,$5,$6,$7)";
                const token = jwt.sign({
                    email: email,
                    userid: userid
                }, process.env.SECERTKEY);
                db.query(sqlQuery, [userid, first_name, last_name, email, password, phonenumber, actuall_password], (err, result) => {
                    if (err) {
                        res.status(500).json({
                            message: "Error Occured"
                        });
                    } else {
                        res.status(200).json({
                            message: "Success",
                            token: token
                        });
                    }
                });
            }
        });
    });
};

exports.loginUser = (req, res, next) => {
    var { email, password } = req.body;
    let sqlQuery = "SELECT * FROM users WHERE email = $1";
    db.query(sqlQuery, [email], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: err
            });
        } else if (result.rowCount == 0) {
            res.status(401).json({
                message: "Unauthorized Access"
            });
        } else {
            bcrypt.compare(password, result.rows[0].password, (err, response) => {
                if (err) {
                    res.status(420).json({
                        message: "Incorrect email or password"
                    });
                }
                if (response) {
                    const token = jwt.sign({
                        email: result.rows[0].email,
                        userid: result.rows[0].userid
                    }, process.env.SECERTKEY);
                    res.status(200).json({
                        message: "Success",
                        token: token
                    })
                } else {
                    res.status(422).json({
                        message: "Incorrect email or password",
                    });
                }
            })
        }
    });
};

exports.updatePassword = (req, res, next) => {
    var { oldPassword, password } = req.body;
    var userid = gAuth.getAuthUser(req);

    let getuserQuery = "SELECT password from users where userid = $1";

    try {
        db.query(getuserQuery, [userid], (err, result) => {
            if (err) {
                res.status(500).json({
                    "message": "Error Occurred",
                });
            } else {
                bcrypt.compare(oldPassword, result.rows[0].password, (err, bcryptres) => {
                    if (err) {
                        res.status(403).json({
                            message: "Password does not matches"
                        })
                    } else if (bcryptres) {
                        bcrypt.hash(password, 10, (err, hash) => {
                            if (err) {
                                throw err
                            }
                            var actuall_password = password;
                            password = hash;
                            let data = [password, actuall_password];
                            let sqlQuery = "UPDATE users SET password = $1, actuall_password = $2 where userid = $3 ";
                            db.query(sqlQuery, [password, actuall_password, userid], (err, finalResult) => {
                                if (err) {
                                    res.status(500).json({
                                        message: "Failed to update password"
                                    });
                                } else {
                                    res.status(200).json({
                                        message: "Password Updated"
                                    });
                                }
                            })
                        });
                    } else {
                        res.status(403).json({
                            message: "Old Password does not matches"
                        })
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error
        });
    }

}

exports.forgotPassword = (req, res, next) => {
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    });

    var mailOptions = {
        from: 'akashrdubey@yahoo.in',
        to: 'akashrdubey19@gmail.com',
        subject: 'Test 1',
        text: 'HeloWorld',
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            res.status(200).json({
                message: "Error pass userid does not match",
                error: err
            })
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({ message: "Mail Sent" });
        }
    });
};