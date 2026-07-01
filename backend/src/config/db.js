const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "fire_safety_db",
    password: "gokul@9966",
    port: 5432,
});

pool.connect()
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((err) => {
        console.log(err.message);
    });

module.exports = pool;