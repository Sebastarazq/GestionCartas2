import { obtenerHeroesApi,crearHeroeEnAPI,actualizarCartaEnAPI } from '../models/Heroe.js';
import { obtenerArmadurasApi,crearArmaduraEnAPI,actualizarArmaduraEnAPI,cambiarEstadoArmaduraEnModelo } from '../models/Armadura.js'
import { obtenerArmasApi,crearArmaEnAPI,actualizarArmaEnAPI,cambiarEstadoArmaEnModelo } from '../models/Arma.js'
import { obtenerItemsApi,crearItemEnAPI,actualizarItemEnAPI,cambiarEstadoItemEnModelo } from '../models/Item.js';
import {obtenerCartasEpicasApi, crearCartaEpicaEnAPI, actualizarEpicaEnAPI,cambiarEstadoEpicaEnModelo} from '../models/Epica.js';
import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import {ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';

// Definir un usuario y contraseña de administrador
const usuarioAdmin = 'cartas';
const contrasenaAdmin = 'Cartas2533@#$';

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

const autenticarUsuario = async (req, res) => {
  // Obtiene el usuario y contraseña del cuerpo de la solicitud
  const { usuario, contrasena } = req.body;
  const data = JSON.stringify({ username: usuario, password: contrasena });
  console.log('Datos del usuario:', data);

  try {
    // Realizar una solicitud al API para autenticar al usuario
    const apiUrl = 'https://webserver.thenexusbattles2.cloud/login-gestion';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    if (response.status === 200) {
      const responseData = await response.json();
      console.log('Respuesta de la API:', responseData);

      if (responseData.admin === true) {
        // Las credenciales son válidas, genera un token JWT
        const token = jwt.sign({ usuario: usuario }, 'gestioncartasnexubattle2omega', {
          expiresIn: '1h', // Establece la duración del token como desees
        });
        console.log('Token JWT generado:', token);

        // Asigna el token JWT a las cookies
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000, // Duración del token en milisegundos (1 hora en este ejemplo)
          secure: false, // Cambia a true si usas HTTPS
        });

        // Redirige al usuario a la página protegida
        res.redirect('/');
      } else {
        // Las credenciales no son válidas para un administrador, muestra un mensaje de error o redirige a la página de inicio de sesión nuevamente
        const error = 'Credenciales no válidas para un administrador';
        console.log('Error:', error);
        res.render('iniciarsesion', {
          pagina: 'Iniciar Sesion',
          error: error,
        });
      }
    } else {
      // La solicitud no fue exitosa, utiliza las credenciales locales
      if (usuario === usuarioAdmin && contrasena === contrasenaAdmin) {
        // Las credenciales son válidas, genera un token JWT
        const token = jwt.sign({ usuario: usuarioAdmin }, 'gestioncartasnexubattle2omega', {
          expiresIn: '1h', // Establece la duración del token como desees
        });
        console.log('Token JWT generado:', token);

        // Asigna el token JWT a las cookies
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000, // Duración del token en milisegundos (1 hora en este ejemplo)
          secure: false, // Cambia a true si usas HTTPS
        });

        // Redirige al usuario a la página protegida
        res.redirect('/');
      } else {
        // Las credenciales locales tampoco son válidas, muestra un mensaje de error o redirige a la página de inicio de sesión nuevamente
        const error = 'Credenciales no válidas';
        console.log('Error:', error);
        res.render('iniciarsesion', {
          pagina: 'Iniciar Sesion',
          error: error,
        });
      }
    }
  } catch (error) {
    // Manejar errores de red u otros errores
    console.error('Error inesperado:', error);
    const errorMessage = 'Error en la autenticación';
    console.log('Error:', errorMessage);
    res.render('iniciarsesion', {
      pagina: 'Iniciar Sesion',
      error: errorMessage,
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

    // Obtener las armaduras desde el API utilizando la función del modelo
    const allArmas = await obtenerArmasApi(); // Pasa el número de página como argumento

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentArmas = allArmas.slice(startIndex, endIndex);

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

    // Obtener las armaduras desde el API utilizando la función del modelo
    const allItems = await obtenerItemsApi(); // Pasa el número de página como argumento

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = allItems.slice(startIndex, endIndex);

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
    const page = parseInt(req.query.page) || 1;
    const ITEMS_PER_PAGE = 3;

    // Obtener las cartas épicas desde el API utilizando la función del modelo
    const allCartasEpicas = await obtenerCartasEpicasApi();

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentCartasEpicas = allCartasEpicas.slice(startIndex, endIndex);

    const totalCartasEpicas = allCartasEpicas.length;
    const totalPages = Math.ceil(totalCartasEpicas / ITEMS_PER_PAGE);

    res.render('epicas', {
      pagina: 'Gestión de Cartas Épicas',
      epicas: currentCartasEpicas,
      currentPage: page,
      totalPages: totalPages,
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
    // Obtener los datos del formulario y el archivo
    const formData = req.body;
    const file = req.file;

    // Llama a la función del modelo para crear la carta épica en el API
    const response = await crearCartaEpicaEnAPI(formData, file);

    if (response.ok) {
      // Creación exitosa
      const tituloExitoso = 'Creación de Carta Épica';
      const mensajeExitoso = 'Carta épica creada correctamente.';
      return res.render('anuncioepica', { cartaEpica: true, tituloExitoso, mensajeExitoso });
    } else {
      // Error en la creación
      const mensajeError = 'Error al crear la carta épica';
      return res.render('anuncioepica', { cartaEpica: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioepica' con un mensaje de error genérico
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioepica', { cartaEpicaCreada: false, errorMessage: mensajeError });
  }
};


const mostrarFormularioActualizacionEpica = async (req, res) => {
  try {
    const idEpica = req.params.Id; // Obtener el valor del parámetro :Id

    // Realizar una solicitud al API para obtener los datos de la épica específica por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idEpica}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const epicaData = await response.json();

    if (!epicaData) {
      // Si no se encontró la épica, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Épica no encontrada' });
    }

    // Pasar los datos de la épica al formulario de actualización
    res.render('actualizarepica', {
      pagina: 'Actualizar Épica',
      epica: epicaData, // Enviar los datos de la épica a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};



const actualizarEpica = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file; // Obtener el archivo del formulario si se proporcionó

    // Llama a la función del modelo para actualizar la Épica en el API
    const response = await actualizarEpicaEnAPI(formData, file);

    if (response.ok) {
      console.log('Carta actualizada con éxito.');
      const tituloExitoso = 'Actualización de Épica';
      const mensajeExitoso = 'Actualizada correctamente.';
      return res.render('anuncioepica', { cartaEpica: true, tituloExitoso, mensajeExitoso });
    } else {
      // Hubo un error en la actualización de la Épica
      const mensajeError = 'Error al actualizar la Épica';
      return res.render('anuncioepica', { cartaEpica: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioepica' con un mensaje de error
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioepica', { cartaEpica: false, errorMessage: mensajeError });
  }
};


const cambiarEstadoEpica = async (req, res) => {
  try {
    const epicaId = req.params.Id; // Obtener el ID de la Épica de los parámetros
    console.log('ID de la Épica:', epicaId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    const cambioExitoso = await cambiarEstadoEpicaEnModelo(epicaId, nuevoEstado);

    if (cambioExitoso) {
      return res.status(200).json({ message: 'Estado de la Épica actualizado exitosamente en el modelo' });
    } else {
      return res.status(500).json({ error: 'Error al cambiar el estado de la Épica en el modelo' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado de la Épica' });
  }
};


const mostrarFormularioCreacionArma = (req, res) => {
  res.render('creararma', {
    pagina: 'Crear Arma',
  });
};

const crearArma = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file;

    const response = await crearArmaEnAPI(formData, file);

    if (response.ok) {
      const tituloExitoso = 'Creación de Arma';
      const mensajeExitoso = 'Creada correctamente.';
      return res.render('anuncioarma', { armaCreada: true, tituloExitoso, mensajeExitoso });
    } else {
      // Hubo un error en la creación del arma
      const mensajeError = 'Error al crear el arma';
      return res.render('anuncioarma', { armaCreada: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioarma' con un mensaje de error
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioarma', { armaCreada: false, errorMessage: mensajeError });
  }
};

const mostrarFormularioActualizacionimgArma = async (req, res) => {
  try {
    const idArma = req.params.Id; // Obtener el valor del parámetro :Id
    console.log(idArma)

    // Realizar una solicitud al API para obtener los datos del héroe específico por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idArma}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const armaData = await response.json();

    if (!armaData) {
      // Si no se encontró el héroe, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Arma no encontrada' });
    }

    // Pasar los datos del héroe a la vista
    res.render('actualizararmaimg', {
      pagina: 'Actualizar Img',
      arma: armaData, // Enviar los datos del héroe a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};

const mostrarFormularioActualizacionArma = async (req, res) => {
  try {
    const idArma = req.params.Id; // Obtener el valor del parámetro :Id

    // Realizar una solicitud al API para obtener los datos del arma específica por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idArma}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const armaData = await response.json();

    if (!armaData) {
      // Si no se encontró el arma, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Arma no encontrada' });
    }

    // Pasar los datos del arma al formulario de actualización
    res.render('actualizararma', {
      pagina: 'Actualizar Arma',
      arma: armaData, // Enviar los datos del arma a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};
const actualizarArma = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file; // Obtener el archivo del formulario si se proporcionó

    // Llama a la función del modelo para actualizar el arma en el API
    const response = await actualizarArmaEnAPI(formData, file);

    if (response.ok) {
      console.log('Carta actualizada con éxito.');
      const tituloExitoso = 'Actualización de Arma';
      const mensajeExitoso = 'Actualizada correctamente.';
      return res.render('anuncioarma', { armaCreada: true, tituloExitoso, mensajeExitoso });
    } else {
      // Hubo un error en la actualización de la arma
      const mensajeError = 'Error al actualizar la arma';
      return res.render('anuncioarma', { armaCreada: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioarma' con un mensaje de error
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioarma', { armaCreada: false, errorMessage: mensajeError });
  }
};

const cambiarEstadoArma = async (req, res) => {
  try {
    const armaId = req.params.Id; // Obtener el ID de la armadura de los parámetros
    console.log('ID de la armadura:', armaId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    const cambioExitoso = await cambiarEstadoArmaEnModelo(armaId, nuevoEstado);

    if (cambioExitoso) {
      return res.status(200).json({ message: 'Estado del arma actualizado exitosamente en el modelo' });
    } else {
      return res.status(500).json({ error: 'Error al cambiar el estado del arma en el modelo' });
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
const mostrarFormularioActualizacionimg = async (req, res) => {
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
    res.render('actualizarheroeimg', {
      pagina: 'Actualizar Img',
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

const mostrarFormularioActualizacionimgArmadura = async (req, res) => {
  try {
    const idArmadura = req.params.Id; // Obtener el valor del parámetro :Id
    console.log(idArmadura)

    // Realizar una solicitud al API para obtener los datos del héroe específico por su ID
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
      // Si no se encontró el héroe, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Héroe no encontrado' });
    }

    // Pasar los datos del héroe a la vista
    res.render('actualizararmaduraimg', {
      pagina: 'Actualizar Img',
      armadura: armaduraData, // Enviar los datos del héroe a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
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
      console.log('Carta actualizada con éxito.');
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
    const formData = req.body;
    const file = req.file;

    const response = await crearItemEnAPI(formData, file);

    if (response.ok) {
      const tituloExitoso = 'Creación de Item';
      const mensajeExitoso = 'Creado correctamente.';
      return res.render('anuncioitem', { itemCreada: true, tituloExitoso, mensajeExitoso });
    } else {
      // Hubo un error en la creación de la armadura
      const mensajeError = 'Error al crear el item';
      return res.render('anuncioitem', { itemCreada: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioitem' con un mensaje de error
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioitem', { itemCreada: false, errorMessage: mensajeError });
  }
};

const mostrarFormularioActualizacionimgItem = async (req, res) => {
  try {
    const idItem = req.params.Id; // Obtener el valor del parámetro :Id
    console.log(idItem)

    // Realizar una solicitud al API para obtener los datos del héroe específico por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idItem}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const itemData = await response.json();

    if (!itemData) {
      // Si no se encontró el héroe, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Item no encontrado' });
    }

    // Pasar los datos del héroe a la vista
    res.render('actualizaritemimg', {
      pagina: 'Actualizar Img',
      item: itemData, // Enviar los datos del héroe a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};

const mostrarFormularioActualizacionItem = async (req, res) => {
  try {
    const idItem = req.params.Id; // Obtener el valor del parámetro :Id

    // Realizar una solicitud al API para obtener los datos de la armadura específica por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idItem}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const itemData = await response.json();

    if (!itemData) {
      // Si no se encontró la item, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Item no encontrado' });
    }

    // Pasar los datos de la item al formulario de actualización
    res.render('actualizaritem', {
      pagina: 'Actualizar Item',
      item: itemData, // Enviar los datos de la item a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};


const actualizarItem = async (req, res) => {
  try {
    const formData = req.body;
    const file = req.file; // Obtener el archivo del formulario si se proporcionó

    // Llama a la función del modelo para actualizar la item en el API
    const response = await actualizarItemEnAPI(formData, file);

    if (response.ok) {
      console.log('Carta actualizada con éxito.');
      const tituloExitoso = 'Actualización de Item';
      const mensajeExitoso = 'Actualizada correctamente.';
      return res.render('anuncioitem', { itemCreada: true, tituloExitoso, mensajeExitoso });
    } else {
      // Hubo un error en la actualización del item
      const mensajeError = 'Error al actualizar el item';
      return res.render('anuncioitem', { itemCreada: false, errorMessage: mensajeError });
    }
  } catch (error) {
    console.error(error);

    // Renderiza la vista 'anuncioitem' con un mensaje de error
    const mensajeError = 'Hubo un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.';
    return res.render('anuncioitem', { itemCreada: false, errorMessage: mensajeError });
  }
};
const cambiarEstadoItem = async (req, res) => {
  try {
    const itemId = req.params.Id; // Obtener el ID de la item de los parámetros
    console.log('ID de la armadura:', itemId);

    const nuevoEstado = req.query.estado; // Obtener el estado de la consulta
    console.log('Estado recibido:', nuevoEstado);

    const cambioExitoso = await cambiarEstadoItemEnModelo(itemId, nuevoEstado);

    if (cambioExitoso) {
      return res.status(200).json({ message: 'Estado del item actualizado exitosamente en el modelo' });
    } else {
      return res.status(500).json({ error: 'Error al cambiar el estado del item en el modelo' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el estado del item' });
  }
};

const pasarIdaActualizar = (req, res) => {
  const cartaId = req.params.Id; // Obtener el ID de la Épica de los parámetros


  res.render('actualizar', {
    pagina: 'Seleccion a actualizar',
  
    cartaid: cartaId, // Enviar el ID de la Épica a la vista
  });
};
const pasarIdaActualizarArmadura = (req, res) => {
  const cartaId = req.params.Id; // Obtener el ID de la Épica de los parámetros


  res.render('actualizarseleccionarmadura', {
    pagina: 'Seleccion a actualizar',
  
    cartaid: cartaId, // Enviar el ID de la Épica a la vista
  });
};
const pasarIdaActualizarEpica = (req, res) => {
  const cartaId = req.params.Id; // Obtener el ID de la Épica de los parámetros


  res.render('actualizarseleccionarepica', {
    pagina: 'Seleccion a actualizar',
  
    cartaid: cartaId, // Enviar el ID de la Épica a la vista
  });
};

const mostrarFormularioActualizacionimgEpica = async (req, res) => {
  try {
    const idEpica = req.params.Id; // Obtener el valor del parámetro :Id
    console.log(idEpica)

    // Realizar una solicitud al API para obtener los datos del héroe específico por su ID
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/${idEpica}`;
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const epicaData = await response.json();

    if (!epicaData) {
      // Si no se encontró el héroe, puedes manejarlo adecuadamente aquí
      return res.status(404).render('error', { error: 'Héroe no encontrado' });
    }

    // Pasar los datos del héroe a la vista
    res.render('actualizarepicaimg', {
      pagina: 'Actualizar Img',
      epica: epicaData, // Enviar los datos del héroe a la vista
    });
  } catch (error) {
    console.error(error);
    res.render('error'); // Renderizar una vista de error en caso de problemas
  }
};
const pasarIdaActualizarArma = (req, res) => {
  const cartaId = req.params.Id; // Obtener el ID de la Épica de los parámetros


  res.render('actualizarseleccionarma', {
    pagina: 'Seleccion a actualizar',
  
    cartaid: cartaId, // Enviar el ID de la Épica a la vista
  });
};

const pasarIdaActualizarItem = (req, res) => {
  const cartaId = req.params.Id; // Obtener el ID de la Épica de los parámetros


  res.render('actualizarseleccionitem', {
    pagina: 'Seleccion a actualizar',
  
    cartaid: cartaId, // Enviar el ID de la Épica a la vista
  });
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
  pasarIdaActualizar,
  mostrarFormularioActualizacionimg,
  pasarIdaActualizarArmadura,
  mostrarFormularioActualizacionimgArmadura,
  pasarIdaActualizarEpica,
  mostrarFormularioActualizacionimgEpica,
  pasarIdaActualizarArma,
  mostrarFormularioActualizacionimgArma,
  pasarIdaActualizarItem,
  mostrarFormularioActualizacionimgItem
};
