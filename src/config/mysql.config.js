import mysql from 'mysql2'
import ENVIROMENT from './enviroment.config.js'

// Pool: Va a establecer una conexion con la base de datos y esta va a ejecutar las consultar al servidor que vamos a consultar.
const pool = mysql.createPool({
    host: ENVIROMENT.MYSQL_HOST,
    user: ENVIROMENT.MYSQL_USER,
    password: ENVIROMENT.MYSQL_PASSWORD,
    database: ENVIROMENT.MYSQL_DBNAME,
    //connectionLimit: 5
})

const promisePool = pool.promise() //configuramos que las consultas sean con async/await para evitar el callback hell   

export default promisePool