
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("pixelTasks")) || [];

function saveTasks() {
    localStorage.setItem("pixelTasks", JSON.stringify(tasks));
}

function updateDashboard() {
    const completedTasks = tasks.filter(task => task.done).length;
    const xp = completedTasks * 10;

    const percentage = tasks.length === 0
        ? 0
        : Math.round((completedTasks / tasks.length) * 100);

    document.getElementById("xp").textContent = xp;
    document.getElementById("completed").textContent =
        `${completedTasks} / ${tasks.length}`;

    document.getElementById("progress").style.width =
        percentage + "%";

    document.getElementById("progress-text").textContent =
        percentage + "% COMPLETE";
}

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";

        if (task.done) {
            taskElement.classList.add("done");
        }

        const checkButton = document.createElement("button");
        checkButton.className = "check-btn";
        checkButton.textContent = task.done ? "✓" : "○";

        checkButton.addEventListener("click", () => {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "X";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            renderTasks();
        });

        taskElement.appendChild(checkButton);
        taskElement.appendChild(taskText);
        taskElement.appendChild(deleteButton);

        taskList.appendChild(taskElement);
    });

    updateDashboard();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") return;

    tasks.push({
        id: Date.now(),
        text: text,
        done: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
});

document.getElementById("date").textContent =
    new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).toUpperCase();

renderTasks();
