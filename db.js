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

pool.query("create table users (id serial primary key,user_id text unique, first_name text, last_name text, email text unique not null, password text, phonenumber text unique, actuall_password text)", (err, res) => {
    console.log(err, res);
    pool.end();
});

// module.exports = pool;
