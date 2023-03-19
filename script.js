"use strict";

const todoForm = document.getElementById("todo-form");
const todoList = document.querySelector(".todos");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const remainingTasks = document.getElementById("remaining-tasks");
const mainInput = document.querySelector(".main-input");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
if (localStorage.getItem("tasks")) {
  tasks.map((t) => {
    createTask(t);
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = mainInput.value.trim();
  if (inputValue == "") {
    return;
  }

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isCompleted: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  createTask(task);
  todoForm.reset();
  mainInput.focus();
});

todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task")
    // ||    e.target.parentElenent.parentElement.classList.contains("remove-task")
  ) {
    const taskId = e.target.closest("li").id;
    removeTask(taskId);
  }
});

todoList.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) {
    e.preventDefault();
    e.target.blur();
  }
});

todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;
  updateTask(taskId, e.target);
});

function createTask(task) {
  const taskEl = document.createElement("li");
  taskEl.setAttribute("id", task.id);

  if (taskEl.isCompleted) {
    taskEl.classList.add("completed");
  }

  const taskElMarkup = `
  <div>
    <input type="checkbox" name="tasks" id="${task.id}" ${
    task.isCompleted ? "checked" : " "
  }/>
    <span ${!task.isCompleted ? "contenteditable" : " "}>${task.name}</span>
  </div>
  <button title="Remove ${task.name} task" class="remove-task">
    <svg
     xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 50 50"
     width="50px"
     height="50px"
     >
     <path
     d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"
     />
    </svg>
   </button>
  `;

  taskEl.innerHTML = taskElMarkup;
  todoList.appendChild(taskEl);

  countTasks();
}

function countTasks() {
  const completedTaskArray = tasks.filter((task) => task.isCompleted === true);

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completedTaskArray.length;
  remainingTasks.textContent = tasks.length - completedTaskArray.length;
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));

  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(taskId).remove();
  countTasks();
}

function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  } else {
    const span = el.nextElementSibling;
    const parent = el.closest("li");

    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      span.removeAttribute("contenteditable");
      parent.classList.add("completed");
    } else {
      span.setAttribute("contenteditable", true);
      parent.classList.remove("completed");
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  countTasks();
}
