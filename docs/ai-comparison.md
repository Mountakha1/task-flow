# AI Comparison

Pide a ambos asistentes que expliquen al menos tres conceptos técnicos (por ejemplo closures, event loop, DOM, hoisting o prototipos):

ChatGPT:
    -Closures (cierres)

Un closure ocurre cuando una función recuerda variables de su entorno, incluso después de que ese entorno haya terminado.
    -Event Loop

El event loop es el mecanismo que permite que JavaScript maneje tareas asíncronas.
    -DOM (Document Object Model)

El DOM es una representación del HTML como un árbol de objetos que JavaScript puede manipular.
    -Hoisting

El hoisting es cuando JavaScript mueve declaraciones al inicio del código antes de ejecutarlo.
    -Prototipos

Los prototipos son el sistema de herencia de JavaScript.
Cada objeto puede heredar propiedades de otro objeto.

En resumen: 

Concepto:	¿Qué hace?
Closures	    Guardan variables del entorno
Event Loop	    Maneja asincronía
DOM	            Representa el HTML
Hoisting	    Mueve variables al inicio
Prototipos	    Permiten herencia

Claude:
Aquí tienes un resumen rápido de cada uno:

Hoisting — JS reorganiza internamente las declaraciones al arrancar. Las funciones suben completas; var sube pero sin valor; let/const no se pueden usar antes de declararlas.

Closures — Una función "captura" las variables del contexto donde fue creada y las mantiene vivas aunque ese contexto ya haya terminado. Es uno de los patrones más poderosos de JS.

Prototipos — El sistema de herencia nativo de JS. Los objetos se encadenan entre sí; si una propiedad no existe en el objeto actual, la búsqueda sube por la cadena. Las class de ES6 son solo una sintaxis más cómoda encima de este mecanismo.

DOM — La API que permite a JS leer y manipular el HTML/CSS de la página como si fueran objetos. Sin el DOM, JS no tendría forma de interactuar con lo que ve el usuario.

Event Loop — El mecanismo que hace posible la asincronía en un lenguaje de un solo hilo. Gestiona en qué orden se ejecutan el código síncrono, las promesas y los temporizadores.

Compara claridad, profundidad y ejemplos de cada explicación:

Aspecto	        Claridad                        Profundidad 
Definición: 	Qué tan fácil es entender algo 	Qué tan completo y detallado es
Objetivo	    Comprensión rápida	            Comprensión completa
Lenguaje	    Simple y directo	            Más técnico y detallado
Uso	Principiantes	Intermedio                  avanzado
Riesgo	        Puede ser superficial	        Puede ser difícil de entender
CLARIDAD:

Es cuando algo está explicado de forma:
Sencilla, directay fácil de entender.

Claude:
Claridad
Fácil de entender
Usa el lenguaje más simple posible. El lector no necesita rellenar huecos. Prioriza la comprensión inmediata sobre la precisión técnica.

Profundidad
Completo y preciso
Cubre los matices, casos borde y mecanismos internos. El lector puede confiar en que no hay simplificaciones que lo engañen.

ChatGPT:
Escribe tres funciones JavaScript con errores intencionales y pide a ambos asistentes que detecten y expliquen el bug:

Funcion 1
function sumarNumeros(a, b) {
  return a + b
}

console.log(sumarNumeros(5, "10"))
Error
Se está sumando un número (5) con un string ("10").
En JavaScript, el operador +:
suma númeroo pero concatena strings
Resultado real "510"

Solución
Convertir a número:
return Number(a) + Number(b)

Funcion 2
function contador() {
  for (var i = 0; i < 3; i++) {
    setTimeout(function () {
      console.log(i)
    }, 1000)
  }
}

contador()

Error
Uso de var en un bucle con setTimeout.
Resultado real
3
3
3

Por qué pasa
var tiene scope global o de función
El setTimeout se ejecuta después
Cuando se ejecuta, el bucle ya terminó → i = 3 
Esto está relacionado con:
closures
asincronía

Soluciones
Opción 1 (mejor):
for (let i = 0; i < 3; i++)

Función 3
function obtenerUsuario(usuario) {
  if (usuario.nombre) {
    return "Hola " + usuario.nombre
  }
}

console.log(obtenerUsuario())
Error

Se llama a la función sin pasar el parámetro usuario.
Resultado
TypeError: Cannot read properties of undefined
Por qué pasa

usuario es undefined, entonces:

usuario.nombre
rompe el código

Soluciones
Opción 1: Validar
if (usuario && usuario.nombre)

Describe en lenguaje natural tres funciones distintas y pide que generen la implementación:

Parte 1: Descripción en lenguaje natural

Pide a ambos asistentes que implementen estas funciones:

🔹 Función 1: Filtrar tareas completadas

👉 Descripción:

Crea una función que reciba un array de tareas.
Cada tarea tiene: id, title y completed.

La función debe devolver solo las tareas que están completadas.

🔹 Función 2: Contar palabras

👉 Descripción:

Crea una función que reciba un texto (string)
y devuelva el número de palabras que contiene.

Función 3: Encontrar el número mayor

👉 Descripción:

Crea una función que reciba un array de números
y devuelva el número más grande.

Si el array está vacío, debe devolver null.

Analiza la calidad del código generado por cada asistente

Función 1: Filtrar tareas completadas
function getCompletedTasks(tasks) {
  if (!Array.isArray(tasks)) return []

  return tasks.filter(task => task && task.completed === true)
}

✔ Usa filter (eficiente y claro)
✔ Valida que sea un array
✔ Evita errores con tareas inválidas

✅ Función 2: Contar palabras
function countWords(text) {
  if (typeof text !== "string") return 0

  return text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length
}

✔ Elimina espacios extra
✔ Maneja string vacío
✔ Usa regex para mayor precisión

Función 3: Encontrar el número mayor
function getMaxNumber(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) return null

  return Math.max(...numbers)
}

✔ Maneja array vacío
✔ Código simple y eficiente
✔ Usa Math.max correctamente