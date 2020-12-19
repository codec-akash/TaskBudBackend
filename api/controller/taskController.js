const { end } = require('../../db');
const db = require('../database/index');

exports.addTask = (req, res, next) => {
    try {
        var user_id = "hello11Id";
        var { task_name, description, completed, start_time, end_time } = req.body;
        task_id = task_name[0] + Math.floor(Math.random() * 10000) + 1 + (new Date().getTime()).toString(36);

        let sqlQuery = "INSERT INTO tasks (user_id,task_id,task_name,description,completed,start_time,end_time) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *"
        db.query(sqlQuery, [user_id, task_id, task_name, description, completed, start_time, end_time], (err, result) => {
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