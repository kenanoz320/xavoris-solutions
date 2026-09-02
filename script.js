/* =========================================================
   SCHOOLTASK
   Aufgabenverwaltung + Kalender + Statistik + Speicherung
   ========================================================= */


/* ================= STORAGE ================= */

const STORAGE_KEY = "schooltask_tasks";
const THEME_KEY = "schooltask_theme";


let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let currentFilter = "all";

let selectedSubject = null;

let calendarDate = new Date();


/* ================= ELEMENTS ================= */

const pages = document.querySelectorAll(".page");

const navItems = document.querySelectorAll(".nav-item");

const pageTitle = document.getElementById("pageTitle");

const currentDateElement = document.getElementById("currentDate");

const modal = document.getElementById("taskModal");

const taskForm = document.getElementById("taskForm");

const openTaskButton = document.getElementById("openTaskButton");

const closeModalButton = document.getElementById("closeModal");

const cancelModalButton = document.getElementById("cancelModal");

const themeButton = document.getElementById("themeButton");

const themeIcon = document.getElementById("themeIcon");


/* ================= INITIALISIERUNG ================= */

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


/* ================= DATUM ================= */

function getTodayString() {

    const date = new Date();

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

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

    currentDateElement.textContent = formatLongDate(new Date());

}


/* ================= NAVIGATION ================= */

function setupNavigation() {

    navItems.forEach(button => {

        button.addEventListener("click", () => {

            const page = button.dataset.page;

            showPage(page);

        });

    });


    document.querySelectorAll("[data-go]").forEach(button => {

        button.addEventListener("click", () => {

            showPage(button.dataset.go);

        });

    });

}


function showPage(pageName) {

    pages.forEach(page => {

        page.classList.remove("active-page");

    });


    const target = document.getElementById(pageName);

    if (target) {
        target.classList.add("active-page");
    }


    navItems.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.page === pageName
        );

    });


    const titles = {
        dashboard: "Dashboard",
        tasks: "Aufgaben",
        calendar: "Kalender",
        subjects: "Fächer",
        statistics: "Statistik"
    };


    pageTitle.textContent = titles[pageName] || "SchoolTask";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ================= MODAL ================= */

function setupModal() {

    openTaskButton.addEventListener("click", openModal);

    closeModalButton.addEventListener("click", closeModal);

    cancelModalButton.addEventListener("click", closeModal);


    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeModal();
        }

    });


    taskForm.addEventListener("submit", event => {

        event.preventDefault();

        createTask();

    });

}


function openModal() {

    modal.classList.add("open");

    document.getElementById("taskTitle").focus();

    document.getElementById("taskDate").value = getTodayString();

}


function closeModal() {

    modal.classList.remove("open");

    taskForm.reset();

}


/* ================= AUFGABE ERSTELLEN ================= */

function createTask() {

    const title = document.getElementById("taskTitle").value.trim();

    const subject = document.getElementById("taskSubject").value;

    const date = document.getElementById("taskDate").value;

    const note = document.getElementById("taskNote").value.trim();

    const priorityElement =
        document.querySelector('input[name="priority"]:checked');


    if (!title || !subject || !date) {

        return;

    }


    const task = {

        id: Date.now(),

        title: title,

        subject: subject,

        date: date,

        priority: priorityElement
            ? priorityElement.value
            : "medium",

        note: note,

        completed: false,

        createdAt: new Date().toISOString()

    };


    tasks.push(task);

    saveTasks();

    closeModal();

    renderEverything();

}


/* ================= SPEICHERN ================= */

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


/* ================= AUFGABE ERLEDIGT ================= */

function toggleTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderEverything();

}


/* ================= AUFGABE LÖSCHEN ================= */

function deleteTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }


    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderEverything();

}


/* ================= AUFGABEN HTML ================= */

function createTaskHTML(task) {

    const priorityNames = {

        low: "Niedrig",

        medium: "Mittel",

        high: "Hoch"

    };


    return `
        <div class="task-item ${task.completed ? "completed" : ""}">

            <button
                class="task-check"
                onclick="toggleTask(${task.id})"
                aria-label="Aufgabe erledigen"
            >
                ${task.completed ? "✓" : ""}
            </button>


            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>


                <div class="task-meta">

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


            <div class="task-actions">

                <button
                    class="task-action delete"
                    onclick="deleteTask(${task.id})"
                    title="Löschen"
                >
                    🗑
                </button>

            </div>

        </div>
    `;

}


/* ================= DASHBOARD ================= */

function renderDashboard() {

    const today = getTodayString();


    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const open = tasks.filter(
        task => !task.completed
    ).length;

    const todayTasks = tasks.filter(
        task =>
            task.date === today &&
            !task.completed
    );


    document.getElementById("totalTasks").textContent = total;

    document.getElementById("openTasks").textContent = open;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("todayTasks").textContent =
        todayTasks.length;


    renderTodayTasks();

    renderUpcomingTasks();

    updateProgress();

}


