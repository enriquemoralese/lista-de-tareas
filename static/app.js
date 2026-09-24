// Animaciones de la lista.
// El servidor sigue siendo quien guarda los cambios: JavaScript solo anima
// antes de enviar el formulario y justo después de que la página se recarga.

const sinAnimaciones = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const PAUSA_MS = 250;  // tiempo para ver la palomita antes de que la tarea se vaya
const SALIDA_MS = 400; // lo que dura la salida (coincide con style.css)

// 1. Al marcar o desmarcar: se tacha, se desvanece, se cierra el hueco y se envía.
document.querySelectorAll(".tarea input[type=checkbox]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        const fila = checkbox.closest(".tarea");
        fila.style.pointerEvents = "none"; // evita un segundo clic mientras se anima
        sessionStorage.setItem("tareaAnimada", fila.dataset.id);

        if (sinAnimaciones) {
            checkbox.form.submit();
            return;
        }

        setTimeout(() => {
            fila.style.height = fila.offsetHeight + "px"; // fija la altura actual...
            fila.offsetHeight;                              // ...hace que el navegador la aplique...
            fila.classList.add("saliendo");
            fila.style.height = "0px";                      // ...y la anima hasta 0
        }, PAUSA_MS);

        setTimeout(() => checkbox.form.submit(), PAUSA_MS + SALIDA_MS);
    });
});

// 2. Al agregar: recordar que la tarea nueva (la última de la lista) debe animarse.
document.querySelector("#form-agregar").addEventListener("submit", () => {
    sessionStorage.setItem("tareaAnimada", "nueva");
});

// 3. Después de recargar: animar la entrada de la tarea que acaba de llegar.
const animada = sessionStorage.getItem("tareaAnimada");
sessionStorage.removeItem("tareaAnimada");

const filaEntrante = animada === "nueva"
    ? document.querySelector(".pendientes .tarea:last-child")
    : document.querySelector(`.tarea[data-id="${animada}"]`);
filaEntrante?.classList.add("entrando");

// 4. Recordar si la sección "Completadas" estaba abierta, para que no se cierre al recargar.
const seccionCompletadas = document.querySelector("details");
if (seccionCompletadas) {
    seccionCompletadas.open = sessionStorage.getItem("completadasAbierta") === "si";
    seccionCompletadas.addEventListener("toggle", () => {
        sessionStorage.setItem("completadasAbierta", seccionCompletadas.open ? "si" : "no");
    });
}