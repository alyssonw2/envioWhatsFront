import mysql from "mysql"
export const connection = mysql.createPool({
    "host"            : "localhost",
    "user"            : "apisoketwhatsapp",
    "password"        : "Nei#8suptec",
    "database"        : "envioemmassa",
    "timezone"            : "CONF.mysql.timezone",
    "charset"             : "utf8mb4"
  })



