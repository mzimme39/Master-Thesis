// script.js

import { writeMouseData, userId, setCurrentTask, throttle, throttleInterval } from './mouse-tracker.js';

function startTask(taskName) {
  setCurrentTask(taskName);
}


document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('to-demographics').addEventListener('click', function () {
    setCurrentTask(null); // Keine Aufgabe während der Instruktionen
    document.getElementById('introduction').classList.add('hidden');
    document.getElementById('demographics').classList.remove('hidden');
  });

  const demographicsForm = document.getElementById('demographics-form');
  const startTestButton = document.getElementById('start-test');
  const mouseSelect = document.getElementById('mouse');
  const finalPage = document.getElementById('final-page');
  const allSections = document.querySelectorAll('section');

  // Funktion zum Aktualisieren des Status des Start-Buttons
  function updateStartButtonState() {
    let allSelected = true;
    const selects = demographicsForm.querySelectorAll('select');
    selects.forEach(select => {
      if (select.value === "") allSelected = false;
    });

    startTestButton.disabled = !allSelected;
  }

  // Event Listener für alle Select-Elemente im Formular
  demographicsForm.querySelectorAll('select').forEach(select => {
    select.addEventListener('change', function() {
      updateStartButtonState();  // Aktualisiert den Status des Buttons bei jeder Änderung
    });
  });

  // Event Listener für den Start-Test-Button
  startTestButton.addEventListener('click', function() {
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
        setCurrentTask(null); // Keine Aufgabe während der Instruktionen
    }, 34000); // 34 Sekunden warten, um dem Video genug Zeit zum Abspielen zu geben
  }

  

  document.getElementById('start-task1').addEventListener('click', function() {
    startTask('task1');
    document.getElementById('instruction-task1').classList.add('hidden');
    document.getElementById('task1').classList.remove('hidden');
  });

  // Event Listener für den Button 'Zur nächsten Aufgabe'
  document.getElementById('submit-colors').addEventListener('click', function() {
    setCurrentTask(null); // Keine Aufgabe während der Instruktionen
    document.getElementById('task1').classList.add('hidden');
    document.getElementById('instruction-task2').classList.remove('hidden');
  });

  document.getElementById('start-task2').addEventListener('click', function () {
    startTask('task2');
    document.getElementById('instruction-task2').classList.add('hidden');
    document.getElementById('task2').classList.remove('hidden');
    showNextTarget(0, 'task2-area'); // Startet mit dem ersten Ziel für Aufgabe 1
  });

  // Event-Listener, um das Tower of Hanoi-Spiel zu starten
  document.getElementById('start-task3').addEventListener('click', function () {
    startTask('task3');
    document.getElementById('instruction-task3').classList.add('hidden');
    document.getElementById('task3').classList.remove('hidden');
    startTask3();
    showTipButtonAfterDelay(60000); // 60000 milliseconds = 60 seconds
  });

  document.getElementById('start-task4').addEventListener('click', function () {
    startTask('task4');
    document.getElementById('instruction-task4').classList.add('hidden');
    document.getElementById('task4').classList.remove('hidden');
    currentLevel = 1;
    startDrawingTask(currentLevel);
  });

  document.getElementById('to-stress-survey-1').addEventListener('click', function() {
    setCurrentTask(null); // Keine Aufgabe während der Instruktionen
    document.getElementById('task4').classList.add('hidden'); // Verstecke die aktuelle Aufgabe 4
    document.getElementById('stress-survey-1').classList.remove('hidden'); // Zeige die Halbzeit-Instruktionen
  });

  // Funktion, um den Status des Buttons "Zum zweiten Teil" basierend auf der Auswahl des Stresslevels zu aktualisieren
  document.getElementById('stress-level-form-1').addEventListener('change', function() {
    const stressLevelSelected = document.querySelector('input[name="stress-level"]:checked');
    document.getElementById('to-task5').disabled = !stressLevelSelected;
  });

  // Initialisiere den Button "Zum zweiten Teil" als deaktiviert
  document.getElementById('to-task5').disabled = true;

  // Navigation von der Halbzeit-Anleitung zu Aufgabe 5 Anleitung
  document.getElementById('to-task5').addEventListener('click', function() {
    document.getElementById('stress-survey-1').classList.add('hidden'); // Verstecke die Halbzeit-Anleitung
    document.getElementById('instruction-task5').classList.remove('hidden'); // Zeige die Anleitung zu Aufgabe 5
    setCurrentTask(null); // Keine Aufgabe während der Instruktionen
  });

  // Starten von Aufgabe 5 bei der Vorbereitungsseite
  document.getElementById('start-pre-task5').addEventListener('click', function() {
    startTask('pre-task5');
    document.getElementById('instruction-task5').classList.add('hidden');
    document.getElementById('pre-task5').classList.remove('hidden'); // Zeige die Vorbereitungsseite
    startPreTask5Timer(); // Starte den Timer für die Vorbereitungsseite
  });

  // Event Listener für das Starten von Aufgabe 6
  document.getElementById('start-task6').addEventListener('click', function() {
    startTask('task6');
    document.getElementById('instruction-task6').classList.add('hidden'); // Verstecke die Anleitung
    document.getElementById('task6').classList.remove('hidden'); // Zeige Aufgabe 6
    startTask6Game(); // Funktion, um das Spiel für Aufgabe 6 zu starten
  });

  document.getElementById('start-task7').addEventListener('click', function () {
    startTask('task7');
    // Verstecke die Anleitung von Task 4 und zeige das Spiel an
    document.getElementById('instruction-task7').classList.add('hidden');
    document.getElementById('task3').classList.add('hidden'); // Verstecke die vorherige Aufgabe 3 vollständig

    // Starte Task 4 mit einer neuen Instanz des Spiels
    startTask7();
  });

  document.getElementById('to-task8').addEventListener('click', function() {
    if (task7Timer) {
      clearInterval(task7Timer); // Stoppe den Timer, wenn der Benutzer auf den Button klickt
      task7Timer = null;
    }
    countdownSound.pause();  // Countdown-Sound stoppen
    countdownSound.currentTime = 0; // Zurücksetzen der Position auf den Anfang
    document.getElementById('task3').classList.add('hidden');
    showInstructionTask8();
    setCurrentTask(null); // Keine Aufgabe während der Instruktionen
  });  

  document.getElementById('start-task8').addEventListener('click', function () {
    startTask('task8');
    document.getElementById('instruction-task8').classList.add('hidden');
    document.getElementById('task8').classList.remove('hidden');
    currentLevel = 1;
    startDrawingTask8(currentLevel);
  });

  document.getElementById('to-stress-survey-2').addEventListener('click', function () {
    setCurrentTask(null); // Keine Aufgabe während der Instruktionen
    document.getElementById('task8').classList.add('hidden');
    document.getElementById('stress-survey-2').classList.remove('hidden');
  });

  // Funktion, um den Status des Buttons "Test beenden" basierend auf der Auswahl des Stresslevels zu aktualisieren
  document.getElementById('stress-level-form-2').addEventListener('change', function() {
    const stressLevelSelected = document.querySelector('input[name="stress-level"]:checked');
    document.getElementById('to-final-page').disabled = !stressLevelSelected;
  });

  // Initialisiere den Button "Test beenden" als deaktiviert
  document.getElementById('to-final-page').disabled = true;

  document.getElementById('to-final-page').addEventListener('click', function() {
    document.getElementById('stress-survey-2').classList.add('hidden'); 
    document.getElementById('final-page').classList.remove('hidden'); 
  });

});


