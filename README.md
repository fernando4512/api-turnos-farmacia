# API REST - Tu Inventario.com | Módulo de Pendientes de Medicamentos

## Integrantes del Equipo (Orden Alfabético por Apellido)

| # Lista Oficial | Nombre Completo |
|-----------------|----------------|
| 8 | Mosquera Arango Luis Fernando |
| 10 | Perea Córdoba Yeison Estiven |


## Valor de N y Porcentaje de Recargo

- **Primer integrante en orden alfabético:** Mosquera Arango Luis Fernando (puesto #8 en la lista oficial)
- **N = 8**
- **Porcentaje de Recargo:** N × 2% = 8 × 2% = **16%**

## Descripción del Negocio

**Tu Inventario.com - Módulo de Gestión de Pendientes de Medicamentos**

**Tu Inventario.com** (https://www.tuinventario.com.co) es un sistema SaaS de inventario multiempresa diseñado para droguerías, depósitos de medicamentos, almacenes y otros negocios comerciales. Dentro de su extensión farmacéutica, el sistema incluye un **módulo de pendientes** que gestiona las solicitudes de medicamentos que no están disponibles de inmediato.

**Actividad principal:** Cuando un paciente o cliente solicita un medicamento en una droguería o depósito farmacéutico y este no se encuentra disponible en el inventario actual, se genera un **turno de pendiente**. Este turno queda registrado en el sistema hasta que el medicamento sea surtido por el proveedor y despachado al paciente. El módulo permite registrar, consultar y dar seguimiento a estos pendientes.

**Datos que requiere un turno de pendiente:**
- `nombrePaciente`: Nombre completo del paciente que solicita el medicamento.
- `documentoPaciente`: Número de documento de identidad del paciente.
- `medicamento`: Nombre comercial o genérico del medicamento solicitado.
- `concentracion`: Concentración o presentación del medicamento (ej: "500mg", "10ml", "Caja x 30 tabletas").
- `cantidad`: Cantidad de unidades requeridas.
- `precioBase`: Precio unitario base del medicamento (en pesos colombianos).
- `prioritario`: Indica si el pendiente requiere gestión prioritaria (`true`/`false`, booleano sin comillas; si se omite se asume `false`). Aplica para medicamentos de urgencia, controlados o de alto costo.
- `servicio`: Servicio o área que genera la solicitud (ej: "Mostrador", "Domicilios", "Hospitalario", "EPS").
- `fechaHora`: Fecha y hora programada para el despacho.

**Regla de negocio:** Si el pendiente es de atención prioritaria (`"prioritario": true`), se aplica un recargo del 16% sobre el subtotal (precio base × cantidad) por gestión urgente de despacho. Si no es prioritario, el total a pagar es igual al subtotal.

**Fórmula:**
```
subtotal   = precioBase × cantidad
totalPagar = subtotal + (subtotal × 16 / 100)   // Si prioritario = true
totalPagar = subtotal                           // Si prioritario = false
```

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework para la API REST
- **Almacenamiento en memoria** - Arreglo en memoria (sin base de datos externa)

## Arquitectura por Capas

```
api-turnos-farmacia/
├── index.js                  # Archivo principal: inicializa Express y conecta rutas
├── routes/
│   └── turnoRoutes.js        # Define los endpoints y los asocia a los controladores
├── controllers/
│   └── turnoController.js    # Gestiona req/res, valida datos y asigna códigos HTTP
├── services/
│   └── turnoService.js       # Lógica de negocio, cálculo de tarifas y gestión de datos
├── middleware/
│   └── auth.js               # Autenticación con usuario y contraseña (HTTP Basic Auth)
├── package.json
├── .gitignore
└── README.md
```

**Responsabilidad de cada capa:**

- **`index.js`**: Inicializa la aplicación Express, configura el middleware `express.json()`, conecta las rutas y levanta el servidor en el puerto 3000.
- **`routes/`**: Define únicamente los endpoints (`GET /`, `GET /:id`, `POST /`) y los asocia con los métodos del controlador correspondiente. No contiene lógica de negocio.
- **`controllers/`**: Recibe la petición (`req`) y la respuesta (`res`), valida los datos de entrada (campos faltantes, tipos de datos, valores numéricos inválidos) y retorna los códigos de estado HTTP apropiados (200, 201, 400, 404).
- **`middleware/`**: Verifica el usuario y la contraseña de cada petición a `/api/turnos` antes de que llegue a las rutas. Si faltan o son incorrectos responde 401 Unauthorized.
- **`services/`**: Contiene toda la lógica de negocio pura: el almacenamiento de datos en memoria, el parámetro N, el cálculo del porcentaje de recargo y la fórmula del total a pagar.

## Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/api-turnos-farmacia.git

# 2. Entrar al directorio del proyecto
cd api-turnos-farmacia

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## Autenticación (usuario y contraseña)

Todos los endpoints de `/api/turnos` están protegidos con **HTTP Basic Auth**. La ruta raíz `/` es pública.

1. Crea un archivo `.env` en la raíz del proyecto (no se sube al repositorio, está en `.gitignore`):

   ```
   API_USUARIO=tu_usuario
   API_PASSWORD="tu_contraseña"
   ```

   > Si la contraseña contiene `#`, escríbela entre comillas dobles; sin comillas, todo lo que va después del `#` se toma como comentario.

2. Envía las credenciales en cada petición:
   - **Postman:** pestaña *Authorization* → *Basic Auth* → escribe usuario y contraseña.
   - **curl:** `curl -u tu_usuario:tu_contraseña http://localhost:3000/api/turnos`

Si no existe el archivo `.env`, el servidor usa las credenciales por defecto `admin` / `farmacia2026` y muestra una advertencia en consola.

| Situación | Respuesta |
|-----------|-----------|
| Sin credenciales | 401 `{"error": "Se requiere autenticación con usuario y contraseña"}` |
| Usuario o contraseña incorrectos | 401 `{"error": "Usuario o contraseña incorrectos"}` |
| Credenciales correctas | La respuesta normal del endpoint |

## Pruebas con Postman

La carpeta `postman/` contiene la colección **`API-Turnos-Farmacia.postman_collection.json`**, con 33 peticiones y 199 verificaciones automáticas.

1. En Postman: **Import** → selecciona el archivo.
2. En la colección, pestaña **Variables**, escribe en *Current value* el `usuario` y `password` de tu `.env` (y `baseUrl` si usas otro puerto).
3. Inicia el servidor (`npm start`) y ejecuta **Run collection** en orden.

| Carpeta | Qué prueba |
|---------|------------|
| 1. General | Ruta raíz pública |
| 2. Autenticación (401) | Sin credenciales, usuario/contraseña incorrectos, esquema Bearer, formato inválido, mayúsculas |
| 3. Crear pendientes (201) | Prioritario (16%), regular, sin `prioritario`, decimales, IDs consecutivos |
| 4. Validaciones (400) | Campos faltantes, valores ≤ 0, tipos incorrectos, `prioritario` no booleano, JSON mal formado |
| 5. Consultar (200/400/404) | Listar todos, consulta por ID, ID inexistente, ID no numérico |

También se puede ejecutar por consola con Newman:

```bash
npx newman run postman/API-Turnos-Farmacia.postman_collection.json --env-var "usuario=tu_usuario" --env-var "password=tu_contraseña"
```

> Los datos están en memoria: reinicia el servidor antes de cada ejecución si quieres empezar con la lista vacía.

## Endpoints Disponibles

| Método | Ruta | Descripción | Código Éxito | Código Error |
|--------|------|-------------|-------------|-------------|
| GET | `/api/turnos` | Obtener todos los pendientes | 200 OK | 401 Unauthorized |
| GET | `/api/turnos/:id` | Obtener un pendiente por ID | 200 OK | 401 Unauthorized, 404 Not Found |
| POST | `/api/turnos` | Registrar un nuevo pendiente | 201 Created | 400 Bad Request, 401 Unauthorized |

## Ejemplos de Pruebas con JSON

### Caso Exitoso - POST /api/turnos (201 Created)

**Pendiente con atención prioritaria (medicamento controlado):**

```json
POST http://localhost:3000/api/turnos
Content-Type: application/json

{
  "nombrePaciente": "Carlos Andrés López",
  "documentoPaciente": "1088345672",
  "medicamento": "Tramadol",
  "concentracion": "50mg Caja x 10 tabletas",
  "cantidad": 2,
  "precioBase": 45000,
  "prioritario": true,
  "servicio": "Mostrador",
  "fechaHora": "2026-11-25 09:30"
}
```

**Respuesta esperada (201 Created):**

```json
{
  "id": 1,
  "nombrePaciente": "Carlos Andrés López",
  "documentoPaciente": "1088345672",
  "medicamento": "Tramadol",
  "concentracion": "50mg Caja x 10 tabletas",
  "cantidad": 2,
  "precioBase": 45000,
  "prioritario": true,
  "servicio": "Mostrador",
  "fechaHora": "2026-11-25 09:30",
  "estado": "pendiente",
  "subtotal": 90000,
  "porcentajeRecargoAplicado": "16%",
  "totalPagar": 104400
}
```

> **Cálculo:** subtotal = 45000 × 2 = 90000 → totalPagar = 90000 + (90000 × 16 / 100) = 90000 + 14400 = **104400**

---

**Pendiente SIN atención prioritaria (medicamento regular):**

```json
POST http://localhost:3000/api/turnos
Content-Type: application/json

{
  "nombrePaciente": "María Fernanda Ríos",
  "documentoPaciente": "42156789",
  "medicamento": "Ibuprofeno",
  "concentracion": "400mg Caja x 30 tabletas",
  "cantidad": 1,
  "precioBase": 12000,
  "prioritario": false,
  "servicio": "Domicilios",
  "fechaHora": "2026-11-26 14:00"
}
```

**Respuesta esperada (201 Created):**

```json
{
  "id": 2,
  "nombrePaciente": "María Fernanda Ríos",
  "documentoPaciente": "42156789",
  "medicamento": "Ibuprofeno",
  "concentracion": "400mg Caja x 30 tabletas",
  "cantidad": 1,
  "precioBase": 12000,
  "prioritario": false,
  "servicio": "Domicilios",
  "fechaHora": "2026-11-26 14:00",
  "estado": "pendiente",
  "subtotal": 12000,
  "porcentajeRecargoAplicado": "0%",
  "totalPagar": 12000
}
```

> **Cálculo:** subtotal = 12000 × 1 = 12000 → totalPagar = subtotal = **12000** (sin recargo)

### Caso de Error de Validación - POST /api/turnos (400 Bad Request)

**Solicitud con campos faltantes:**

```json
POST http://localhost:3000/api/turnos
Content-Type: application/json

{
  "nombrePaciente": "Juan Pérez",
  "medicamento": "Acetaminofén"
}
```

**Respuesta esperada (400 Bad Request):**

```json
{
  "error": "Faltan campos obligatorios para registrar el pendiente",
  "camposFaltantes": ["documentoPaciente", "concentracion", "cantidad", "precioBase", "servicio", "fechaHora"]
}
```

---

**Solicitud con valor numérico inválido:**

```json
POST http://localhost:3000/api/turnos
Content-Type: application/json

{
  "nombrePaciente": "Ana García",
  "documentoPaciente": "1090123456",
  "medicamento": "Losartán",
  "concentracion": "50mg Caja x 30 tabletas",
  "cantidad": -5,
  "precioBase": 30000,
  "servicio": "EPS",
  "fechaHora": "2026-11-27 10:00"
}
```

**Respuesta esperada (400 Bad Request):**

```json
{
  "error": "El campo \"cantidad\" debe ser un número mayor a cero"
}
```

### Caso de ID Inexistente - GET /api/turnos/999 (404 Not Found)

```
GET http://localhost:3000/api/turnos/999
```

**Respuesta esperada (404 Not Found):**

```json
{
  "error": "No se encontró un pendiente con el ID 999"
}
```

---

*Desarrollado como parte del Taller Evaluativo Final de Arquitectura Cliente-Servidor — CIAF*
*Basado en el módulo de pendientes del sistema Tu Inventario.com (https://www.tuinventario.com.co)*
