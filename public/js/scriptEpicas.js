async function cambiarEstadoEpica(e) {
  console.log('Clic en el botón de cambiar estado');
  const epicaId = e.target.dataset.epicaId; // Obtener el ID de la épica

  try {
    // Realizar una solicitud al API para obtener el estado actual de la épica
    const url = `https://cards.thenexusbattles2.cloud/api/cartas/${epicaId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const epicaData = await response.json();
    const isActive = epicaData.estado; // Obtener el estado activo/inactivo de la épica
    console.log('Estado actual de la épica:', isActive);

    // Actualizar el estado en el servidor
    const nuevoEstado = !isActive;
    const updateUrl = `/admin/cambiarestadoepica/${epicaId}?estado=${nuevoEstado}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'POST',
    });

    console.log('Respuesta del servidor:', updateResponse);

    const { message } = await updateResponse.json();

    if (updateResponse.ok) {
      alert(message);

      // Actualiza el texto del botón según el nuevo estado
      e.target.textContent = nuevoEstado ? 'Suspender' : 'Activar';
    } else {
      console.error('Error al cambiar el estado de la épica.');
    }
  } catch (error) {
    console.error(error);
  }
}

// Agregar un evento click a los botones para cambiar el estado
const epicaButtons = document.querySelectorAll('.cambiar-estado-epica-button');
epicaButtons.forEach(button => {
  button.addEventListener('click', cambiarEstadoEpica);
});
