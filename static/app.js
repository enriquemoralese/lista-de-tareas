// Animaciones de la lista.
// El servidor sigue siendo quien guarda los cambios: JavaScript solo anima
// antes de enviar el formulario y justo después de que la página se recarga.

const sinAnimaciones = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PAUSA_MS = 250;  // tiempo para ver la palomita antes de que la tarea se vaya
const SALIDA_MS = 400; // lo que dura la salida (coincide con style.css)

// Desvanece la fila, cierra su hueco y, al terminar, ejecuta alTerminar().
function animarSalida(fila, alTerminar) {
    fila.style.pointerEvents = "none"; // evita un segundo clic mientras se anima

    if (sinAnimaciones) {
        alTerminar();
        return;
    }

    fila.style.height = fila.offsetHeight + "px"; // fija la altura actual...
    fila.offsetHeight;                              // ...hace que el navegador la aplique...
    fila.classList.add("saliendo");
    fila.style.height = "0px";                      // ...y la anima hasta 0

    setTimeout(alTerminar, SALIDA_MS);
}

// 1. Al marcar o desmarcar: se tacha, se ve la palomita un momento y la tarea se va.
document.querySelectorAll(".tarea input[type=checkbox]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const fila = checkbox.closest(".tarea");
        fila.style.pointerEvents = "none";
        sessionStorage.setItem("tareaAnimada", fila.dataset.id);

        const pausa = sinAnimaciones ? 0 : PAUSA_MS;
        setTimeout(() => animarSalida(fila, () => checkbox.form.submit()), pausa);
    });
});

// 2. Al eliminar: primero la animación, después se envía el formulario.
document.querySelectorAll(".form-eliminar").forEach((form) => {
    form.addEventListener("submit", (evento) => {
        evento.preventDefault(); // detiene el envío para esperar a la animación
        animarSalida(form.closest(".tarea"), () => form.submit());
    });
});

// 3. Al agregar: recordar que la tarea nueva (la última de la lista) debe animarse.
document.querySelector("#form-agregar").addEventListener("submit", () => {
    sessionStorage.setItem("tareaAnimada", "nueva");
});

// 4. Después de recargar: animar la entrada de la tarea que acaba de llegar.
const animada = sessionStorage.getItem("tareaAnimada");
sessionStorage.removeItem("tareaAnimada");

const filaEntrante = animada === "nueva"
    ? document.querySelector(".pendientes .tarea:last-child")
    : document.querySelector(`.tarea[data-id="${animada}"]`);
filaEntrante?.classList.add("entrando");

// 5. Recordar si la sección "Completadas" estaba abierta, para que no se cierre al recargar.
// Se busca por id: ahora cada tarea tiene su propio <details> para la nota,
// así que "details" a secas ya no señalaría a esta sección.
const seccionCompletadas = document.querySelector("#completadas");
if (seccionCompletadas) {
    seccionCompletadas.open = sessionStorage.getItem("completadasAbierta") === "si";
    seccionCompletadas.addEventListener("toggle", () => {
        sessionStorage.setItem("completadasAbierta", seccionCompletadas.open ? "si" : "no");
    });
}
