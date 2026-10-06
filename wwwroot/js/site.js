const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const taskCategory = document.getElementById("taskCategory");

const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const categoryFilter = document.getElementById("categoryFilter");
const taskSearch = document.getElementById("taskSearch");


/* =========================
   Save Tasks
   ========================= */

function saveTasks() {
    const tasks = [];

    document.querySelectorAll(".task-item").forEach(function (taskItem) {

        const taskText = taskItem.querySelector(".task-text");

        if (!taskText) {
            return;
        }

        tasks.push({
            text: taskText.textContent,
            status: taskItem.classList.contains("completed")
                ? "completed"
                : taskItem.classList.contains("in-progress")
                    ? "in-progress"
                    : "pending",

            priority: taskItem.dataset.priority || "Medium",

            dueDate: taskItem.dataset.dueDate || "",

            category: taskItem.dataset.category || "IT Support"
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* =========================
   Task Events
   ========================= */

function addTaskEvents(taskItem) {

    const deleteBtn = taskItem.querySelector(".delete-btn");
    const completeBtn = taskItem.querySelector(".complete-btn");
    const startBtn = taskItem.querySelector(".start-btn");
    const editBtn = taskItem.querySelector(".edit-btn");


    /* Delete */

    deleteBtn.addEventListener("click", function () {

        taskItem.remove();

        saveTasks();

        filterTasks();

        updateDashboard();
    });


    /* Edit */

    editBtn.addEventListener("click", function () {

        const taskText = taskItem.querySelector(".task-text");

        const newTaskText = prompt(
            "Edit task:",
            taskText.textContent
        );

        if (newTaskText === null) {
            return;
        }

        const updatedText = newTaskText.trim();

        if (updatedText === "") {
            return;
        }

        taskText.textContent = updatedText;

        saveTasks();

        filterTasks();

        updateDashboard();
    });


    /* Start / In Progress */

    startBtn.addEventListener("click", function () {

        taskItem.classList.remove("completed");

        if (taskItem.classList.contains("in-progress")) {

            taskItem.classList.remove("in-progress");

        } else {

            taskItem.classList.add("in-progress");
        }

        const statusLabel =
            taskItem.querySelector(".task-status");


        if (taskItem.classList.contains("in-progress")) {

            statusLabel.textContent = "In Progress";

        } else {

            statusLabel.textContent = "Pending";
        }

        saveTasks();

        filterTasks();

        updateDashboard();
    });


    /* Complete */

    completeBtn.addEventListener("click", function () {

        taskItem.classList.remove("in-progress");

        taskItem.classList.add("completed");

        const statusLabel =
            taskItem.querySelector(".task-status");

        statusLabel.textContent = "Completed";

        saveTasks();

        filterTasks();

        updateDashboard();
    });
}


/* =========================
   Create Task
   ========================= */

function createTask(
    taskText,
    status = "pending",
    priority = "Medium",
    dueDate = "",
    category = "IT Support"
) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    taskItem.dataset.priority = priority;

    taskItem.dataset.dueDate = dueDate;

    taskItem.dataset.category = category;


    if (status === "completed") {

        taskItem.classList.add("completed");
    }


    if (status === "in-progress") {

        taskItem.classList.add("in-progress");
    }


    taskItem.innerHTML = `
        <div class="task-content">

            <span class="task-text">${taskText}</span>

            <span class="task-status">Pending</span>

            <span class="task-priority">${priority}</span>

            <span class="task-category">${category}</span>

            <span class="task-due-date">
                ${dueDate ? "Due: " + dueDate : "No due date"}
            </span>

        </div>

        <div>

            <button class="start-btn">
                Start
            </button>

            <button class="complete-btn">
                Complete
            </button>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        </div>
    `;


    taskList.appendChild(taskItem);

    addTaskEvents(taskItem);


    const statusLabel =
        taskItem.querySelector(".task-status");


    if (status === "completed") {

        statusLabel.textContent = "Completed";

    } else if (status === "in-progress") {

        statusLabel.textContent = "In Progress";

    } else {

        statusLabel.textContent = "Pending";
    }
}


/* =========================
   Load Tasks
   ========================= */

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");


    if (!savedTasks) {

        document
            .querySelectorAll(".task-item")
            .forEach(function (taskItem) {

                addTaskEvents(taskItem);
            });

        saveTasks();

        return;
    }


    taskList.innerHTML = "";

    const tasks = JSON.parse(savedTasks);


    tasks.forEach(function (task) {

        createTask(
            task.text,
            task.status,
            task.priority || "Medium",
            task.dueDate || "",
            task.category || "IT Support"
        );
    });
}


/* =========================
   Filter Tasks
   ========================= */

function filterTasks() {

    const selectedStatus = statusFilter.value;

    const selectedPriority =
        priorityFilter.value;

    const selectedCategory =
        categoryFilter.value;

    const searchText =
        taskSearch.value.trim().toLowerCase();


    document
        .querySelectorAll(".task-item")
        .forEach(function (taskItem) {


            const taskText =
                taskItem
                    .querySelector(".task-text")
                    .textContent
                    .toLowerCase();


            const taskStatus =
                taskItem.classList.contains("completed")
                    ? "completed"
                    : taskItem.classList.contains("in-progress")
                        ? "in-progress"
                        : "pending";


            const taskPriorityValue =
                taskItem.dataset.priority || "Medium";


            const taskCategoryValue =
                taskItem.dataset.category || "IT Support";


            const statusMatches =
                selectedStatus === "all" ||
                selectedStatus === taskStatus;


            const priorityMatches =
                selectedPriority === "all" ||
                selectedPriority === taskPriorityValue;


            const categoryMatches =
                selectedCategory === "all" ||
                selectedCategory === taskCategoryValue;


            const searchMatches =
                searchText === "" ||
                taskText.includes(searchText);


            if (
                statusMatches &&
                priorityMatches &&
                categoryMatches &&
                searchMatches
            ) {

                taskItem.style.display = "";

            } else {

                taskItem.style.display = "none";
            }
        });
}


/* =========================
   Task Manager Controls
   ========================= */

if (addTaskBtn) {

    addTaskBtn.addEventListener("click", function () {

        const taskText =
            taskInput.value.trim();


        if (taskText === "") {

            return;
        }


        createTask(
            taskText,
            "pending",
            taskPriority.value,
            taskDueDate.value,
            taskCategory.value
        );


        taskInput.value = "";

        taskDueDate.value = "";

        taskCategory.value = "IT Support";


        saveTasks();

        filterTasks();

        updateDashboard();
    });


    statusFilter.addEventListener(
        "change",
        filterTasks
    );


    priorityFilter.addEventListener(
        "change",
        filterTasks
    );


    categoryFilter.addEventListener(
        "change",
        filterTasks
    );


    taskSearch.addEventListener(
        "input",
        filterTasks
    );


    loadTasks();

    filterTasks();
}


/* =========================
   Dashboard
   ========================= */

function updateDashboard() {

    const totalTasks =
        document.getElementById("totalTasks");


    if (!totalTasks) {

        return;
    }


    const savedTasks =
        localStorage.getItem("tasks");


    if (!savedTasks) {

        document.getElementById("totalTasks").textContent = "0";

        document.getElementById("pendingTasks").textContent = "0";

        document.getElementById("inProgressTasks").textContent = "0";

        document.getElementById("completedTasks").textContent = "0";

        document.getElementById("overdueTasks").textContent = "0";

        document.getElementById("dueTodayTasks").textContent = "0";

        document.getElementById("completionPercentage").textContent = "0%";

        document.getElementById("progressFill").style.width = "0%";

        return;
    }


    const tasks = JSON.parse(savedTasks);


    const today =
        new Date().toISOString().split("T")[0];


    /* =========================
       Summary Counts
       ========================= */

    const total = tasks.length;


    const pending =
        tasks.filter(function (task) {

            return task.status === "pending";

        }).length;


    const inProgress =
        tasks.filter(function (task) {

            return task.status === "in-progress";

        }).length;


    const completed =
        tasks.filter(function (task) {

            return task.status === "completed";

        }).length;


    const overdue =
        tasks.filter(function (task) {

            return task.dueDate &&
                task.dueDate < today &&
                task.status !== "completed";

        }).length;


    const dueToday =
        tasks.filter(function (task) {

            return task.dueDate === today &&
                task.status !== "completed";

        }).length;


    /* =========================
       Summary Cards
       ========================= */

    document.getElementById("totalTasks").textContent =
        total;


    document.getElementById("pendingTasks").textContent =
        pending;


    document.getElementById("inProgressTasks").textContent =
        inProgress;


    document.getElementById("completedTasks").textContent =
        completed;


    document.getElementById("overdueTasks").textContent =
        overdue;


    document.getElementById("dueTodayTasks").textContent =
        dueToday;


    /* =========================
       Overall Progress
       ========================= */

    const completionPercentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);


    document.getElementById(
        "completionPercentage"
    ).textContent =
        completionPercentage + "%";


    document.getElementById(
        "progressFill"
    ).style.width =
        completionPercentage + "%";


    /* =========================
       Priority
       ========================= */

    document.getElementById(
        "highPriorityTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.priority === "High";

        }).length;


    document.getElementById(
        "mediumPriorityTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.priority === "Medium";

        }).length;


    document.getElementById(
        "lowPriorityTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.priority === "Low";

        }).length;


    /* =========================
       Categories
       ========================= */

    document.getElementById(
        "itSupportTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.category === "IT Support";

        }).length;


    document.getElementById(
        "maintenanceTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.category === "Maintenance";

        }).length;


    document.getElementById(
        "equipmentTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.category === "Equipment";

        }).length;


    document.getElementById(
        "hrTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.category === "HR";

        }).length;


    document.getElementById(
        "administrationTasks"
    ).textContent =

        tasks.filter(function (task) {

            return task.category === "Administration";

        }).length;


    /* =========================
       Upcoming Tasks
       ========================= */

    const upcomingContainer =
        document.getElementById("upcomingTasks");


    if (upcomingContainer) {

        const upcomingTasks =
            tasks
                .filter(function (task) {

                    return task.dueDate &&
                        task.dueDate >= today &&
                        task.status !== "completed";

                })
                .sort(function (a, b) {

                    return a.dueDate.localeCompare(b.dueDate);

                })
                .slice(0, 5);


        if (upcomingTasks.length === 0) {

            upcomingContainer.innerHTML = `
                <div class="empty-dashboard-message">
                    No upcoming tasks.
                </div>
            `;

        } else {

            upcomingContainer.innerHTML = "";


            upcomingTasks.forEach(function (task) {

                const item =
                    document.createElement("div");

                item.className =
                    "dashboard-task-item";


                item.innerHTML = `
                    <strong>${task.text}</strong>

                    <span>
                        Due: ${task.dueDate}
                    </span>

                    <span>
                        ${task.priority} · ${task.category}
                    </span>
                `;


                upcomingContainer.appendChild(item);
            });
        }
    }


    /* =========================
       Overdue Tasks
       ========================= */

    const overdueContainer =
        document.getElementById("overdueTaskList");


    if (overdueContainer) {

        const overdueTasks =
            tasks
                .filter(function (task) {

                    return task.dueDate &&
                        task.dueDate < today &&
                        task.status !== "completed";

                })
                .sort(function (a, b) {

                    return a.dueDate.localeCompare(b.dueDate);

                })
                .slice(0, 5);


        if (overdueTasks.length === 0) {

            overdueContainer.innerHTML = `
                <div class="empty-dashboard-message">
                    No overdue tasks.
                </div>
            `;

        } else {

            overdueContainer.innerHTML = "";


            overdueTasks.forEach(function (task) {

                const item =
                    document.createElement("div");

                item.className =
                    "dashboard-task-item";


                item.innerHTML = `
                    <strong>${task.text}</strong>

                    <span>
                        Due: ${task.dueDate}
                    </span>

                    <span>
                        ${task.priority} · ${task.category}
                    </span>
                `;


                overdueContainer.appendChild(item);
            });
        }
    }


    /* =========================
       Recent Activity
       ========================= */

    const recentActivity =
        document.getElementById("recentActivity");


    if (recentActivity) {

        recentActivity.innerHTML = `
            <div class="activity-item">

                <span class="activity-icon">✓</span>

                <div>

                    <strong>Dashboard updated</strong>

                    <p>
                        Your dashboard is showing the latest task information.
                    </p>

                </div>

            </div>
        `;
    }
}


/* =========================
   Start Dashboard
   ========================= */

updateDashboard();