const crypto = require('crypto');

// ============================================================
// Autenticación HTTP Basic (usuario y contraseña)
// ============================================================
// El cliente debe enviar el encabezado:
//   Authorization: Basic base64(usuario:contraseña)
// Las credenciales se leen de las variables de entorno
// API_USUARIO y API_PASSWORD (archivo .env, ver .env.example).
// ============================================================

const USUARIO_POR_DEFECTO = 'admin';
const PASSWORD_POR_DEFECTO = 'farmacia2026';

const USUARIO = process.env.API_USUARIO || USUARIO_POR_DEFECTO;
const PASSWORD = process.env.API_PASSWORD || PASSWORD_POR_DEFECTO;

const usaCredencialesPorDefecto = !process.env.API_USUARIO || !process.env.API_PASSWORD;

// Compara dos textos en tiempo constante para evitar ataques de tiempo
const sonIguales = (a, b) => {
  const hashA = crypto.createHash('sha256').update(a).digest();
  const hashB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
};

const noAutorizado = (res, mensaje) => {
  res.set('WWW-Authenticate', 'Basic realm="Tu Inventario.com", charset="UTF-8"');
  return res.status(401).json({ error: mensaje });
};

const autenticar = (req, res, next) => {
  const encabezado = req.headers.authorization || '';
  const [esquema, token] = encabezado.split(' ');

  if (esquema !== 'Basic' || !token) {
    return noAutorizado(res, 'Se requiere autenticación con usuario y contraseña');
  }

  const decodificado = Buffer.from(token, 'base64').toString('utf8');
  const separador = decodificado.indexOf(':');
  if (separador === -1) {
    return noAutorizado(res, 'Formato de credenciales inválido');
  }

  const usuario = decodificado.slice(0, separador);
  const password = decodificado.slice(separador + 1);

  // Se evalúan ambas comparaciones para no revelar cuál falló
  const usuarioOk = sonIguales(usuario, USUARIO);
  const passwordOk = sonIguales(password, PASSWORD);

  if (!usuarioOk || !passwordOk) {
    return noAutorizado(res, 'Usuario o contraseña incorrectos');
  }

  req.usuario = usuario;
  next();
};

module.exports = { autenticar, usaCredencialesPorDefecto };
