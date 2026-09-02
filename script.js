const STORAGE_KEY = "schooltask_tasks";
const THEME_KEY = "schooltask_theme";

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let currentFilter = "all";
let selectedSubject = null;
let calendarDate = new Date();


// =========================
// DOM CONTENT LOADED
// =========================

document.addEventListener("DOMContentLoaded", () => {

    setupNavigation();
    setupModal();
    setupFilters();
    setupCalendar();
    setupSubjects();
    setupTheme();

    updateDate();
    renderEverything();

});


// =========================
// DATE
// =========================

function getTodayString() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("de-CH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}


function formatLongDate(date) {

    return date.toLocaleDateString("de-CH", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}


function updateDate() {

    const currentDate = document.getElementById("currentDate");

    if (!currentDate) {
        return;
    }

    currentDate.textContent = formatLongDate(new Date());
}


// =========================
// NAVIGATION
// =========================

function setupNavigation() {

    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {

        item.addEventListener("click", () => {

            const page = item.dataset.page;

            if (!page) {
                return;
            }

            navItems.forEach(nav => {
                nav.classList.remove("active");
            });

            item.classList.add("active");

            document.querySelectorAll(".page").forEach(pageElement => {
                pageElement.classList.remove("active");
            });

            const selectedPage =
                document.getElementById(page + "Page");

            if (selectedPage) {
                selectedPage.classList.add("active");
            }

            const pageTitles = {
                dashboard: "Dashboard",
                tasks: "Aufgaben",
                calendar: "Kalender",
                subjects: "Fächer",
                statistics: "Statistik"
            };

            const pageTitle =
                document.getElementById("pageTitle");

            if (pageTitle) {
                pageTitle.textContent =
                    pageTitles[page] || "SchoolTask";
            }

        });

    });

}


// =========================
// MODAL
// =========================

function setupModal() {

    const modal = document.getElementById("taskModal");

    const openModalButton =
        document.getElementById("openModal");

    const openModalTasksButton =
        document.getElementById("openModalTasks");

    const closeModalButton =
        document.getElementById("closeModal");

    const cancelModalButton =
        document.getElementById("cancelModal");

    const taskForm =
        document.getElementById("taskForm");


    if (openModalButton) {

        openModalButton.addEventListener("click", openModal);

    }


    if (openModalTasksButton) {

        openModalTasksButton.addEventListener("click", openModal);

    }


    if (closeModalButton) {

        closeModalButton.addEventListener("click", closeModal);

    }


    if (cancelModalButton) {

        cancelModalButton.addEventListener("click", closeModal);

    }


    if (modal) {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                closeModal();
            }

        });

    }


    if (taskForm) {

        taskForm.addEventListener("submit", event => {

            event.preventDefault();

            createTask();

        });

    }

}


function openModal() {

    const modal =
        document.getElementById("taskModal");

    if (!modal) {
        return;
    }

    modal.classList.add("active");

    const dateInput =
        document.getElementById("taskDate");

    if (dateInput) {

        dateInput.value =
            getTodayString();

    }

    setTimeout(() => {

        const titleInput =
            document.getElementById("taskTitle");

        if (titleInput) {
            titleInput.focus();
        }

    }, 100);

}


function closeModal() {

    const modal =
        document.getElementById("taskModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("active");

    const form =
        document.getElementById("taskForm");

    if (form) {
        form.reset();
    }

}


// =========================
// CREATE TASK
// =========================

function createTask() {

    const title =
        document.getElementById("taskTitle").value.trim();

    const subject =
        document.getElementById("taskSubject").value;

    const date =
        document.getElementById("taskDate").value;

    const category =
        document.getElementById("taskCategory").value;

    const note =
        document.getElementById("taskNote").value.trim();


    const priorityElement =
        document.querySelector(
            'input[name="priority"]:checked'
        );


    const priority =
        priorityElement
            ? priorityElement.value
            : "medium";


    if (!title || !subject || !date || !category) {

        alert("Bitte fülle alle Pflichtfelder aus.");

        return;

    }


    const task = {

        id: Date.now(),

        title: title,

        subject: subject,

        date: date,

        category: category,

        priority: priority,

        note: note,

        completed: false,

        createdAt: new Date().toISOString()

    };


    tasks.push(task);

    saveTasks();

    closeModal();

    renderEverything();

}


// =========================
// STORAGE
// =========================

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


// =========================
// TASK ACTIONS
// =========================

function toggleTask(id) {

    const task =
        tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderEverything();

}


function deleteTask(id) {

    const confirmed =
        confirm("Möchtest du diese Aufgabe wirklich löschen?");

    if (!confirmed) {
        return;
    }

    tasks =
        tasks.filter(task => task.id !== id);

    saveTasks();

    renderEverything();

}


// =========================
// DASHBOARD
// =========================

function renderDashboard() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const open =
        tasks.filter(task => !task.completed).length;


    const today =
        getTodayString();


    const todayTasks =
        tasks.filter(task => task.date === today);


    const totalTasks =
        document.getElementById("totalTasks");

    const completedTasks =
        document.getElementById("completedTasks");

    const openTasks =
        document.getElementById("openTasks");

    const todayTasksElement =
        document.getElementById("todayTasks");


    if (totalTasks) {
        totalTasks.textContent = total;
    }

    if (completedTasks) {
        completedTasks.textContent = completed;
    }

    if (openTasks) {
        openTasks.textContent = open;
    }

    if (todayTasksElement) {
        todayTasksElement.textContent =
            todayTasks.length;
    }


    renderWeekTasks();

    renderUpcomingTasks();

    updateProgress();

}


