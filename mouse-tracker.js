// mouse-tracker.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getDatabase, ref, set, push } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your Firebase configuration
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
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Generate a unique user ID for this session
const userId = `user_${Math.random().toString(36).substring(2, 15)}`;

// Function to write mouse data to Firebase
function writeMouseData(userId, eventType, x, y, timeStamp) {
    const mouseDataRef = ref(db, 'mouseData/' + userId);
    const newDataRef = push(mouseDataRef);
    set(newDataRef, {
        eventType: eventType,
        x: x,
        y: y,
        timeStamp: timeStamp
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

// Event listeners for mouse movements and clicks
document.addEventListener('mousemove', (event) => {
    writeMouseData(userId, 'move', event.clientX, event.clientY, Date.now());
});

document.addEventListener('click', (event) => {
    writeMouseData(userId, 'click', event.clientX, event.clientY, Date.now());
});

document.addEventListener('drag', (event) => {
    writeMouseData(userId, 'drag', event.clientX, event.clientY, Date.now());
});

// Event listeners for form submissions
document.getElementById('start-test').addEventListener('click', function() {
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