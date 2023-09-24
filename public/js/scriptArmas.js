async function cambiarEstadoArma(e) {
    console.log('Clic en el botón de suspender');
    const armaId = e.target.dataset.armaId; // Obtener el ID del arma
    const isActive = e.target.dataset.isActive === 'true'; // Obtener el estado activo/inactivo del arma
  
    try {
      const url = `/admin/cambiarestadoarma/${armaId}`;
      const nuevoEstado = !isActive; // Cambiar el estado
  
      const respuesta = await fetch(url, {
        method: 'PUT', // Usa el método PUT para cambiar el estado del arma
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: nuevoEstado }), // Envía el nuevo estado en el cuerpo
      });
  
      const { message } = await respuesta.json();
  
      if (respuesta.ok) {
        // Cambiar el estado del botón y la clase de la carta
        e.target.dataset.isActive = nuevoEstado;
        e.target.textContent = nuevoEstado ? 'Activar' : 'Suspender';
  
        const carta2 = e.target.closest('.carta2');
        carta2.classList.toggle('suspended'); // Cambiar la clase para cambiar el color
  
        alert(message); // Muestra un mensaje de éxito
      } else {
        console.error('Error al cambiar el estado del arma.');
      }
    } catch (error) {
      console.error(error);
    }
  }
  