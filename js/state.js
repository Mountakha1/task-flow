export const state = {
  taskItems: [],
  currentFilter: "all",
  searchQuery: "",
}

/**
 * Reemplaza la lista de tareas del estado.
 * @param {unknown} taskItems
 */
export function setTasks(taskItems){
  state.taskItems = Array.isArray(taskItems) ? taskItems : []
}

/**
 * Crea una tarea nueva.
 * @param {string} title
 * @returns {{ id: number, title: string, completed: boolean, createdAt: Date }}
 */
export function createTask(title){
  return {
    id: Date.now(),
    title,
    completed: false,
    createdAt: new Date(),
  }
}

/**
 * Agrega una tarea al estado.
 * @param {string} title
 */
export function addTask(title){
  state.taskItems = [...state.taskItems, createTask(title)]
}

/**
 * Elimina una tarea por id.
 * @param {number} taskId
 */
export function deleteTask(taskId){
  state.taskItems = state.taskItems.filter(task => task.id !== taskId)
}

/**
 * Alterna completada/no completada.
 * @param {number} taskId
 */
export function toggleTask(taskId){
  state.taskItems = state.taskItems.map(task => (
    task.id === taskId ? { ...task, completed: !task.completed } : task
  ))
}

/**
 * Edita el título de una tarea.
 * @param {number} taskId
 * @param {string} newTitle
 */
export function editTaskTitle(taskId, newTitle){
  state.taskItems = state.taskItems.map(task => (
    task.id === taskId ? { ...task, title: newTitle } : task
  ))
}

/**
 * Marca todas como completadas.
 */
export function completeAll(){
  state.taskItems = state.taskItems.map(task => ({ ...task, completed: true }))
}

/**
 * Elimina las tareas completadas.
 */
export function clearCompleted(){
  state.taskItems = state.taskItems.filter(task => !task.completed)
}

/**
 * Devuelve tareas filtradas y buscadas según el estado actual.
 * @returns {Array<{ id: number, title: string, completed: boolean }>}
 */
export function getVisibleTasks(){
  let visible = state.taskItems

  if(state.currentFilter === "completed") visible = visible.filter(task => task.completed)
  if(state.currentFilter === "pending") visible = visible.filter(task => !task.completed)

  const query = state.searchQuery.trim().toLowerCase()
  if(query !== ""){
    visible = visible.filter(task => task.title.toLowerCase().includes(query))
  }

  return visible
}

