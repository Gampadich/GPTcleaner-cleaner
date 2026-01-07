document.addEventListener('DOMContentLoaded', () => {
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

    btn.addEventListener('click', async () => {
        const skipAmount = skipInput.value;

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('chatgpt.com')) {
            statusDiv.innerText = '❌ Go to chatgpt.com first!';
            statusDiv.style.color = 'red';
            return;
        }

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