from itertools import count

from flask import Flask, redirect, render_template, request, url_for

app = Flask(__name__)

# Las tareas se guardan en memoria: existen mientras el servidor está encendido.
tareas = []
contador_ids = count(1)  # Genera ids únicos: 1, 2, 3...


@app.route("/")
def index():
    return render_template("index.html", tareas=tareas)


@app.route("/agregar", methods=["POST"])
def agregar():
    titulo = request.form.get("titulo", "").strip()
    if titulo:
        tareas.append({"id": next(contador_ids), "titulo": titulo, "completada": False})
    return redirect(url_for("index"))


if __name__ == "__main__":
    app.run(port=3000, debug=True)