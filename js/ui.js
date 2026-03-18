/**
 * Aplica estilos de “tarea completada”.
 * @param {{ taskRowEl: HTMLElement, taskTitleEl: HTMLElement }} refs
 * @param {boolean} completed
 */
function applyCompletedTaskUI({ taskRowEl, taskTitleEl }, completed){
  if(!completed) return
  taskTitleEl.style.textDecoration = "line-through"
  taskRowEl.style.opacity = "0.6"
}

/**
 * Crea botón Editar y bindea el flujo de edición.
 * @param {{ task: { id: number, title: string }, onEdit: (taskId: number, newTitle: string) => void }} params
 * @returns {HTMLButtonElement}
 */
function createEditButton({ task, onEdit }){
  const editBtn = document.createElement("button")
  editBtn.textContent = "Editar"

  editBtn.addEventListener("click",()=>{
    const newTitle = prompt("Editar tarea:", task.title)
    const trimmed = newTitle?.trim()
    if(trimmed) onEdit(task.id, trimmed)
  })

  return editBtn
}

/**
 * Bindea acciones de una tarea.
 * @param {{ completeBtn: HTMLButtonElement, deleteBtn: HTMLButtonElement, actionsEl: HTMLElement }} elements
 * @param {{ task: { id: number, title: string }, onToggle: (taskId: number) => void, onDelete: (taskId: number) => void, onEdit: (taskId: number, newTitle: string) => void }} handlers
 */
function bindTaskActions({ completeBtn, deleteBtn, actionsEl }, { task, onToggle, onDelete, onEdit }){
  completeBtn.addEventListener("click",()=> onToggle(task.id))
  deleteBtn.addEventListener("click",()=> onDelete(task.id))
  actionsEl.appendChild(createEditButton({ task, onEdit }))
}

/**
 * Crea el DOM de una tarea a partir de la plantilla.
 * @param {{ taskTemplate: HTMLTemplateElement }} dom
 * @param {{ id: number, title: string, completed: boolean }} task
 * @param {{ onToggle: (taskId: number) => void, onDelete: (taskId: number) => void, onEdit: (taskId: number, newTitle: string) => void }} handlers
 * @returns {DocumentFragment}
 */
export function createTaskElement(dom, task, handlers){
  const clone = dom.taskTemplate.content.cloneNode(true)

  const taskRowEl = clone.querySelector(".task")
  const taskTitleEl = clone.querySelector(".task-title")

  const completeBtn = clone.querySelector(".complete-btn")
  const deleteBtn = clone.querySelector(".delete-btn")
  const actionsEl = clone.querySelector(".task-actions")

  taskTitleEl.textContent = task.title
  applyCompletedTaskUI({ taskRowEl, taskTitleEl }, task.completed)
  bindTaskActions({ completeBtn, deleteBtn, actionsEl }, { task, ...handlers })

  return clone
}

/**
 * Renderiza una lista de tareas visible.
 * @param {{ taskList: HTMLElement }} dom
 * @param {Array<{ id: number, title: string, completed: boolean }>} visibleTasks
 * @param {{ onToggle: (taskId: number) => void, onDelete: (taskId: number) => void, onEdit: (taskId: number, newTitle: string) => void }} handlers
 */
export function renderTasks(dom, visibleTasks, handlers){
  dom.taskList.innerHTML = ""

  const fragment = document.createDocumentFragment()
  visibleTasks.forEach(task => {
    fragment.appendChild(createTaskElement(dom, task, handlers))
  })

  dom.taskList.appendChild(fragment)
}

/**
 * Actualiza estadísticas del panel lateral.
 * @param {{ totalTasksValue: HTMLElement, completedTasksValue: HTMLElement, pendingTasksValue: HTMLElement }} dom
 * @param {Array<{ completed: boolean }>} taskItems
 */
export function updateStats(dom, taskItems){
  const total = taskItems.length
  const completed = taskItems.reduce((count, task)=> count + (task.completed ? 1 : 0), 0)
  const pending = total - completed

  dom.totalTasksValue.textContent = total
  dom.completedTasksValue.textContent = completed
  dom.pendingTasksValue.textContent = pending
}

