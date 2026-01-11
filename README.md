# 🧹 AI Chat Mass Deleter (Chrome Extension)

A browser automation script to mass-delete chat history from popular AI platforms. It automates clearing conversations from ChatGPT, Google Gemini, Claude AI, and DeepSeek.

---

## 🚀 Features

- Multi-platform support:
  - OpenAI ChatGPT
  - Google Gemini
  - Claude AI
  - DeepSeek
- Configurable "Safe Zone" to protect pinned or recent chats.
- Intelligent DOM navigation to find menus, delete actions, and confirmation dialogs.
- Visual feedback: highlights elements before clicking so you can watch what the script does.
- Toggle control: start/stop remotely via extension messages.

---

## 🛠️ Installation

This script is intended to run as a content script inside a Chrome extension.

1. Create a folder for your extension.
2. Save the content script as `content.js`.
3. Create a `manifest.json` (Manifest V3) with permissions for the target sites.
4. Load the extension in Chrome: open `chrome://extensions/` → **Load unpacked** → select the folder.

### Example `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "AI Chat Cleaner",
  "version": "1.0",
  "permissions": ["activeTab", "scripting"],
  "content_scripts": [
    {
      "matches": [
        "https://chatgpt.com/*",
        "https://gemini.google.com/*",
        "https://claude.ai/*",
        "https://chat.deepseek.com/*"
      ],
      "js": ["content.js"]
    }
  ]
}
```

---

## 📖 Usage

Navigate to the AI chat website you want to clean (for example `https://chatgpt.com`).

Trigger the script by sending a message from your extension popup or background script.

### Start cleaning

Send this message to start:

```javascript
chrome.tabs.sendMessage(tabId, {
  action: "start_cleaning",
  safeZone: 0 // Number of top chats to skip (0 = delete everything)
});
```

### Check status

To check whether the script is running:

```javascript
chrome.tabs.sendMessage(tabId, { action: "check_status" });
```

---

## ⚙️ How it works

The script runs a loop while `isRunning` is true, detects the current hostname, and runs platform-specific deletion logic.

1. ChatGPT
   - Filters out navigation links (e.g., "Explore GPTs", "Upgrade Plan").
   - Identifies chat links by `/c/` URL patterns.
   - Opens context menu and selects "Delete".

2. Google Gemini
   - Locates the navigation container and finds "Recent" or "Chats".
   - Handles mat-dialog confirmation modals used by Gemini.
   - Includes retry logic for server synchronization delays.

3. Claude AI
   - Uses pointer events to simulate realistic user clicks (required for some React-based UIs).
   - Navigates the sidebar items and confirms deletion via modals.

4. DeepSeek
   - Iterates sidebar links and handles the platform-specific dropdown menu structure.

---

## ⚠️ Important Notes

- Safe Zone: `safeZone` determines how many top chats to skip. `0` deletes the first item; `1` skips the top item, etc.
- DOM changes: AI platforms frequently update their UIs. If the script stops working, update CSS selectors in `content.js`.
- Rate limiting: The script uses `sleep()` delays between actions to avoid crashes and reduce rate limiting risk.
