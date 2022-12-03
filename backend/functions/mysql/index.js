import mysql from "mysql"
export const connection = mysql.createPool({
    "host"            : "localhost",
    "user"            : "root",
    "password"        : "",
    "database"        : "envioemmassa",
    "timezone"            : "CONF.mysql.timezone",
    "charset"             : "utf8mb4"
  })
