AUTORIZATIOM_TOKEN: es como un dni con informacion del usuario, emitido en este caso por nosotros, Tiene informacion de sesion.

-Rutas protegidas: SOn las rutas para que un usuario pueda pasar a ese lugar tiene que estar autentificado.
Para eso notros hacemos una funcion middleware, que va a tomar el token y verifica que sea valido.

----------
AUTOTIFICACION DE BARREA:

Cuando mandamos el token de verificacion en el postman mediante los headers, debemos indicar que tipo de estrategia vamos a usar: se hace asi

Bearer (espacio) y el token  

A nuestro backend llega un string 


TENEMOS QUE LOGUARNOS, NOS DA UN TOKEN, VAMOS Y LO PEGAMOS EN LA CONSULTA, ASI CADA VEZ QUE QUIERA HACER UNA CONSULTA YA QUE EL TOKEN SE ACTUALIZA