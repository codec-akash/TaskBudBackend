const db = require('../database/index')
exports.getAppData = (req, res, next) => {
    try {
        let sqlQuery = "SELECT * FROM appData";
        db.query(sqlQuery, (err, result) => {
            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                const { showResult } = result.rows;
                res.status(200).json(
                    result.rows[0]
                );
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error Occured"
        });
    }
};

exports.updateAppData = (req, res, next) => {
    try {
        let sqlQuery = "UPDATE appData SET minAppVersion = $1, latestAppVersion = $2, updatedAt = $3";
        const { minAppVersion, latestAppVersion, updatedAt } = req.body;

        db.query(sqlQuery, [minAppVersion, latestAppVersion, updatedAt], (err, result) => {
            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                res.status(200).json({
                    tasks: result
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error Occured"
        });

    }
};

exports.addAppData = (req, res, next) => {
    try {
        let sqlQuery = "INSERT INTO appData (minAppVersion, latestAppVersion, updatedAt) VALUES ($1,$2,$3) returning *";
        const { minAppVersion, latestAppVersion, updatedAt } = req.body;

        db.query(sqlQuery, [minAppVersion, latestAppVersion, updatedAt], (err, result) => {
            if (err) {
                res.status(400).json({
                    message: err
                });
            } else {
                res.status(200).json({
                    tasks: result
                });
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Error Occured"
        });

    }
};