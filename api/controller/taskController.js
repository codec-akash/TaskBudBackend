const db = require('../database/index')
const gAuth = require('../middleware/getAuth');

exports.addTask = (req, res, next) => {
    try {
        var userid = gAuth.getAuthUser(req);
        var { task_name, description, completed, start_time, end_time } = req.body;
        task_id = task_name[0] + Math.floor(Math.random() * 10000) + 1 + (new Date().getTime()).toString(36);

        let sqlQuery = "INSERT INTO tasks (userid,task_id,task_name,description,completed,start_time,end_time) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *"
        db.query(sqlQuery, [userid, task_id, task_name, description, completed, start_time, end_time], (err, result) => {
            if (err) {
                res.status(500).json({
                    message: err.message
                });
            }
            else {
                res.status(200).json({
                    message: "Success",
                    "result": result.rows[0]
                });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: err
        });

    }
}

exports.getUserTask = (req, res, next) => {
    var userid = gAuth.getAuthUser(req);
    let sqlQuery = "SELECT * FROM tasks WHERE userid = $1";
    try {
        db.query(sqlQuery, [userid], (err, result) => {
            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                res.status(200).json({
                    tasks: result.rows
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error
        });
    }
};