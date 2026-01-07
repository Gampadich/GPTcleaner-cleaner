document.getElementById('btn-clean').addEventListener('click', async () => {
    const skipAmount = document.getElementById('skipCount').value
    const statusDiv = document.getElementById('status')

    const [tab] = await chrome.tabs.query({ active : true, currentWindow : true})

    if (!tab.url.includes('chatgpt.com')) {
        statusDiv.innerText = 'Please navigate to chatgpt.com to use this extension.'
        statusDiv.style.color = 'red'
        return
    }

    statusDiv.innerText = 'Cleaning command sent...'

    chrome.tabs.sendMessage(tab.id, { action: 'start_cleaning', safeZone : parseInt(skipAmount) }, (response) => {
        if (chrome.runtime.lastError) {
            statusDiv.innerText = "Error: please reload the page..."
        } else {
            statusDiv.innerText = "Started the work..."
        }
    })
})