(async () => {
    const sleep = (ms) => new Promise(res => setTimeout(res, ms))

    const menuBtn = document.querySelector('button[class="__menu-item-trailing-btn"]')

    menuBtn.style.border = "3px solid red"
    menuBtn.dispatchEvent(new PointerEvent('pointerdown', {bubbles : true}))
    menuBtn.dispatchEvent(new PointerEvent('pointerup', {bubbles : true}))

    await sleep(800)

    const deleteMenuBtn = document.querySelector('div[data-testid="delete-chat-menu-item"]')

    deleteMenuBtn.style.border = "3px solid red"
    deleteMenuBtn.click()

    await sleep(800)

    const deleteBtn = document.querySelector('button[data-testid="delete-conversation-confirm-button"]')

    deleteBtn.style.border = "3px solid green"
    deleteBtn.click()
})()