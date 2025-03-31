import ENVIROMENT from "../config/enviroment.config.js";
import { ServerError } from "../utils/errors.utils.js";
import jwt from 'jsonwebtoken'

const authMiddleware = (request, response, next) =>{ // funcion next, nos permite ir al sigueinte punto, si verifico que el token es valido, nos pasa al siguiente punto
    try{
        const authorizacion_header = request.headers['authorization'] // obtenemos el token del header, el nombre que esta entre comillas debe ser el mismo que esta en postamn
        if(!authorizacion_header){ // si no hay token
            throw new ServerError('No hay token(header)', 401)
        }
        const authorization_token = authorizacion_header.split(' ')[1] //l token viene en un string separado por espacios, por lo tanto lo vamos a dividir en un array
         // obtenemos el token [1]

        if(!authorization_token){ // si no hay token
            throw new ServerError('No hay token', 401)
        }
        try{
            const user_info = jwt.verify(authorization_token, ENVIROMENT.SECRET_KEY_JWT) // verificamos que el token sea valido
            request.user = user_info // le pasamos la informacion del usuario al request, luego accedemos en el authController a la propiedad user

        next()
        }
        catch(error){
            throw new ServerError('Token no valido', 400)
        }
        
        


    }
    catch(error){
        console.log("error middleware", error);

        if (error.status) {
            return response.send({
                ok: false,
                status: error.status,
                message: error.message
            });
        }

        response.send({
            status: 500,
            ok: false,
            message: "internal server error"
        });

    }

    
}

export default authMiddleware