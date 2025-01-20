let timeLeft;
let timerId = null;
let isWorkMode = true;
let sessionHistory = [];

// DOM elements
const minutesDisplay = document.querySelector('.odometer.minutes');
const secondsDisplay = document.querySelector('.odometer.seconds');
const historyList = document.querySelector('.history-list');
const workLed = document.getElementById('work-led');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workButton = document.getElementById('work');
const breakButton = document.getElementById('break');
const timerSound = document.getElementById('timerSound');
const progressRing = document.querySelector('.progress-ring-circle');
const progressBar = document.querySelector('.progress-bar-fill');
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const saveSettingsButton = document.getElementById('saveSettings');
let initialTime;

// Constants
const DEFAULT_WORK_TIME = 50;
const DEFAULT_BREAK_TIME = 0.1;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    // Clear previous content
    minutesDisplay.innerHTML = `<span>${minutes.toString().padStart(2, '0')}</span>`;
    secondsDisplay.innerHTML = `<span>${seconds.toString().padStart(2, '0')}</span>`;
}

function addToHistory(duration, type) {
    const date = new Date();
    const historyItem = {
        type,
        duration,
        timestamp: date.toLocaleTimeString()
    };
    sessionHistory.unshift(historyItem);
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    historyList.innerHTML = sessionHistory
        .map(item => `
            <div class="history-item">
                <span>${item.timestamp}</span>
                <span>${item.type}</span>
                <span>${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}</span>
            </div>
        `)
        .join('');
}

function startTimer() {
    if (timerId === null) {
        const initialTime = timeLeft;
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                timerSound.play();
                addToHistory(initialTime, isWorkMode ? 'Work' : 'Break');
                alert(isWorkMode ? 'Work time is over! Take a break!' : 'Break is over! Back to work!');
                resetTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkMode ? DEFAULT_WORK_TIME * 60 : DEFAULT_BREAK_TIME * 60;
    initialTime = timeLeft;
    updateDisplay();
    updateProgress();
}

function setWorkMode() {
    isWorkMode = true;
    workLed.style.backgroundColor = 'var(--primary-color)';
    document.querySelector('.mode-indicator span').textContent = 'WORK MODE';
    resetTimer();
}

function setBreakMode() {
    isWorkMode = false;
    workLed.style.backgroundColor = '#ff0000';
    document.querySelector('.mode-indicator span').textContent = 'BREAK MODE';
    resetTimer();
}

function saveSettings() {
    const newWorkTime = parseInt(workTimeInput.value);
    const newBreakTime = parseInt(breakTimeInput.value);
    
    if (newWorkTime && newBreakTime) {
        DEFAULT_WORK_TIME = newWorkTime;
        DEFAULT_BREAK_TIME = newBreakTime;
        resetTimer();
        
        // Show feedback
        saveSettingsButton.textContent = 'Saved!';
        setTimeout(() => {
            saveSettingsButton.textContent = 'Save Settings';
        }, 2000);
    }
}

// Initialize
timeLeft = DEFAULT_WORK_TIME * 60;
updateDisplay();

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', setWorkMode);
breakButton.addEventListener('click', setBreakMode);
saveSettingsButton.addEventListener('click', saveSettings);