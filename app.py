from itertools import count

from flask import Flask, abort, redirect, render_template, request, url_for

app = Flask(__name__)

# Las tareas se guardan en memoria: existen mientras el servidor está encendido.
tareas = []
contador_ids = count(1)  # Genera ids únicos: 1, 2, 3...


def buscar_tarea(tarea_id):
    """Devuelve la tarea con ese id, o responde 404 si no existe."""
    for tarea in tareas:
        if tarea["id"] == tarea_id:
            return tarea
    abort(404)


@app.route("/")
def index():
    pendientes = [tarea for tarea in tareas if not tarea["completada"]]
    completadas = [tarea for tarea in tareas if tarea["completada"]]
    return render_template("index.html", pendientes=pendientes, completadas=completadas)


@app.route("/agregar", methods=["POST"])
def agregar():
    titulo = request.form.get("titulo", "").strip()
    if titulo:
        tareas.append({"id": next(contador_ids), "titulo": titulo, "completada": False})
    return redirect(url_for("index"))


@app.route("/completar/<int:tarea_id>", methods=["POST"])
def completar(tarea_id):
    tarea = buscar_tarea(tarea_id)
    tarea["completada"] = not tarea["completada"]  # Alterna: completada <-> pendiente
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(port=3000, debug=True)