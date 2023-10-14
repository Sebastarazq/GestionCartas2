import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

// Función para obtener los héroes desde el API
const obtenerHeroesApi = async () => {
  try {
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/?size=1000&page=1&coleccion=Heroes&onlyActives=false`;
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
    return data;
  } catch (error) {
    console.error('Error al obtener héroes desde el API:', error);
    throw error;
  }
};


// Función para crear un héroe en el API
const crearHeroeEnAPI = async (formData, file) => {
  try {
    if (!file) {
      return res.status(400).json({ error: 'Archivo no recibido' });
    }

    // Antes de agregar 'daño' al objeto FormData, codifica el carácter 'ñ'
    const danioCodificado = encodeURIComponent(formData.dano);

    // Construir el objeto de datos
    const data = new FormData();
    data.append('icono', 'https://www.youtube.com/');
    data.append('nombre', formData.nombre);
    data.append('clase', formData.clase);
    data.append('tipo', formData.tipo);
    data.append('poder', formData.poder);
    data.append('vida', formData.vida);
    data.append('defensa', formData.defensa);
    data.append('ataqueBase', formData.ataqueBase);
    data.append('ataqueRnd', formData.ataqueRnd);
    data.append('daño', danioCodificado);
    data.append('estado', formData.estado);
    data.append('descripcion', formData.descripcion);
    data.append('precio', formData.precio);
    data.append('stock', formData.stock);
    data.append('descuento', formData.descuento);

    // Agregar la imagen al objeto de datos
    data.append('imagen', fs.createReadStream(file.path));

    console.log('Datos para crear el héroe:', data);

    // Realizar la solicitud POST utilizando node-fetch
    const cartEndpoint = 'https://cards.thenexusbattles2.cloud/api/heroes/';
    const response = await fetch(cartEndpoint, {
      method: 'POST',
      body: data,
      headers: {
        ...data.getHeaders(), // Añadir encabezados del formulario
      },
    });

    console.log('Respuesta del API al crear el héroe:', response.status);

    return response;
  } catch (error) {
    console.error('Error al crear el héroe en el API:', error);
    throw error;
  }
};
// Función para actualizar una carta en el API
const actualizarCartaEnAPI = async (formData, file) => {
  try {
    // Extraer los campos del formulario individualmente
    const id = formData.id;
    const nombre = formData.nombre;
    const poder = formData.poder;
    const vida = formData.vida;
    const defensa = formData.defensa;
    const ataqueBase = formData.ataqueBase;
    const ataqueRnd = formData.ataqueRnd;
    const dano = formData.dano;
    const estado = formData.estado;
    const descripcion = formData.descripcion;
    const precio = formData.precio;
    const stock = formData.stock;
    const descuento = formData.descuento;

    // Construir un objeto FormData y agregar los campos no vacíos al mismo
    const data = new FormData();
    if (id) data.append('id', id);
    if (nombre) data.append('nombre', nombre);
    if (poder) data.append('poder', poder);
    if (vida) data.append('vida', vida);
    if (defensa) data.append('defensa', defensa);
    if (ataqueBase) data.append('ataqueBase', ataqueBase);
    if (ataqueRnd) data.append('ataqueRnd', ataqueRnd);
    
    // Antes de agregar 'daño' al objeto FormData, codifica el carácter 'ñ'
    if (dano) {
      const danioCodificado = encodeURIComponent(dano);
      data.append('daño', danioCodificado);
    }

    if (estado) data.append('estado', estado);
    if (descripcion) data.append('descripcion', descripcion);
    if (precio) data.append('precio', precio);
    if (stock) data.append('stock', stock);
    if (descuento) data.append('descuento', descuento);

    // Agregar la imagen al objeto de datos si se proporcionó
    if (file) {
      data.append('imagen', fs.createReadStream(file.path), {
        filename: file.originalname,
        contentType: file.mimetype
      });
    }

    // Construir la URL del API
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/heroes/`;

    // Verificar si se proporcionó una imagen y configurar el encabezado
    let headers = {};

    if (file) {
      headers = {
        'Content-Type': 'multipart/form-data',
        ...data.getHeaders(),
      };
    } else {
      headers = data.getHeaders();
    }

    // Realizar la solicitud PATCH al API para actualizar la carta
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: data,
      headers: {
        ...data.getHeaders()
      },
    });
    
    console.log('response:',response)
    return response;
  } catch (error) {
    throw error;
  }
};


export { obtenerHeroesApi, crearHeroeEnAPI, actualizarCartaEnAPI };