// Drag-and-Drop-Logik für Aufgabe 1
document.addEventListener('DOMContentLoaded', function() {
  const colorBoxes = document.querySelectorAll('#task1 .color-box');
  const wordBoxes = document.querySelectorAll('#task1 .word-box');
  const submitButton = document.getElementById('submit-colors');

  // Initiale Deaktivierung des Submit-Buttons
  submitButton.disabled = true;

  colorBoxes.forEach(box => {
    box.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text', e.target.dataset.color);
      e.dataTransfer.setDragImage(e.target, 0, 0); // Setzt das Bild, das beim Ziehen angezeigt wird
    });
  });

  wordBoxes.forEach(box => {
    box.addEventListener('dragover', function(e) {
      e.preventDefault(); // Erlaube das Ablegen
    });
    box.addEventListener('drop', function(e) {
      e.preventDefault();
      const draggedColor = e.dataTransfer.getData('text');
      const targetWord = e.target.dataset.word;

      if (draggedColor === targetWord) {
        if (!e.target.getAttribute('data-assigned-color')) {
          const matchingBox = document.querySelector(`#task1 .color-box[data-color="${draggedColor}"]`);
          matchingBox.style.opacity = '0.4'; // Reduziere die Deckkraft
          e.target.style.backgroundColor = draggedColor; // Färbe das Wortfeld
          e.target.setAttribute('data-assigned-color', draggedColor); // Markiere als zugeordnet
          checkAllAssigned(); // Überprüfe, ob alle Zuordnungen abgeschlossen sind
        }
      } else {
        // Fallback: Setze das Element auf die ursprüngliche Position zurück
        const draggedElement = document.querySelector(`#task1 .color-box[data-color="${draggedColor}"]`);
        draggedElement.style.position = 'relative'; // Setzt die Position zurück, wenn erforderlich
        draggedElement.style.top = '0px'; // Setze top auf 0
        draggedElement.style.left = '0px'; // Setze left auf 0
      }
    });
  });

  function checkAllAssigned() {
    const allAssigned = Array.from(wordBoxes).every(box => box.getAttribute('data-assigned-color'));
    submitButton.disabled = !allAssigned; // Aktiviere den Button nur, wenn alle zugeordnet sind
  }
});









function showNextTarget(index, taskAreaId) {
  if (index >= 10) { // Änderung von 5 auf 10 Boxen
      alert('Gut gemacht! Aufgabe 2 abgeschlossen.');
      document.getElementById('task2').classList.add('hidden');
      document.getElementById('instruction-task3').classList.remove('hidden');
      setCurrentTask(null); // Keine Aufgabe während der Instruktionen
      return;
  }
  updateRemainingTargets2(index + 1, 10); // Aktualisiere die Anzahl der verbleibenden Ziele
  createTarget(index, taskAreaId);
}

function updateRemainingTargets2(current, max) {
  const remainingTargets2 = document.getElementById('remaining-targets2');
  remainingTargets2.textContent = `Verbleibende Targets: ${max - current + 1} von ${max}`;
}

function createTarget(index, taskAreaId) {
  let taskArea = document.getElementById(taskAreaId);
  let target = document.createElement('div');
  target.className = 'target';
  target.style.width = '30px';
  target.style.height = '30px';
  target.style.backgroundColor = 'gray'; // Ändern Sie die Farbe in Grau
  target.style.position = 'absolute';

  let maxWidth = taskArea.offsetWidth - 50;
  let maxHeight = taskArea.offsetHeight - 50;
  let randomX = Math.random() * maxWidth;
  let randomY = Math.random() * maxHeight;

  target.style.left = `${randomX}px`;
  target.style.top = `${randomY}px`;

  taskArea.appendChild(target);

  target.addEventListener('click', function () {
      taskArea.removeChild(this);
      showNextTarget(index + 1, taskAreaId); // Rufen Sie die nächste Box nach dem Klick auf
  });
}


function showInstructionTask4() {
  document.getElementById('instruction-task4').classList.remove('hidden');
  setCurrentTask(null); // Keine Aufgabe während der Instruktionen
}

// Globale Variable für den Countdown-Sound
let countdownSound = new Audio('countdown_10s.mp3');

// Funktion zum Initialisieren des Audios nach Benutzerinteraktion
function initializeAudio() {
    document.body.addEventListener('click', () => {
        countdownSound.play().catch(() => {
            console.log('Audio-Initialisierung fehlgeschlagen');
        });
        countdownSound.pause();
        countdownSound.currentTime = 0;
    }, { once: true });
}

// Initialisiere das Audio bei der ersten Benutzerinteraktion
initializeAudio();

// Funktion zum Aktualisieren der Timer-Anzeige
function updateTimerDisplay(timeLeft, timerElement, playSound = true) {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Countdown-Sound abspielen, wenn 5 Sekunden übrig sind
  if (timeLeft === 10 && playSound) {
      countdownSound.play().catch(err => {
          console.log('Audio-Fehler:', err);
      });
  }

  // Countdown-Sound stoppen, wenn die Zeit abgelaufen ist
  if (timeLeft === 0 && countdownSound) {
      countdownSound.pause();
      countdownSound.currentTime = 0;
  }

  // Ändere die Textfarbe zu rot, wenn 5 Sekunden oder weniger übrig sind, sonst schwarz
  if (timeLeft <= 10) {
      timerElement.style.color = 'red';
  } else {
      timerElement.style.color = 'black';
  }
}



let preTask5TimerInterval; // Globale Variable für den Timer der Vorbereitungsaufgabe

function startPreTask5Timer() {
    let timeLeft = 20; // Setze die Zeit auf 15 Sekunden
    let timerElement = document.getElementById('pretask5-timer'); // Nutze das richtige Timer-Element
    updateTimerDisplay(timeLeft, timerElement, true);

    if (preTask5TimerInterval) {
        clearInterval(preTask5TimerInterval); // Stelle sicher, dass kein vorheriger Timer läuft
    }

    preTask5TimerInterval = setInterval(function() {
        timeLeft--;
        updateTimerDisplay(timeLeft, timerElement, true);
        if (timeLeft <= 0) {
            clearInterval(preTask5TimerInterval);
            preTask5TimerInterval = null;
            preTask5TimeUp(); // Funktion, die ausgeführt wird, wenn der Timer abläuft
        }
    }, 1000);
}

function preTask5TimeUp() {
  startTask('task5');
  document.getElementById('pre-task5').classList.add('hidden'); // Verstecke die Pre-Task 5-Ansicht
  document.getElementById('task5').classList.remove('hidden'); // Zeige Aufgabe 5
  startTask5Timer(); // Starte den Timer für Aufgabe 5
}



function initTask5() {
  const resultsContainer = document.getElementById('task5-results');
  resultsContainer.innerHTML = ''; // Reset der Inhalte

  const results = ['4', '9', '15', '8', '5']; // Ergebnisse von Matheaufgaben
  results.forEach(result => {
      const container = document.createElement('div');
      container.className = 'result-box';
      container.setAttribute('data-result', result);
      container.textContent = result;
      resultsContainer.appendChild(container);
  });

  initTask5DragAndDrop(); // Initialisiere Drag-and-Drop für task5
}

