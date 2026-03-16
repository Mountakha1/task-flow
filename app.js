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

saveTasks()

renderTasks()

updateStats()

}

function deleteTask(id){

tasks = tasks.filter(task => task.id !== id)

saveTasks()

renderTasks()

updateStats()

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

saveTasks()

renderTasks()

updateStats()

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

saveTasks()

renderTasks()

}


// ============================
// FILTROS Y BUSQUEDA
// ============================

function getFilteredTasks(){

let filtered = tasks

if(currentFilter === "completed"){

filtered = filtered.filter(task => task.completed)

}

if(currentFilter === "pending"){

filtered = filtered.filter(task => !task.completed)

}

if(searchText !== ""){

filtered = filtered.filter(task =>
task.title.toLowerCase().includes(searchText.toLowerCase())
)

}

return filtered

}


// ============================
// CREAR ELEMENTO DOM
// ============================

function createTaskElement(task){

const clone = taskTemplate.content.cloneNode(true)

const li = clone.querySelector(".task")

const title = clone.querySelector(".task-title")

const completeBtn = clone.querySelector(".complete-btn")

const deleteBtn = clone.querySelector(".delete-btn")

const actions = clone.querySelector(".task-actions")

title.textContent = task.title


if(task.completed){

title.style.textDecoration = "line-through"

li.style.opacity = "0.6"

}


// completar

completeBtn.addEventListener("click",()=>{

toggleTask(task.id)

})


// eliminar

deleteBtn.addEventListener("click",()=>{

deleteTask(task.id)

})


// editar

const editBtn = document.createElement("button")

editBtn.textContent="Editar"

editBtn.addEventListener("click",()=>{

const newTitle = prompt("Editar tarea:",task.title)

if(newTitle && newTitle.trim() !== ""){

editTask(task.id,newTitle.trim())

}

})

actions.appendChild(editBtn)

return clone

}


// ============================
// RENDER TAREAS
// ============================

function renderTasks(){

taskList.innerHTML=""

const visibleTasks = getFilteredTasks()

visibleTasks.forEach(task=>{

const element = createTaskElement(task)

taskList.appendChild(element)

})

}


// ============================
// ESTADISTICAS
// ============================

function updateStats(){

const total = tasks.length

const completed = tasks.filter(t=>t.completed).length

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

saveTasks()

renderTasks()

updateStats()

})

}


// borrar completadas

if(clearCompletedBtn){

clearCompletedBtn.addEventListener("click",()=>{

tasks = tasks.filter(task=>!task.completed)

saveTasks()

renderTasks()

updateStats()

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