const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

    taskItem.innerHTML = `
        <span>${taskText}</span>
        <div>
            <button class="complete-btn">Complete</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(taskItem);

    taskInput.value = "";

    const deleteBtn = taskItem.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", function () {
        taskItem.remove();
    });

    const completeBtn = taskItem.querySelector(".complete-btn");

    completeBtn.addEventListener("click", function () {
        taskItem.classList.toggle("completed");
    });
});