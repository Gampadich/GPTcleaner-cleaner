let isRunning = false 

chrome.runtime.onMessage.addListener((request, sender, sendRespnse) => {
    console.log(`Have a command! Save ${request.safeZone} chats`)

    if (!isRunning) {
        startMassDeletion(request.safeZone)
        sendRespnse( { status : 'started'} )
    } else {
        isRunning = false
        console.log('Get a stop command')
        sendRespnse( {status : 'stopped'} )
    }
})

