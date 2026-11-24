// ============================================================
// Tu Inventario.com - Módulo de Pendientes de Medicamentos
// ============================================================
// Cuando un paciente solicita un medicamento que no está
// disponible de inmediato en la droguería o depósito, se
// genera un "pendiente": un turno de solicitud que queda
// registrado hasta que el medicamento sea despachado.
//
// REGLA DE NEGOCIO PARAMETRIZADA
// N = 8 (Mosquera Arango Luis Fernando, primer integrante
//        en orden alfabético por apellido)
// Porcentaje de Recargo = N × 2% = 8 × 2% = 16%
//
// Si el pendiente es PRIORITARIO (medicamentos de urgencia,
// controlados o de alto costo), se cobra un recargo del 16%
// sobre el subtotal (precioBase × cantidad) por gestión
// prioritaria de despacho.
// ============================================================

const N = 8;
const PORCENTAJE_RECARGO = N * 2; // 16%

// Almacenamiento en memoria (simula la base de datos)
let turnos = [];
let contadorId = 1;

// Obtener todos los pendientes registrados
const obtenerTodos = () => {
  return turnos;
};

// Buscar un pendiente por su ID
const obtenerPorId = (id) => {
  return turnos.find(turno => turno.id === id) || null;
};

// Registrar un nuevo pendiente con cálculo de tarifa
const crearTurno = (datos) => {
  // precioBase es el precio unitario: el subtotal considera la cantidad
  const subtotal = datos.precioBase * datos.cantidad;
  let totalPagar;

  if (datos.prioritario === true) {
    // Medicamento prioritario: se aplica recargo del 16%
    // totalPagar = subtotal + (subtotal × porcentajeRecargo / 100)
    totalPagar = subtotal + (subtotal * PORCENTAJE_RECARGO / 100);
  } else {
    // Medicamento regular: total = subtotal sin recargo
    totalPagar = subtotal;
  }

  const nuevoTurno = {
    id: contadorId++,
    nombrePaciente: datos.nombrePaciente,
    documentoPaciente: datos.documentoPaciente,
    medicamento: datos.medicamento,
    concentracion: datos.concentracion,
    cantidad: datos.cantidad,
    precioBase: datos.precioBase,
    prioritario: datos.prioritario,
    servicio: datos.servicio,
    fechaHora: datos.fechaHora,
    estado: 'pendiente',
    subtotal: parseFloat(subtotal.toFixed(2)),
    porcentajeRecargoAplicado: datos.prioritario === true ? `${PORCENTAJE_RECARGO}%` : '0%',
    totalPagar: parseFloat(totalPagar.toFixed(2))
  };

  turnos.push(nuevoTurno);
  return nuevoTurno;
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crearTurno,
  N,
  PORCENTAJE_RECARGO
};
