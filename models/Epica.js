import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

const obtenerCartasEpicasApi = async () => {
  try {
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
    return data;
  } catch (error) {
    console.error('Error al obtener cartas épicas desde el API:', error);
    throw error;
  }
};
const crearCartaEpicaEnAPI = async (formData, file) => {
  try {
    // Verificar si se proporcionó un archivo
    if (!file) {
      console.log('Error: Archivo no recibido');
      return res.status(400).json({ error: 'Archivo no recibido' });
    }

    // Extraer los campos del formulario individualmente
    const nombre = formData.nombre;
    const descripcion = formData.descripcion;
    const precio = formData.precio;
    const tipo = formData.tipo;
    const clase = formData.clase;
    const estado = formData.estado;
    const estadistica = formData.estadistica;
    const efectoValorAfectado = parseInt(formData.efectoValorAfectado, 10);
    const efectoIdEstrategia = parseInt(formData.efectoIdEstrategia, 10);
    const stock = formData.stock;
    const descuento = formData.descuento;

    // Agregar los campos de efecto y efectoHeroe
    const efecto = {
      estadistica: estadistica,
      id_estrategia: efectoIdEstrategia,
      turnosValidos: -1,
      valorAfectado: efectoValorAfectado,
    };

    const efectoHeroe = {
      estadistica: formData.efectoHeroeEstadistica,
      id_estrategia: parseInt(formData.efectoHeroeIdEstrategia, 10),
      turnosValidos: parseInt(formData.efectoHeroeTurnosValidos, 10),
      valorAfectado: parseInt(formData.efectoHeroeValorAfectado, 10),
    };

    console.log('efecto:',efecto)
    console.log('efectoHeroe:',efectoHeroe)

    // Construir un objeto FormData y agregar los campos
    const data = new FormData();
    data.append('nombre', nombre);
    data.append('coleccion', 'Epicas');
    data.append('descripcion', descripcion);
    data.append('precio', precio);
    data.append('tipo', tipo);
    data.append('clase', clase);
    data.append('estado', estado);
    data.append('icono', 'https://www.youtube.com/'); // Cambia la URL de icono según sea necesario
    data.append('efecto', JSON.stringify(efecto));
    data.append('efectoHeroe', JSON.stringify(efectoHeroe));
    data.append('imagen', fs.createReadStream(file.path));
    data.append('stock', stock);
    data.append('descuento', descuento);

    console.log('Datos enviados a la API:', data);
    // Construir la URL del API
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/consumible/`;
    
    // Realizar la solicitud POST al API para crear la carta épica
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: data,
      headers: {
        ...data.getHeaders(), // Añadir encabezados del formulario
      }
    });
    console.log('repsonse:',response)

    return response;
  } catch (error) {
    console.error('Error al crear la carta épica en el API:', error);
    throw error;
  }
};
const actualizarEpicaEnAPI = async (formData, file) => {
  try {
    // Extraer el ID de la Épica del formulario para identificar la que se actualizará
    const id = formData.id;

    // Crear un objeto FormData para enviar los datos
    const data = new FormData();

    if (id) {
      data.append('id', id);
    }

    // Agregar campos de formulario no vacíos
    if (formData.nombre) {
      data.append('nombre', formData.nombre);
    }
    if (formData.descripcion) {
      data.append('descripcion', formData.descripcion);
    }
    if (formData.precio) {
      data.append('precio', formData.precio);
    }
    if (formData.estado) {
      data.append('estado', formData.estado);
    }

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

    // Construir la URL del API (asegúrate de incluir el ID en la URL para identificar la Épica específica)
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

    // Realizar la solicitud PATCH al API para actualizar la Épica
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

const cambiarEstadoEpicaEnModelo = async (epicaId, nuevoEstado) => {
  try {
    // Crear un objeto FormData y agregar los datos a él
    const formData = new FormData();
    formData.append('id', epicaId); // Agregar el ID al FormData
    formData.append('estado', nuevoEstado); // Agregar el estado al FormData

    // Construir la URL de la API externa de acuerdo a tu configuración
    const apiUrl = `https://cards.thenexusbattles2.cloud/api/consumible/`; // Asegúrate de usar la URL correcta para las Épicas

    // Realizar la solicitud PATCH a la API externa para cambiar el estado de la Épica
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: formData,
    });

    return response.ok;
  } catch (error) {
    console.error('Error al cambiar el estado de la Épica en el modelo:', error);
    throw error;
  }
};






export{
  obtenerCartasEpicasApi,
  crearCartaEpicaEnAPI,
  actualizarEpicaEnAPI,
  cambiarEstadoEpicaEnModelo
}