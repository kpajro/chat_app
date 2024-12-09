const mysql = require("mysql2")
require("dotenv").config()


function getConnection(){
    const conn = mysql.createConnection({
        host: process.env.DB_HOST_APP,
        user: process.env.DB_USER_APP,
        database: process.env.DB_NAME_APP
    })

    conn.connect((e)=>{
        if (e) {
            console.error("failed to connect", e.message)
        } else {
            console.log("connected")
        }
    })

    return conn
}

module.exports = { getConnection}