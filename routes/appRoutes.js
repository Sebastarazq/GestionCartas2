import express from "express";
import multerMiddleware from "../middlewares/multer.js"; // Importa el middleware Multer
import { jwttoken } from "../middlewares/token.js"; //importo el token
import { inicio,mostrarFormularioInicioSesion,autenticarUsuario,mostrarHeroes,mostrarArmaduras,mostrarEpicas,mostrarFormularioCreacionArma, crearArma,
mostrarArmas,mostrarFormularioActualizacionArma,mostrarFormularioCreacionEpica,crearEpica,mostrarFormularioActualizacionEpica,actualizarEpica,actualizarArma,
cambiarEstadoArma,crearHeroe, mostrarFormularioCreacion , mostrarFormularioActualizacion,actualizarCarta,cambiarEstadoEpica,
cambiarEstadoHeroe, mostrarFormularioCreacionArmadura, crearArmadura, mostrarFormularioActualizacionArmadura, actualizarArmadura, 
cambiarEstadoArmadura, mostrarItems, mostrarFormularioCreacionItem, crearItem, mostrarFormularioActualizacionItem, actualizarItem, cambiarEstadoItem,
} from "../controllers/appController.js";

const router = express.Router()

//Ruta Principal
router.get('/',jwttoken, inicio)

// Ruta para mostrar el formulario de inicio de sesión
router.get('/auth/iniciosesion', mostrarFormularioInicioSesion);

// Ruta POST para procesar la autenticación
router.post('/auth/iniciosesion', autenticarUsuario);

// Mostrar Heroes
router.get('/admin/heroes',jwttoken,mostrarHeroes);

// Ruta para mostrar el formulario de creación de carta y enviarlo
router.get('/admin/crearcarta', jwttoken,mostrarFormularioCreacion);
router.post('/admin/crearcarta',jwttoken, multerMiddleware.single('imagen'), crearHeroe); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de actualizar carta y enviarlo
router.get('/admin/actualizarcarta/:Id',jwttoken, mostrarFormularioActualizacion);
router.patch('/admin/actualizarcarta/:Id',jwttoken,multerMiddleware.single('imagen'), actualizarCarta);

// Ruta para cambiar el estado del héroe
router.put('/admin/cambiarestadoheroe/:Id',jwttoken, cambiarEstadoHeroe);


// Mostrar Armaduras
router.get('/admin/armaduras',jwttoken, mostrarArmaduras);

// Ruta para mostrar el formulario de armadura de carta y enviarlo
router.get('/admin/creararmadura',jwttoken, mostrarFormularioCreacionArmadura);
router.post('/admin/creararmadura',jwttoken, multerMiddleware.single('urlImagen'), crearArmadura); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de actualizar armadura y enviarlo
router.get('/admin/actualizararmadura/:Id',jwttoken, mostrarFormularioActualizacionArmadura);
router.post('/admin/actualizararmadura/:Id',jwttoken,multerMiddleware.single('urlImagen'), actualizarArmadura);

// Ruta para cambiar el estado de la armadura
router.put('/admin/cambiarestadoarmadura/:Id',jwttoken, cambiarEstadoArmadura);

// Mostrar armas
router.get('/admin/armas',jwttoken,mostrarArmas);

// Ruta para mostrar el formulario de arma de carta y enviarlo
router.get('/admin/creararma',jwttoken, mostrarFormularioCreacionArma);
router.post('/admin/creararma',jwttoken, multerMiddleware.single('urlImagen'), crearArma); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de actualizar arma y enviarlo
router.get('/admin/actualizararma/:Id',jwttoken, mostrarFormularioActualizacionArma);
router.post('/admin/actualizararma/:Id', jwttoken, multerMiddleware.single('urlImagen'), actualizarArma);

// Ruta para cambiar el estado de la arma
router.put('/admin/cambiarestadoarma/:Id',jwttoken, cambiarEstadoArma);

// Mostrar items
router.get('/admin/items',jwttoken, mostrarItems);

// Ruta para mostrar el formulario de armadura de carta y enviarlo
router.get('/admin/crearitem',jwttoken, mostrarFormularioCreacionItem);
router.post('/admin/crearitem',jwttoken, multerMiddleware.single('urlImagen'), crearItem); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de actualizar Items y enviarlo
router.get('/admin/actualizaritem/:Id',jwttoken, mostrarFormularioActualizacionItem);
router.post('/admin/actualizaritem/:Id',jwttoken, multerMiddleware.single('urlImagen'), actualizarItem);

// Ruta para cambiar el estado de la Items
router.put('/admin/cambiarestadoitem/:Id',jwttoken, cambiarEstadoItem);

// Mostrar Epicas
router.get('/admin/epicas',jwttoken, mostrarEpicas);

// Ruta para mostrar el formulario de epica de carta y enviarlo
router.get('/admin/crearepica',jwttoken, mostrarFormularioCreacionEpica);
router.post('/admin/crearepica',jwttoken, multerMiddleware.single('urlImagen'), crearEpica); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de epica de carta y enviarlo
router.get('/admin/actualizarepica/:Id',jwttoken, mostrarFormularioActualizacionEpica);
router.post('/admin/actualizarepica/:Id',jwttoken, multerMiddleware.single('urlImagen'), actualizarEpica); // Utiliza el middleware Multer

// Ruta para cambiar el estado de la epica
router.put('/admin/cambiarestadoepica/:Id',jwttoken, cambiarEstadoEpica);




export default router;