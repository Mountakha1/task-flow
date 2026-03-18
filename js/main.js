import { dom } from "./dom.js"
import { loadTasks, saveTasks } from "./storage.js"
import {
  state,
  setTasks,
  addTask,
  deleteTask,
  toggleTask,
  editTaskTitle,
  completeAll,
  clearCompleted,
  getVisibleTasks,
} from "./state.js"
import { renderTasks, updateStats } from "./ui.js"

/**
 * @typedef {Object} SyncUIOptions
 * @property {boolean} [render]
 * @property {boolean} [stats]
 */

/**
 * Persiste el estado y actualiza UI/estadísticas.
 * @param {SyncUIOptions} [options]
 */
function syncUI({ render = true, stats = true } = {}){
  saveTasks(state.taskItems)
  if(render) renderTasks(dom, getVisibleTasks(), handlers)
  if(stats) updateStats(dom, state.taskItems)
}

const TITLE_MIN_LENGTH = 1
const TITLE_MAX_LENGTH = 120

/**
 * Normaliza un título para comparar duplicados.
 * @param {string} title
 * @returns {string}
 */
function normalizeTitleForCompare(title){
  return title.trim().replace(/\s+/g, " ").toLowerCase()
}

/**
 * Valida el título de una tarea (vacío, longitud, duplicados).
 * @param {string} rawTitle
 * @param {{ excludeTaskId?: number }} [options]
 * @returns {{ ok: true, value: string } | { ok: false, message: string }}
 */
function validateTaskTitle(rawTitle, { excludeTaskId } = {}){
  const value = rawTitle.trim().replace(/\s+/g, " ")

  if(value.length < TITLE_MIN_LENGTH) return { ok: false, message: "Escribe un título." }
  if(value.length > TITLE_MAX_LENGTH) return { ok: false, message: `Máximo ${TITLE_MAX_LENGTH} caracteres.` }

  const normalized = normalizeTitleForCompare(value)
  const hasDuplicate = state.taskItems.some(task => (
    task.id !== excludeTaskId && normalizeTitleForCompare(task.title) === normalized
  ))
  if(hasDuplicate) return { ok: false, message: "Ya existe una tarea con ese título." }

  return { ok: true, value }
}

/**
 * Ejecuta una mutación de estado y sincroniza UI.
 * @param {() => void} action
 * @param {SyncUIOptions} [options]
 */
function runAndSync(action, options){
  action()
  syncUI(options)
}

const handlers = {
  onToggle: (taskId)=>{
    runAndSync(()=> toggleTask(taskId))
  },
  onDelete: (taskId)=>{
    runAndSync(()=> deleteTask(taskId))
  },
  onEdit: (taskId, newTitle)=>{
    const result = validateTaskTitle(newTitle, { excludeTaskId: taskId })
    if(!result.ok){
      alert(result.message)
      return
    }

    editTaskTitle(taskId, result.value)
    syncUI({ stats: false })
  },
}

function bindEvents(){
  dom.taskForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    const result = validateTaskTitle(dom.taskTitleInput.value)
    dom.taskTitleInput.setCustomValidity(result.ok ? "" : result.message)
    if(!result.ok){
      dom.taskTitleInput.reportValidity()
      return
    }

    runAndSync(()=> addTask(result.value))
    dom.taskForm.reset()
    dom.taskTitleInput.setCustomValidity("")
  })

  dom.taskTitleInput.addEventListener("input",()=>{
    dom.taskTitleInput.setCustomValidity("")
  })

  if(dom.searchInput){
    dom.searchInput.addEventListener("input", function(){
      state.searchQuery = this.value
      renderTasks(dom, getVisibleTasks(), handlers)
    })
  }

  document.querySelectorAll("[data-filter]").forEach(btn=>{
    btn.addEventListener("click", function(){
      state.currentFilter = this.dataset.filter
      renderTasks(dom, getVisibleTasks(), handlers)
    })
  })

  if(dom.completeAllBtn){
    dom.completeAllBtn.addEventListener("click",()=>{
      runAndSync(()=> completeAll())
    })
  }

  if(dom.clearCompletedBtn){
    dom.clearCompletedBtn.addEventListener("click",()=>{
      runAndSync(()=> clearCompleted())
    })
  }
}

function init(){
  setTasks(loadTasks())
  bindEvents()
  renderTasks(dom, getVisibleTasks(), handlers)
  updateStats(dom, state.taskItems)
}

init()

