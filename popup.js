const toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: togglePausePlay
    });
  });
});