function initTask5DragAndDrop() {
  const colorBoxes5 = document.querySelectorAll('#task5-colors .color-box');
  const resultsBoxes5 = document.querySelectorAll('#task5-results .result-box');

  colorBoxes5.forEach(box => {
    box.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text', e.target.dataset.color);
    });
  });

  resultsBoxes5.forEach(box => {
    box.addEventListener('dragover', function(e) {
      e.preventDefault(); // Erlaube das Ablegen
    });
    box.addEventListener('drop', function(e) {
      e.preventDefault();
      const draggedColor = e.dataTransfer.getData('text');
      const targetResult = e.target.dataset.result;
      e.target.style.backgroundColor = draggedColor; // Färbe das Ergebnisfeld
      e.target.setAttribute('data-assigned-color', draggedColor); // Speichere die Zuordnung
      e.target.style.opacity = '1'; // Setze die Deckkraft zurück
      const draggedBox = document.querySelector(`#task5-colors .color-box[data-color="${draggedColor}"]`);
      draggedBox.setAttribute('data-assigned', 'true');
      draggedBox.setAttribute('draggable', 'false');
      draggedBox.style.opacity = '0.4'; // Reduziere die Deckkraft der Farbbox
    });
    box.addEventListener('click', function(e) {
      const assignedColor = e.target.getAttribute('data-assigned-color');
      if (assignedColor) {
        const draggedBox = document.querySelector(`#task5-colors .color-box[data-color="${assignedColor}"]`);
        draggedBox.setAttribute('data-assigned', 'false');
        draggedBox.setAttribute('draggable', 'true');
        draggedBox.style.opacity = '1'; // Volle Deckkraft wiederherstellen
        e.target.style.backgroundColor = ''; // Zurücksetzen der Hintergrundfarbe der Ergebnisbox
        e.target.removeAttribute('data-assigned-color'); // Aufheben der Zuordnung
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initTask5();
});


let task5TimerInterval;

function startTask5Timer() {
  let timeLeft = 15;  // Setze die Zeit auf 12 Sekunden für die echte Aufgabe 5
  let timerElement = document.getElementById('task5-timer');

  updateTimerDisplay(timeLeft, timerElement, true);  // Sicherstellen, dass playSound true ist

  if (task5TimerInterval) {
      clearInterval(task5TimerInterval);  // Stelle sicher, dass kein vorheriger Timer läuft
  }

  task5TimerInterval = setInterval(function() {
      timeLeft--;
      updateTimerDisplay(timeLeft, timerElement, true);  // playSound true hier auch
      if (timeLeft <= 0) {
          clearInterval(task5TimerInterval);
          task5TimerInterval = null;
          task5TimeUp();  // Funktion, die aufgerufen wird, wenn der Timer abläuft
      }
  }, 1000);
}


function task5TimeUp() {
  alert('Mindestens eine Zuordnung war falsch. Andere Teilnehmende waren bei dieser Aufgabe im Durchschnitt besser. Nun geht es zur nächsten Aufgabe.');
  document.getElementById('task5').classList.add('hidden');
  document.getElementById('instruction-task6').classList.remove('hidden');
  setCurrentTask(null); // Keine Aufgabe während der Instruktionen
}





let task6TimerInterval;

function startTask6Game() {
  let currentLevel = 1;
  const maxLevel = 10; // Maximale Anzahl von Levels
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  const taskArea = document.getElementById('task6-area');
  const colorNameDisplay = document.getElementById('color-name');
  const remainingTargets = document.getElementById('remaining-targets');
  const timerElement = document.getElementById('timer');
  const errorSound = new Audio('error-sound.mp3'); // Pfad zur Audiodatei

  startTask6Timer(); // Startet den Timer
  updateRemainingTargets(currentLevel, maxLevel); // Initialisiere die Anzeige der verbleibenden Targets

  // Objekt mit Farbenübersetzungen
  const colorTranslations = {
    'red': 'Rot',
    'blue': 'Blau',
    'green': 'Grün',
    'yellow': 'Gelb',
    'purple': 'Lila'
  };

  // Funktion zum Zufallsgenerieren einer Farbe aus der Liste
  function getRandomColor() {
    const colorIndex = Math.floor(Math.random() * colors.length);
    return colors[colorIndex];
  }

  function nextLevel() {
    if (currentLevel > maxLevel) {
      finishTask6(); // Aufruf der Funktion, die das Ende der Aufgabe und die Navigation behandelt
      countdownSound.pause();  // Countdown-Sound stoppen
      countdownSound.currentTime = 0; // Zurücksetzen der Position auf den Anfang
      return;
    }
    updateRemainingTargets(currentLevel, maxLevel);
    taskArea.innerHTML = '';
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    colorNameDisplay.textContent = colorTranslations[targetColor];
    colorNameDisplay.style.color = getRandomColor();
  
    colors.forEach(color => {
      let target = document.createElement('div');
      target.style.width = '30px';
      target.style.height = '30px';
      target.style.backgroundColor = color;
      target.style.position = 'absolute';
      target.style.left = `${Math.random() * (taskArea.offsetWidth - 50)}px`;
      target.style.top = `${Math.random() * (taskArea.offsetHeight - 50)}px`;
      target.style.cursor = 'pointer';
  
      target.addEventListener('click', function() {
        if (color === targetColor) {
          currentLevel++;
          nextLevel();
        } else {
          errorSound.play();
        }
      });
  
      taskArea.appendChild(target);
    });
  }
  

  function startTask6Timer() {
    let timeLeft = 20; // Setzt den Timer auf 15 Sekunden
    updateTimerDisplay(timeLeft, timerElement, true);

    task6TimerInterval = setInterval(function() {
      timeLeft--;
      updateTimerDisplay(timeLeft, timerElement, true);
      if (timeLeft <= 0) {
        clearInterval(task6TimerInterval);
        task6TimerInterval = null;
        finishTask6(); // Aufruf der Funktion, die das Ende der Aufgabe und die Navigation behandelt
      }
    }, 1000);
  }
  

  function updateRemainingTargets(current, max) {
    remainingTargets.textContent = `Verbleibende Targets: ${max - current + 1} von ${max}`;
  }

  function finishTask6() {
    clearInterval(task6TimerInterval);
    task6TimerInterval = null;
    document.getElementById('task6').classList.add('hidden');
    document.getElementById('instruction-task7').classList.remove('hidden');
    setCurrentTask(null); // Keine Aufgabe während der Instruktionen
    alert('Aufgabe 6 beendet. Weiter zu Aufgabe 7.');
  }

  nextLevel();
}



function getRandomColor() {
  const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
  return colors[Math.floor(Math.random() * colors.length)];
}




function startTask3() {
  document.getElementById('instruction-task3').classList.add('hidden');
  document.getElementById('task3').classList.remove('hidden');
  document.getElementById('task3-title').textContent = 'Aufgabe 3: Tower of Hanoi';
  document.getElementById('task7-timer').classList.add('hidden'); // Verstecke den Timer für Aufgabe 3
  startTowersOfHanoi(3); // Starte das Spiel mit 3 Scheiben
}

// Funktion zum Starten der Aufgabe 4
function startTask7() {
  document.getElementById('instruction-task7').classList.add('hidden');
  document.getElementById('task3').classList.remove('hidden');
  document.getElementById('task3-title').textContent = 'Aufgabe 7: Tower of Hanoi';
  document.getElementById('task7-timer').classList.remove('hidden'); // Zeige den Timer für Aufgabe 7
  startTowersOfHanoi(3); // Starte das Spiel mit 3 Scheiben für Aufgabe 7
  startTask7Timer(); // Starte den Timer für Aufgabe 7

  // Verstecke den Tipp-Button und das Video für Aufgabe 7
  document.getElementById('tip-button-task3').classList.add('hidden');
  document.getElementById('tip-video-task3').classList.add('hidden');
  document.getElementById('tip-iframe-task3').src = "";
}

function startTowersOfHanoi(discs) {
  if (window.toh) {
    window.toh.destroyGame();
  }
  setTimeout(() => {
    const towers = document.querySelectorAll(".tower");
    const restartBtn = document.querySelector(".restart");
    window.toh = new TowersOfHanoi(discs, towers, restartBtn);
    window.toh.onWin = function() { // Callback function for winning
      const taskTitle = document.getElementById('task3-title').textContent;
      if (taskTitle.includes('Aufgabe 3:')) { // Change condition to match task 3
        document.getElementById('to-task4').classList.remove('hidden');
        document.getElementById('to-task4').addEventListener('click', function() {
          this.classList.add('hidden');
          document.getElementById('task3').classList.add('hidden'); // Hide task 3
          showInstructionTask4(); // Show instruction for task 4
        });
      } else if (taskTitle.includes('Aufgabe 7:')) { // Change condition to match task 7
        document.getElementById('to-task8').classList.remove('hidden');
        document.getElementById('to-task8').addEventListener('click', function() {
          this.classList.add('hidden');
          document.getElementById('task3').classList.add('hidden'); // Hide task 3
          showInstructionTask8(); // Show instruction for task 8
        });
        document.getElementById('to-task4').classList.add('hidden'); // Always hide the button to task 4
      }
      if (taskTitle.includes('Aufgabe 3:')) {
        showTipButtonAfterDelay(60000); // Show the tip button only in task 3 after 60 seconds
      }
    };
  }, 100);
}








// Funktion zum Aktualisieren der Timer-Anzeige
function updateTimerDisplay7(timeLeft, timerElement, playSound = true) {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Countdown-Sound abspielen, wenn 5 Sekunden übrig sind
  if (timeLeft === 10 && playSound) {
      countdownSound.play().catch(err => {
          console.log('Audio-Fehler:', err);
      });
  }

  // Countdown-Sound stoppen, wenn die Zeit abgelaufen ist
  if (timeLeft === 0 && countdownSound) {
      countdownSound.pause();
      countdownSound.currentTime = 0;
  }

  // Ändere die Textfarbe zu rot, wenn 5 Sekunden oder weniger übrig sind, sonst schwarz
  if (timeLeft <= 15) {
      timerElement.style.color = 'red';
  } else {
      timerElement.style.color = 'black';
  }
}


let task7Timer; // Globale Variable für den Timer der Aufgabe 7

function startTask7Timer() {
  let timeLeft = 40;
  const timerElement = document.getElementById('task7-timer-display');
  updateTimerDisplay7(timeLeft, timerElement, true);

  task7Timer = setInterval(function() {
      timeLeft--;
      updateTimerDisplay7(timeLeft, timerElement, true);
      if (timeLeft <= 0) {
          clearInterval(task7Timer);
          task7Timer = null;
          if (!window.toh.gameWon) {
              alert('Zeit abgelaufen. Aufgabe beendet.');
              document.getElementById('task3').classList.add('hidden'); // Versteckt das Tower of Hanoi-Spiel
              showInstructionTask8(); // Leitet automatisch zur Anleitung für Aufgabe 8 weiter
          }
      }
  }, 1000);
}


function showInstructionTask8() {
  document.getElementById('instruction-task8').classList.remove('hidden');
  document.getElementById('task3').classList.add('hidden'); // Verstecken Sie Tower of Hanoi mit 3 Scheiben, falls sichtbar
}


function showTipButtonAfterDelay(delay) {
  const tipButton = document.getElementById('tip-button-task3');
  const pingSound = new Audio('ping.mp3'); // Füge diese Zeile hinzu

  setTimeout(function() {
      if (!window.toh.gameWon) { // Only show the button if the game is not won
          tipButton.classList.remove('hidden');
          pingSound.play(); // Füge diese Zeile hinzu, um den Ton abzuspielen
      }
  }, delay);
}


document.getElementById('tip-button-task3').addEventListener('click', function() {
  const tipVideo = document.getElementById('tip-video-task3');
  const tipIframe = document.getElementById('tip-iframe-task3');
  tipIframe.src = "https://www.youtube.com/embed/Rd4XzCkt-aw?si=Kp2x1nmAVFrFarLC&autoplay=1&mute=1";
  tipVideo.classList.remove('hidden');
});



class TowersOfHanoi {
  constructor(discs, towerEls, restartBtn) {
    this.discs = discs;
    this.towerEls = towerEls;
    this.restartBtn = restartBtn;
    this.errorSound = new Audio('error-sound.mp3'); // Pfad zur Audiodatei
    this.onWin = function() {}; // Standardmäßig leer

    this.bindFunctions();
    this.initGame();
  }

  bindFunctions() {
    this.initGameFunc = this.initGame.bind(this);
    this.handleDiscClickFunc = this.handleDiscClick.bind(this);
  }

  initGame() {
    this.towers = [[], [], []];
    for (let i = this.discs; i > 0; i--) {
        this.towers[0].push(i);
    }

    this.moves = 0;
    this.voidButtons();
    this.initButtons();
    this.initTowers();
    this.drawTowers();
    this.displayMessage(
        "Verschiebe alle Scheiben vom linken zum rechten Turm, eine nach der anderen. Eine Scheibe kann nicht auf einer kleineren Scheibe liegen. Viel Spaß!"
    );
  }

  onWin() {
    if (task7Timer) {
      clearInterval(task7Timer); // Stoppe den globalen Timer
      task7Timer = null; // Setze die Timer-Variable zurück
      updateTimerDisplay(0, document.getElementById('task7-timer-display')); // Setze die Timer-Anzeige auf 0
    }
    document.getElementById('task3').classList.add('hidden'); // Verstecke das Spiel
    if (document.getElementById('task3-title').textContent === 'Aufgabe 3: Tower of Hanoi') {
      document.getElementById('to-task4').classList.remove('hidden');
    } else if (document.getElementById('task3-title').textContent === 'Aufgabe 7: Tower of Hanoi') {
      document.getElementById('to-task8').classList.remove('hidden');
    }
  }

  initButtons() {
    this.restartBtn.classList.add("clickable");
    this.restartBtn.addEventListener("click", this.initGameFunc);
  }

  initTowers() {
    this.towerEls.forEach(towerEl => {
        towerEl.classList.add("clickable");
        towerEl.addEventListener("click", this.handleDiscClickFunc);
    });
  }

  voidButtons() {
    this.restartBtn.classList.remove("clickable");
    this.restartBtn.removeEventListener("click", this.initGameFunc);
  }

  handleDiscClick(e) {
    const clickedElement =
        e.target.nodeName === "LI" ? e.target.parentNode : e.target;
    const clickedTower = clickedElement.dataset.tower;
    const holdTower = this.holdTower;

    if (!holdTower) {
        if (this.isTowerEmpty(this.towers[clickedTower])) {
            return false;
        }
        this.holdTower = clickedTower;
        this.highlightHoldDisc(true);
        return true;
    } else {
        this.highlightHoldDisc(false);
    }

    if (!this.isDiscMoveValid(holdTower, clickedTower)) {
        this.errorSound.play(); // Spielt den Fehlersound ab
        this.displayMessage("Ungültiger Zug");
        this.holdTower = null;
        return false;
    }

    this.executeUserMove(holdTower, clickedTower);
    if (this.isSolved()) {
        this.postWinCleanUp(`Du hast mit ${this.moves} Zügen gewonnen!`);
    }
    this.holdTower = null;
  }

  executeUserMove(fromTower, toTower) {
    this.moveDisc(fromTower, toTower);
    this.moves++;
    this.drawTowers();
    this.displayMessage(`${this.moves} ${this.moves > 1 ? "Züge" : "Zug"}`);
  }

  moveDisc(fromIdx, toIdx) {
    this.towers[toIdx].push(this.towers[fromIdx].pop());
  }

  highlightHoldDisc(toggle) {
    const targetDiscEl = this.towerEls[this.holdTower].lastChild;
    if (toggle) {
        targetDiscEl.style.borderColor = "black";
        targetDiscEl.style.borderWidth = "3px";
        targetDiscEl.style.borderStyle = "solid";
    } else {
        targetDiscEl.style.border = "none";
    }
  }

  isTowerEmpty(tower) {
    return !tower.length;
  }

  isDiscMoveValid(fromIdx, toIdx) {
    if (fromIdx === toIdx) {
        return undefined;
    }
    if (
        this.isTowerEmpty(this.towers[fromIdx]) ||
        this.getTopDiscValue(this.towers[fromIdx]) > this.getTopDiscValue(this.towers[toIdx])
    ) {
        return false;
    }
    return true;
  }

  getTopDiscValue(tower) {
    return this.isTowerEmpty(tower) ? undefined : tower[tower.length - 1];
  }

  isSolved() {
    return (
        this.isTowerEmpty(this.towers[0]) &&
        this.isTowerEmpty(this.towers[1]) &&
        this.towers[2].length === this.discs
    );
  }

  drawTowers() {
    this.towerEls.forEach((towerEl, index) => {
        while (towerEl.lastChild) {
            towerEl.removeChild(towerEl.lastChild);
        }
        this.towers[index].forEach(disc => {
            let li = document.createElement("LI");
            li.id = `disc-${disc}`;
            towerEl.appendChild(li);
        });
    });
  }

  displayMessage(message) {
    const messageBox = document.querySelector("#message");
    messageBox.innerHTML = message;
  }

  postWinCleanUp(withMessage) {
    this.displayMessage(withMessage);
    this.gameWon = true; // Set game won to true
    this.onWin(); // Call the onWin callback

    this.destroyGame(); // Clean up the game instance

    if (this.timer) {
      clearInterval(this.timer); // Stop the timer
      document.getElementById('task7-timer').classList.add('hidden'); // Hide the timer
    }

    this.initButtons(); // Re-initialize buttons if necessary
  }


  destroyGame() {
    // Entferne alle Event Listener und reinige das DOM
    this.towerEls.forEach(towerEl => {
        while (towerEl.firstChild) {
            towerEl.removeChild(towerEl.firstChild);
        }
        towerEl.removeEventListener("click", this.handleDiscClickFunc);
    });
    this.restartBtn.removeEventListener("click", this.initGameFunc);
    this.restartBtn.classList.remove("clickable");
    if (this.errorSound) {
        this.errorSound.pause();
        this.errorSound.currentTime = 0;
    }
    this.errorSound = null; // Stelle sicher, dass alle Ressourcen freigegeben werden
  }
}

// Initialization code
document.addEventListener("DOMContentLoaded", () => {
  // Initialisierung des Spiels für Task 3
  const towers = document.querySelectorAll(".tower");
  const restartBtn = document.querySelector(".restart");
  window.toh = new TowersOfHanoi(3, towers, restartBtn); // Startet initial mit 3 Scheiben für Aufgabe 3
});



let currentLevel = 1;
let drawingStarted = false; // Ob der Zeichenprozess gestartet wurde
let drawing = false; // Ob aktuell gezeichnet wird
const canvas = document.getElementById('drawing-canvas');
const canvas8 = document.getElementById('drawing-canvas8');
const ctx = canvas.getContext('2d');
const ctx8 = canvas8.getContext('2d');
const pathHeight = 30; // Höhe des Pfades


function startDrawingTask(level) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPath(level);
  let drawing = false;
  let startCoords;
  let drawingStarted = false; // Hinzugefügt, um den Beginn des Zeichnens zu verfolgen

  // Aktualisiere die Nachricht basierend auf dem Level
  const taskMessage = document.getElementById('task-message');
  if (level === 1) {
    taskMessage.textContent = 'Zeichne eine Linie vom linken Startpunkt zum rechten Endpunkt, ohne die Grenzen zu verletzen.';
  } else if (level === 2) {
    taskMessage.textContent = 'Zeichne einen Kreis beginnend vom schwarzen Punkt und beende deine Zeichnung auch wieder im schwarzen Punkt, ohne die Grenzen zu verletzen.';
  } else if (level === 3) {
    taskMessage.textContent = 'Zeichne ein Haus beginnend vom schwarzen Punkt und beende deine Zeichnung auch wieder im schwarzen Punkt, ohne die Grenzen zu verletzen.';
  }

  canvas.onmousedown = function(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Schreibe den Beginn des Zeichnens als Drag-Start-Ereignis in die Datenbank
      writeMouseData(userId, 'dragstart', x, y, Date.now(), setCurrentTask);

      if (level === 1 && y > canvas.height / 2 - pathHeight / 2 && y < canvas.height / 2 + pathHeight / 2) {
          startCoords = { x, y };
          drawing = true;
          ctx.beginPath();
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.moveTo(x, y);
      } else if (level === 2) {
          const distance = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
          const outerRadius = Math.min(canvas.width, canvas.height) / 2 - 20;
          const innerRadius = outerRadius - pathHeight;
          
          if (distance <= outerRadius && distance >= innerRadius) {
            startCoords = { x, y };
            drawing = true; // Beginn des Zeichnens
            drawingStarted = false; // Setze zurück, dass der Zeichenprozess noch nicht bestätigt ist
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.moveTo(x, y);
          }
        } else if (level === 3) {
          const houseWidth = 150;
          const houseHeight = houseWidth;
          const roofHeight = houseWidth / 2;
          const verticalShift = 37.8; // 1 cm Verschiebung in Pixel
          const squareStartX = (canvas.width - houseWidth) / 2;
          const squareStartY = ((canvas.height - houseHeight - roofHeight) / 2 + 30) + verticalShift;
      
          if (isWithinHousePath(x, y, squareStartX, squareStartY, houseWidth, houseHeight, pathHeight)) {
              startCoords = { x, y };
              drawing = true;
              drawingStarted = false; // Setze zurück, dass der Zeichenprozess noch nicht bestätigt ist
              ctx.beginPath();
              ctx.strokeStyle = 'black';
              ctx.lineWidth = 2;
              ctx.moveTo(x, y);
          }
      }
    };

  canvas.onmousemove = throttle(function(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Schreibe die Mausbewegungen während des Zeichnens in die Datenbank
    writeMouseData(userId, 'drag', x, y, Date.now(), setCurrentTask);
  
    if (level === 1) {
      if (y < canvas.height / 2 - pathHeight / 2 || y > canvas.height / 2 + pathHeight / 2 || x < 20 || x > canvas.width - 20) {
          drawing = false;
          ctx.closePath();

          // Protokolliere die Grenzeüberschreitung
          writeMouseData(userId, 'border_cross', x, y, Date.now(), setCurrentTask);

          alert('Du hast die Grenze überschritten. Versuche es erneut.');
          startDrawingTask(level);
      } else {
          ctx.lineTo(x, y);
          ctx.stroke();
      }
    } else if (level === 2) {
      const distance = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2));
      // Angepasst, um den Zielbereich zu vergrößern, indem der äußere Radius weiter nach außen gesetzt wird
      const outerRadius = Math.min(canvas.width, canvas.height) / 2 - 10; // Neuer, kleinerer Radius
      const innerRadius = outerRadius - pathHeight; // Innerer Radius wird automatisch angepasst
  
      if (distance <= outerRadius && distance >= innerRadius) {
        // Wenn dies das erste Zeichnen ist, setzen Sie drawingStarted auf true
        if (!drawingStarted) {
          drawingStarted = true; // Der Zeichenprozess ist bestätigt
        }
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        // Wenn der Bereich verlassen wird, brechen Sie das Zeichnen ab und geben Sie eine Warnung aus
        drawing = false;
        drawingStarted = false; // Zeichnen wurde unterbrochen, setzen Sie zurück
        ctx.closePath();

        // Protokolliere die Grenzeüberschreitung
        writeMouseData(userId, 'border_cross', x, y, Date.now(), setCurrentTask);

        alert('Du hast die Grenze überschritten. Versuche es erneut.');
        startDrawingTask(level); 
      }
    } else if (level === 3) {
      const houseWidth = 150;
      const houseHeight = houseWidth;
      const roofHeight = houseWidth / 2;
      const verticalShift = 37.8;
      const squareStartX = (canvas.width - houseWidth) / 2;
      const squareStartY = ((canvas.height - houseHeight - roofHeight) / 2 + 30) + verticalShift;
  
      if (isWithinHousePath(x, y, squareStartX, squareStartY, houseWidth, houseHeight, pathHeight)) {
        // Wenn dies das erste Zeichnen ist, setzen Sie drawingStarted auf true
        if (!drawingStarted) {
          drawingStarted = true; // Der Zeichenprozess ist bestätigt
        }
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        drawing = false;
        drawingStarted = false; // Zeichnen wurde unterbrochen, setzen Sie zurück
        ctx.closePath();

        // Protokolliere die Grenzeüberschreitung
        writeMouseData(userId, 'border_cross', x, y, Date.now(), setCurrentTask);

        alert('Du hast die Grenze überschritten. Versuche es erneut.');
        startDrawingTask(level);
      }
    }
  }, throttleInterval);

  canvas.onmouseup = function(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Schreibe das Ende des Zeichnens als Drop-Ereignis in die Datenbank
    writeMouseData(userId, 'drop', x, y, Date.now(), setCurrentTask);

    if (level === 1) {
        drawing = false;
        const endCircleX = canvas.width - 25;
        const endCircleY = canvas.height / 2;
        const endCircleRadius = 5;
    
        if (x >= endCircleX - endCircleRadius && x <= endCircleX + endCircleRadius &&
            y >= endCircleY - endCircleRadius && y <= endCircleY + endCircleRadius) {
            currentLevel++;
            if (currentLevel <= 2) {
                startDrawingTask(currentLevel);
            } else {
                alert('Alle Aufgaben abgeschlossen!');
            }
        } else {
            alert('Du hast das Ziel nicht erreicht. Versuche es erneut.');
            startDrawingTask(level);
        }
    } else if (level === 2) {
        const distanceToEnd = Math.sqrt(Math.pow(startCoords.x - x, 2) + Math.pow(startCoords.y - y, 2));
        const threshold = ctx.lineWidth * 2;
        
        drawing = false;
        if (drawingStarted && distanceToEnd <= threshold) {
            currentLevel++;
            startDrawingTask(currentLevel);
        } else {
            alert('Du hast den Kreis nicht geschlossen. Versuche es erneut.');
            startDrawingTask(level);
        }
        drawingStarted = false;
    } else if (level === 3) {
        const distanceToEnd = Math.sqrt(Math.pow(startCoords.x - x, 2) + Math.pow(startCoords.y - y, 2));
        const threshold = ctx.lineWidth * 2;
        
        drawing = false;
        if (drawingStarted && distanceToEnd <= threshold) {
            const messageDiv = document.getElementById('completion-message');
            messageDiv.classList.remove('hidden');
            document.getElementById('to-stress-survey-1').classList.remove('hidden');
        } else {
            alert('Du hast das Haus nicht geschlossen. Versuche es erneut.');
            startDrawingTask(level);
        }
        drawingStarted = false;
    }
  };

}



