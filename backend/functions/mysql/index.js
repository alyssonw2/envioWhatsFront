import mysql from "mysql"
export const connection = mysql.createPool({
    "host"            : "191.101.71.117",
    "user"            : "root",
    "password"        : "Nei#8suptec",
    "database"        : "envioemmassa",
    "timezone"            : "CONF.mysql.timezone",
    "charset"             : "utf8mb4"
  })
