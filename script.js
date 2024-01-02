// Get references to HTML elements
const fileSize = document.getElementById('file-size');
const fileSizeUnit = document.getElementById('file-size-unit');
const downloadSpeed = document.getElementById('download-speed');
const downloadSpeedUnit = document.getElementById('download-speed-unit');
const calcBtn = document.getElementById('calc-button');
const resetBtn = document.getElementById('reset-button');
const lowerContent = document.querySelector('.lower-content');
const timeResult = document.getElementById('time-result');
const countdownStopButton = document.getElementById('countdown-stop-button');

// Variables for time calculations and countdown
let timeRemaining;
let countdownInterval;
let entriesFilled;


// Function to validate user inputs
function validateInputs() {
    const fileSizeValue = parseFloat(fileSize.value.trim());
    const downloadSpeedValue = parseFloat(downloadSpeed.value.trim());
    // Check if the input fields are not empty and not negative
    if (isNaN(fileSizeValue) || isNaN(downloadSpeedValue) || fileSizeValue < 0 || downloadSpeedValue < 0) {
        return false;
    }
    return true;    
}

// Function to convert values to bytes based on selected units
function convertToBytes(value, unit) {
    const unitMap = {
        'bytes': 1,
        'kilobytes': 1024,
        'megabytes': 1048576,
        'gigabytes': 1073741824,
        'b/s': 1,
        'kb/s': 1024,
        'mb/s': 1048576,
        'gb/s': 1073741824,
    };
    return value * unitMap[unit] || value;
}

// Function to convert time in seconds to a readable format
function convertTime(seconds) {
    if (seconds < 60) {
        return seconds === 1 ? '1 second' : `${seconds} seconds`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const minuteStr = minutes === 1 ? 'minute' : 'minutes';
        const secondStr = remainingSeconds === 1 ? 'second' : 'seconds';
        return `${minutes} ${minuteStr} ${remainingSeconds} ${secondStr}`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const remainingMinutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const hourStr = hours === 1 ? 'hour' : 'hours';
        const minuteStr = remainingMinutes === 1 ? 'minute' : 'minutes';
        const secondStr = remainingSeconds === 1 ? 'second' : 'seconds';
        return `${hours} ${hourStr} ${remainingMinutes} ${minuteStr} ${remainingSeconds} ${secondStr}`;
    }
}

// Function to reset the form and countdown.
function resetForm() {
    clearInterval(countdownInterval);
    fileSize.value = '';
    downloadSpeed.value = '';
    const timeResult = document.getElementById('time-result');
    timeResult.textContent = '';
    const countdownStopButton = document.getElementById('countdown-stop-button');
    if (countdownStopButton) {
        countdownStopButton.innerHTML = '';
    }
}

function createButtons() {
    clearInterval(countdownInterval);
    timeResult.textContent = '';
    countdownStopButton.innerHTML = '';
    const countdownButton = document.createElement('button');
    countdownButton.textContent = 'COUNTDOWN';
    countdownButton.id = "countdown-button";
    countdownStopButton.appendChild(countdownButton);
    countdownButton.addEventListener('click', countdown);
}

function calculateTime() {
    let fileSizeValue = parseFloat(fileSize.value);
    let downloadSpeedValue = parseFloat(downloadSpeed.value);
    let fileSizeUnitValue = fileSizeUnit.value;
    let downloadSpeedUnitValue = downloadSpeedUnit.value;

    // Convert input values to bytes and calculate time remaining
    fileSizeValue = convertToBytes(fileSizeValue, fileSizeUnitValue);
    downloadSpeedValue = convertToBytes(downloadSpeedValue, downloadSpeedUnitValue);
    timeRemaining = fileSizeValue / downloadSpeedValue;

    // Format and display the result
    const formattedTime = convertTime(Math.round(timeRemaining));
    timeResult.textContent = formattedTime;

    if (timeRemaining < 1) {
        alert('The download will complete in less than 1 second.');
        resetForm();
        return;
    }
}

function countdown() {
    const countdownButton = document.getElementById('countdown-button');
    const formattedTime = convertTime(Math.round(timeRemaining));

    if (countdownButton.textContent === 'COUNTDOWN') {
        // Start the countdown immediately
        let remainingTime = Math.round(timeRemaining);
        timeResult.textContent = convertTime(remainingTime);

        countdownInterval = setInterval(function () {
            remainingTime--;
            timeResult.textContent = convertTime(remainingTime);

            // When the time reaches 0 or the "Stop" button is clicked, stop the countdown
            if (remainingTime < 0) {
                clearInterval(countdownInterval);
                timeResult.textContent = formattedTime;
                alert('Your download is finished!');
                countdownButton.textContent = 'COUNTDOWN'; // Change back to "COUNTDOWN"
            }
        }, 1000); // Update every 1 second (1000 milliseconds)

        countdownButton.textContent = 'STOP'; // Change the button to "Stop" when clicked
    } else {
        // Stop the countdown
        clearInterval(countdownInterval);
        timeResult.textContent = formattedTime;
        countdownButton.textContent = 'COUNTDOWN'; // Change back to "COUNTDOWN"
    }
}


// Event listener for the calculate button
calcBtn.addEventListener('click', function () {
    if (validateInputs()) {

        createButtons()
        calculateTime()
       

    } else {
        alert('Please make sure both file size and download speed are entered.');
    }
});

// Event listener for the reset button
resetBtn.addEventListener('click', resetForm);

