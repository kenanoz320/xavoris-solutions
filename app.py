from flask import Flask, render_template, request, redirect

app = Flask(__name__)

tasks = [
    {
        "id": 1,
        "title": "Mathe Aufgaben 5–10",
        "subject": "Mathe",
        "date": "Heute",
        "priority": "hoch",
        "done": False,
        "note": "Kapitel 3, Seite 42"
    },
    {
        "id": 2,
        "title": "Englisch Vokabeln lernen",
        "subject": "Englisch",
        "date": "Morgen",
        "priority": "mittel",
        "done": False,
        "note": ""
    },
    {
        "id": 3,
        "title": "ABU Arbeitsblatt",
        "subject": "ABU",
        "date": "Freitag",
        "priority": "niedrig",
        "done": True,
        "note": "Aufgaben 1–4"
    }
]


@app.route("/")
def home():
    return render_template("index.html", tasks=tasks)


@app.route("/add", methods=["POST"])
def add_task():

    title = request.form.get("title", "").strip()
    subject = request.form.get("subject")
    date = request.form.get("date")
    priority = request.form.get("priority")
    note = request.form.get("note", "").strip()

    if title:

        new_task = {
            "id": max([task["id"] for task in tasks], default=0) + 1,
            "title": title,
            "subject": subject,
            "date": date,
            "priority": priority,
            "done": False,
            "note": note
        }

        tasks.append(new_task)

    return redirect("/")


@app.route("/done/<int:task_id>", methods=["POST"])
def complete_task(task_id):

    for task in tasks:

        if task["id"] == task_id:
            task["done"] = not task["done"]
            break

    return redirect("/")


@app.route("/delete/<int:task_id>", methods=["POST"])
def delete_task(task_id):

    global tasks

    tasks = [
        task for task in tasks
        if task["id"] != task_id
    ]

    return redirect("/")


if __name__ == "__main__":
    app.run(debug=True)
