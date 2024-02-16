var AWS = require("aws-sdk");
const {Pool,Client} = require("pg");
require('dotenv').config();

AWS.config.loadFromPath('./config.json');

endpoint = process.env.ENDPOINT;
db_port = process.env.DB_PORT;
db_user = process.env.DB_USER;
db_pass = process.env.DB_PASS;
db_name = process.env.DB_NAME;

const pool = new Pool({
    host: endpoint,
    database: db_name,
    user: db_user,
    password: db_pass,
    port: db_port,
    ssl: {
        rejectUnauthorized: false
    }
});

( async () => {
    const client = await pool.connect();
    try{
        const {rows} = await client.query("SELECT now()");
        console.log(rows[0]);
    }catch (err){
        console.error("Database connection failed due to " + err);

    }finally{
        client.release();
    }
})();
