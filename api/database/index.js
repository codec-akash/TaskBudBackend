const pool = require('../../db');
module.exports = {
    query: (text, callback) => {
        const start = Date.now()
        return pool.query(text, (err, res) => {
            const duration = Date.now() - start
            console.log('executed query', { text, duration, rows: res.rowCount })
            callback(err, res)
        })
    },

    query: (text, params, callback) => {
        const start = Date.now()
        return pool.query(text, params, (err, res) => {
            const duration = Date.now() - start
            console.log(params);
            console.log('executed query', { text, duration, })
            callback(err, res)
        })
    },
}