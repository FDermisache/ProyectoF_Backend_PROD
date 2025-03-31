COMO DESPLEGAR EL BACKEND EN VERCEL:

1. Probar todo el funcionamiento desde postman

2. Copiamos el proyecto(la carpeta) y lo pegamos en otra carpeta aparte
3. vamos  agithub y creamos otro repo
4. copiamos el codigo que nos dan y lo pegamos en la temrinal
5. agregamos en el package.json el siguiente script ("start": "node ./src/server.js",)
6. Creamos un archivo llamado vercel.json y le pegamos el siguiente codigo : {
    "version": 2,
    "builds": [
        {
            "src": "src/server.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/(.*)",
            "dest": "src/server.js"
        }
    ]
}

7. Pusheamos los cambios
8. vamos a vercel 
9. creamos un nuevo projecto
10. vamos a la parte de Build and Ouput 
11. en install COmand ponemos ( npm install)
12. En enviroment copiamos y pegamos el .env MENOS LAS URL serian 5 cosas
13. desplegamos
