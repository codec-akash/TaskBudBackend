const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// const pool = new Pool({
//     user: process.env.NAME,
//     password: process.env.PASSWORD,
//     database: process.env.DATABASE,
//     host: process.env.HOST,
//     port: 5432
// });
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = pool;
