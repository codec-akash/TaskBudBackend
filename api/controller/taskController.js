const { json } = require('body-parser');
const e = require('express');
const db = require('../database/index')
const gAuth = require('../middleware/getAuth');

exports.addTask = (req, res, next) => {
    try {
        var userid = gAuth.getAuthUser(req);
        var { task_name, description, completed, start_time, end_time, category } = req.body;
        task_id = task_name[0] + Math.floor(Math.random() * 10000) + 1 + (new Date().getTime()).toString(36);

        let sqlQuery = "INSERT INTO tasks (userid,task_id,task_name,description,completed,start_time,end_time,category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning *"
        db.query(sqlQuery, [userid, task_id, task_name, description, completed, start_time, end_time, category], (err, result) => {
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

exports.updateTask = (req, res, next) => {
    var userid = gAuth.getAuthUser(req);
    let sqlQuery = "UPDATE tasks SET task_name = $1,description = $2, completed = $3,start_time = $4,end_time = $5,category = $6 where task_id = $7";
    var { task_name, description, completed, start_time, end_time, category } = req.body;
    const { taskId } = req.params;
    try {
        db.query(sqlQuery, [task_name, description, completed, start_time, end_time, category, taskId], (err, result) => {
            if (err) {
                res.status(500).json({
                    message: err.message
                });
            }
            else if (result.rowCount != 1) {
                res.status(404).json({
                    "message": "No such Task",
                });
            } else {
                res.status(200).json({
                    message: "Success"
                });
            }
        });
    } catch (err) {
        res.status(500).json({});
    }
}

exports.deleteTask = (req, res, next) => {
    const { taskId } = req.params;
    let sqlQuery = "DELETE FROM tasks WHERE task_id = $1";
    try {
        db.query(sqlQuery, [taskId], (err, result) => {
            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                res.status(200).json({
                    message: "Success"
                });
            }
        });
    } catch (err) {
        res.status(500).json({});
    }
}

exports.getWeekTask = (req, res, next) => {
    let sqlQuery = "SELECT * FROM tasks WHERE start_time::date between $1 and $2";
    try {
        var date = '2021-01-25';
        var date2 = '2021-01-20';
        var parsedDate = new Date(date);
        var parsedDate2 = new Date(date2);
        db.query(sqlQuery, [parsedDate2, parsedDate], (err, result) => {
            if (err) {
                res.status(404).json({
                    message: err
                });
            }
            let array = [];
            for (var i = 0; i < result.rowCount; i++) {
                console.log(result.rowCount);
                var hours = (result.rows[i].end_time.getTime() - result.rows[i].start_time.getTime()) / (1000 * 60 * 60 * 24)
                array.push(hours * 24);
            }
            res.status(200).json({
                hours: array
            })
        })
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

exports.getCategoryData = (req, res, next) => {
    var userid = gAuth.getAuthUser(req);
    let categoryArray = [];
    let hoursArray = [];
    let getCategoryCommand = "SELECT DISTINCT category FROM tasks where userid = $1";
    let getCategoryHours = 'SELECT start_time, end_time FROM tasks where category = $1 and userid = $2';
    try {
        db.query(getCategoryCommand, [userid], (error, response) => {
            if (error) {
                throw error;
            }
            console.log("coiunt");
            console.log(response.rowCount);
            for (let index = 0; index < response.rowCount; index++) {
                categoryArray[index] = response.rows[index];
                // console.log(categoryArray[index]['category']);
                // if (index == response.rowCount - 1) {
                //     console.log("responseLol")
                // }
            }
            var count = 0;
            for (let index = 0; index < categoryArray.length; index++) {
                db.query(getCategoryHours, [categoryArray[index]['category'], userid], (errHour, resHour) => {
                    if (errHour) {
                        throw errHour;
                    }
                    for (let ctr = 0; ctr < resHour.rowCount; ctr++) {
                        var hours = ((resHour.rows[ctr].end_time.getTime() - resHour.rows[ctr].start_time.getTime()) / (1000 * 60 * 60 * 24)) * 24;
                        console.log(hours);
                        hoursArray[count] = hours;
                        count = count + 1;
                    }
                    if (index == categoryArray.length - 1) {
                        let finalArray = [];
                        for (let i = 0; i < hoursArray.length; i++) {
                            finalArray.push({ category: categoryArray[i]['category'], hours: hoursArray[i] });
                        }
                        res.status(200).json(finalArray);
                    }
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error Occured"
        })
    }
}