function updateStats() {

    const tasks = document.querySelectorAll(".task-card");

    let done = 0;
    let open = 0;


    tasks.forEach(task => {

        const isDone =
            task.dataset.done === "True";


        if (isDone) {
            done++;
        } else {
            open++;
        }

    });


    document.getElementById("taskCount").textContent =
        tasks.length;


    document.getElementById("doneCount").textContent =
        done;


    document.getElementById("openCount").textContent =
        open;
}



function filterTasks(type) {

    const tasks =
        document.querySelectorAll(".task-card");


    tasks.forEach(task => {

        const isDone =
            task.dataset.done === "True";


        if (type === "all") {

            task.style.display = "flex";

        }


        else if (
            type === "done" &&
            isDone
        ) {

            task.style.display = "flex";

        }


        else if (
            type === "open" &&
            !isDone
        ) {

            task.style.display = "flex";

        }


        else {

            task.style.display = "none";

        }

    });

}



function searchTasks() {

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const tasks =
        document.querySelectorAll(".task-card");


    tasks.forEach(task => {

        const text =
            task.textContent.toLowerCase();


        if (text.includes(search)) {

            task.style.display = "flex";

        }

        else {

            task.style.display = "none";

        }

    });

}



updateStats();
