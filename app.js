// ============================
// SELECTORES DOM
// ============================

const form = document.getElementById("taskForm")
const taskInput = document.getElementById("taskTitle")

const taskList = document.getElementById("taskList")

const totalTasks = document.getElementById("totalTasks")
const completedTasks = document.getElementById("completedTasks")
const pendingTasks = document.getElementById("pendingTasks")

const taskTemplate = document.getElementById("taskTemplate")

const searchInput = document.getElementById("searchInput")

const completeAllBtn = document.getElementById("completeAllBtn")
const clearCompletedBtn = document.getElementById("clearCompletedBtn")


// ============================
// CONSTANTES
// ============================

const STORAGE_KEY = "tasks"


// ============================
// ESTADO
// ============================

let tasks = []

let currentFilter = "all"

let searchText = ""

// ============================
// HELPERS UI / PERSISTENCIA
// ============================

function syncUI({ render = true, stats = true } = {}){

saveTasks()

if(render) renderTasks()

if(stats) updateStats()

}


// ============================
// MODELO TAREA
// ============================

function createTask(title){

return {

id: Date.now(),

title: title,

completed: false,

createdAt: new Date()

}

}


// ============================
// LOCAL STORAGE
// ============================

function saveTasks(){

localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))

}

function loadTasks(){

const saved = localStorage.getItem(STORAGE_KEY)

if(!saved){

tasks = []

return

}

tasks = JSON.parse(saved)

}


// ============================
// CRUD TAREAS
// ============================

function addTask(title){

const task = createTask(title)

tasks.push(task)

syncUI()

}

function deleteTask(id){

tasks = tasks.filter(task => task.id !== id)

syncUI()

}

function toggleTask(id){

tasks = tasks.map(task => {

if(task.id === id){

return {

...task,

completed: !task.completed

}

}

return task

})

syncUI()

}

function editTask(id,newTitle){

tasks = tasks.map(task => {

if(task.id === id){

return {

...task,

title:newTitle

}

}

return task

})

syncUI({ stats: false })

}


// ============================
// FILTROS Y BUSQUEDA
// ============================

function getFilteredTasks(){

let filtered = tasks

if(currentFilter === "completed") filtered = filtered.filter(task => task.completed)

if(currentFilter === "pending") filtered = filtered.filter(task => !task.completed)

const query = searchText.trim().toLowerCase()

if(query !== ""){

filtered = filtered.filter(task => task.title.toLowerCase().includes(query))

}

return filtered

}


// ============================
// CREAR ELEMENTO DOM
// ============================

function applyCompletedTaskUI({ li, titleEl }, completed){

if(!completed) return

titleEl.style.textDecoration = "line-through"

li.style.opacity = "0.6"

}

function createEditButton(task){

const editBtn = document.createElement("button")

editBtn.textContent = "Editar"

editBtn.addEventListener("click",()=>{

const newTitle = prompt("Editar tarea:",task.title)

if(newTitle && newTitle.trim() !== ""){

editTask(task.id,newTitle.trim())

}

})

return editBtn

}

function bindTaskActions({ completeBtn, deleteBtn, actionsEl }, task){

// completar
completeBtn.addEventListener("click",()=>{

toggleTask(task.id)

})

// eliminar
deleteBtn.addEventListener("click",()=>{

deleteTask(task.id)

})

// editar
actionsEl.appendChild(createEditButton(task))

}

function createTaskElement(task){

const clone = taskTemplate.content.cloneNode(true)

const li = clone.querySelector(".task")

const title = clone.querySelector(".task-title")

const completeBtn = clone.querySelector(".complete-btn")

const deleteBtn = clone.querySelector(".delete-btn")

const actions = clone.querySelector(".task-actions")

title.textContent = task.title

applyCompletedTaskUI({ li, titleEl: title }, task.completed)

bindTaskActions({ completeBtn, deleteBtn, actionsEl: actions }, task)

return clone

}


// ============================
// RENDER TAREAS
// ============================

function renderTasks(){

taskList.innerHTML=""

const visibleTasks = getFilteredTasks()

const fragment = document.createDocumentFragment()

visibleTasks.forEach(task=>{

const element = createTaskElement(task)

fragment.appendChild(element)

})

taskList.appendChild(fragment)

}


// ============================
// ESTADISTICAS
// ============================

function updateStats(){

const total = tasks.length

const completed = tasks.reduce((count, task)=> count + (task.completed ? 1 : 0), 0)

const pending = total - completed

totalTasks.textContent = total

completedTasks.textContent = completed

pendingTasks.textContent = pending

}


// ============================
// EVENTOS
// ============================


// añadir tarea

form.addEventListener("submit",(e)=>{

e.preventDefault()

const title = taskInput.value.trim()

if(title === "") return

addTask(title)

form.reset()

})


// busqueda

if(searchInput){

searchInput.addEventListener("input",function(){

searchText = this.value

renderTasks()

})

}


// filtros

document.querySelectorAll("[data-filter]").forEach(btn=>{

btn.addEventListener("click",function(){

currentFilter = this.dataset.filter

renderTasks()

})

})


// completar todas

if(completeAllBtn){

completeAllBtn.addEventListener("click",()=>{

tasks = tasks.map(task=>({

...task,

completed:true

}))

syncUI()

})

}


// borrar completadas

if(clearCompletedBtn){

clearCompletedBtn.addEventListener("click",()=>{

tasks = tasks.filter(task=>!task.completed)

syncUI()

})

}


// ============================
// INIT APP
// ============================

function init(){

loadTasks()

renderTasks()

updateStats()

}

init()