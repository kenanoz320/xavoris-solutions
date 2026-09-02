function showPage(pageId, button) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });


    document.getElementById(pageId).classList.add("active");


    document.querySelectorAll(".nav-button").forEach(btn => {
        btn.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }


    const titles = {

        overview: "Übersicht",

        tasks: "Aufgaben",

        calendar: "Kalender",

        subjects: "Fächer"

    };


    document.getElementById("pageTitle").textContent =
        titles[pageId];


    window.scrollTo(0, 0);
}



function openModal() {

    document
        .getElementById("modal")
        .classList.add("show");

}



function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");

}



document
    .getElementById("modal")
    .addEventListener("click", function(event) {

        if (event.target.id === "modal") {

            closeModal();

        }

    });



function updateStatistics() {

    const tasks =
        document.querySelectorAll(
            "#taskList .task"
        );


    const total =
        tasks.length;


    let completed = 0;


    tasks.forEach(task => {

        if (task.dataset.done === "True") {

            completed++;

        }

    });


    const open =
        total - completed;


    let progress = 0;


    if (total > 0) {

        progress =
            Math.round(
                (completed / total) * 100
            );

    }


    document.getElementById(
        "totalTasks"
    ).textContent = total;


    document.getElementById(
        "completedTasks"
    ).textContent = completed;


    document.getElementById(
        "openTasks"
    ).textContent = open;


    document.getElementById(
        "progress"
    ).textContent = progress + "%";


    document.getElementById(
        "circleProgress"
    ).textContent = progress + "%";

}



function filterTasks(type, button) {

    document
        .querySelectorAll(".filter")
        .forEach(btn => {

            btn.classList.remove("active");

        });


    button.classList.add("active");


    document
        .querySelectorAll("#taskList .task")
        .forEach(task => {

            const done =
                task.dataset.done === "True";


            if (type === "all") {

                task.style.display = "flex";

            }


            else if (
                type === "done" &&
                done
            ) {

                task.style.display = "flex";

            }


            else if (
                type === "open" &&
                !done
            ) {

                task.style.display = "flex";

            }


            else {

                task.style.display = "none";

            }

        });

}



function searchTasks() {

    const input =
        document.getElementById(
            "search"
        );


    const search =
        input.value.toLowerCase();


    document
        .querySelectorAll(
            "#allTasks .full-task"
        )
        .forEach(task => {

            const title =
                task.dataset.title;


            if (title.includes(search)) {

                task.style.display = "flex";

            }

            else {

                task.style.display = "none";

            }

        });

}



function filterSubject(subject) {

    document
        .querySelectorAll(
            "#allTasks .full-task"
        )
        .forEach(task => {

            if (
                subject === "all" ||
                task.dataset.subject === subject
            ) {

                task.style.display = "flex";

            }

            else {

                task.style.display = "none";

            }

        });

}



updateStatistics();
