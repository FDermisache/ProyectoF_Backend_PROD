import dotenv from 'dotenv'

//Carga las variables de entorno en process.env
dotenv.config()

const ENVIROMENT = {
    PORT: process.env.PORT || 3000,
    MONGO_DB_URL: process.env.MONGO_DB_URL,
    SECRET_KEY_JWT: process.env.SECRET_JWT_KEY,
    GMAIL_USERNAME: process.env.GMAIL_USERNAME,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    URL_BACKEND: process.env.URL_BACKEND || 'http://localhost:3000',
    URL_FRONTEND: process.env.URL_FRONTEND ||  'http://localhost:5173',
    MYSQL:{
        DBNAME: process.env.MYSQL_DBNAME,
        USERNAME: process.env.MYSQL_USER,
        PASSWORD: process.env.MYSQL_PASSWORD,
        HOST: process.env.MYSQL_HOST,

    }
}

for(let key in ENVIROMENT){
    if(ENVIROMENT[key] === undefined){
        console.error('OJO que la variable ' + key  +' esta indefinida')
    }
}





export default ENVIROMENT