function isWithinHousePath(x, y, squareStartX, squareStartY, houseWidth, houseHeight, pathHeight) {
  const topY = squareStartY;
  const bottomY = squareStartY + houseHeight;
  const leftX = squareStartX;
  const rightX = squareStartX + houseWidth;
  const pathWidthHalf = pathHeight / 2;

  // Prüfen, ob x innerhalb der horizontalen Grenzen plus Pfadbreite
  const withinHorizontalBounds = (x >= leftX - pathWidthHalf && x <= rightX + pathWidthHalf);

  // Prüfen, ob y innerhalb der vertikalen Grenzen plus Pfadbreite
  const withinVerticalBounds = (y >= topY - pathWidthHalf && y <= bottomY + pathWidthHalf);

  // Prüfen der genauen Position innerhalb des Pfades (Hauskonturen plus äußerer Rand)
  const onVerticalBars = (withinVerticalBounds && ((x >= leftX - pathWidthHalf && x <= leftX + pathWidthHalf) || (x >= rightX - pathWidthHalf && x <= rightX + pathWidthHalf)));
  const onHorizontalBars = (withinHorizontalBounds && ((y >= bottomY - pathWidthHalf && y <= bottomY + pathWidthHalf)));
  const onRoofLeftBar = (x >= leftX && x <= squareStartX + houseWidth / 2) && (y >= topY - (x - leftX) - pathWidthHalf && y <= topY - (x - leftX) + pathWidthHalf);
  const onRoofRightBar = (x <= rightX && x >= squareStartX + houseWidth / 2) && (y >= topY - (rightX - x) - pathWidthHalf && y <= topY - (rightX - x) + pathWidthHalf);

  return onVerticalBars || onHorizontalBars || onRoofLeftBar || onRoofRightBar;
}



