let isRunning = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start_cleaning") {
        console.log(`Command received. Keep safe: ${request.safeZone}`);
        
        if (!isRunning) {
            startMassDeletion(request.safeZone);
            sendResponse({ status: "started" });
        } else {
            isRunning = false;
            console.log("Stop command received.");
            sendResponse({ status: "stopped" });
        }
    }
    return true; 
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function simulateHumanClick(element) {
    if (!element) return;
    const events = ['pointerover', 'mouseover', 'mousedown', 'pointerdown', 'mouseup', 'pointerup', 'click'];
    for (let eventType of events) {
        const event = new MouseEvent(eventType, { view: window, bubbles: true, cancelable: true, buttons: 1 });
        element.dispatchEvent(event);
        await sleep(30);
    }
}

async function clickElementByText(textToFind, timeout = 2000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const xpath = `//*[contains(text(), '${textToFind}')]`;
        const matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (matchingElement && matchingElement.offsetParent !== null) {
            await simulateHumanClick(matchingElement);
            return true;
        }
        await sleep(100);
    }
    return false;
}

async function deleteNextChat(safeZoneCount) {
    const allLinks = document.querySelectorAll('nav a');
    const bannedWords = ["new chat", "search", "explore", "images", "apps", "projects", "upgrade", "plan", "gpts"];

    const chatLinks = Array.from(allLinks).filter(link => {
        if (link.offsetParent === null) return false;

        const text = link.innerText.toLowerCase().trim();
        const href = link.getAttribute('href') || "";
        const isBanned = bannedWords.some(word => text.includes(word));
        return (href.includes('/c/') || text.length > 2) && !isBanned;
    });

    if (chatLinks.length <= safeZoneCount) {
        console.log(`Limit reached. ${chatLinks.length} chats remaining.`);
        return false;
    }

    const targetChat = chatLinks[safeZoneCount]; 
    
    targetChat.scrollIntoView({ block: 'center', behavior: 'instant' });
    targetChat.style.border = "3px solid red"; 
    
    console.log(`Processing: "${targetChat.innerText.substring(0, 20)}..."`);

    await simulateHumanClick(targetChat);
    await sleep(300);
    
    const menuBtn = targetChat.querySelector('button, [role="button"], [aria-haspopup="menu"]');
    if (!menuBtn) {
        console.log("Menu button not found. Skipping.");
        targetChat.style.display = 'none'; 
        return true; 
    }

    await simulateHumanClick(menuBtn);
    await sleep(800); 

    let deleteMenuItem = document.querySelector('[data-testid="delete-chat-menu-item"]');
    let clickedMenu = false;

    if (deleteMenuItem) {
        await simulateHumanClick(deleteMenuItem);
        clickedMenu = true;
    } else {
        if (await clickElementByText("Delete", 500)) clickedMenu = true;
        else if (await clickElementByText("Видалити", 500)) clickedMenu = true;
        else if (await clickElementByText("Delete chat", 500)) clickedMenu = true;
    }

    if (!clickedMenu) {
        console.log("System chat detected (no Delete button). Skipping.");
        document.body.click(); 
        await sleep(500);
        
        targetChat.style.display = 'none'; 
        return true; 
    }

    await sleep(800); 

    const confirmBtn = document.querySelector('[data-testid="delete-conversation-confirm-button"]');
    if (confirmBtn) {
        await simulateHumanClick(confirmBtn);
        console.log("Chat deleted.");
        await sleep(1500); 
        return true; 
    } else {
        if (await clickElementByText("Delete", 500)) { await sleep(1500); return true; }
        if (await clickElementByText("Видалити", 500)) { await sleep(1500); return true; }
    }
    
    console.log("Failed to confirm deletion.");
    targetChat.style.display = 'none';
    return true;
}

async function startMassDeletion(safeZoneCount) {
    isRunning = true;
    
    while (isRunning) {
        const success = await deleteNextChat(safeZoneCount);
        if (!success) {
            isRunning = false;
            console.log("Process finished.");
            break;
        }
    }
}