document.addEventListener('DOMContentLoaded', async () => {
    try {
      // Realizar una solicitud al API para obtener los datos de los héroes
      const apiUrl = 'https://cards.thenexusbattles2.cloud/api/cartas/?size=1000&page=1&coleccion=Heroes&onlyActives=false';
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al consultar el API');
      }

      const heroesData = await response.json();

      if (!heroesData || !heroesData.length) {
        // Manejar caso en el que no se encontraron héroes
        return;
      }

      // Obtener el select de héroes
      const heroeSelect = document.getElementById('heroeId');
      // Obtener el select de tipo y clase
      const tipoSelect = document.getElementById('tipo');
      const claseSelect = document.getElementById('clase');

      // Agregar una opción inicial en el select de héroes
      const optionSeleccionar = document.createElement('option');
      optionSeleccionar.value = ''; // Puedes dejar el valor vacío o definir otro valor predeterminado
      optionSeleccionar.textContent = 'Seleccionar';
      heroeSelect.appendChild(optionSeleccionar);

      // Iterar sobre los datos de héroes y agregar opciones al select
      heroesData.forEach((hero) => {
        const option = document.createElement('option');
        option.value = hero._id;
        option.textContent = `${hero.nombre}`;
        heroeSelect.appendChild(option);
      });

      // Escuchar cambios en el select de héroes
      heroeSelect.addEventListener('change', (event) => {
        const selectedHeroId = event.target.value;

        // Buscar el héroe seleccionado en la lista de héroes
        const selectedHero = heroesData.find((hero) => hero._id === selectedHeroId);

        // Actualizar los valores de tipo y clase en los select
        if (selectedHero) {
          tipoSelect.value = selectedHero.tipo;
          claseSelect.value = selectedHero.clase;
        } else {
          // Si no se encuentra el héroe, puedes establecer valores predeterminados o hacer lo que desees
          tipoSelect.value = '';
          claseSelect.value = '';
        }
      });

      console.log('La página se ha cargado completamente.');

    } catch (error) {
      console.error(error);
    }
  });
