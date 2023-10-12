async function cambiarEstadoArma(e) {
  console.log('Clic en el botón de cambiar estado');
  const armaId = e.target.dataset.armaId; // Obtener el ID del arma

  try {
    // Realizar una solicitud al API para obtener el estado actual del arma
    const url = `https://cards.thenexusbattles2.cloud/api/cartas/${armaId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const armaData = await response.json();
    const isActive = armaData.estado; // Obtener el estado activo/inactivo del arma
    console.log('Estado actual del arma:', isActive);

    // Actualizar el estado en el servidor
    const nuevoEstado = !isActive;
    const updateUrl = `/admin/cambiarEstadoArma/${armaId}?estado=${nuevoEstado}`;
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
      console.error('Error al cambiar el estado del arma.');
    }
  } catch (error) {
    console.error(error);
  }
}
