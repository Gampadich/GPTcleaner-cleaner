(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const allChats = document.querySelectorAll(
    '[data-dd-action-name="sidebar-chat-item"]'
  );
  const targetChat = allChats[0];

  if (!targetChat) return console.error("Чат не знайдено");

  console.log("👉 Вибираю чат...");
  targetChat.click();
  await sleep(800);

  const menuButton = document.querySelector('button[aria-haspopup="menu"]');

  if (menuButton) {
    console.log('Found menu button, executing SUPER CLICK...');
    menuButton.style.border = "3px solid red";

    
    menuButton.focus();

    const rect = menuButton.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);

    const opts = {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: x,
        clientY: y,
        buttons: 1 
    };

    menuButton.dispatchEvent(new PointerEvent('pointerdown', opts));
    menuButton.dispatchEvent(new MouseEvent('mousedown', opts));
    menuButton.dispatchEvent(new PointerEvent('pointerup', opts));
    menuButton.dispatchEvent(new MouseEvent('mouseup', opts));
    menuButton.dispatchEvent(new MouseEvent('click', opts));
    

    console.log("Click dispatched!");
  } else {
    console.error("❌ Кнопку не знайдено");
    return;
  }

  await sleep(800);

  const deleteButton = document.querySelector(
    'div[data-testid="delete-chat-trigger"]'
  );

  if (deleteButton) {
    console.log("Found delete button, clicking it...");
    deleteButton.style.border = "3px solid red";
    deleteButton.click(); 
    console.log("Succesfull");
  } else {
    console.log("Delete button not found");
  }

  await sleep(800);

  const deleteConfirmButton = document.querySelector(
    'button[data-testid="delete-modal-confirm"]'
  );

  if (deleteConfirmButton) {
    console.log("Found delete confirm button, clicking it...");
    deleteConfirmButton.style.border = "3px solid red";
    deleteConfirmButton.click();
    console.log("Succesfully delete chat!");
  } else {
    console.log("Delete confirm button not found");
  }
})();