// =========================
// WEEK FUNCTIONS
// =========================

function dateToString(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function getStartOfWeek(date) {

    const result =
        new Date(date);

    result.setHours(0, 0, 0, 0);


    const day =
        result.getDay();


    const difference =
        day === 0
            ? -6
            : 1 - day;


    result.setDate(
        result.getDate() + difference
    );


    return result;

}


function getWeekDateRange(weekOffset = 0) {

    const start =
        getStartOfWeek(new Date());


    start.setDate(
        start.getDate() +
        (weekOffset * 7)
    );


    const end =
        new Date(start);


    end.setDate(
        end.getDate() + 6
    );


    return {

        start: dateToString(start),

        end: dateToString(end),

        startDate: start,

        endDate: end

    };

}


function formatWeekRange(startDate, endDate) {

    const options = {

        day: "2-digit",

        month: "2-digit"

    };


    return `${startDate.toLocaleDateString(
        "de-CH",
        options
    )} – ${endDate.toLocaleDateString(
        "de-CH",
        options
    )}`;

}


function renderWeekTasks() {

    const thisWeek =
        getWeekDateRange(0);

    const nextWeek =
        getWeekDateRange(1);


    const thisWeekTasks =
        tasks
            .filter(task =>
                task.date >= thisWeek.start &&
                task.date <= thisWeek.end
            )
            .sort(sortTasks);


    const nextWeekTasks =
        tasks
            .filter(task =>
                task.date >= nextWeek.start &&
                task.date <= nextWeek.end
            )
            .sort(sortTasks);


    const thisWeekRange =
        document.getElementById("thisWeekRange");

    const nextWeekRange =
        document.getElementById("nextWeekRange");


    if (thisWeekRange) {

        thisWeekRange.textContent =
            formatWeekRange(
                thisWeek.startDate,
                thisWeek.endDate
            );

    }


    if (nextWeekRange) {

        nextWeekRange.textContent =
            formatWeekRange(
                nextWeek.startDate,
                nextWeek.endDate
            );

    }


    const thisWeekList =
        document.getElementById("thisWeekList");

    const nextWeekList =
        document.getElementById("nextWeekList");


    if (thisWeekList) {

        if (thisWeekTasks.length === 0) {

            thisWeekList.innerHTML = `
                <div class="empty-state">
                    <span>Keine Aufgaben diese Woche</span>
                </div>
            `;

        } else {

            thisWeekList.innerHTML =
                thisWeekTasks
                    .map(createTaskHTML)
                    .join("");

        }

    }


    if (nextWeekList) {

        if (nextWeekTasks.length === 0) {

            nextWeekList.innerHTML = `
                <div class="empty-state">
                    <span>Keine Aufgaben nächste Woche</span>
                </div>
            `;

        } else {

            nextWeekList.innerHTML =
                nextWeekTasks
                    .map(createTaskHTML)
                    .join("");

        }

    }

}


// =========================
// UPCOMING TASKS
// =========================

function renderUpcomingTasks() {

    const upcomingList =
        document.getElementById("upcomingList");

    if (!upcomingList) {
        return;
    }


    const today =
        getTodayString();


    const upcomingTasks =
        tasks
            .filter(task =>
                task.date >= today &&
                !task.completed
            )
            .sort(sortTasks)
            .slice(0, 5);


    if (upcomingTasks.length === 0) {

        upcomingList.innerHTML = `
            <div class="empty-state">
                <span>Keine offenen Aufgaben</span>
            </div>
        `;

        return;

    }


    upcomingList.innerHTML =
        upcomingTasks
            .map(createTaskHTML)
            .join("");

}


// =========================
// TASK HTML
// =========================

function createTaskHTML(task) {

    const priorityNames = {

        low: "Niedrig",

        medium: "Mittel",

        high: "Hoch"

    };


    const categoryNames = {

        exam: "Prüfung",

        homework: "Hausaufgaben",

        other: "Anderes"

    };


    const category =
        task.category || "other";


    return `

        <div class="task-item ${task.completed ? "completed" : ""}">

            <div
                class="task-checkbox"
                onclick="toggleTask(${task.id})">

                ${task.completed ? "✓" : ""}

            </div>


            <div class="task-content">

                <div class="task-title">

                    ${escapeHTML(task.title)}

                </div>


                <div class="task-meta">

                    <span class="category ${category}">

                        ${categoryNames[category] || "Anderes"}

                    </span>


                    <span class="task-subject">

                        ${escapeHTML(task.subject)}

                    </span>


                    <span class="task-date">

                        ${formatDate(task.date)}

                    </span>


                    <span class="priority ${task.priority}">

                        ${priorityNames[task.priority]}

                    </span>

                </div>

            </div>


            <button
                class="delete-task"
                onclick="deleteTask(${task.id})"
                title="Aufgabe löschen">

                ×

            </button>

        </div>

    `;

}


// =========================
// FILTER
// =========================

function setupFilters() {

    const filterButtons =
        document.querySelectorAll(".filter-button");


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });


            button.classList.add("active");


            currentFilter =
                button.dataset.filter;


            renderAllTasks();

        });

    });

}


