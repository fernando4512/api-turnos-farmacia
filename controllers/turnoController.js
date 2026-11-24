const turnoService = require('../services/turnoService');

// GET /api/turnos → Lista todos los pendientes (200 OK)
const obtenerTodos = (req, res) => {
  const turnos = turnoService.obtenerTodos();
  res.status(200).json(turnos);
};

// GET /api/turnos/:id → Consulta un pendiente por ID (200 OK o 404 Not Found)
const obtenerPorId = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'El ID debe ser un número válido' });
  }

  const turno = turnoService.obtenerPorId(id);

  if (!turno) {
    return res.status(404).json({
      error: `No se encontró un pendiente con el ID ${id}`
    });
  }

  res.status(200).json(turno);
};

// POST /api/turnos → Registra un nuevo pendiente (201 Created o 400 Bad Request)
const crearTurno = (req, res) => {
  const {
    nombrePaciente,
    documentoPaciente,
    medicamento,
    concentracion,
    cantidad,
    precioBase,
    prioritario,
    servicio,
    fechaHora
  } = req.body;

  // Validar campos obligatorios
  const camposFaltantes = [];
  if (!nombrePaciente) camposFaltantes.push('nombrePaciente');
  if (!documentoPaciente) camposFaltantes.push('documentoPaciente');
  if (!medicamento) camposFaltantes.push('medicamento');
  if (!concentracion) camposFaltantes.push('concentracion');
  if (cantidad === undefined || cantidad === null) camposFaltantes.push('cantidad');
  if (precioBase === undefined || precioBase === null) camposFaltantes.push('precioBase');
  if (!servicio) camposFaltantes.push('servicio');
  if (!fechaHora) camposFaltantes.push('fechaHora');

  if (camposFaltantes.length > 0) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios para registrar el pendiente',
      camposFaltantes
    });
  }

  // Validar que valores numéricos sean positivos
  if (typeof cantidad !== 'number' || cantidad <= 0) {
    return res.status(400).json({
      error: 'El campo "cantidad" debe ser un número mayor a cero'
    });
  }

  if (typeof precioBase !== 'number' || precioBase <= 0) {
    return res.status(400).json({
      error: 'El campo "precioBase" debe ser un número mayor a cero'
    });
  }

  // Validar que "prioritario", si se envía, sea booleano (true/false)
  if (prioritario !== undefined && typeof prioritario !== 'boolean') {
    return res.status(400).json({
      error: 'El campo "prioritario" debe ser true o false (booleano, sin comillas)'
    });
  }

  // Delegar la creación al servicio
  const nuevoTurno = turnoService.crearTurno({
    nombrePaciente,
    documentoPaciente,
    medicamento,
    concentracion,
    cantidad,
    precioBase,
    prioritario: prioritario === true,
    servicio,
    fechaHora
  });

  res.status(201).json(nuevoTurno);
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crearTurno
};
