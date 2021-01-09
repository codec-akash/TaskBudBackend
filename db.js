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

// pool.query("drop table appData", (err, res) => {
//     console.log(err, res);
//     // pool.end();
// });
pool.query("create table IF NOT EXISTS users (id serial primary key,userid text unique, first_name text, last_name text, email text unique not null, password text, phonenumber text unique, actuall_password text)", (err, res) => {
    console.log(err, res);
    // pool.end();
});
pool.query("create table IF NOT EXISTS tasks (id serial primary key,userid text not null, task_id text unique not null, task_name text, description text, completed boolean not null, start_time time not null, end_time time not null)", (err, res) => {
    console.log(err, res);
    // pool.end();
});

pool.query("create table IF NOT EXISTS appData (id serial primary key, minAppVersion text not null, latestAppVersion text not null, updatedAt text not null)", (err, res) => {
    console.log(err, res);
    // pool.end();
});

module.exports = pool;
