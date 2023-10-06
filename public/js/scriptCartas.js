// Script en el cliente
async function cambiarEstadoHeroe(e) {
  console.log('Clic en el botón de cambiar estado');
  const heroId = e.target.dataset.heroId; // Obtener el ID del héroe
  const isActive = e.target.dataset.isActive === 'true'; // Obtener el estado activo/inactivo del héroe
  console.log('Estado actual del héroe:', isActive);

  // Invertir el estado en el cliente
  const nuevoEstado = !isActive;
  //console.log('Nuevo estado:', nuevoEstado);
  e.target.dataset.isActive = nuevoEstado;
  e.target.textContent = nuevoEstado ? 'Suspender' : 'Activar';

  try {
    const url = `/admin/cambiarestadoheroe/${heroId}?estado=${nuevoEstado}`;
    console.log('URL de la solicitud:', url);

    const respuesta = await fetch(url, {
      method: 'POST',
    });

    console.log('Respuesta del servidor:', respuesta);

    const { message } = await respuesta.json();

    if (respuesta.ok) {
      alert(message); // Muestra un mensaje de éxito
    } else {
      console.error('Error al cambiar el estado del héroe.');
    }
  } catch (error) {
    console.error(error);
  }
}
