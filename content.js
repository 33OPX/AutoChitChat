// Variables
let hasClickedStart = false; // Track if START button has been clicked
let isPaused = false; // Track whether the script is paused
let inactivityTimer = null; // Timer for inactivity detection
let lastMessageTime = null; // Timestamp of the last message
const INACTIVITY_LIMIT = 30000; // 30 seconds in milliseconds

// Function to click a button by text content
function clickButton(buttonText) {
  try {
    const button = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes(buttonText));
    if (button) {
      console.log(`${buttonText} button found, clicking...`);
      button.click();
      return true;
    } else {
      console.log(`${buttonText} button not found.`);
      return false;
    }
  } catch (error) {
    console.error(`Error clicking ${buttonText} button:`, error);
    return false;
  }
}

// Function to click the SKIP button
function clickSkipButton() {
  return clickButton("SKIP");
}

// Function to click the CONFIRM? button
function clickConfirmButton() {
  return clickButton("CONFIRM?");
}

// Function to click the START button
function clickStartButton() {
  const success = clickButton("START");
  if (success) hasClickedStart = true; // Mark that we've clicked the START button
  return success;
}

// Function to check for messages containing "M", "m", or "male"
function checkMessages() {
  try {
    const messages = Array.from(document.querySelectorAll('li.select-text p')).map(p => p.textContent.trim());
    const messageRegex = /\bmale\b|\b[Mm]\b/; // Matches "male" or "M"/"m" alone
    const numberAttachedRegex = /\b\d+[Mm]\b|\b[Mm]\d+\b/; // Matches numbers attached to M or m

    // Check for numbers attached to M or m
    const hasInvalidMessage = messages.some(msg => numberAttachedRegex.test(msg));
    if (hasInvalidMessage) {
      console.log("Found message with numbers attached to M or m. Skipping chat...");
      return true;
    }

    // Check for "M", "m", or "male"
    const hasMaleMessage = messages.some(msg => messageRegex.test(msg));
    return hasMaleMessage;
  } catch (error) {
    console.error("Error checking messages:", error);
    return false;
  }
}

// Function to check the button status and trigger actions
function checkButtonAndMessages() {
  if (!isPaused) {
    const hasMaleMessage = checkMessages();

    if (hasMaleMessage) {
      console.log("Found message with M, m, or male. Performing SKIP -> CONFIRM? -> START...");
      clickSkipButton();
      setTimeout(() => {
        clickConfirmButton();
        setTimeout(() => {
          clickStartButton();
        }, 1000);
      }, 1000);
    } else {
      console.log("No message with M, m, or male detected.");
    }
  }
}

// Function to check if the chat has been skipped and click START if necessary
function checkIfSkipped() {
  const startButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('START'));

  if (startButton && !hasClickedStart) {
    console.log("START button is visible, indicating the chat has been skipped.");
    clickStartButton();
  } else if (hasClickedStart) {
    console.log("Already clicked START, waiting for next chat.");
  } else {
    console.log("START button not found, chat still active.");
  }
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer); // Clear the existing timer
  }
  if (!isPaused) {
    inactivityTimer = setTimeout(() => {
      console.log("No activity for 30 seconds. Skipping chat...");
      clickSkipButton();
      setTimeout(() => {
        clickConfirmButton();
        setTimeout(() => {
          clickStartButton();
        }, 1000);
      }, 1000);
    }, INACTIVITY_LIMIT);
  }
}

// Function to monitor chat messages and update the last message time
function monitorMessages() {
  const messages = Array.from(document.querySelectorAll('li.select-text p'));
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    const messageTime = new Date(); // Use current time as a fallback

    // Check if the last message is new
    if (!lastMessageTime || messageTime > lastMessageTime) {
      lastMessageTime = messageTime;
      resetInactivityTimer(); // Reset the timer on new message
    }
  }
}

// Function to toggle pause/play state
function togglePausePlay() {
  isPaused = !isPaused;
  pausePlayButton.textContent = isPaused ? 'Turn ON' : 'Turn OFF';
  pausePlayButton.style.backgroundColor = isPaused ? 'green' : 'red';
  console.log(isPaused ? "Script paused." : "Script resumed.");

  // Clear the inactivity timer when paused
  if (isPaused && inactivityTimer) {
    clearTimeout(inactivityTimer);
    console.log("Inactivity timer cleared.");
  } else if (!isPaused) {
    resetInactivityTimer(); // Restart the timer when unpaused
  }
}

// Function to create a pause/play toggle button
function createPausePlayButton() {
  const pausePlayButton = document.createElement('button');
  pausePlayButton.textContent = 'Turn OFF';
  pausePlayButton.style.position = 'fixed';
  pausePlayButton.style.top = '10px';
  pausePlayButton.style.left = '10px';
  pausePlayButton.style.zIndex = '1000';
  pausePlayButton.style.padding = '10px';
  pausePlayButton.style.backgroundColor = 'red';
  pausePlayButton.style.color = 'white';
  pausePlayButton.style.border = 'none';
  pausePlayButton.style.cursor = 'pointer';
  pausePlayButton.addEventListener('click', togglePausePlay);
  document.body.appendChild(pausePlayButton);

  window.pausePlayButton = pausePlayButton;
}

// Function to continuously monitor the chat and button state
function monitorChat() {
  let lastPath = window.location.pathname;

  setInterval(() => {
    const currentPath = window.location.pathname;

    if (currentPath !== lastPath) {
      console.log("New chat detected. Resetting the START button status and inactivity timer.");
      hasClickedStart = false;
      lastPath = currentPath;
      lastMessageTime = null; // Reset the last message time
      resetInactivityTimer(); // Restart the inactivity timer
    }

    if (!isPaused) {
      monitorMessages(); // Check for new messages
      checkButtonAndMessages();
      checkIfSkipped(); // Ensure this function is defined and called
    }
  }, 5000); // Check every 5 seconds
}

// Initialize the script
createPausePlayButton();
monitorChat();