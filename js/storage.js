const STORAGE_KEY = "tasks"

/**
 * Persiste tareas en localStorage.
 * @param {Array<{ id: number, title: string, completed: boolean }>} taskItems
 */
export function saveTasks(taskItems){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskItems))
}

/**
 * Carga tareas desde localStorage.
 * @returns {Array<{ id: number, title: string, completed: boolean, createdAt?: unknown }>}
 */
export function loadTasks(){
  const raw = localStorage.getItem(STORAGE_KEY)
  if(!raw) return []

  try{
    return JSON.parse(raw) ?? []
  }catch{
    return []
  }
}

