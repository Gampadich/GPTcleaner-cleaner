async function deleteNextChat(safeZoneCount) {
  const allLinks = document.querySelectorAll("nav a");
  const bannedWords = [
    "new chat",
    "search",
    "explore",
    "images",
    "apps",
    "projects",
    "upgrade",
    "plan",
    "gpts",
  ];

  const chatLinks = Array.from(allLinks).filter((link) => {
    const text = link.innerText.toLowerCase().trim();
    const href = link.getAttribute("href") || "";
    const isBanned = bannedWords.some((word) => text.includes(word));
    return (href.includes("/c/") || text.length > 2) && !isBanned;
  });

  if (chatLinks.length <= safeZoneCount) {
    console.log(
      `Safe zone limit reached. ${chatLinks.length} chats remaining.`
    );
    return false;
  }

  const targetChat = chatLinks[safeZoneCount];
  targetChat.scrollIntoView({ block: "center", behavior: "instant" });
  targetChat.style.border = "3px solid red";

  console.log(
    `Attempting to delete: "${targetChat.innerText.substring(0, 20)}..."`
  );

  await simulateHumanClick(targetChat);
  await sleep(300);

  const menuBtn = targetChat.querySelector(
    'button, [role="button"], [aria-haspopup="menu"]'
  );
  if (!menuBtn) {
    console.log("Menu button not found.");
    return false;
  }

  await simulateHumanClick(menuBtn);
  console.log("Menu clicked. Waiting for list...");
  await sleep(1000);

  let deleteMenuItem = document.querySelector(
    '[data-testid="delete-chat-menu-item"]'
  );
  let clickedMenu = false;

  if (deleteMenuItem) {
    console.log("Found button by ID (delete-chat-menu-item)");
    await simulateHumanClick(deleteMenuItem);
    clickedMenu = true;
  } else {
    console.log("ID not found, searching by text...");

    if (await clickElementByText("Delete")) clickedMenu = true;
    else if (await clickElementByText("Видалити")) clickedMenu = true;
    else if (await clickElementByText("Delete chat")) clickedMenu = true;
    else if (await clickElementByText("Видалити чат")) clickedMenu = true;
  }

  if (!clickedMenu) {
    console.log("Delete option not found.");
    document.body.click();
    return false;
  }

  await sleep(1000);

  const confirmBtn = document.querySelector(
    '[data-testid="delete-conversation-confirm-button"]'
  );
  if (confirmBtn) {
    await simulateHumanClick(confirmBtn);
    console.log("Chat deleted (confirmed by ID).");
    await sleep(2000);
    return true;
  } else {
    console.log("Searching for confirm button by text...");
    if (await clickElementByText("Delete")) {
      console.log("Chat deleted (confirmed by 'Delete').");
      await sleep(2000);
      return true;
    }
    if (await clickElementByText("Видалити")) {
      console.log("Chat deleted (confirmed by 'Видалити').");
      await sleep(2000);
      return true;
    }
  }

  console.log("Could not click final confirmation.");
  return false;
}
