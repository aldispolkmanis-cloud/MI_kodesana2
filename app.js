const STORAGE_KEY = "pd1-uzdevumi";
const taskInput = document.querySelector("#task-input");
const taskForm = document.querySelector("#task-form");
const taskList = document.querySelector("#task-list");
const counter = document.querySelector("#counter");
const filters = document.querySelector(".filters");

let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function visibleTasks() {
  if (currentFilter === "active") return tasks.filter((task) => !task.done);
  if (currentFilter === "completed") return tasks.filter((task) => task.done);
  return tasks;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.done ? " is-done" : ""}`;
  item.dataset.id = task.id;

  const toggle = document.createElement("input");
  toggle.className = "task-toggle";
  toggle.type = "checkbox";
  toggle.checked = task.done;
  toggle.setAttribute("aria-label", `Atzīmēt uzdevumu: ${task.text}`);

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  const remove = document.createElement("button");
  remove.className = "delete-btn";
  remove.type = "button";
  remove.textContent = "×";
  remove.setAttribute("aria-label", `Dzēst uzdevumu: ${task.text}`);

  item.append(toggle, text, remove);
  return item;
}

function renderTasks() {
  taskList.replaceChildren(...visibleTasks().map(createTaskElement));
  const remaining = tasks.filter((task) => !task.done).length;
  counter.textContent = `Atlikuši ${remaining} uzdevumi`;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ id: crypto.randomUUID(), text, done: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

function updateFilterButtons() {
  filters.querySelectorAll("[data-filter]").forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  currentFilter = button.dataset.filter;
  updateFilterButtons();
  renderTasks();
});

taskList.addEventListener("change", (event) => {
  if (!event.target.matches(".task-toggle")) return;
  const task = tasks.find((item) => item.id === event.target.closest(".task-item").dataset.id);
  if (!task) return;
  task.done = event.target.checked;
  saveTasks();
  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const remove = event.target.closest(".delete-btn");
  if (!remove) return;
  const id = remove.closest(".task-item").dataset.id;
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
});

renderTasks();