function renderTodayTasks() {

    const container =
        document.getElementById("todayList");


    const today = getTodayString();


    const todayTasks = tasks

        .filter(task => task.date === today)

        .sort(sortTasks);


    if (todayTasks.length === 0) {

        container.innerHTML = emptyState(
            "🎉",
            "Keine Aufgaben für heute",
            "Du hast heute nichts fällig."
        );

        return;

    }


    container.innerHTML =
        todayTasks.map(createTaskHTML).join("");

}


function renderUpcomingTasks() {

    const container =
        document.getElementById("upcomingList");


    const today = getTodayString();


    const upcoming = tasks

        .filter(task =>
            task.date >= today &&
            !task.completed
        )

        .sort(sortTasks)

        .slice(0, 5);


    if (upcoming.length === 0) {

        container.innerHTML = emptyState(
            "✓",
            "Alles erledigt",
            "Momentan stehen keine Aufgaben an."
        );

        return;

    }


    container.innerHTML =
        upcoming.map(createTaskHTML).join("");

}


/* ================= AUFGABEN SEITE ================= */

function setupFilters() {

    document.querySelectorAll(".filter").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".filter")
                .forEach(item =>
                    item.classList.remove("active")
                );


            button.classList.add("active");

            currentFilter = button.dataset.filter;

            renderAllTasks();

        });

    });

}


function renderAllTasks() {

    const container =
        document.getElementById("allTasksList");


    let filtered = [...tasks];


    if (currentFilter === "open") {

        filtered = filtered.filter(
            task => !task.completed
        );

    }


    if (currentFilter === "completed") {

        filtered = filtered.filter(
            task => task.completed
        );

    }


    if (currentFilter === "today") {

        filtered = filtered.filter(
            task => task.date === getTodayString()
        );

    }


    filtered.sort(sortTasks);


    if (filtered.length === 0) {

        container.innerHTML = emptyState(
            "✓",
            "Keine Aufgaben",
            "Hier gibt es momentan nichts zu sehen."
        );

        return;

    }


    container.innerHTML =
        filtered.map(createTaskHTML).join("");

}


/* ================= SORTIERUNG ================= */

function sortTasks(a, b) {

    if (a.date !== b.date) {

        return a.date.localeCompare(b.date);

    }


    if (a.completed !== b.completed) {

        return a.completed ? 1 : -1;

    }


    const priorityOrder = {
        high: 0,
        medium: 1,
        low: 2
    };


    return (
        priorityOrder[a.priority] -
        priorityOrder[b.priority]
    );

}


/* ================= FÄCHER ================= */

function setupSubjects() {

    document.querySelectorAll(".subject-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                selectedSubject =
                    card.dataset.subject;

                renderSubjectDetails();

                document.getElementById("subjectDetails")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            });

        });

}


function renderSubjects() {

    const subjects = [
        "ABU",
        "Mathe",
        "Englisch",
        "Modul"
    ];


    subjects.forEach(subject => {

        const count = tasks.filter(
            task => task.subject === subject
        ).length;


        const id =
            "count" +
            subject.replace("ä", "a");


        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                `${count} ${count === 1 ? "Aufgabe" : "Aufgaben"}`;

        }

    });


    renderSubjectDetails();

}


function renderSubjectDetails() {

    const title =
        document.getElementById("selectedSubjectTitle");

    const list =
        document.getElementById("subjectTaskList");


    if (!selectedSubject) {

        title.textContent = "Wähle ein Fach";

        list.innerHTML = emptyState(
            "📚",
            "Noch kein Fach ausgewählt",
            "Klicke oben auf ein Fach."
        );

        return;

    }


    title.textContent = selectedSubject;


    const subjectTasks = tasks

        .filter(task =>
            task.subject === selectedSubject
        )

        .sort(sortTasks);


    if (subjectTasks.length === 0) {

        list.innerHTML = emptyState(
            "✓",
            "Keine Aufgaben",
            `Für ${selectedSubject} gibt es noch keine Aufgaben.`
        );

        return;

    }


    list.innerHTML =
        subjectTasks.map(createTaskHTML).join("");

}


/* ================= KALENDER ================= */

function setupCalendar() {

    document.getElementById("previousMonth")
        .addEventListener("click", () => {

            calendarDate.setMonth(
                calendarDate.getMonth() - 1
            );

            renderCalendar();

        });


    document.getElementById("nextMonth")
        .addEventListener("click", () => {

            calendarDate.setMonth(
                calendarDate.getMonth() + 1
            );

            renderCalendar();

        });


    document.getElementById("todayButton")
        .addEventListener("click", () => {

            calendarDate = new Date();

            renderCalendar();

        });

}


