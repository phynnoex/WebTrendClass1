const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

import { initializeApp } from "firebase/app";
import {
  doc,
  getDocs,
  addDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAdxj1J4Gvq8dqx1qFFcj1PNUAwEh_GAl0",
  authDomain: "webtrendclass1.firebaseapp.com",
  projectId: "webtrendclass1",
  storageBucket: "webtrendclass1.firebasestorage.app",
  messagingSenderId: "838491099821",
  appId: "1:838491099821:web:5197612de17d5da2c66c24",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function renderTasks() {
  var tasks = await getTasksFromFirestore();
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    if (!task.data().completed) {
      const taskItem = document.createElement("li");
      taskItem.id = task.id;
      taskItem.textContent = task.data().text;
      taskList.appendChild(taskItem);
    }
  });
}
async function getTasksFromFirestore() {
  var data = await getDocs(collection(db, "todos"));
  let userData = [];
  data.forEach((doc) => {
    userData.push(doc);
  });
  return userData;
}

function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}

// Add Task
addTaskBtn.addEventListener("click", async () => {
  const task = taskInput.value.trim();
  if (task) {
    const taskInput = document.getElementById("taskInput");
    const taskText = sanitizeInput(taskInput.value.trim());
    if (taskText) {
      await addTaskToFirestore(taskText);
      renderTasks();
      taskInput.value = "";
    }
    renderTasks();
  }
});

async function addTaskToFirestore(taskText) {
  await addDoc(collection(db, "todos"), {
    text: taskText,
    completed: false,
  });
}

// Remove Task on Click
taskList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.remove();
  }
});

const sw = new URL("service-worker.js", import.meta.url);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(sw.href, {
      scope: "/WebTrendClass1/",
    })
    .then((registration) =>
      console.log(
        "Service Worker Registered for scope:",
        registration.scope,
        "Script URL:",
        sw.href
      )
    )
    .catch((err) => console.error("Service Worker Error:", err));
} else {
  console.warn("Service Workers are not supported in this browser.");
}

