async function cambiarEstadoArmadura(e) {
  console.log('Clic en el botón de cambiar estado');
  const armaduraId = e.target.dataset.armaduraId; // Obtener el ID de la armadura

  try {
    // Realizar una solicitud al API para obtener el estado actual de la armadura
    const url = `https://cards.thenexusbattles2.cloud/api/cartas/${armaduraId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error al consultar el API');
    }

    const armaduraData = await response.json();
    const isActive = armaduraData.estado; // Obtener el estado activo/inactivo de la armadura
    console.log('Estado actual de la armadura:', isActive);

    // Actualizar el estado en el servidor
    const nuevoEstado = !isActive;
    const updateUrl = `/admin/cambiarestadoarmadura/${armaduraId}?estado=${nuevoEstado}`;
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
      console.error('Error al cambiar el estado de la armadura.');
    }
  } catch (error) {
    console.error(error);
  }
}
