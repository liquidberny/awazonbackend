LINKS DE REFERENCIAS:
    https://mongoosejs.com/docs/guide.html
    https://youtu.be/wnfjx65aQTw  ---Mayor fuente de referencia de este proyecto


INFORMACIÓN DE CUENTA:
    La cuenta de gmail usada para crear la cuenta de mongodb es: "awasonochoa@gmail.com", la contraseña es: "awazon2023" (para ambos gmail y mongodb).

INFORMACION DE DATABASE USER:
    El database user para leer y escribir a cualquier base de datos es: "awasonochoa", y la contraseña es "Pxf0LmTa7SJr38wJ".

FAQ:
--->¿Qué tengo que hacer la primera vez que clono el repositorio?
    Abres una terminal en la carpeta del proyecto y ejecutas el comando: "npm install", esto instalara todos los modulos de node que el proyecto necesita (estas dependencias estan en el archvo package.json).
--->¿Cómo corro el proyecto?
    De nuevo, en la terminal abierta en la carpeta del proyecto necesitas ejecutar un comando: "npm start", esto dispara nodemon y ejecuta el archivo "server.js".
--->¿Qué hago si surge una duda nueva a cerca del este repo?
    Preguntale a cualquiera del equipo que te pueda responder o busca la respuesta en internet, cuando la tengas, haz el favor de anotarla en este apartado de FAQ.

DESARROLLO DEL PROYECTO:
    03/03/2023 
        11:23 Berny: Hice el "esqueleto" de este repositorio, escribí informacion en este readme y le voy a dar acceso a todos en cuanto suba esta madre al gitlab.
        11:44: "Añadi MONGODB_URI= mongodb+srv://awasonochoa:Pxf0LmTa7SJr38wJ@awasoncluster.zee8ncw.mongodb.net/awasonochoa?retryWrites=true&w=majority en el archivo ".env" y agrege codigo para ejecutar el servidor.
    03/03/2023
        2:02 Daniel: Cree la carpeta models y tambien cree el archivo Users.js
        2:22 Daniel: Coloque el codigo del archivo Users,js y tambien hice npm install para tener los paquetes faltantes
    04/03/2023
        12:35 Jesús: Se creo la carpeta api y se creo el archivo User.js
        12:35 Jesús: Se coloco el codigo correspondiente en el archivo User.js y se importo en el archivo server.js
    04/03/2023
        1:38 pm Angel: Se creo el endpoint para editar usuario en api/User.js.
    04/03/2023
        11:03PM Berny: Cree el endpoint para crear dar de alta usuario y corregí la ubicacion de la importacion de un modulo, a parte hacia falta la linea de body parser en el server.js.
    06/03/2023
        9:37AM Jose: Ya quedo el endpoint para borrar el user usando la id del usuario. 
    06/03/2023
        11:22 Am Berny: Ya se puede autenticar credenciales desde el endpoint /signin.