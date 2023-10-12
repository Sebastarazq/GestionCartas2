async function cambiarEstadoItem(e) {
  console.log('Clic en el botón de cambiar estado');
  const itemId = e.target.dataset.itemId; 

  try {
    // Realizar una solicitud al API para obtener el estado actual del item
    const url = `https://cards.thenexusbattles2.cloud/api/cartas/${itemId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const itemData = await response.json();
    const isActive = itemData.estado; // Obtener el estado activo/inactivo del item
    console.log('Estado actual del item:', isActive);

    // Actualizar el estado en el servidor
    const nuevoEstado = !isActive;
    const updateUrl = `/admin/cambiarestadoitem/${itemId}?estado=${nuevoEstado}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'POST',
    });

    console.log('Respuesta del servidor:', updateResponse);

    const { message } = await updateResponse.json();

    if (updateResponse.ok) {
      alert(message); // Muestra un mensaje de éxito

      // Actualiza el texto del botón según el nuevo estado
      e.target.textContent = nuevoEstado ? 'Suspender' : 'Activar';
    } else {
      console.error('Error al cambiar el estado del item.');
    }
  } catch (error) {
    console.error(error);
  }
}

// Agrega un evento de clic a todos los botones de cambio de estado
const buttons = document.querySelectorAll('button[data-item-id]');
buttons.forEach((button) => {
  button.addEventListener('click', cambiarEstadoItem);
});
