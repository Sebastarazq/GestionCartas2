// Obtén una referencia al input de tipo archivo y al span para mostrar el nombre del archivo
const inputFile = document.getElementById('imagen');
const fileNameSpan = document.getElementById('file-name-span');

// Agrega un evento change al input de tipo archivo
inputFile.addEventListener('change', function() {
  // Verifica si se ha seleccionado un archivo
  if (inputFile.files.length > 0) {
    // Obtiene el nombre del archivo seleccionado
    const fileName = inputFile.files[0].name;

    // Actualiza el contenido del span con el nombre del archivo
    fileNameSpan.textContent = fileName;
  } else {
    // Si no se ha seleccionado un archivo, muestra un mensaje predeterminado
    fileNameSpan.textContent = 'Ningún archivo seleccionado';
  }
});
