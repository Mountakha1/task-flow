## Task Flow

Aplicación web (HTML/CSS/JS) para **gestionar tareas** en el navegador, con persistencia en `localStorage`.

### Funcionalidades

- **Crear tareas** con validaciones:
  - Título obligatorio
  - Máximo 120 caracteres
  - Evita duplicados (comparación normalizada)
- **Editar título** de una tarea (con las mismas validaciones)
- **Completar / eliminar** tareas
- **Búsqueda por texto** (filtra por título)
- **Estadísticas**: total, completadas y pendientes
- **Persistencia local**: guarda y carga desde `localStorage`

### Cómo ejecutar

No requiere instalación ni backend.

- **Opción A (recomendada)**: abre el proyecto con una extensión tipo “Live Server” (VS Code/Cursor) y abre `index.html`.
- **Opción B**: abre `index.html` directamente en el navegador.

### Ejemplos de uso

- **Añadir una tarea**:
  1. Escribe un título (por ejemplo: `Estudiar JavaScript`)
  2. Pulsa “Añadir tarea”

- **Buscar tareas**:
  1. En la caja “Buscar por título…”, escribe `estudiar`
  2. La lista se filtra automáticamente

- **Editar una tarea**:
  1. Pulsa “Editar”
  2. Escribe un nuevo título
  3. Si el título es inválido o duplicado, verás un mensaje de error

### Estructura del proyecto

```text
task-flow/
  index.html
  style.css
  js/
    main.js      # arranque, eventos, validaciones, sincronización UI
    dom.js       # referencias al DOM
    state.js     # estado + operaciones sobre tareas + selector visible
    ui.js        # renderizado + estadísticas
    storage.js   # load/save en localStorage
```

### Documentación de funciones (resumen)

Las funciones principales están documentadas con **JSDoc** en `js/`.

- **`js/main.js`**
  - `validateTaskTitle(rawTitle, options)`: valida título (vacío, longitud, duplicados).
  - `syncUI(options)`: persiste y actualiza UI/estadísticas.
  - `runAndSync(action, options)`: helper para evitar repetición (mutación + sync).

- **`js/state.js`**
  - `addTask(title)`, `deleteTask(taskId)`, `toggleTask(taskId)`, `editTaskTitle(taskId, newTitle)`
  - `completeAll()`, `clearCompleted()`
  - `getVisibleTasks()`: aplica filtro/búsqueda en base al estado.

- **`js/ui.js`**
  - `renderTasks(dom, visibleTasks, handlers)`: render de la lista.
  - `updateStats(dom, taskItems)`: actualiza contadores.

- **`js/storage.js`**
  - `loadTasks()`: carga desde `localStorage`.
  - `saveTasks(taskItems)`: guarda en `localStorage`.

### Notas

- Las tareas se guardan en el navegador del usuario. Para “resetear” el estado, limpia el `localStorage` del sitio o borra los datos del navegador.
