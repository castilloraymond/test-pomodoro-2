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
const workTimeInput = document.getElementById('workTime');
const breakTimeInput = document.getElementById('breakTime');
const saveSettingsButton = document.getElementById('saveSettings');

// Settings
let workTime = 25;
let breakTime = 5;

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    minutesDisplay.innerHTML = `${minutes.toString().padStart(2, '0')}`;
    secondsDisplay.innerHTML = `${seconds.toString().padStart(2, '0')}`;
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
                <div class="history-time">${item.timestamp}</div>
                <div class="history-type">${item.type} - ${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}</div>
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
    timeLeft = isWorkMode ? workTime * 60 : breakTime * 60;
    updateDisplay();
}

function setWorkMode() {
    isWorkMode = true;
    workLed.style.backgroundColor = 'var(--primary-color)';
    document.querySelector('.mode-indicator span').textContent = 'WORK MODE';
    resetTimer();
}

function setBreakMode() {
    isWorkMode = false;
    workLed.style.backgroundColor = 'var(--accent-color)';
    document.querySelector('.mode-indicator span').textContent = 'BREAK MODE';
    resetTimer();
}

function saveSettings() {
    const newWorkTime = parseInt(workTimeInput.value);
    const newBreakTime = parseInt(breakTimeInput.value);
    
    if (newWorkTime && newBreakTime) {
        workTime = newWorkTime;
        breakTime = newBreakTime;
        resetTimer();
        
        saveSettingsButton.textContent = 'Saved!';
        setTimeout(() => {
            saveSettingsButton.textContent = 'Save Settings';
        }, 2000);
    }
}

// Initialize
timeLeft = workTime * 60;
updateDisplay();

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
workButton.addEventListener('click', setWorkMode);
breakButton.addEventListener('click', setBreakMode);
saveSettingsButton.addEventListener('click', saveSettings);