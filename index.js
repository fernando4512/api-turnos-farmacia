// Cargar variables de entorno desde .env (si existe) antes de todo lo demás
try {
  process.loadEnvFile();
} catch (err) {
  if (err.code !== 'ENOENT') throw err;
}

const express = require('express');
const turnoRoutes = require('./routes/turnoRoutes');
const { autenticar, usaCredencialesPorDefecto } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz informativa
app.get('/', (req, res) => {
  res.json({
    sistema: 'Tu Inventario.com - Módulo de Pendientes de Medicamentos',
    descripcion: 'API REST para gestión de turnos de solicitud de medicamentos pendientes en droguerías y depósitos farmacéuticos',
    endpoints: {
      'GET /api/turnos': 'Obtener todos los turnos de pendientes',
      'GET /api/turnos/:id': 'Obtener un turno específico por ID',
      'POST /api/turnos': 'Registrar un nuevo turno de medicamento pendiente'
    },
    autenticacion: 'Los endpoints /api/turnos requieren HTTP Basic Auth (usuario y contraseña)'
  });
});

// Conexión de rutas (protegidas con usuario y contraseña)
app.use('/api/turnos', autenticar, turnoRoutes);

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Tu Inventario.com - Módulo de Pendientes de Medicamentos');
  if (usaCredencialesPorDefecto) {
    console.warn('ADVERTENCIA: no se definieron API_USUARIO y API_PASSWORD; se usan las credenciales por defecto. Crea un archivo .env con esas dos variables.');
  }
});
