import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT en las cookies
const jwttoken = (req, res, next) => {
  const token = req.cookies.jwt; // Nombre de la cookie que contiene el token JWT

  // Verificar si el token existe
  if (token) {
    jwt.verify(token, 'gestioncartasnexubattle2omega', (err, decodedToken) => {
      if (err) {
        console.error(err.message);
        res.redirect('/auth/iniciosesion'); // Redirigir a la página de inicio de sesión en caso de error
      } else {
        // El token es válido, puedes acceder a `decodedToken` para obtener información del usuario si es necesario
        next(); // Continuar con la siguiente función de middleware o ruta
      }
    });
  } else {
    res.redirect('/auth/iniciosesion'); // Redirigir a la página de inicio de sesión si no hay token en las cookies
  }
};

export { jwttoken };
