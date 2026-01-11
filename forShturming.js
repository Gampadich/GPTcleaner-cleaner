(async () => {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    
    const allChats = document.querySelectorAll('a')
    console.log(`Found ${allChats.length} chats`)
    
    const targetChat = allChats[0]
    if (!targetChat) return console.log("Chat not found");

    targetChat.style.border = "3px solid red"
    
    targetChat.click();
    
    await sleep(800)

    const allButtons = document.querySelectorAll('.ds-icon-button__hover-bg')
    const menuButton = allButtons[1]; 

    if (menuButton) {
        menuButton.style.border = "3px solid red"
        menuButton.click()
    } else {
        return console.log("Кнопку меню не знайдено");
    }

    await sleep(800)

    const menuButtons = document.querySelectorAll('.ds-dropdown-menu-option')
    let deleteButton = null;

    for (let i = 0; i < menuButtons.length; i++) {
        const text = menuButtons[i].innerText.toLowerCase();
        if (text.includes('delete') || text.includes('видалити') || text.includes('удалить')) {
            deleteButton = menuButtons[i];
            break;
        }
    }

    if (deleteButton) {
        deleteButton.style.border = "3px solid red"
        deleteButton.click()
    } else {
        return console.log("Delete button not found");
    }

    await sleep(800)

    const confirmButtons = document.querySelectorAll('button')
    const confirmButton = confirmButtons[1]
    
    if (confirmButton) {
        confirmButton.click()
        console.log("Chat deleted successfully");
    } else {
        console.log("Confirm button not found");
    }
})();