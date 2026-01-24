(async () => {
    const sleep = (ms) => new Promise(res => setTimeout(res, ms))
    const chats = document.querySelectorAll('a[data-dd-action-name="sidebar-chat-item"]')

    console.log(`Found ${chats.length} chats`)
    
    const chat = chats[0]
    chat.style.border = "3px solid red"
    chat.click()

    await sleep(400)

    const menuBtn = document.querySelector('button[aria-haspopup="menu"]')

    if (menuBtn) console.log('Founded menu button')

    menuBtn.style.border = "3px solid red"
    menuBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    menuBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));

    await sleep(400)

    const firstDeleteButton = document.querySelector('div[data-testid="delete-chat-trigger"]')
    firstDeleteButton.style.border = "3px solid red"
    firstDeleteButton.click()

    await sleep(400)

    const deleteButton = document.querySelector('button[data-testid="delete-modal-confirm"]')
    deleteButton.style.border = "3px solid blue"
    deleteButton.click()
})()