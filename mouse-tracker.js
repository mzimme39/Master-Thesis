// mouse-tracker.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDXA85T2Cxhdfu4FTmvo-4rvhznCeG0w1s",
    authDomain: "mouse-data.firebaseapp.com",
    databaseURL: "https://mouse-data-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "mouse-data",
    storageBucket: "mouse-data.appspot.com",
    messagingSenderId: "807620479258",
    appId: "1:807620479258:web:20b99ddcf75a855d13c4a3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getDatabase(app);

// Generate a unique user ID for this session
export const userId = `user_${Math.random().toString(36).substring(2, 15)}`;

let _currentTask = 'unknown'; // Internes Tracking der aktuellen Aufgabe

export function getCurrentTask() {
    return _currentTask;
}

export function setCurrentTask(task) {
    _currentTask = task;
}

// Function to write mouse data to Firebase
export function writeMouseData(userId, eventType, x, y, timeStamp) { // Entferne den task Parameter hier
    const task = getCurrentTask(); // Hole den aktuellen Task
    console.log(`Writing data: ${eventType}, task: ${task}`); // Konsolenausgabe hinzufügen
    if (task === null || task === 'unknown') return; // Verhindern das Schreiben von Daten, wenn keine Aufgabe läuft
    const mouseDataRef = ref(db, 'mouseData/' + userId);
    const newDataRef = push(mouseDataRef);
    set(newDataRef, {
        eventType: eventType,
        x: x,
        y: y,
        timeStamp: timeStamp,
        task: task // Add task information to the mouse data
    });
}

// Function to write form data to Firebase
function writeFormData(userId, formId, formData) {
    const formDataRef = ref(db, 'formData/' + userId);
    const newFormDataRef = push(formDataRef);
    set(newFormDataRef, {
        formId: formId,
        formData: formData,
        timeStamp: Date.now()
    });
}

// Function to capture form data
function captureFormData(formId) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    writeFormData(userId, formId, data);
}

let pauseTimer;
const pauseThreshold = 2000; // Schwellenwert für eine "meaningful pause" in Millisekunden

// Funktion zur Erkennung einer meaningful pause
function startPauseTimer(x, y) {
    pauseTimer = setTimeout(() => {
        writeMouseData(userId, 'meaningful_pause', x, y, Date.now());
    }, pauseThreshold);
}

function stopPauseTimer() {
    if (pauseTimer) {
        clearTimeout(pauseTimer);
        pauseTimer = null;
    }
}

// Throttling-Funktion
export function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

export const throttleInterval = 50;


// Event listeners for mouse movements with throttling and pause detection
document.addEventListener('mousemove', throttle((event) => {
    const task = getCurrentTask();
    stopPauseTimer(); // Stoppe den Pause-Timer, wenn die Maus bewegt wird
    startPauseTimer(event.clientX, event.clientY); // Starte den Pause-Timer

    if ((task !== 'task4' && task !== 'task8' && task !== 'task1' && task !== 'task5') || (event.buttons === 0)) {
        writeMouseData(userId, 'move', event.clientX, event.clientY, Date.now());
    }
}, throttleInterval));

// Event listeners for clicks and drag actions
document.addEventListener('click', (event) => {
    stopPauseTimer(); // Stoppe den Pause-Timer, wenn geklickt wird
    writeMouseData(userId, 'click', event.clientX, event.clientY, Date.now());
});

document.addEventListener('dragstart', (event) => {
    stopPauseTimer(); // Stoppe den Pause-Timer, wenn das Dragging beginnt
    const task = getCurrentTask();
    if (task === 'task1' || task === 'task4' || task === 'task5' || task === 'task8') {
        writeMouseData(userId, 'dragstart', event.clientX, event.clientY, Date.now());
    }
});

document.addEventListener('drag', throttle((event) => {
    const task = getCurrentTask();
    if (task === 'task1' || task === 'task4' || task === 'task5' || task === 'task8') {
        writeMouseData(userId, 'drag', event.clientX, event.clientY, Date.now());
    }
}, throttleInterval));

document.addEventListener('dragend', (event) => {
    stopPauseTimer(); // Stoppe den Pause-Timer, wenn das Dragging endet
    const task = getCurrentTask();
    if (task === 'task1' || task === 'task4' || task === 'task5' || task === 'task8') {
        writeMouseData(userId, 'drop', event.clientX, event.clientY, Date.now());
    }
});








// Event listeners for form submissions
document.getElementById('start-test').addEventListener('click', function() {
    const mouseSelect = document.getElementById('mouse'); // Ensure this is defined correctly
    const allSections = document.querySelectorAll('section');
    const finalPage = document.getElementById('final-page');
    captureFormData('demographics-form');
    if (mouseSelect.value === 'Keine Maus oder Touchpad') {
        alert('Die Durchführung des Experiments ohne Maus oder Touchpad ist nicht möglich.');
        allSections.forEach(section => section.classList.add('hidden'));
        finalPage.classList.remove('hidden');
    } else {
        allSections.forEach(section => section.classList.add('hidden'));
        document.getElementById('video').classList.remove('hidden');
        autoStartAndProceedVideo(); // Die Funktion wird nur aufgerufen, wenn der Button geklickt wird
    }
});

function autoStartAndProceedVideo() {
    const videoFrame = document.getElementById('auto-video');
    // Setzen der Video URL, um automatisches Abspielen zu gewährleisten
    videoFrame.src += "&autoplay=1"

    // Event Listener, der nach dem Video zur Aufgabeninstruktion navigiert
    setTimeout(() => {
        videoFrame.src = ""; // Das Video wird gestoppt, indem die src auf eine leere Zeichenfolge gesetzt wird
        document.getElementById('video').classList.add('hidden');
        document.getElementById('instruction-task1').classList.remove('hidden');
        currentTask = null; // Keine Aufgabe während der Instruktionen
    }, 34000); // 34 Sekunden warten, um dem Video genug Zeit zum Abspielen zu geben
  }

document.getElementById('stress-level-form-1').addEventListener('submit', function (event) {
    event.preventDefault();
    captureFormData('stress-level-form-1');
    document.getElementById('stress-survey-1').classList.add('hidden');
    document.getElementById('instruction-task5').classList.remove('hidden');
});

document.getElementById('stress-level-form-2').addEventListener('submit', function (event) {
    event.preventDefault();
    captureFormData('stress-level-form-2');
    document.getElementById('stress-survey-2').classList.add('hidden');
    document.getElementById('final-page').classList.remove('hidden');
});
