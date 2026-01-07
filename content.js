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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function simulateHumanClick(element){
    if (!element) return
    const events = ['pointerover', 'mouseover', 'mousedown', 'pointerdown', 'mouseup', 'pointerup', 'click']
    for ( let eventType of events){
        const event = new MouseEvent(eventType, { view : window, bubbles : true, cancelable : true, buttons : 1 })
        element.dispatchEvent(event)
        await sleep(30)
    }
}

async function clickElementByText (textToFind, timeout = 1500) {
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
        const xpath = `//*[contains(text(), '${textToFind}')]`
        const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
        if (matchingElement && matchingElement.offsetParent !== null) {
            await simulateHumanClick(matchingElement)
            return true
        }
        await sleep(100)
    }
    return false
}

async function deleteNextChat (safeZoneCount) {
    const allLinks = document.querySelectorAll('nav a')
    const bannedWords = ['new chat', 'search', 'explore', 'images', 'apps', 'projects', 'upgrade', 'plan', 'gpts']
    
    const chatLinks = Array.from(allLinks).filter(link => {
        const text = link.innerText.toLowerCase().trim()
        const href = link.getAttribute('href') || ''
        const isBanned = bannedWords.some(word => text.includes(word))
        return (href.includes('/c/') || text.length > 2) && !isBanned
    }) 

    if (chatLinks.length <= safeZoneCount) {
        console.log(`Finished: ${chatLinks.length} remaining`)
        return false;
    }

    const targetChat = chatLinks[safeZoneCount]
    targetChat.scrollIntoView( { block : 'center', behavior : 'instant' } )
    targetChat.style.border = '3px solid red'

    console.log('Deleting...')

    await simulateHumanClick(targetChat)
    await sleep(300)

    const menuBtn = targetChat.querySelector('button, [role="button"], [aria-haspopup="menu"]')

    if (!menuBtn) {
        console.log('Menu button not found. Skipping')
        return false
    }

    await simulateHumanClick(menuBtn)
    await sleep(800)

    let deleteMenuItem = document.querySelector('[data-testid="delete-chat-menu-item]')
    let clickedMenu = false

    if (deleteMenuItem) {
        await simulateHumanClick(deleteMenuItem)
        clickedMenu = true
    } else {
        clickedMenu = await clickElementByText('Delete')
    }

    if (!clickedMenu) {
        console.log('Delete option not found')
        document.body.click()
        return false
    }

    await sleep(800)

    const confirmBtn = document.querySelector('[data-testid="delete-conversation-confirm-button"]')

    if (confirmBtn) {
        await simulateHumanClick(confirmBtn)
        console.log("Chat deleted!")
        await sleep(2000)
        return true
    } else {
        const confirmed = await clickElementByText("Delete")
        if (confirmed) {
            console.log('Chat deleted (by text)!')
            await sleep(2000)
            return true
        }
    }
    return true
}

async function startMassDeletion(safeZoneCount) {
    isRunning = true

    while (isRunning) {
        const success = await deleteNextChat(safeZoneCount)

        if (!success) {
            console.log('Job done or stopped')
            isRunning = false
            break
        }
    }
}
