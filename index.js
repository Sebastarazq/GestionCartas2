import express  from "express";
import appRoutes from './routes/appRoutes.js'
import connect from './config/db.js'
import cookieParser from 'cookie-parser';

//Crear la app

const app = express();

app.use(cookieParser()); // Usar cookie-parser para analizar las cookies


// Habilitar pug
app.set('view engine','pug') //usar pug
app.set('views','./views') // aca estaran los archivos

// Carpeta publica
app.use(express.static('public'))


app.use(express.urlencoded({ extended: true }));


//Routing
app.use('/', appRoutes)

//Definir un puerto y arrancar el proyecto
const port = 3000;
app.listen(port, () =>{
    console.log(`El servidor esta funcionando en http://localhost:${port}`)
});
 //conexion db
connect()