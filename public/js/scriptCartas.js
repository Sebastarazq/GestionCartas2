async function cambiarEstadoHeroe(e) {
  console.log('Clic en el botón de cambiar estado');
  const heroId = e.target.dataset.heroId; // Obtener el ID del héroe
  const isActive = e.target.dataset.isActive === 'true'; // Obtener el estado activo/inactivo del héroe

  try {
    const url = `/admin/cambiarestadoheroe/${heroId}`;
    const nuevoEstado = !isActive; // Cambiar el estado

    const bodyData = { estado: nuevoEstado }; // Crear un objeto con el nuevo estado

    const respuesta = await fetch(url, {
      method: 'POST', // Usa el método POST para cambiar el estado del héroe
      headers: {
        'Content-Type': 'application/json', // Establecer el tipo de contenido como JSON
      },
      body: JSON.stringify(bodyData), // Convertir el objeto en JSON y enviarlo en el cuerpo
    });

    const { message } = await respuesta.json();

    if (respuesta.ok) {
      // Puedes agregar lógica adicional aquí, como cambiar la clase CSS de la carta si lo deseas

      e.target.dataset.isActive = nuevoEstado; // Actualizar el estado en el botón
      e.target.textContent = nuevoEstado ? 'Suspender' : 'Activar'; // Actualizar el texto en el botón

      alert(message); // Muestra un mensaje de éxito
    } else {
      console.error('Error al cambiar el estado del héroe.');
    }
  } catch (error) {
    console.error(error);
  }
}
