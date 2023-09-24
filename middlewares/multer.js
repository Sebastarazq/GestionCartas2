import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtén el directorio actual del módulo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '../public/img'));
  },
  filename: (req, file, callback) => {
    const imageName = Date.now() + '-' + file.originalname;
    callback(null, imageName);
  },
});

const upload = multer({ storage });

export default upload;