function drawPath(level) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (level === 1) {
    ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
      ctx.fillRect(20, canvas.height / 2 - pathHeight / 2, canvas.width - 40, pathHeight);
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(25, canvas.height / 2, 5, 0, Math.PI * 2); // Verschiebe den linken Punkt etwas nach rechts
      ctx.fill();
      ctx.beginPath();
      ctx.arc(canvas.width - 25, canvas.height / 2, 5, 0, Math.PI * 2); // Verschiebe den rechten Punkt etwas nach links
      ctx.fill();
  } else if (level === 2) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const strokeRadius = Math.min(centerX, centerY) - (pathHeight / 1.2);

      ctx.beginPath();
      ctx.arc(centerX, centerY, strokeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
      ctx.lineWidth = pathHeight;
      ctx.stroke();

      // Schwarzer Punkt für Level 2
      ctx.fillStyle = 'black';
      ctx.beginPath();
      const pointRadius = 4; // Kleinere Größe für den schwarzen Punkt
      ctx.arc(centerX, centerY - strokeRadius + (pathHeight / 25), pointRadius, 0, Math.PI * 2);
      ctx.fill();
  } else if (level === 3) {
      const houseWidth = 150;
      const houseHeight = houseWidth;
      const roofHeight = houseWidth / 2;
      const verticalShift = 37.8;

      const squareStartX = (canvas.width - houseWidth) / 2;
      const squareStartY = ((canvas.height - houseHeight - roofHeight) / 2 + 30) + verticalShift;

      ctx.beginPath();
      ctx.moveTo(squareStartX + houseWidth, squareStartY + houseHeight);
      ctx.lineTo(squareStartX, squareStartY + houseHeight);
      ctx.lineTo(squareStartX, squareStartY);
      ctx.lineTo(squareStartX + houseWidth / 2, squareStartY - roofHeight);
      ctx.lineTo(squareStartX + houseWidth, squareStartY);
      ctx.lineTo(squareStartX + houseWidth, squareStartY + houseHeight + (pathHeight / 2));

      ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
      ctx.lineWidth = pathHeight;
      ctx.stroke();
      ctx.closePath();

      // Schwarzer Punkt für Level 3
      ctx.fillStyle = 'black';
      ctx.beginPath();
      const pointRadius = 4; // Kleinere Größe für den schwarzen Punkt
      ctx.arc(squareStartX + houseWidth / 2, squareStartY + houseHeight, pointRadius, 0, Math.PI * 2);
      ctx.fill();
  }
}




