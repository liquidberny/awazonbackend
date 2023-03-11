<b>LINKS DE REFERENCIAS:</b>
<p><a href="https://mongoosejs.com/docs/guide.html">https://mongoosejs.com/docs/guide.html</a></p>
<p><a href="https://youtu.be/wnfjx65aQTw">https://youtu.be/wnfjx65aQTw</a> &ensp;--->Mayor fuente de referencia de este proyecto</p>

<b>INFORMACIÓN DE CUENTA:</b>
<p>La cuenta de gmail usada para crear la cuenta de mongodb es: <b>"awasonochoa@gmail.com"</b>, la contraseña es: <b>"awason2023"</b> (para ambos gmail y mongodb).</p>

<b>INFORMACION DE DATABASE USER:</b>
El database user para leer y escribir a cualquier base de datos es: <b>"awasonochoa"</b>, y la contraseña es <b>"Pxf0LmTa7SJr38wJ"</b>.

<b>FAQ:</b></br>
---><b>¿Qué tengo que hacer la primera vez que clono el repositorio?</b></br>
    <p>Abres una terminal en la carpeta del proyecto y ejecutas el comando: "npm install", esto instalara todos los modulos de node que el proyecto necesita (estas dependencias estan en el archvo package.json).</p>
---><b>¿Cómo corro el proyecto?</b>
    <p>De nuevo, en la terminal abierta en la carpeta del proyecto necesitas ejecutar un comando: "npm start", esto dispara nodemon y ejecuta el archivo "server.js".</p>
---><b>¿Qué hago si surge una duda nueva a cerca del este repo?</b>
    <p>Preguntale a cualquiera del equipo que te pueda responder o busca la respuesta en internet, cuando la tengas, haz el favor de anotarla en este apartado de FAQ.</p>

<b>DESARROLLO DEL PROYECTO:</b>
    <p><i><b>03/03/2023</i></p></b> 
        &emsp;<b>11:23 Berny:</b> Hice el "esqueleto" de este repositorio, escribí informacion en este readme y le voy a dar acceso a todos en cuanto suba esta madre al gitlab.</br>
        &emsp;<b>11:44:</b>"Añadi MONGODB_URI= mongodb+srv://awasonochoa:Pxf0LmTa7SJr38wJ@awasoncluster.zee8ncw.mongodb.net/awasonochoa?retryWrites=true&w=majority en el archivo ".env" y agrege codigo para ejecutar el servidor.</p>
    <p><i><b>03/03/2023</i></p></b>
        &emsp;<b>2:02 Daniel:</b> Cree la carpeta models y tambien cree el archivo Users.js</br>
        &emsp;<b>2:22 Daniel:</b> Coloque el codigo del archivo Users,js y tambien hice npm install para tener los paquetes faltantes</p>
    <p><i><b>04/03/2023</i></p></b>
        &emsp;<b>12:35 Jesús:</b> Se creo la carpeta api y se creo el archivo User.js</br>
        &emsp;<b>12:35 Jesús:</b> Se coloco el codigo correspondiente en el archivo User.js y se importo en el archivo server.js</p>
    <p><i><b>04/03/2023</i></p></b>
         &emsp;<b>1:38 pm Angel:</b> Se creo el endpoint para editar usuario en api/User.js.</p>
    <p><i><b>04/03/2023</i></p></b>
        &emsp;<b>11:03PM Berny:</b> Cree el endpoint para crear dar de alta usuario y corregí la ubicacion de la importacion de un modulo, a parte hacia falta la linea de body parser en el server.js.</p>
    <p><i><b>06/03/2023</p></i></b>
        &emsp;<b>9:37AM Jose:</b> Ya quedo el endpoint para borrar el user usando la id del usuario.</p> 
    <p><i><b>06/03/2023</p></i></b>
        &emsp;<b>11:22 Am Berny:</b> Ya se puede autenticar credenciales desde el endpoint /signin.</p>
    <p><i><b>07/03/2023</p></i></b>
        &emsp;<b>11:20 Berny:</b> Cree unos modelos Carrier y Cliente, heredando los atributos de user. Toca crear los endpoints  de carrier y client respectivamente.</br>
        &emsp;<b>11:25 Jesús:</b> Cambio del nombre de las variables a como aparecen en el diagrama de clase (nombre, apellidos, email, contrasena) en todos los archivos donde aparecen estas variables.</br>
         &emsp;<b>1:15 Daniel:</b> Agregue el codigo para hacer el endpoint edit horario</br>
         &emsp;<b>1:44 Daniel:</b> Modifique el modelo del Cliente.js para Horario</br>
         &emsp;<b>2:00 Daniel:</b> Agregue las lineas de codigo "const ClientRouter = require("./api/Client")" y "app.use("/client", ClientRouter);" en server.js</br>
         &emsp;<b>2:14 Angel:</b> Cree un metodo para registrar un nuevo Carrier en api/Carrier.js basado en el metodo que se encuentra en api/User.js</br>
         &emsp;<b>2:41 Angel:</b> Cree un metodo para registrar un nuevo Client en api/Client.js basado en el metodo que se encuentra en api/User.js</br>
         &emsp;<b>4:11 pm Jesús:</b> Agregue el get para el cliente y carrier, tambien poder buscarlo mediante el id que tenga.</br>
         &emsp;<b>4:06 Daniel:</b> Agregue el codigo del endpoint edit vehiculo</br> 
         &emsp;<b>5:02 Berny:</b> Copie y pegue el codigo para actualizar la informacion basica de usuarios, falta un endpoint para editar el address especificamente</br>
         &emsp;<b>7:45 pm Berny:</b> Inspirado en el coódigo del enpoint para editar vehiculo y horario realice el codigo para editar la direccion de cliente.</p>
        <p><i><b>08/03/2023</p></i></b>
        &emsp;<b>1:45 pm Angel:</b> Cree el metodo de editar el estado del Carrier (isActive) en api/Carrier.js</br>
        &emsp;<b>2:55 pm Jesús:</b> Obtuve los carriers que nada mas estan activos.
    <p><i><b>10/03/2023</b></i></p>
        &emsp;<b>7:54 pm Angel:</b> Modificado el metodo de editar carrier en api/Carriers.js
                        Antes: router.put("/update"...)...
                        Ahora: router.put("/update/:id"...)...
        &emsp;<b>7:56 pm Angel:</b> Agregado en el metodo de editar carrier una condicional para evitar campos vacios
        &emsp;<b>8:00 pm Angel:</b> Modificado el metodo de editar cliente en api/Client.js</br>
                        <b>Antes:</b> router.put("/update"...)...</br>
                        <b>Ahora:</b> router.put("/update/:id"...)...</br>
        &emsp;<b>8:02 pm Angel:</b> Agregado en el metodo de editar carrier una condicional para evitar campos vacios</br>
        &emsp;<b>9:18 pm Angel:</b> Arregle algunos errores al momento de hacer el update que implicaban objetos como vehiculo (carrier), horario (cliente) y direccion (cliente).
        9:20 pm Angel: Actualizado los datos que muestran cuando responde un endpoint en api/Carrier.js y api/Client.js