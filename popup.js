document.addEventListener('DOMContentLoaded', async () => {
    const btn = document.getElementById('btn-clean');
    const statusDiv = document.getElementById('status');
    const skipInput = document.getElementById('skipCount');

    function updateButtonState(isRunning) {
        if (isRunning) {
            btn.textContent = '🛑 Stop Cleaning';
            btn.style.backgroundColor = '#333';
        } else {
            btn.textContent = '🗑️ Start Cleaning';
            btn.style.backgroundColor = '#ef4444';
        }
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const isChatGPT = tab.url.includes('chatgpt.com');
    const isGemini = tab.url.includes('gemini.google.com')

    if (!isChatGPT && !isGemini) {
        statusDiv.innerText = 'This extension only works on ChatGPT or Gemini pages.';
        statusDiv.style.color = 'red';
        btn.disabled = true;
        return;
    }

    chrome.tabs.sendMessage(tab.id, { action: 'check_status' }, (response) => {
        if (!chrome.runtime.lastError && response) {
            updateButtonState(response.isRunning);
            if (response.isRunning) {
                statusDiv.innerText = "Running in background...";
                statusDiv.style.color = "green";
            }
        }
    });

    btn.addEventListener('click', async () => {
        const skipAmount = skipInput.value;
        statusDiv.innerText = 'Sending command...';

        chrome.tabs.sendMessage(tab.id, { 
            action: 'start_cleaning', 
            safeZone: parseInt(skipAmount) 
        }, (response) => {
            
            if (chrome.runtime.lastError) {
                statusDiv.innerText = "Error: Refresh the page!";
                statusDiv.style.color = "red";
                return;
            }

            if (response && response.status === 'started') {
                statusDiv.innerText = "Running...";
                statusDiv.style.color = "green";
                updateButtonState(true); 
            } else if (response && response.status === 'stopped') {
                statusDiv.innerText = "Stopped.";
                statusDiv.style.color = "#888";
                updateButtonState(false); 
            }
        });
    });
});