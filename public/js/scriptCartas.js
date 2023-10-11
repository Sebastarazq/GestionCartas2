async function cambiarEstadoHeroe(e) {
  console.log('Clic en el botón de cambiar estado');
  const heroeId = e.target.dataset.heroId; // Obtener el ID del héroe

  try {
    // Realizar una solicitud al API para obtener el estado actual del héroe
    const url = `https://cards.thenexusbattles2.cloud/api/cartas/${heroeId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const heroeData = await response.json();
    const isActive = heroeData.estado; // Obtener el estado activo/inactivo del héroe
    console.log('Estado actual del héroe:', isActive);

    // Actualizar el estado en el servidor
    const updateUrl = `/admin/cambiarEstadoHeroe/${heroeId}?estado=${!isActive}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'POST',
    });

    console.log('Respuesta del servidor:', updateResponse);

    const { message } = await updateResponse.json();

    if (updateResponse.ok) {
      alert(message); // Muestra un mensaje de éxito

      // Actualiza el texto del botón según el nuevo estado
      e.target.textContent = !isActive ? 'Suspender' : 'Activar';
    } else {
      console.error('Error al cambiar el estado del héroe.');
    }
  } catch (error) {
    console.error(error);
  }
}
