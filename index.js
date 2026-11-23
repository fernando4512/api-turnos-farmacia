const express = require('express');
const turnoRoutes = require('./routes/turnoRoutes');

const app = express();
const PORT = 3000;

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
    }
  });
});

// Conexión de rutas
app.use('/api/turnos', turnoRoutes);

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Tu Inventario.com - Módulo de Pendientes de Medicamentos');
});
