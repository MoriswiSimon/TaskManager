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


function addTaskEvents(taskItem) {
    const deleteBtn = taskItem.querySelector(".delete-btn");
    const completeBtn = taskItem.querySelector(".complete-btn");
    const startBtn = taskItem.querySelector(".start-btn");
    const editBtn = taskItem.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", function () {
        taskItem.remove();
        saveTasks();
        filterTasks();
    });


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
    });


    startBtn.addEventListener("click", function () {
        taskItem.classList.remove("completed");

        if (taskItem.classList.contains("in-progress")) {
            taskItem.classList.remove("in-progress");
        } else {
            taskItem.classList.add("in-progress");
        }

        const statusLabel = taskItem.querySelector(".task-status");

        if (taskItem.classList.contains("in-progress")) {
            statusLabel.textContent = "In Progress";
        } else {
            statusLabel.textContent = "Pending";
        }

        saveTasks();
        filterTasks();
    });


    completeBtn.addEventListener("click", function () {
        taskItem.classList.remove("in-progress");
        taskItem.classList.add("completed");

        const statusLabel = taskItem.querySelector(".task-status");

        statusLabel.textContent = "Completed";

        saveTasks();
        filterTasks();
    });
}


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
            <button class="start-btn">Start</button>
            <button class="complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(taskItem);

    addTaskEvents(taskItem);

    const statusLabel = taskItem.querySelector(".task-status");

    if (status === "completed") {
        statusLabel.textContent = "Completed";
    } else if (status === "in-progress") {
        statusLabel.textContent = "In Progress";
    } else {
        statusLabel.textContent = "Pending";
    }
}


function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        document.querySelectorAll(".task-item").forEach(function (taskItem) {
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


function filterTasks() {
    const selectedStatus = statusFilter.value;
    const selectedPriority = priorityFilter.value;
    const selectedCategory = categoryFilter.value;
    const searchText = taskSearch.value.trim().toLowerCase();

    document.querySelectorAll(".task-item").forEach(function (taskItem) {

        const taskText = taskItem
            .querySelector(".task-text")
            .textContent
            .toLowerCase();

        const taskStatus = taskItem.classList.contains("completed")
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

if (addTaskBtn) {
addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

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
});


statusFilter.addEventListener("change", filterTasks);

priorityFilter.addEventListener("change", filterTasks);

categoryFilter.addEventListener("change", filterTasks);

taskSearch.addEventListener("input", filterTasks);


loadTasks();

filterTasks();
}

function updateDashboard() {
    const totalTasks = document.getElementById("totalTasks");
    const pendingTasks = document.getElementById("pendingTasks");
    const inProgressTasks = document.getElementById("inProgressTasks");
    const completedTasks = document.getElementById("completedTasks");

    if (!totalTasks) {
        return;
    }

    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) {
        totalTasks.textContent = "0";
        pendingTasks.textContent = "0";
        inProgressTasks.textContent = "0";
        completedTasks.textContent = "0";

        return;
    }

    const tasks = JSON.parse(savedTasks);

    totalTasks.textContent = tasks.length;

    pendingTasks.textContent = tasks.filter(function (task) {
        return task.status === "pending";
    }).length;

    inProgressTasks.textContent = tasks.filter(function (task) {
        return task.status === "in-progress";
    }).length;

    completedTasks.textContent = tasks.filter(function (task) {
        return task.status === "completed";
    }).length;
}

updateDashboard();