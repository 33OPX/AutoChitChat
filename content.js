// Variables
let hasClickedStart = false;
let isPaused = false;
let inactivityTimer = null;
let lastMessageTime = null;
const INACTIVITY_LIMIT = 30000;

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

// Click-specific button functions
const clickSkipButton = () => clickButton("SKIP");
const clickConfirmButton = () => clickButton("CONFIRM?");
const clickStartButton = () => {
  const success = clickButton("START");
  if (success) hasClickedStart = true;
  return success;
};

// Check for unwanted messages
function checkMessages() {
  try {
    const messages = Array.from(document.querySelectorAll('li.select-text p')).map(p => p.textContent.trim());
    const maleRegex = /\bmale\b|\b[Mm]\b/;
    const numberAttachedRegex = /\b\d+[Mm]\b|\b[Mm]\d+\b/;

    if (messages.some(msg => numberAttachedRegex.test(msg))) {
      console.log("Found message with numbers attached to M or m. Skipping chat...");
      return true;
    }

    return messages.some(msg => maleRegex.test(msg));
  } catch (error) {
    console.error("Error checking messages:", error);
    return false;
  }
}

// Check button state and perform actions
function checkButtonAndMessages() {
  if (!isPaused && checkMessages()) {
    console.log("Found message with M, m, or male. Performing SKIP -> CONFIRM? -> START...");
    clickSkipButton();
    setTimeout(() => {
      clickConfirmButton();
      setTimeout(clickStartButton, 1000);
    }, 1000);
  }
}

// Check if chat is skipped and restart if needed
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

// Reset inactivity timer
function resetInactivityTimer() {
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (!isPaused) {
    inactivityTimer = setTimeout(() => {
      console.log("No activity for 30 seconds. Skipping chat...");
      clickSkipButton();
      setTimeout(() => {
        clickConfirmButton();
        setTimeout(clickStartButton, 1000);
      }, 1000);
    }, INACTIVITY_LIMIT);
  }
}

// Monitor messages for inactivity reset
function monitorMessages() {
  const messages = document.querySelectorAll('li.select-text p');
  if (messages.length) {
    const lastMessage = messages[messages.length - 1];
    const messageTime = new Date();

    if (!lastMessageTime || messageTime > lastMessageTime) {
      lastMessageTime = messageTime;
      resetInactivityTimer();
    }
  }
}

// Toggle pause/play functionality
function togglePausePlay() {
  isPaused = !isPaused;
  const pausePlayButton = document.getElementById('pausePlayButton');
  pausePlayButton.textContent = isPaused ? 'Turn ON' : 'Turn OFF';
  pausePlayButton.style.backgroundColor = isPaused ? 'green' : 'red';
  console.log(isPaused ? "Script paused." : "Script resumed.");

  if (isPaused && inactivityTimer) {
    clearTimeout(inactivityTimer);
    console.log("Inactivity timer cleared.");
  } else if (!isPaused) {
    resetInactivityTimer();
  }
}

// Create a toggle button in the UI
function createPausePlayButton() {
  const pausePlayButton = document.createElement('button');
  pausePlayButton.id = 'pausePlayButton';
  pausePlayButton.textContent = 'Turn OFF';
  Object.assign(pausePlayButton.style, {
    position: 'fixed',
    top: '10px',
    left: '10px',
    zIndex: '9999',  // Increase z-index to ensure it's on top
    padding: '10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  });

  pausePlayButton.addEventListener('click', togglePausePlay);
  document.body.appendChild(pausePlayButton);
}

// Monitor chat activity
function monitorChat() {
  let lastPath = window.location.pathname;

  setInterval(() => {
    const currentPath = window.location.pathname;

    if (currentPath !== lastPath) {
      console.log("New chat detected. Resetting the START button status and inactivity timer.");
      hasClickedStart = false;
      lastPath = currentPath;
      lastMessageTime = null;
      resetInactivityTimer();
    }

    if (!isPaused) {
      monitorMessages();
      checkButtonAndMessages();
      checkIfSkipped();
    }
  }, 5000);
}

// Initialize the script
createPausePlayButton();
monitorChat();