function renderAllTasks() {

    const list =
        document.getElementById("allTasksList");

    if (!list) {
        return;
    }


    let filteredTasks =
        [...tasks];


    if (currentFilter === "open") {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );

    }


    if (currentFilter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );

    }


    if (currentFilter === "today") {

        const today =
            getTodayString();

        filteredTasks =
            filteredTasks.filter(
                task => task.date === today
            );

    }


    filteredTasks.sort(sortTasks);


    if (filteredTasks.length === 0) {

        list.innerHTML = `
            <div class="empty-state">
                <span>Keine Aufgaben gefunden</span>
            </div>
        `;

        return;

    }


    list.innerHTML =
        filteredTasks
            .map(createTaskHTML)
            .join("");

}


// =========================
// SORT
// =========================

function sortTasks(a, b) {

    if (a.completed !== b.completed) {

        return a.completed ? 1 : -1;

    }


    if (a.date !== b.date) {

        return a.date.localeCompare(b.date);

    }


    const priorityOrder = {

        high: 0,

        medium: 1,

        low: 2

    };


    const priorityA =
        priorityOrder[a.priority] ?? 1;

    const priorityB =
        priorityOrder[b.priority] ?? 1;


    return priorityA - priorityB;

}


// =========================
// SUBJECTS
// =========================

function setupSubjects() {

    renderSubjects();

}


function renderSubjects() {

    const subjects = [

        "ABU",

        "Mathe",

        "Englisch",

        "Modul"

    ];


    subjects.forEach(subject => {

        const count =
            tasks.filter(
                task => task.subject === subject
            ).length;


        const element =
            document.getElementById(
                "count" + subject
            );


        if (element) {

            element.textContent =
                count;

        }

    });

}


// =========================
// CALENDAR
// =========================

function setupCalendar() {

    const previous =
        document.getElementById("prevMonth");

    const next =
        document.getElementById("nextMonth");


    if (previous) {

        previous.addEventListener("click", () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        });

    }


    if (next) {

        next.addEventListener("click", () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        });

    }

}


