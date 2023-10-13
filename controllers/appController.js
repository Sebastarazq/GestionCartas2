import { obtenerHeroesApi,crearHeroeEnAPI,actualizarCartaEnAPI } from '../models/Heroe.js';
import { obtenerArmadurasApi,crearArmaduraEnAPI,actualizarArmaduraEnAPI,cambiarEstadoArmaduraEnModelo } from '../models/Armadura.js'
import ArmaModel from '../models/Arma.js';
import ItemModel from '../models/Item.js';
import EpicaModel from '../models/Epica.js';
import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import {ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

// Definir un usuario y contraseña de administrador
const usuarioAdmin = 'admin';
const contrasenaAdmin = 'admin123';

//inicio
const inicio = (req,res) =>{
  res.render('inicio', {
    pagina: 'Inicio'
  });
}

// Controlador para mostrar el formulario de inicio de sesión
const mostrarFormularioInicioSesion = (req, res) => {
  res.render('iniciarsesion', {
    pagina: 'Iniciar Sesion'
  });
};

// Controlador para autenticar al usuario
const autenticarUsuario = (req, res) => {
  // Obtiene el usuario y contraseña del cuerpo de la solicitud
  const { usuario, contrasena } = req.body;

  // Verifica si los campos están vacíos
  if (!usuario || !contrasena) {
    // Los campos están vacíos, asigna un mensaje de error
    const error = 'Por favor, completa todos los campos.';
    return res.render('iniciarsesion', {
      pagina: 'Iniciar Sesion',
      error: error, // Pasa el mensaje de error a la vista
    });
  }

  // Verificar si las credenciales coinciden con el usuario y contraseña de administrador
  if (usuario === usuarioAdmin && contrasena === contrasenaAdmin) {
    // Las credenciales son válidas, genera un token JWT
    const token = jwt.sign({ usuario: usuarioAdmin }, 'gestioncartasnexubattle2omega', {
      expiresIn: '1h', // Establece la duración del token como desees
    });

    // Asigna el token JWT a las cookies
    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 3600000, // Duración del token en milisegundos (1 hora en este ejemplo)
      secure: false, // Cambia a true si usa HTTPS
    });

    // Redirige al usuario a la página protegida
    res.redirect('/');
  } else {
    // Las credenciales son inválidas, muestra un mensaje de error o redirige a la página de inicio de sesión nuevamente
    const error = 'Credenciales inválidas';
    res.render('iniciarsesion', {
      pagina: 'Iniciar Sesion',
      error: error, // Pasa el mensaje de error a la vista
    });
  }
};



