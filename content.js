let isRunning = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "start_cleaning") {
        console.log(`Start ing program. Safe Zone: ${request.safeZone}`);
        if (!isRunning) {
            startMassDeletion(request.safeZone);
            sendResponse({ status: "started" });
        } else {
            isRunning = false;
            sendResponse({ status: "stopped" });
        }
    }
    if (request.action === "check_status") {
        sendResponse({ isRunning: isRunning });
    }
    return true;
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function softClick(element) {
    if (!element) return;
    element.scrollIntoView({ block: 'center', behavior: 'instant' });
    element.click();
}

function hardClick(element) {
    if (!element) return;
    element.style.border = "3px solid red";
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    element.click();
}

async function waitFor(selector, timeout = 3000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const el = document.querySelector(selector);
        if (el) return el;
        await sleep(100);
    }
    return null;
}

function findByText(selector, textList) {
    const elements = document.querySelectorAll(selector);
    for (let el of elements) {
        const txt = el.innerText.toLowerCase();
        if (textList.some(t => txt.includes(t)) && el.offsetParent) {
            return el;
        }
    }
    return null;
}

async function deleteGemini(safeZoneCount) {
    const nav = document.querySelector('nav') || document.querySelector('[role="navigation"]');
    if (!nav) { console.log("Navigation not found"); return false; }
    let equator = null;
    nav.querySelectorAll('*').forEach(el => {
        if (el.innerText && ['чати', 'chats', 'recent'].includes(el.innerText.trim().toLowerCase()) && el.offsetParent) {
            equator = el;
        }
    });

    if (!equator) {
        console.log("Chats section not found.");
        return false;
    }

    const titles = nav.querySelectorAll('.conversation-title');
    let chats = [];
    titles.forEach(t => {
        const row = t.closest('.conversation-items-container') || t.closest('a') || t.closest('div[role="button"]');
        if (row && row.offsetParent && (equator.compareDocumentPosition(row) & Node.DOCUMENT_POSITION_FOLLOWING)) {
            chats.push(row);
        }
    });
    chats = [...new Set(chats)]; 

    console.log(`Found chats: ${chats.length}`);

    if (chats.length <= safeZoneCount) {
        return "LIMIT_REACHED";
    }

    const target = chats[safeZoneCount];
    
    console.log(`Deleting: "${target.innerText.split('\n')[0]}..."`);
    target.style.border = "3px solid magenta";

    target.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await sleep(600);

    let menuBtn = target.querySelector('[data-test-id="actions-menu-button"]');
    if (!menuBtn) menuBtn = target.querySelector('button[aria-haspopup="true"]');
    
    if (!menuBtn) {
        console.log("Menu button not found. Skipping.");
        target.style.display = 'none'; 
        return true;
    }

    softClick(menuBtn);

    const menuOpen = await waitFor('div[role="menu"]', 2000);
    if (!menuOpen) {
        console.log("Menu not found. Trying again...");
        softClick(menuBtn);
        await sleep(500);
    }

    const deleteBtn = findByText('div[role="menuitem"], button', ['delete', 'видалити']);
    
    if (!deleteBtn) {
        console.log("Delete button not found.");
        document.body.click();
        target.style.display = 'none';
        return true;
    }

    softClick(deleteBtn);

    console.log("Waiting for confirmation...");
    const dialog = await waitFor('mat-dialog-container', 3000);
    
    if (dialog) {
        await sleep(300); 
        let confirmBtn = dialog.querySelector('[data-test-id="confirm-button"]');
    
        if (!confirmBtn) {
            const buttons = dialog.querySelectorAll('button');
            for (let btn of buttons) {
                if (btn.innerText.toLowerCase().includes('delete') || btn.innerText.toLowerCase().includes('видалити')) {
                    confirmBtn = btn;
                    break;
                }
            }
        }

        if (confirmBtn) {
            console.log("Confirming!");
            hardClick(confirmBtn); 
            
            console.log("Wait for deletion...");
            let retries = 0;
            while (document.body.contains(target) && retries < 50) { // Чекаємо до 5 сек
                await sleep(100);
                retries++;
            }
            
            if (document.body.contains(target)) {
                 console.log("Servers bug.");
                 target.style.display = 'none';
            } else {
                 console.log("Sucsesfull.");
            }
            
            await sleep(1000); 
            return true;
        }
    }

    console.log("Cant confirm.");
    target.style.display = 'none'; 
    return true;
}

async function deleteChatGPT(safeZoneCount) {
    const allLinks = document.querySelectorAll('nav a');
    const bannedWords = ["new chat", "search", "explore", "images", "apps", "projects", "upgrade", "plan", "gpts"];
    const chatLinks = Array.from(allLinks).filter(link => {
        if (link.offsetParent === null) return false;
        const text = link.innerText.toLowerCase().trim();
        const href = link.getAttribute('href') || "";
        const isBanned = bannedWords.some(word => text.includes(word));
        return (href.includes('/c/') || text.length > 2) && !isBanned;
    });

    if (chatLinks.length <= safeZoneCount) return "LIMIT_REACHED";
    const targetChat = chatLinks[safeZoneCount]; 
    targetChat.scrollIntoView({ block: 'center', behavior: 'instant' });
    targetChat.style.border = "3px solid #10a37f"; 
    
    softClick(targetChat);
    await sleep(300);
    const menuBtn = targetChat.querySelector('button, [role="button"], [aria-haspopup="menu"]');
    if (!menuBtn) { targetChat.style.display = 'none'; return true; }

    softClick(menuBtn);
    await sleep(600); 
    
    let deleteBtn = null;
    const items = document.querySelectorAll('[role="menuitem"]');
    for(let item of items) {
        if(item.innerText.toLowerCase().includes('delete') || item.innerText.toLowerCase().includes('видалити')) {
            deleteBtn = item;
            break;
        }
    }
    
    if (deleteBtn) {
        softClick(deleteBtn);
    } else {
        document.body.click(); targetChat.style.display = 'none'; return true; 
    }

    await sleep(600); 
    const confirmBtn = document.querySelector('[data-testid="delete-conversation-confirm-button"]');
    if (confirmBtn) { hardClick(confirmBtn); await sleep(1000); return true; } 
    return false;
}

async function startMassDeletion(safeZoneCount) {
    isRunning = true;
    const hostname = window.location.hostname;
    console.log(`Start cleaner on: ${hostname}`);

    while (isRunning) {
        let result = false;

        if (hostname.includes('chatgpt')) {
            result = await deleteChatGPT(safeZoneCount);
        } else if (hostname.includes('google') || hostname.includes('gemini')) {
            result = await deleteGemini(safeZoneCount);
        } else {
            console.log('Unknown page!');
            isRunning = false;
            break;
        }

        if (result === "LIMIT_REACHED") {
            console.log("✅ Clearing complete or limit reached.");
            isRunning = false;
            break;
        }

        if (!result) {
            console.log('Error, Stopping.');
            isRunning = false;
            break;
        }
    }
}