startDrawingTask(1);  // Starte mit Level 1


// Code für Aufgabe 8
function startDrawingTask8(level) {
  ctx8.clearRect(0, 0, canvas8.width, canvas8.height);
  drawPath8(level);
  let drawing = false;
  let startCoords;
  let drawingStarted = false; // Hinzugefügt, um den Beginn des Zeichnens zu verfolgen

  // Aktualisiere die Nachricht basierend auf dem Level
  const taskMessage = document.getElementById('task-message8');
  if (level === 1) {
    taskMessage.textContent = 'Zeichne eine Linie vom linken Startpunkt zum rechten Endpunkt, ohne die Grenzen zu verletzen.';
  } else if (level === 2) {
    taskMessage.textContent = 'Zeichne einen Kreis beginnend vom schwarzen Punkt und beende deine Zeichnung auch wieder im schwarzen Punkt, ohne die Grenzen zu verletzen.';
  } else if (level === 3) {
    taskMessage.textContent = 'Zeichne ein Haus beginnend vom schwarzen Punkt und beende deine Zeichnung auch wieder im schwarzen Punkt, ohne die Grenzen zu verletzen.';
  }

  canvas8.onmousedown = function(e) {
    const rect = canvas8.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Schreibe den Beginn des Zeichnens als Drag-Start-Ereignis in die Datenbank
    writeMouseData(userId, 'dragstart', x, y, Date.now(), setCurrentTask);

    if (level === 1 && y > canvas8.height / 2 - pathHeight / 2 && y < canvas8.height / 2 + pathHeight / 2) {
      startCoords = { x, y };
      drawing = true;
      ctx8.beginPath();
      ctx8.strokeStyle = 'black';
      ctx8.lineWidth = 2;
      ctx8.moveTo(x, y);
    } else if (level === 2) {
      const distance = Math.sqrt(Math.pow(x - canvas8.width / 2, 2) + Math.pow(y - canvas8.height / 2, 2));
      const outerRadius = Math.min(canvas8.width, canvas8.height) / 2 - 20;
      const innerRadius = outerRadius - pathHeight;

      if (distance <= outerRadius && distance >= innerRadius) {
        startCoords = { x, y };
        drawing = true;
        drawingStarted = false; // Setze zurück, dass der Zeichenprozess noch nicht bestätigt ist
        ctx8.beginPath();
        ctx8.strokeStyle = 'black';
        ctx8.lineWidth = 2;
        ctx8.moveTo(x, y);
      }
    } else if (level === 3) {
      const houseWidth = 150;
      const houseHeight = houseWidth;
      const roofHeight = houseWidth / 2;
      const verticalShift = 37.8; // 1 cm Verschiebung in Pixel
      const squareStartX = (canvas8.width - houseWidth) / 2;
      const squareStartY = ((canvas8.height - houseHeight - roofHeight) / 2 + 30) + verticalShift;

      if (isWithinHousePath(x, y, squareStartX, squareStartY, houseWidth, houseHeight, pathHeight)) {
        startCoords = { x, y };
        drawing = true;
        drawingStarted = false; // Setze zurück, dass der Zeichenprozess noch nicht bestätigt ist
        ctx8.beginPath();
        ctx8.strokeStyle = 'black';
        ctx8.lineWidth = 2;
        ctx8.moveTo(x, y);
      }
    }
  };

  canvas8.onmousemove = throttle(function(e) {
    if (!drawing) return;
    const rect = canvas8.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Schreibe die Mausbewegungen während des Zeichnens in die Datenbank
    writeMouseData(userId, 'drag', x, y, Date.now(), setCurrentTask);

    if (level === 1) {
      if (y < canvas8.height / 2 - pathHeight / 2 || y > canvas8.height / 2 + pathHeight / 2 || x < 20 || x > canvas8.width - 20) {
        drawing = false;
        ctx8.closePath();

        // Protokolliere die Grenzeüberschreitung
        writeMouseData(userId, 'border_cross', x, y, Date.now(), setCurrentTask);

        alert('Du hast die Grenze überschritten. Versuche es erneut.');
        startDrawingTask8(level);
      } else {
        ctx8.lineTo(x, y);
        ctx8.stroke();
      }
    } else if (level === 2) {
      const distance = Math.sqrt(Math.pow(x - canvas8.width / 2, 2) + Math.pow(y - canvas8.height / 2, 2));
      const outerRadius = Math.min(canvas8.width, canvas8.height) / 2 - 10;
      const innerRadius = outerRadius - pathHeight;

      if (distance <= outerRadius && distance >= innerRadius) {
        if (!drawingStarted) {
          drawingStarted = true;
        }
        ctx8.lineTo(x, y);
        ctx8.stroke();
      } else {
        drawing = false;
        drawingStarted = false;
        ctx8.closePath();

        writeMouseData(userId, 'border_cross', x, y, Date.now(), setCurrentTask);

        alert('Du hast die Grenze überschritten. Versuche es erneut.');
        startDrawingTask8(level);
      }
    } else if (level === 3) {
      const houseWidth = 150;
      const houseHeight = houseWidth;
      const roofHeight = houseWidth / 2;
      const verticalShift = 37.8;
      const squareStartX = (canvas8.width - houseWidth) / 2;
      const squareStartY = ((canvas8.height - houseHeight - roofHeight) / 2 + 30) + verticalShift;

      if (isWithinHousePath(x, y, squareStartX, squareStartY, houseWidth, houseHeight, pathHeight)) {
        if (!drawingStarted) {
          drawingStarted = true;
        }
        ctx8.lineTo(x, y);
        ctx8.stroke();
      } else {
        drawing = false;
        drawingStarted = false;
        ctx8.closePath();

        writeMouseData(userId, 'border_cross', x, y, Date.now(), setCurrentTask);

        alert('Du hast die Grenze überschritten. Versuche es erneut.');
        startDrawingTask8(level);
      }
    }
  }, throttleInterval);

  canvas8.onmouseup = function(e) {
    if (!drawing) return;
    const rect = canvas8.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    writeMouseData(userId, 'drop', x, y, Date.now(), setCurrentTask);

    if (level === 1) {
      drawing = false;
      const endCircleX = canvas8.width - 25;
      const endCircleY = canvas8.height / 2;
      const endCircleRadius = 5;

      if (x >= endCircleX - endCircleRadius && x <= endCircleX + endCircleRadius &&
          y >= endCircleY - endCircleRadius && y <= endCircleY + endCircleRadius) {
        currentLevel++;
        if (currentLevel <= 2) {
          startDrawingTask8(currentLevel);
        } else {
          alert('Alle Aufgaben abgeschlossen!');
        }
      } else {
        alert('Du hast das Ziel nicht erreicht. Versuche es erneut.');
        startDrawingTask8(level);
      }
    } else if (level === 2) {
      const distanceToEnd = Math.sqrt(Math.pow(startCoords.x - x, 2) + Math.pow(startCoords.y - y, 2));
      const threshold = ctx8.lineWidth * 2;

      drawing = false;
      if (drawingStarted && distanceToEnd <= threshold) {
        currentLevel++;
        startDrawingTask8(currentLevel);
      } else {
        alert('Du hast den Kreis nicht geschlossen. Versuche es erneut.');
        startDrawingTask8(level);
      }
      drawingStarted = false;
    } else if (level === 3) {
      const distanceToEnd = Math.sqrt(Math.pow(startCoords.x - x, 2) + Math.pow(startCoords.y - y, 2));
      const threshold = ctx8.lineWidth * 2;

      drawing = false;
      if (drawingStarted && distanceToEnd <= threshold) {
        const messageDiv8 = document.getElementById('completion-message8');
        messageDiv8.classList.remove('hidden');
        document.getElementById('to-stress-survey-2').classList.remove('hidden');
      } else {
        alert('Du hast das Haus nicht geschlossen. Versuche es erneut.');
        startDrawingTask8(level);
      }
      drawingStarted = false;
    }
  };
}