const mostrarHeroes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const ITEMS_PER_PAGE = 3;

    // Obtener los héroes desde el API utilizando la función del modelo
    const allHeroes = await obtenerHeroesApi();

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentHeroes = allHeroes.slice(startIndex, endIndex);

    const totalHeroes = allHeroes.length;
    const totalPages = Math.ceil(totalHeroes / ITEMS_PER_PAGE);

    res.render('heroes2', {
      pagina: 'Gestion cartas',
      heroes: currentHeroes,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



const mostrarArmaduras = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const ITEMS_PER_PAGE = 3;

    // Obtener las armaduras desde el API utilizando la función del modelo
    const allArmaduras = await obtenerArmadurasApi(); // Pasa el número de página como argumento

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentArmaduras = allArmaduras.slice(startIndex, endIndex);

    const totalArmaduras = allArmaduras.length;
    const totalPages = Math.ceil(totalArmaduras / ITEMS_PER_PAGE);

    res.render('armaduras', {
      pagina: 'Gestión de Armaduras',
      armaduras: currentArmaduras,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const mostrarArmas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Obtén el número de página de la consulta
    const ITEMS_PER_PAGE = 3; // Define la cantidad de armas por página

    // Realiza una solicitud al API para obtener todas las armas
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/?size=1000&page=1&coleccion=Armas&onlyActives=false`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const data = await response.json();
    const allArmas = data;

    // Divide las armas en páginas en el servidor
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentArmas = allArmas.slice(startIndex, endIndex);

    // Calcula el número total de páginas en función de la cantidad total de armas
    const totalArmas = allArmas.length;
    const totalPages = Math.ceil(totalArmas / ITEMS_PER_PAGE);

    res.render('armas', {
      pagina: 'Gestión de Armas',
      armas: currentArmas,
      currentPage: page,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const mostrarItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Obtén el número de página de la consulta
    const ITEMS_PER_PAGE = 3; // Define la cantidad de items por página

    // Realiza una solicitud al API para obtener todas las armas
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/?size=1000&page=1&coleccion=Items&onlyActives=false`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const data = await response.json();
    const allItems = data;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = allItems.slice(startIndex, endIndex);

    // Calcula el número total de páginas en función de la cantidad total de armas
    const totalItems = allItems.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    res.render('items', {
      pagina: 'Gestión de Items',
      items: currentItems, // Pasa los datos de la página actual a la vista
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const mostrarEpicas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Obtén el número de página de la consulta
    const ITEMS_PER_PAGE = 3; // Define la cantidad de cartas épicas por página

    // Realiza una solicitud al API para obtener todas las cartas épicas
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/?size=1000&page=1&coleccion=Epicas&onlyActives=false`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const data = await response.json();
    const allEpicas = data;

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentEpicas = allEpicas.slice(startIndex, endIndex);

    // Calcula el número total de páginas en función de la cantidad total de cartas épicas
    const totalEpicas = allEpicas.length;
    const totalPages = Math.ceil(totalEpicas / ITEMS_PER_PAGE);

    res.render('epicas', {
      pagina: 'Gestion cartas épicas',
      epicas: currentEpicas, // Pasa los datos de la página actual a la vista
      currentPage: page,
      totalPages: totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const mostrarFormularioCreacionEpica = (req, res) => {
  res.render('crearepica', {
    pagina: 'Crear Épica',
  });
};

const crearEpica = async (req, res) => {
  try {
    // Obtén los datos del formulario
    const formData = req.body;
    const file = req.file; // El archivo subido

    // Construye la URL de la imagen
    const urlImagen = `https://store.thenexusbattles2.cloud/imgcards/img/${file.filename}`;

    console.log('formData:', formData);

    // Crea una nueva carta épica utilizando el modelo
    const nuevaEpica = new EpicaModel({
      urlImagen,
      heroe: formData.heroe,
      nombre: formData.nombre,
      efectoGlobal: {
        case: formData['efectoGlobal.case'],
        statEffect: formData['efectoGlobal.statEffect'],
        stat: formData['efectoGlobal.stat'],
        target: formData['efectoGlobal.target'],
        turnCount: formData['efectoGlobal.turnCount'],
      },
      efectoHeroe: {
        case: formData['efectoHeroe.case'],
        statEffect: formData['efectoHeroe.statEffect'],
        stat: formData['efectoHeroe.stat'],
        target: formData['efectoHeroe.target'],
        turnCount: formData['efectoHeroe.turnCount'],
      },
      activo: formData.activo === 'true',
      desc: formData.desc,
    });

    console.log('Épica creada:', nuevaEpica);

    // Guarda la nueva carta épica en la base de datos
    await nuevaEpica.save();

    // Redirige al usuario a otra página o muestra un mensaje de éxito
    res.send('<script>alert("Épica creada exitosamente!"); window.location.href = "/admin/epicas";</script>');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la Épica' });
  }
};

const mostrarFormularioActualizacionEpica = async (req, res) => {
  try {
    const idEpica = req.params.Id; // Obtener el valor del parámetro :id

    console.log('ID de la épica a actualizar:', idEpica); // Agregar este registro para verificar el ID

    const epica = await EpicaModel.findById(idEpica); // Obtener una épica por su ID

    console.log('Épica encontrada:', epica); // Agregar este registro para verificar la épica

    if (!epica) {
      // Si no se encontró la épica, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Épica no encontrada' });
    }

    res.render('actualizarepica', {
      pagina: 'Actualizar Épica',
      epica: epica, // Enviar la épica específica a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};


const actualizarEpica = async (req, res) => {
  try {
    const idEpica = req.params.Id; // Obtener el valor del parámetro :id
    const formData = req.body; // Obtener los datos del formulario

    // Obtener la URL de la imagen existente (por defecto)
    let urlImagen = formData.urlImagen;

    // Si se proporciona una nueva imagen, guarda la URL de la nueva imagen
    if (req.file) {
      // Construye la URL de la imagen actualizada
      const baseUrl = 'https://store.thenexusbattles2.cloud/imgcards'; // Cambia esto según la configuración de tu servidor
      urlImagen = `${baseUrl}/img/${req.file.filename}`;
    }

    // Construye un objeto con los datos actualizados
    const updatedData = {
      urlImagen,
      heroe: formData.heroe,
      nombre: formData.nombre,
      efectoGlobal: {
        case: formData['efectoGlobal.case'],
        statEffect: formData['efectoGlobal.statEffect'],
        stat: formData['efectoGlobal.stat'],
        target: formData['efectoGlobal.target'],
        turnCount: formData['efectoGlobal.turnCount'],
      },
      efectoHeroe: {
        case: formData['efectoHeroe.case'],
        statEffect: formData['efectoHeroe.statEffect'],
        stat: formData['efectoHeroe.stat'],
        target: formData['efectoHeroe.target'],
        turnCount: formData['efectoHeroe.turnCount'],
      },
      activo: formData.activo === 'true',
      desc: formData.desc,
    };

    // Actualiza los datos de la épica en la base de datos
    await EpicaModel.findByIdAndUpdate(idEpica, updatedData);

    console.log('Épica actualizada con éxito.');

    // Agregar un script de alert después de la redirección
    res.send('<script>alert("Épica actualizada con éxito."); window.location.href = "/admin/epicas/";</script>');
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderiza una vista de error en caso de problemas
  }
};

const cambiarEstadoEpica = async (req, res) => {
  try {
    const epicaId = req.params.Id; // Obtener el ID de la épica de los parámetros
    console.log('ID de la épica:', epicaId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    // Crear un objeto FormData y agregar los datos a él
    const formData = new FormData();
    formData.append('id', epicaId); // Agregar el ID al FormData
    formData.append('estado', nuevoEstado); // Agregar el estado al FormData

    console.log('Datos en FormData:', formData);

    // Construir la URL de la API externa de acuerdo a tu configuración
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/consumible/`; // Ajusta la URL según tus necesidades

    console.log('URL de la API externa:', apiUrl);

    // Realizar la solicitud PATCH a la API externa para cambiar el estado de la épica
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: formData,
    });

    console.log('Respuesta del fetch:', response);

    if (response.ok) {
      // Cambio de estado exitoso en la API externa
      return res.status(200).json({ message: 'Estado de la épica actualizado exitosamente en la API externa' });
    } else {
      // Error en el cambio de estado en la API externa
      return res.status(500).json({ error: 'Error al cambiar el estado de la épica en la API externa' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado de la épica' });
  }
};

const mostrarFormularioCreacionArma = (req, res) => {
  res.render('creararma', {
    pagina: 'Crear Arma',
  });
};

const crearArma = async (req, res) => {
  try {
    // Obtén los datos del formulario
    const formData = req.body;
    const file = req.file; // El archivo subido

    // Construye la URL de la imagen
    const urlImagen = `https://store.thenexusbattles2.cloud/imgcards/img/${file.filename}`;

    console.log('formData:', formData);
    console.log('formData.efecto:', formData.efecto);

    // Crea una nueva arma utilizando el modelo
    const newArma = new ArmaModel({
      urlImagen,
      nombre: formData.nombre,
      tipoHeroe: formData.tipoHeroe,
      efecto: {
        case: formData['efecto.case'],
        statEffect: formData['efecto.statEffect'],
        stat: formData['efecto.stat'],
        target: formData['efecto.target'],
        turnCount: formData['efecto.turnCount'],
      },
      activo: formData.activo === 'true',
      desc: formData.desc,
    });
    
    console.log('Arma creada:', newArma);
    // Guarda la nueva arma en la base de datos
    await newArma.save();

    // Redirige al usuario a otra página o muestra un mensaje de éxito
    res.send('<script>alert("Arma creada exitosamente!"); window.location.href = "/admin/armas";</script>');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el Arma' });
  }
};

const mostrarFormularioActualizacionArma = async (req, res) => {
  try {
    const idArma = req.params.Id; // Obtener el valor del parámetro :id

    console.log('ID del arma a actualizar:', idArma); // Agregar este registro para verificar el ID

    const arma = await ArmaModel.findById(idArma); // Obtener un arma por su ID

    console.log('Arma encontrada:', arma); // Agregar este registro para verificar el arma

    if (!arma) {
      // Si no se encontró el arma, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Arma no encontrada' });
    }

    res.render('actualizararma', {
      pagina: 'Actualizar Arma',
      arma: arma, // Enviar el arma específico a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};
const actualizarArma = async (req, res) => {
  try {
    const idArma = req.params.Id; // Obtener el valor del parámetro :id
    const formData = req.body; // Obtener los datos del formulario

    // Obtener la URL de la imagen existente (por defecto)
    let urlImagen = formData.urlImagen;

    // Si se proporciona una nueva imagen, guarda la URL de la nueva imagen
    if (req.file) {
      // Construye la URL de la imagen actualizada
      const baseUrl = 'https://store.thenexusbattles2.cloud/imgcards'; // Cambia esto según la configuración de tu servidor
      urlImagen = `${baseUrl}/img/${req.file.filename}`;
    }

    // Construye un objeto con los datos actualizados
    const updatedData = {
      urlImagen,
      nombre: formData.nombre,
      tipoHeroe: formData.tipoHeroe,
      efecto: {
        case: formData['efecto.case'],
        statEffect: formData['efecto.statEffect'],
        stat: formData['efecto.stat'],
        target: formData['efecto.target'],
        turnCount: formData['efecto.turnCount'],
      },
      activo: formData.activo === 'true',
      desc: formData.desc,
    };

    // Actualiza los datos del arma en la base de datos
    await ArmaModel.findByIdAndUpdate(idArma, updatedData);

    console.log('Arma actualizada con éxito.');

    // Agregar un script de alert después de la redirección
    res.send('<script>alert("Arma actualizada con éxito."); window.location.href = "/admin/armas/";</script>');
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderiza una vista de error en caso de problemas
  }
};

const cambiarEstadoArma = async (req, res) => {
  try {
    const armaId = req.params.Id; // Obtener el ID del arma de los parámetros
    console.log('ID del arma:', armaId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    // Crear un objeto FormData y agregar los datos a él
    const formData = new FormData();
    formData.append('id', armaId); // Agregar el ID al FormData
    formData.append('estado', nuevoEstado); // Agregar el estado al FormData

    console.log('Datos en FormData:', formData);

    // Construir la URL de la API externa
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/consumible/`;

    console.log('URL de la API externa:', apiUrl);

    // Realizar la solicitud PATCH a la API externa para cambiar el estado del arma
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: formData,
    });

    console.log('Respuesta del fetch:', response);

    if (response.ok) {
      // Cambio de estado exitoso en la API externa
      return res.status(200).json({ message: 'Estado del arma actualizado exitosamente en la API externa' });
    } else {
      // Error en el cambio de estado en la API externa
      return res.status(500).json({ error: 'Error al cambiar el estado del arma en la API externa' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado del arma' });
  }
};



const mostrarFormularioCreacion = (req, res) => {
    res.render('crearcarta2', {
      pagina: 'Crear Carta'
    });
};

const crearHeroe = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file;

    console.log('formData:',formData);
    console.log('file:',file)

    const response = await crearHeroeEnAPI(formData, file);

    if (response.ok) {
      // La solicitud fue exitosa (código de estado HTTP 2xx), redirigir al usuario a la vista "anuncioheroe"
      return res.render('anuncioheroe', { cartaCreada: true });
    } else {
      // Hubo un error en la creación del héroe
      return res.render('anuncioheroe', { cartaCreada: false, errorMessage: 'Error al crear el héroe' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el héroe' });
  }
};



// Controlador para mostrar el formulario de actualización de un héroe
const mostrarFormularioActualizacion = async (req, res) => {
  try {
    const idHero = req.params.Id; // Obtener el valor del parámetro :Id
    console.log(idHero)

    // Realizar una solicitud al API para obtener los datos del héroe específico por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idHero}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const heroData = await response.json();

    if (!heroData) {
      // Si no se encontró el héroe, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Héroe no encontrado' });
    }

    // Pasar los datos del héroe a la vista
    res.render('actualizarcarta', {
      pagina: 'Actualizar Carta',
      hero: heroData, // Enviar los datos del héroe a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};


// Controlador para actualizar una carta en el API
const actualizarCarta = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file; // Obtener el archivo del formulario
    console.log('file:',file)
    console.log('formData:',formData)

    // Llama a la función del modelo para actualizar la carta en el API
    const response = await actualizarCartaEnAPI(formData, file);

    if (response.ok) {
      // Actualización exitosa
      console.log('Carta actualizada con éxito.');
      return res.render('anuncioheroea', { cartaActualizada: true });
    } else {
      // Error en la actualización
      console.error('Error al actualizar la carta.');
      return res.render('anuncioheroea', { cartaActualizada: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la carta' });
  }
};


const cambiarEstadoHeroe = async (req, res) => {
  try {
    const heroId = req.params.Id; // Obtener el ID del héroe de los parámetros
    console.log('ID del héroe:', heroId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    // Crear un objeto FormData y agregar los datos a él
    const formData = new FormData();
    formData.append('id', heroId); // Agregar el ID al FormData
    formData.append('estado', nuevoEstado); // Agregar el estado al FormData

    console.log('Datos en FormData:', formData);

    // Construir la URL de la API externa de acuerdo a tu configuración
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/heroes/`;

    console.log('URL de la API externa:', apiUrl);

    // Realizar la solicitud PATCH a la API externa para cambiar el estado del héroe
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: formData,
    });

    console.log('Respuesta del fetch:', response);

    if (response.ok) {
      // Cambio de estado exitoso en la API externa
      return res.status(200).json({ message: 'Estado del héroe actualizado exitosamente en la API externa' });
    } else {
      // Error en el cambio de estado en la API externa
      return res.status(500).json({ error: 'Error al cambiar el estado del héroe en la API externa' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado del héroe' });
  }
};


//mostrar formulario creción de armaduras
const mostrarFormularioCreacionArmadura = (req, res) => {
  res.render('creararmadura', {
    pagina: 'Crear armaduras'
  });
};

const crearArmadura = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file;

    const response = await crearArmaduraEnAPI(formData, file);

    if (response.ok) {
      const tituloExitoso = 'Creación de Armadura';
      const mensajeExitoso = 'Creada correctamente.';
      return res.render('anuncioarmadura', { armaduraCreada: true, tituloExitoso, mensajeExitoso });
    } else {
      // Hubo un error en la creación de la armadura
      const mensajeError = 'Error al crear la armadura';
      return res.render('anuncioarmadura', { armaduraCreada: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioarmadura' con un mensaje de error
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioarmadura', { armaduraCreada: false, errorMessage: mensajeError });
  }
};



const mostrarFormularioActualizacionArmadura = async (req, res) => {
  try {
    const idArmadura = req.params.Id; // Obtener el valor del parámetro :Id

    // Realizar una solicitud al API para obtener los datos de la armadura específica por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idArmadura}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const armaduraData = await response.json();

    if (!armaduraData) {
      // Si no se encontró la armadura, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Armadura no encontrada' });
    }

    // Pasar los datos de la armadura al formulario de actualización
    res.render('actualizararmadura', {
      pagina: 'Actualizar Armadura',
      armadura: armaduraData, // Enviar los datos de la armadura a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};

const actualizarArmadura = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file; // Obtener el archivo del formulario si se proporcionó

    // Llama a la función del modelo para actualizar la armadura en el API
    const response = await actualizarArmaduraEnAPI(formData, file);

    if (response.ok) {
      const tituloExitoso = 'Actualización de Armadura';
      const mensajeExitoso = 'Actualizada correctamente.';
      return res.render('anuncioarmadura', { armaduraCreada: true, tituloExitoso, mensajeExitoso });
    } else {
      // Hubo un error en la actualización de la armadura
      const mensajeError = 'Error al actualizar la armadura';
      return res.render('anuncioarmadura', { armaduraCreada: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioarmadura' con un mensaje de error
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioarmadura', { armaduraCreada: false, errorMessage: mensajeError });
  }
};




// Controlador para cambiar el estado activo de la armadura
const cambiarEstadoArmadura = async (req, res) => {
  try {
    const armaduraId = req.params.Id; // Obtener el ID de la armadura de los parámetros
    console.log('ID de la armadura:', armaduraId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    const cambioExitoso = await cambiarEstadoArmaduraEnModelo(armaduraId, nuevoEstado);

    if (cambioExitoso) {
      return res.status(200).json({ message: 'Estado de la armadura actualizado exitosamente en el modelo' });
    } else {
      return res.status(500).json({ error: 'Error al cambiar el estado de la armadura en el modelo' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado de la armadura' });
  }
};


const mostrarFormularioCreacionItem = (req, res) => {
  res.render('crearitem', {
    pagina: 'Crear Item',
  });
};

const crearItem = async (req, res) => {
  try {
    // Obtén los datos del formulario
    const formData = req.body;
    const file = req.file; // El archivo subido

    // Construye la URL de la imagen
    const urlImagen = `https://store.thenexusbattles2.cloud/imgcards/img/${file.filename}`;

    console.log('formData:', formData);
    console.log('formData.efecto:', formData.efecto);

    // Crea una nueva item utilizando el modelo
    const newItem = new ItemModel({
      urlImagen,
      heroe: formData.heroe,
      nombre: formData.nombre,
      efecto: {
        case: formData['efecto.case'],
        statEffect: formData['efecto.statEffect'],
        stat: [formData['efecto.stat']], // Esto permite una matriz de cadenas
        target: formData['efecto.target'],
        turnCount: formData['efecto.turnCount'],
      },
      activo: formData.activo === 'true',
      desc: formData.desc,
    });
    
    console.log('Arma creada:', newItem);
    // Guarda la nueva arma en la base de datos
    await newItem.save();

    // Redirige al usuario a otra página o muestra un mensaje de éxito
    res.send('<script>alert("Item creada exitosamente!"); window.location.href = "/admin/items";</script>');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el Item' });
  }
};

const mostrarFormularioActualizacionItem = async (req, res) => {
  try {
    const idItem = req.params.Id; // Obtener el valor del parámetro :id

    console.log('ID del item a actualizar:', idItem); // Agregar este registro para verificar el ID

    const item = await ItemModel.findById(idItem); // Obtener un item por su ID

    console.log('Item encontrada:', item); // Agregar este registro para verificar el item

    if (!item) {
      // Si no se encontró el item, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'item no encontrada' });
    }

    res.render('actualizaritem', {
      pagina: 'Actualizar Item',
      item: item, // Enviar el item específico a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};


const actualizarItem = async (req, res) => {
  try {
    const idItem = req.params.Id; // Obtener el valor del parámetro :id
    const formData = req.body; // Obtener los datos del formulario

    let urlImagen = formData.urlImagen;

    // Si se proporciona una nueva imagen, guarda la URL de la nueva imagen
    if (req.file) {
      // Construye la URL de la imagen actualizada
      const baseUrl = 'https://store.thenexusbattles2.cloud/imgcards'; // Cambia esto según la configuración de tu servidor
      urlImagen = `${baseUrl}/img/${req.file.filename}`;
    }

    // Buscar el Item por su ID y actualizarla con los nuevos datos del formulario
    await ItemModel.findByIdAndUpdate(idItem, {
        urlImagen,
        heroe: formData.heroe,
        nombre: formData.nombre,
        efecto: {
          case: formData['efecto.case'],
          statEffect: formData['efecto.statEffect'],
          stat: formData['efecto.stat'], // Esto permite una matriz de cadenas
          target: formData['efecto.target'],
          turnCount: formData['efecto.turnCount'],
        },
        activo: formData.activo === 'true',
        desc: formData.desc,
      });

    console.log('Item actualizada con éxito.');

    // Agregar un script de alert después de la redirección
    res.send('<script>alert("Item actualizada con éxito."); window.location.href = "/admin/items/";</script>');
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderiza una vista de error en caso de problemas
  }
};
const cambiarEstadoItem = async (req, res) => {
  try {
    const itemId = req.params.Id; // Obtener el ID del item de los parámetros
    console.log('ID del item:', itemId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    // Crear un objeto FormData y agregar los datos a él
    const formData = new FormData();
    formData.append('id', itemId); // Agregar el ID al FormData
    formData.append('estado', nuevoEstado); // Agregar el estado al FormData

    console.log('Datos en FormData:', formData);

    // Construir la URL de la API externa de acuerdo a tu configuración
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/consumible/`;

    console.log('URL de la API externa:', apiUrl);

    // Realizar la solicitud PATCH a la API externa para cambiar el estado del item
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: formData,
    });

    console.log('Respuesta del fetch:', response);

    if (response.ok) {
      // Cambio de estado exitoso en la API externa
      return res.status(200).json({ message: 'Estado del item actualizado exitosamente en la API externa' });
    } else {
      // Error en el cambio de estado en la API externa
      return res.status(500).json({ error: 'Error al cambiar el estado del item en la API externa' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado del item' });
  }
};


export {
  inicio,
  mostrarFormularioInicioSesion,
  autenticarUsuario,
  mostrarHeroes,
  mostrarArmaduras,
  mostrarArmas,
  mostrarEpicas,
  mostrarFormularioCreacionEpica,
  crearEpica,
  mostrarFormularioActualizacionEpica,
  actualizarEpica,
  cambiarEstadoEpica,
  mostrarFormularioCreacionArma,
  crearArma,
  mostrarFormularioActualizacionArma,
  actualizarArma,
  cambiarEstadoArma,
  mostrarFormularioCreacion,
  crearHeroe,
  mostrarFormularioActualizacion,
  actualizarCarta,
  cambiarEstadoHeroe,
  mostrarFormularioCreacionArmadura,
  crearArmadura,
  mostrarFormularioActualizacionArmadura,
  actualizarArmadura,
  cambiarEstadoArmadura,
  mostrarItems,
  mostrarFormularioCreacionItem,
  crearItem,
  mostrarFormularioActualizacionItem,
  actualizarItem,
  cambiarEstadoItem,
};
