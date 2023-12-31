import express from "express";
import multerMiddleware from "../middlewares/multer.js"; // Importa el middleware Multer
import { jwttoken } from "../middlewares/token.js"; //importo el token
import { inicio,mostrarFormularioInicioSesion,autenticarUsuario,mostrarHeroes,mostrarArmaduras,mostrarEpicas,mostrarFormularioCreacionArma, crearArma,
mostrarArmas,mostrarFormularioActualizacionArma,mostrarFormularioCreacionEpica,crearEpica,mostrarFormularioActualizacionEpica,actualizarEpica,actualizarArma,
cambiarEstadoArma,crearHeroe, mostrarFormularioCreacion , mostrarFormularioActualizacion,actualizarCarta,cambiarEstadoEpica,
cambiarEstadoHeroe, mostrarFormularioCreacionArmadura, crearArmadura, mostrarFormularioActualizacionArmadura, actualizarArmadura, 
cambiarEstadoArmadura, mostrarItems, mostrarFormularioCreacionItem, crearItem, mostrarFormularioActualizacionItem, actualizarItem, cambiarEstadoItem,
pasarIdaActualizar,mostrarFormularioActualizacionimg,pasarIdaActualizarArmadura,mostrarFormularioActualizacionimgArmadura,pasarIdaActualizarEpica,
mostrarFormularioActualizacionimgEpica, pasarIdaActualizarArma, mostrarFormularioActualizacionimgArma, pasarIdaActualizarItem, mostrarFormularioActualizacionimgItem} from "../controllers/appController.js";

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
router.get('/admin/actualizar/:Id',jwttoken,pasarIdaActualizar);
router.get('/admin/seleccionactualizararmadura/:Id',jwttoken,pasarIdaActualizarArmadura);
router.get('/admin/seleccionactualizararma/:Id',jwttoken,pasarIdaActualizarArma);
router.get('/admin/seleccionactualizaritem/:Id',jwttoken,pasarIdaActualizarItem);

//---
router.get('/admin/crearcarta', jwttoken,mostrarFormularioCreacion);
router.post('/admin/crearcarta',jwttoken, multerMiddleware.single('imagen'), crearHeroe); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de actualizar carta y enviarlo
router.get('/admin/actualizarcarta/:Id',jwttoken, mostrarFormularioActualizacion);
router.get('/admin/actualizarcartaimg/:Id',jwttoken, mostrarFormularioActualizacionimg);
router.post('/admin/actualizarcarta/:Id',jwttoken,multerMiddleware.single('imagen'), actualizarCarta);
router.post('/admin/actualizarcartaimg/:Id',jwttoken,multerMiddleware.single('imagen'), actualizarCarta);

// Ruta para cambiar el estado del héroe
router.post('/admin/cambiarestadoheroe/:Id',jwttoken, cambiarEstadoHeroe);


// Mostrar Armaduras
router.get('/admin/armaduras',jwttoken, mostrarArmaduras);

// Ruta para mostrar el formulario de armadura de carta y enviarlo
router.get('/admin/creararmadura',jwttoken, mostrarFormularioCreacionArmadura);
router.post('/admin/creararmadura',jwttoken, multerMiddleware.single('imagen'), crearArmadura); // Utiliza el middleware Multer

router.get('/admin/seleccionactualizararmadura/:Id',jwttoken,pasarIdaActualizarArmadura);

// Ruta para mostrar el formulario de actualizar armadura y enviarlo
router.get('/admin/actualizararmaduraimg/:Id',jwttoken, mostrarFormularioActualizacionimgArmadura);
router.get('/admin/actualizararmadura/:Id',jwttoken, mostrarFormularioActualizacionArmadura);
router.post('/admin/actualizararmadura/:Id',jwttoken,multerMiddleware.single('imagen'), actualizarArmadura);
router.post('/admin/actualizararmaduraimg/:Id',jwttoken,multerMiddleware.single('imagen'), actualizarArmadura);

// Ruta para cambiar el estado de la armadura
router.post('/admin/cambiarestadoarmadura/:Id',jwttoken, cambiarEstadoArmadura);

// Mostrar armas
router.get('/admin/armas',jwttoken,mostrarArmas);

// Ruta para mostrar el formulario de arma de carta y enviarlo
router.get('/admin/creararma',jwttoken, mostrarFormularioCreacionArma);
router.post('/admin/creararma',jwttoken, multerMiddleware.single('imagen'), crearArma); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de actualizar arma y enviarlo
router.get('/admin/actualizararma/:Id',jwttoken, mostrarFormularioActualizacionArma);
router.get('/admin/actualizararmaimg/:Id',jwttoken, mostrarFormularioActualizacionimgArma);
router.post('/admin/actualizararma/:Id', jwttoken, multerMiddleware.single('imagen'), actualizarArma);
router.post('/admin/actualizararmaimg/:Id', jwttoken, multerMiddleware.single('imagen'), actualizarArma);

// Ruta para cambiar el estado de la arma
router.post('/admin/cambiarestadoarma/:Id',jwttoken, cambiarEstadoArma);

// Mostrar items
router.get('/admin/items',jwttoken, mostrarItems);

// Ruta para mostrar el formulario de armadura de carta y enviarlo
router.get('/admin/crearitem',jwttoken, mostrarFormularioCreacionItem);
router.post('/admin/crearitem',jwttoken, multerMiddleware.single('imagen'), crearItem); // Utiliza el middleware Multer

// Ruta para mostrar el formulario de actualizar Items y enviarlo
router.get('/admin/actualizaritem/:Id',jwttoken, mostrarFormularioActualizacionItem);
router.get('/admin/actualizaritemimg/:Id',jwttoken, mostrarFormularioActualizacionimgItem);
router.post('/admin/actualizaritem/:Id',jwttoken, multerMiddleware.single('imagen'), actualizarItem);
router.post('/admin/actualizaritemimg/:Id',jwttoken, multerMiddleware.single('imagen'), actualizarItem);

// Ruta para cambiar el estado de la Items
router.post('/admin/cambiarestadoitem/:Id',jwttoken, cambiarEstadoItem);

// Mostrar Epicas
router.get('/admin/epicas',jwttoken, mostrarEpicas);

// Ruta para mostrar el formulario de epica de carta y enviarlo
router.get('/admin/crearepica',jwttoken, mostrarFormularioCreacionEpica);
router.post('/admin/crearepica',jwttoken, multerMiddleware.single('imagen'), crearEpica); // Utiliza el middleware Multer

router.get('/admin/seleccionactualizarepica/:Id',jwttoken,pasarIdaActualizarEpica);


// Ruta para mostrar el formulario de epica de carta y enviarlo
router.get('/admin/actualizarepicaimg/:Id',jwttoken, mostrarFormularioActualizacionimgEpica);
router.get('/admin/actualizarepica/:Id',jwttoken, mostrarFormularioActualizacionEpica);
router.post('/admin/actualizarepica/:Id',jwttoken, multerMiddleware.single('imagen'), actualizarEpica); // Utiliza el middleware Multer
router.post('/admin/actualizarepicaimg/:Id',jwttoken, multerMiddleware.single('imagen'), actualizarEpica); // Utiliza el middleware Multer

// Ruta para cambiar el estado de la epica
router.post('/admin/cambiarestadoepica/:Id',jwttoken, cambiarEstadoEpica);




export default router;