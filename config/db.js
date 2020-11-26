const mysql = require('mysql')

connexion = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connexion.connect((error)=> {
    if(error) throw error

    console.log("Database connection !!");
})


module.exports = connexion