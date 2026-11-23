const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');

// GET /api/turnos - Listar todos los pendientes registrados
router.get('/', turnoController.obtenerTodos);

// GET /api/turnos/:id - Consultar un pendiente específico por ID
router.get('/:id', turnoController.obtenerPorId);

// POST /api/turnos - Registrar un nuevo pendiente de medicamento
router.post('/', turnoController.crearTurno);

module.exports = router;
