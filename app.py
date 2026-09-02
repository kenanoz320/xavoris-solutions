from flask import Flask, render_template, request, redirect, jsonify

app = Flask(__name__)

tasks = [
    {
        "id": 1,
        "title": "Mathe Hausaufgaben",
        "subject": "Mathe",
        "date": "2026-09-04",
        "priority": "hoch",
        "done": False
    },
    {
        "id": 2,
        "title": "Python lernen",
        "subject": "Informatik",
        "date": "2026-09-05",
        "priority": "mittel",
        "done": False
    }
]


@app.route("/")
def home():
    return render_template("index.html", tasks=tasks)


@app.route("/add", methods=["POST"])
def add_task():

    title = request.form.get("title")
    subject = request.form.get("subject")
    date = request.form.get("date")
    priority = request.form.get("priority")

    if title:
        new_task = {
            "id": len(tasks) + 1,
            "title": title,
            "subject": subject,
            "date": date,
            "priority": priority,
            "done": False
        }

        tasks.append(new_task)

    return redirect("/")


@app.route("/done/<int:task_id>", methods=["POST"])
def done_task(task_id):

    for task in tasks:
        if task["id"] == task_id:
            task["done"] = not task["done"]

    return redirect("/")


@app.route("/delete/<int:task_id>", methods=["POST"])
def delete_task(task_id):

    global tasks

    tasks = [
        task for task in tasks
        if task["id"] != task_id
    ]

    return redirect("/")


@app.route("/api/tasks")
def api_tasks():
    return jsonify(tasks)


if __name__ == "__main__":
    app.run(debug=True)