function renderCalendar() {

    const grid =
        document.getElementById("calendarGrid");


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    const monthName =
        calendarDate.toLocaleDateString(
            "de-CH",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById("calendarTitle")
        .textContent =
        capitalize(monthName);


    const firstDay =
        new Date(year, month, 1);


    let startDay =
        firstDay.getDay();


    if (startDay === 0) {
        startDay = 7;
    }


    const daysInMonth =
        new Date(year, month + 1, 0).getDate();


    const previousMonthDays =
        new Date(year, month, 0).getDate();


    let html = "";


    for (let i = startDay - 1; i > 0; i--) {

        const day =
            previousMonthDays - i + 1;


        html += createCalendarDay(
            day,
            year,
            month - 1,
            true
        );

    }


    for (let day = 1; day <= daysInMonth; day++) {

        html += createCalendarDay(
            day,
            year,
            month,
            false
        );

    }


    const cellsUsed =
        startDay - 1 + daysInMonth;


    const remaining =
        Math.ceil(cellsUsed / 7) * 7 -
        cellsUsed;


    for (let day = 1; day <= remaining; day++) {

        html += createCalendarDay(
            day,
            year,
            month + 1,
            true
        );

    }


    grid.innerHTML = html;

}


function createCalendarDay(
    day,
    year,
    month,
    otherMonth
) {

    const date =
        new Date(year, month, day);


    const dateString =
        `${date.getFullYear()}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${String(
            date.getDate()
        ).padStart(2, "0")}`;


    const todayClass =
        dateString === getTodayString()
            ? "today"
            : "";


    const tasksForDay =
        tasks.filter(
            task => task.date === dateString
        );


    const taskHTML =
        tasksForDay

            .slice(0, 3)

            .map(task => `
                <span class="calendar-task ${task.priority === "high" ? "high" : ""}">
                    ${escapeHTML(task.title)}
                </span>
            `)

            .join("");


    return `
        <div class="calendar-day ${otherMonth ? "other-month" : ""} ${todayClass}">

            <span class="day-number">
                ${day}
            </span>

            ${taskHTML}

        </div>
    `;

}


/* ================= STATISTIK ================= */

function renderStatistics() {

    const total = tasks.length;

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const open =
        total - completed;


    const today =
        tasks.filter(
            task =>
                task.date === getTodayString() &&
                !task.completed
        ).length;


    const percent =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document.getElementById("statisticsPercent")
        .textContent = `${percent}%`;


    document.getElementById("statisticsBar")
        .style.width = `${percent}%`;


    document.getElementById("summaryTotal")
        .textContent = total;


    document.getElementById("summaryOpen")
        .textContent = open;


    document.getElementById("summaryCompleted")
        .textContent = completed;


    document.getElementById("summaryToday")
        .textContent = today;


    document.getElementById("statisticsDescription")
        .textContent =
        total === 0
            ? "Noch keine Aufgaben."
            : `${completed} von ${total} Aufgaben erledigt.`;


    renderSubjectStatistics();

}


function renderSubjectStatistics() {

    const container =
        document.getElementById("subjectStatistics");


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


            const completed =
                tasks.filter(
                    task =>
                        task.subject === subject &&
                        task.completed
                ).length;


            const percent =
                count === 0
                    ? 0
                    : Math.round(
                        (completed / count) * 100
                    );


            return `
                <div class="subject-stat">

                    <div class="subject-stat-header">
                        <span>${subject}</span>
                        <span>${completed}/${count}</span>
                    </div>

                    <div class="subject-stat-bar">
                        <div style="width: ${percent}%"></div>
                    </div>

                </div>
            `;

        }).join("");

}


/* ================= PROGRESS ================= */

function updateProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const percent =
        total === 0
            ? 0
            : Math.round(
                completed / total * 100
            );


    document.getElementById("progressPercent")
        .textContent = `${percent}%`;


    const degrees =
        percent * 3.6;


    document.getElementById("progressCircle")
        .style.background =
        `conic-gradient(
            var(--primary) ${degrees}deg,
            var(--border) ${degrees}deg
        )`;


    document.getElementById("progressText")
        .textContent =
        total === 0
            ? "Noch keine Aufgaben vorhanden."
            : `${completed} von ${total} Aufgaben erledigt.`;

}


/* ================= DARK MODE ================= */

function setupTheme() {

    const savedTheme =
        localStorage.getItem(THEME_KEY);


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeIcon.textContent = "☀";

    }


    themeButton.addEventListener("click", () => {

        document.body.classList.toggle("dark");


        const isDark =
            document.body.classList.contains("dark");


        localStorage.setItem(
            THEME_KEY,
            isDark ? "dark" : "light"
        );


        themeIcon.textContent =
            isDark ? "☀" : "☾";

    });

}


/* ================= ALLES AKTUALISIEREN ================= */

function renderEverything() {

    renderDashboard();

    renderAllTasks();

    renderCalendar();

    renderSubjects();

    renderStatistics();

}


/* ================= EMPTY STATE ================= */

function emptyState(
    icon,
    title,
    text
) {

    return `
        <div class="empty-state">

            <div class="empty-icon">
                ${icon}
            </div>

            <strong>
                ${title}
            </strong>

            <span>
                ${text}
            </span>

        </div>
    `;

}


/* ================= SICHERHEIT ================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


/* ================= HILFSFUNKTIONEN ================= */

function capitalize(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() + text.slice(1);

}


/* ================= GLOBALE FUNKTIONEN ================= */

window.toggleTask = toggleTask;

window.deleteTask = deleteTask;