function drawPath8(level) {
  ctx8.clearRect(0, 0, canvas.width, canvas.height);
  if (level === 1) {
      ctx8.fillStyle = 'rgba(128, 128, 128, 0.5)';
      ctx8.fillRect(20, canvas.height / 2 - pathHeight / 2, canvas.width - 40, pathHeight);
      ctx8.fillStyle = 'black';
      ctx8.beginPath();
      ctx8.arc(25, canvas.height / 2, 5, 0, Math.PI * 2); // Verschiebe den linken Punkt etwas nach rechts
      ctx8.fill();
      ctx8.beginPath();
      ctx8.arc(canvas.width - 25, canvas.height / 2, 5, 0, Math.PI * 2); // Verschiebe den rechten Punkt etwas nach links
      ctx8.fill();
    } else if (level === 2) {
      // Setze den Mittelpunkt des Kreises
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      // Stelle den Radius so ein, dass er der Hälfte der Wegbreite des grauen Pfads entspricht
      const strokeRadius = Math.min(centerX, centerY) - (pathHeight / 1.2);

      ctx8.beginPath();
      ctx8.arc(centerX, centerY, strokeRadius, 0, Math.PI * 2);
      ctx8.strokeStyle = 'rgba(128, 128, 128, 0.5)';
      ctx8.lineWidth = pathHeight;
      ctx8.stroke();

      // Schwarzer Punkt für Level 2
      ctx8.fillStyle = 'black';
      ctx8.beginPath();
      const pointRadius = 4;
      ctx8.arc(centerX, centerY - strokeRadius + (pathHeight / 25), pointRadius, 0, Math.PI * 2);
      ctx8.fill();
    } if (level === 3) {
        const houseWidth = 150; // Breite des Hauses festlegen
        const houseHeight = houseWidth;
        const roofHeight = houseWidth / 2; // Höhe des Dachs festlegen
        const verticalShift = 37.8; // 1 cm Verschiebung in Pixel
    
        // Startpositionen anpassen, um das gesamte Haus nach unten zu verschieben
        const squareStartX = (canvas.width - houseWidth) / 2;
        const squareStartY = ((canvas.height - houseHeight - roofHeight) / 2 + 30) + verticalShift; // Herabgesetzt um das Dach sichtbar zu machen und um 1 cm nach unten verschoben
    
        ctx8.beginPath();
        // Zeichne den unteren Balken von rechts nach links
        ctx8.moveTo(squareStartX + houseWidth, squareStartY + houseHeight); // Untere rechte Ecke
        ctx8.lineTo(squareStartX, squareStartY + houseHeight); // Untere linke Ecke
    
        // Zeichne den linken vertikalen Balken nach oben
        ctx8.lineTo(squareStartX, squareStartY); // Obere linke Ecke
    
        // Zeichne das Dach von der oberen linken Ecke zur Spitze
        ctx8.lineTo(squareStartX + houseWidth / 2, squareStartY - roofHeight); // Dachspitze
    
        // Zeichne das Dach von der Spitze zur oberen rechten Ecke
        ctx8.lineTo(squareStartX + houseWidth, squareStartY); // Obere rechte Ecke
    
        // Zeichne den rechten vertikalen Balken nach unten
        ctx8.lineTo(squareStartX + houseWidth, squareStartY + houseHeight + (pathHeight / 2)); // Erweiterte untere rechte Ecke
    
        ctx8.strokeStyle = 'rgba(128, 128, 128, 0.5)';
        ctx8.lineWidth = pathHeight;
        ctx8.stroke();
        ctx8.closePath(); // Schließt den Pfad um eine kontinuierliche Linie zu gewährleisten

        // Schwarzer Punkt für Level 3
        ctx8.fillStyle = 'black';
        ctx8.beginPath();
        const pointRadius = 4;
        ctx8.arc(squareStartX + houseWidth / 2, squareStartY + houseHeight, pointRadius, 0, Math.PI * 2);
        ctx8.fill();
    }
    
  
}

startDrawingTask8(1);  // Starte mit Level 1



