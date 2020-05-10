const mysql = require("mysql2/promise"); //어싱크어웨이 할거니까 인덱스 아닌 프로미스
const pool = mysql.createPool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_DATABASE,
    waitForConnections:true,
    connectionLimit:10,
});

module.express = { mysql, pool };