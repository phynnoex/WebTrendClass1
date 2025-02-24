// Get references to DOM elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// ✅ Correct Firebase Imports
import { initializeApp } from "firebase/app";
import {
  doc,
  getDoc,   // ✅ Moved here
  getDocs,
  addDoc,
  updateDoc,
  getFirestore,
  collection,
} from "firebase/firestore";

// ✅ Fixed Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdxj1J4Gvq8dqx1qFFcj1PNUAwEh_GAl0",
  authDomain: "webtrendclass1.firebaseapp.com",
  projectId: "webtrendclass1",
  storageBucket: "webtrendclass1.appspot.com",  // ✅ Fixed this line
  messagingSenderId: "838491099821",
  appId: "1:838491099821:web:5197612de17d5da2c66c24",
};

// Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Fetch and Render Tasks from Firestore
async function renderTasks() {
  const tasks = await getTasksFromFirestore();
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    if (!task.data().completed) {
      const taskItem = document.createElement("li");
      taskItem.id = task.id;
      taskItem.textContent = task.data().text;
      taskList.appendChild(taskItem);
    }
  });
}

// ✅ Get Tasks from Firestore
async function getTasksFromFirestore() {
  const data = await getDocs(collection(db, "todos"));
  return data.docs; // More efficient
}

// ✅ Sanitize Input
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// ✅ Add Task Event Listener
addTaskBtn.addEventListener("click", async () => {
  const taskText = sanitizeInput(taskInput.value.trim());
  if (taskText) {
    await addTaskToFirestore(taskText);
    renderTasks();
    taskInput.value = "";
  }
});

// ✅ Add Task to Firestore
async function addTaskToFirestore(taskText) {
  await addDoc(collection(db, "todos"), {
    text: taskText,
    completed: false,
  });
}

// ✅ Remove Task on Click
taskList.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.remove();
  }
});

// ✅ Service Worker Registration
const sw = new URL("service-worker.js", import.meta.url);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(sw.href, { scope: "/WebTrendClass1/" })
    .then(() => console.log("Service Worker Registered:", sw.href))
    .catch((err) => console.error("Service Worker Error:", err));
}

// ✅ Google Generative AI Setup
import { GoogleGenerativeAI } from "@google/generative-ai";

let apiKey, genAI, model;

// ✅ Fetch API Key
async function getApiKey() {
  const snapshot = await getDoc(doc(db, "api key", "googlegenai"));
  apiKey = snapshot.data().key;
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

// ✅ Ask Chatbot
async function askChatBot(request) {
  return await model.generateContent(request);
}

// ✅ AI Rule-Based Chatbot
function ruleChatBot(request) {
  if (request.startsWith("add task")) {
    const task = request.replace("add task", "").trim();
    if (task) {
      addTask(task);
      appendMessage(`Task "${task}" added!`);
    } else {
      appendMessage("Please specify a task to add.");
    }
    return true;
  } else if (request.startsWith("complete")) {
    const taskName = request.replace("complete", "").trim();
    if (taskName) {
      if (removeFromTaskName(taskName)) {
        appendMessage(`Task "${taskName}" marked as complete.`);
      } else {
        appendMessage("Task not found!");
      }
    } else {
      appendMessage("Please specify a task to complete.");
    }
    return true;
  }
  return false;
}

// ✅ AI Button Event Listener
aiButton.addEventListener("click", async () => {
  const prompt = aiInput.value.trim().toLowerCase();
  if (prompt) {
    if (!ruleChatBot(prompt)) {
      askChatBot(prompt);
    }
  } else {
    appendMessage("Please enter a prompt");
  }
});

// ✅ Append Message to Chat History
function appendMessage(message) {
  const history = document.createElement("div");
  history.textContent = message;
  history.className = "history";
  chatHistory.appendChild(history);
  aiInput.value = "";
}

// ✅ Remove Task by Name
function removeFromTaskName(task) {
  const elements = document.getElementsByName(task);
  if (elements.length === 0) return false;
  
  elements.forEach((e) => {
    removeTask(e.id);
    removeVisualTask(e.id);
  });

  return true;
}
