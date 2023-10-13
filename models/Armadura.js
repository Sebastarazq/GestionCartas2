import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

// Función para obtener los héroes desde el API
const obtenerArmadurasApi = async () => {
  try {
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/cartas/?size=1000&page=1&coleccion=Armaduras&onlyActives=false`;
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
const crearArmaduraEnAPI = async (formData, file) => {
  try {
    // Verificar si se proporcionó un archivo
    if (!file) {
      console.log('Error: Archivo no recibido');
      return res.status(400).json({ error: 'Archivo no recibido' });
    }

    // Extraer los campos del objeto "efecto" del cuerpo del formulario
    const efectoEstadistica = formData.estadistica;
    const efectoIdEstrategia = parseInt(formData.efectoIdEstrategia, 10);
    const efectoTurnosValidos = parseInt(formData.efectoTurnosValidos, 10);
    const efectoValorAfectado = parseInt(formData.efectoValorAfectado, 10);
    // Agregar el objeto "efecto" como JSON
    const efecto = {
      estadistica: efectoEstadistica,
      id_estrategia: efectoIdEstrategia,
      turnosValidos: efectoTurnosValidos,
      valorAfectado: efectoValorAfectado
    };

    console.log('efecto:', efecto);

    // Construir el objeto de datos (FormData)
    const data = new FormData();
    data.append('clase', formData.clase);
    data.append('coleccion', 'Armaduras');
    data.append('descripcion', formData.descripcion);
    data.append('descuento', formData.descuento);
    data.append('efecto', JSON.stringify(efecto));
    data.append('estado', formData.estado);
    data.append('icono', 'https://www.youtube.com/');
    data.append('efectoHeroe', '');
    data.append('imagen', fs.createReadStream(file.path));
    data.append('nombre', formData.nombre);
    data.append('precio', formData.precio);
    data.append('stock', formData.stock);
    data.append('tipo', formData.tipo);

    console.log('Datos enviados a la API:', data);

    // Realizar la solicitud POST al API utilizando node-fetch
    const armaduraEndpoint = 'https://cards.thenexusbattles2.cloud/api/consumible/';
    const response = await fetch(armaduraEndpoint, {
      method: 'POST',
      body: data,
      headers: {
        ...data.getHeaders(), // Añadir encabezados del formulario
      },
    });

    console.log('RESPONSE:', response);

    return response;
  } catch (error) {
    console.error('Error al crear la armadura en el API:', error);
    throw error;
  }
};
const actualizarArmaduraEnAPI = async (formData, file) => {
  try {
    // Extraer los campos del formulario individualmente
    const id = formData.id; // Asegúrate de que tengas un campo 'id' para identificar la armadura que se actualizará

    // Construir un objeto FormData y agregar los campos no vacíos al mismo
    const data = new FormData();

    if (id) data.append('id', id);

    if (formData.nombre) data.append('nombre', formData.nombre);
    if (formData.descripcion) data.append('descripcion', formData.descripcion);
    if (formData.precio) data.append('precio', formData.precio);
    if (formData.estado) data.append('estado', formData.estado);

    // Verificar y agregar el objeto "efecto" si los campos están presentes
    if (formData.estadistica) {
      const efectoEstadistica = formData.estadistica;
      const efectoIdEstrategia = parseInt(formData.efectoIdEstrategia, 10);
      const efectoTurnosValidos = parseInt(formData.efectoTurnosValidos, 10);
      const efectoValorAfectado = parseInt(formData.efectoValorAfectado, 10);

      const efecto = {
        estadistica: efectoEstadistica,
        id_estrategia: efectoIdEstrategia,
        turnosValidos: efectoTurnosValidos,
        valorAfectado: efectoValorAfectado,
      };

      data.append('efecto', JSON.stringify(efecto));
    }

    if (formData.stock !== undefined) {
      data.append('stock', formData.stock);
    }

    if (formData.descuento !== undefined) {
      data.append('descuento', formData.descuento);
    }

    // Agregar la imagen al objeto de datos si se proporcionó
    if (file) {
      data.append('imagen', fs.createReadStream(file.path), {
        filename: file.originalname,
        contentType: file.mimetype
      });
    }

    // Construir la URL del API (asegúrate de incluir el ID en la URL para identificar la armadura específica)
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/consumible/`;

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

    // Realizar la solicitud PATCH al API para actualizar la armadura
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: data,
      headers: headers,
    });

    console.log('response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};
// Función para cambiar el estado de una armadura en el modelo
const cambiarEstadoArmaduraEnModelo = async (armaduraId, nuevoEstado) => {
  try {
    // Crear un objeto FormData y agregar los datos a él
    const formData = new FormData();
    formData.append('id', armaduraId); // Agregar el ID al FormData
    formData.append('estado', nuevoEstado); // Agregar el estado al FormData

    // Construir la URL de la API externa de acuerdo a tu configuración
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/consumible/`;

    // Realizar la solicitud PATCH a la API externa para cambiar el estado de la armadura
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error('Error al cambiar el estado de la armadura en el modelo:', error);
    throw error;
  }
};




export{
  obtenerArmadurasApi,
  crearArmaduraEnAPI,
  actualizarArmaduraEnAPI,
  cambiarEstadoArmaduraEnModelo
}