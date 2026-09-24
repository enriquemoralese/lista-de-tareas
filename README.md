# Lista de tareas

Aplicación web para llevar una lista de tareas: agregarlas, marcarlas como completadas,
eliminarlas y ponerles una nota. El servidor está hecho con Flask y la interfaz con HTML,
CSS y un poco de JavaScript.

## Funcionalidades

- Agregar una tarea escribiéndola en el campo de texto y pulsando "Agregar".
- Marcarla como completada con el checkbox. Las completadas salen de la lista principal
  y pasan a la sección desplegable "Completadas". Si se desmarcan, vuelven.
- Eliminar una tarea con el botón de la papelera, que aparece al pasar el ratón por encima.
- Ponerle una nota a cada tarea. Pasa el ratón sobre una tarea y pulsa "+ nota" para
  escribirla. Para cambiarla, haz clic en la nota. Para borrarla, guárdala vacía.
- Contador de tareas pendientes en el encabezado.
- Animaciones al agregar y al quitar tareas, que se desactivan solas si el sistema
  operativo está configurado para reducir el movimiento.

## Requisitos

- Python 3.9 o superior
- git

Para comprobar la versión de Python instalada:

```
python3 --version
```

En Windows el comando suele ser `python --version`.

## Instalación

### 1. Clonar el repositorio

```
git clone https://github.com/enriquemoralese/lista-de-tareas.git
cd lista-de-tareas
```

### 2. Crear y activar el entorno virtual

En Mac y Linux:

```
python3 -m venv .venv
source .venv/bin/activate
```

En Windows:

```
python -m venv .venv
.venv\Scripts\activate
```

Si Windows PowerShell no deja activarlo y muestra un error de "execution policy",
ejecuta esto una sola vez y vuelve a intentar la activación:

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Cuando el entorno está activo, el nombre `(.venv)` aparece al principio de la línea
de la terminal.

### 3. Instalar las dependencias

```
pip install -r requirements.txt
```

## Ejecución

Con el entorno virtual activado:

```
python app.py
```

Abre http://localhost:3000 en el navegador.

Para detener el servidor, pulsa Ctrl+C en la terminal. Para salir del entorno virtual,
escribe `deactivate`.

Las tareas se guardan en la memoria del servidor, no en una base de datos. Esto significa
que se borran al detener o reiniciar el servidor. La aplicación arranca en modo depuración,
así que también se reinicia (y la lista se vacía) cada vez que se guarda un cambio en
un archivo del proyecto.

## Estructura del proyecto

```
lista-de-tareas/
├── app.py              Servidor Flask: las rutas y la lista de tareas en memoria.
├── requirements.txt    Las dependencias del proyecto.
├── README.md           Este archivo.
├── .gitignore          Lo que git no debe versionar (el entorno virtual, entre otras cosas).
├── static/
│   ├── style.css       Los estilos de la página.
│   └── app.js          Las animaciones de la lista.
└── templates/
    └── index.html      La plantilla con el HTML de la página.
```

## Decisiones técnicas

**Flask.** La aplicación es pequeña y solo necesita servir una página y responder a cuatro
acciones, así que un framework mínimo es suficiente. La única dependencia del proyecto
es Flask.

**Los datos viven en memoria.** Las tareas son una lista de diccionarios en `app.py`.
El enunciado permitía no usar base de datos, y así el proyecto se ejecuta sin instalar
ni configurar nada más. Cada tarea tiene un id propio, en lugar de identificarse por su
posición en la lista, porque las posiciones cambian cuando se elimina una tarea.

**Cada cambio es un POST seguido de una redirección.** Agregar, completar, eliminar y
guardar una nota son formularios que envían un POST y luego redirigen a la página
principal. Este patrón, Post/Redirect/Get, evita que al recargar el navegador se repita
la última acción. Se usan formularios y no enlaces porque una petición GET no debe
modificar datos.

**JavaScript solo para las animaciones.** El servidor es el que manda: todo lo que cambia
pasa por él. El JavaScript del proyecto únicamente retrasa el envío de un formulario lo
que dura una animación y marca la fila que acaba de llegar. Si se desactiva JavaScript,
la aplicación sigue funcionando entera, solo que sin animaciones.

## Uso de IA

Usé Claude Code como asistente durante todo el proyecto: para entender cómo funciona
Flask, que no había usado antes, para discutir alternativas y para escribir parte del
código y de este README.

Revisé cada cambio antes de darlo por bueno, probé la aplicación en cada paso y las
decisiones de diseño y de arquitectura las tomé yo. Puedo explicar qué hace y por qué
está cada línea del repositorio.