function renderCalendar() {

    const calendarGrid =
        document.getElementById("calendarGrid");

    const calendarMonth =
        document.getElementById("calendarMonth");


    if (!calendarGrid || !calendarMonth) {
        return;
    }


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    calendarMonth.textContent =
        calendarDate.toLocaleDateString(
            "de-CH",
            {
                month: "long",
                year: "numeric"
            }
        );


    const firstDay =
        new Date(year, month, 1);


    let startingDay =
        firstDay.getDay();


    if (startingDay === 0) {
        startingDay = 7;
    }


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    let html = "";


    for (
        let i = startingDay - 1;
        i > 0;
        i--
    ) {

        const day =
            previousMonthDays - i + 1;

        html += `
            <div class="calendar-day other-month">
                <span>${day}</span>
            </div>
        `;

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        const dayTasks =
            tasks.filter(
                task => task.date === dateString
            );


        const today =
            new Date();


        const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();


        html += `

            <div class="calendar-day ${isToday ? "today" : ""}">

                <span>
                    ${day}
                </span>

                <div class="calendar-tasks">

                    ${dayTasks
                        .slice(0, 3)
                        .map(task => `
                            <div
                                class="calendar-task ${task.completed ? "completed" : ""}"
                                onclick="toggleTask(${task.id})">

                                ${escapeHTML(task.title)}

                            </div>
                        `)
                        .join("")}

                </div>

            </div>

        `;

    }


    const totalCells =
        startingDay - 1 +
        daysInMonth;


    const remainingCells =
        Math.ceil(totalCells / 7) * 7 -
        totalCells;


    for (
        let day = 1;
        day <= remainingCells;
        day++
    ) {

        html += `
            <div class="calendar-day other-month">
                <span>${day}</span>
            </div>
        `;

    }


    calendarGrid.innerHTML = html;

}


// =========================
// STATISTICS
// =========================

function renderStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const open =
        tasks.filter(
            task => !task.completed
        ).length;


    const completedElement =
        document.getElementById(
            "statisticsCompleted"
        );


    const openElement =
        document.getElementById(
            "statisticsOpen"
        );


    if (completedElement) {
        completedElement.textContent =
            completed;
    }


    if (openElement) {
        openElement.textContent =
            open;
    }


    const completedBar =
        document.getElementById(
            "completedBar"
        );


    const openBar =
        document.getElementById(
            "openBar"
        );


    const completedPercentage =
        total > 0
            ? (completed / total) * 100
            : 0;


    const openPercentage =
        total > 0
            ? (open / total) * 100
            : 0;


    if (completedBar) {

        completedBar.style.width =
            `${completedPercentage}%`;

    }


    if (openBar) {

        openBar.style.width =
            `${openPercentage}%`;

    }


    renderSubjectStatistics();

}


function renderSubjectStatistics() {

    const container =
        document.getElementById(
            "subjectStatistics"
        );


    if (!container) {
        return;
    }


    const subjects = [

        "ABU",

        "Mathe",

        "Englisch",

        "Modul"

    ];


    container.innerHTML =
        subjects.map(subject => {

            const count =
                tasks.filter(
                    task => task.subject === subject
                ).length;


            return `

                <div class="subject-stat-row">

                    <span>
                        ${subject}
                    </span>

                    <strong>
                        ${count}
                    </strong>

                </div>

            `;

        }).join("");

}


// =========================
// PROGRESS
// =========================

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const open =
        tasks.filter(
            task => !task.completed
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    const progressPercent =
        document.getElementById(
            "progressPercent"
        );


    const progressCompleted =
        document.getElementById(
            "progressCompleted"
        );


    const progressOpen =
        document.getElementById(
            "progressOpen"
        );


    if (progressPercent) {

        progressPercent.textContent =
            `${percentage}%`;

    }


    if (progressCompleted) {

        progressCompleted.textContent =
            completed;

    }


    if (progressOpen) {

        progressOpen.textContent =
            open;

    }


    const circle =
        document.querySelector(
            ".progress-circle"
        );


    if (circle) {

        circle.style.setProperty(
            "--progress",
            `${percentage}%`
        );

    }

}


// =========================
// DARK MODE
// =========================

function setupTheme() {

    const toggle =
        document.getElementById(
            "themeToggle"
        );


    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

    }


    if (toggle) {

        toggle.addEventListener("click", () => {

            document.body.classList.toggle("dark");


            const isDark =
                document.body.classList.contains("dark");


            localStorage.setItem(
                THEME_KEY,
                isDark ? "dark" : "light"
            );

        });

    }

}


// =========================
// RENDER EVERYTHING
// =========================

function renderEverything() {

    renderDashboard();

    renderAllTasks();

    renderCalendar();

    renderSubjects();

    renderStatistics();

}


// =========================
// EMPTY STATE
// =========================

function emptyState(message = "Keine Aufgaben vorhanden") {

    return `

        <div class="empty-state">

            <span>
                ${message}
            </span>

        </div>

    `;

}


// =========================
// SECURITY
// =========================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


// =========================
// GLOBAL FUNCTIONS
// =========================

window.toggleTask = toggleTask;

window.deleteTask = deleteTask;
