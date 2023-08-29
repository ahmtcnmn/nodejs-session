import "dotenv/config"
import mysql from "mysql2/promise";

var pool = mysql.createPool({
  host: process.env.mysqlHost,
  user: process.env.mysqlUser,
  password: process.env.mysqlPassword,
  database: process.env.mysqlDatabase,
  waitForConnections:true,
  namedPlaceholders: true,
  waitForConnections:true,
  connectionLimit:1000,
});



export default pool