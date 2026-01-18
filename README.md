# 🧹 AI Chat Mass Purger (Chrome Extension)

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://developer.chrome.com/docs/extensions)

> **Effortlessly clear your AI chat history with one click.** Automates mass-deletion on ChatGPT, Google Gemini, Claude AI, and DeepSeek using human-like UI interaction.

---

## 🖼️ Preview

> **[🎥 Watch Demo Video](посилання_на_відео_якщо_буде)**

---

## 🚀 Key Features

* **🤖 Multi-Platform Support:** Works seamlessly with ChatGPT, Gemini, Claude, and DeepSeek.
* **🛡️ Safe Zone:** A unique feature that allows you to preserve your 'N' most recent or important chats.
* **🕵️ Human-Like Behavior:** Mimics real user clicks and scrolls with smart delays to avoid detection.
- **⚡ No API Required:** Works directly in your browser UI. Your passwords and tokens are never shared.
- **🎨 Modern Popup:** Simple and intuitive interface to control the cleaning process.

---

## 🛠️ Technical Stack

- **Core:** Vanilla JavaScript (ES6+)
- **Automation:** DOM Manipulation & Event Simulation
- **Platform:** Chrome Extension API (Manifest V3)
- **Styling:** CSS3 (Custom UI for the popup)

---

## 📥 How to Install (Chrome / Brave / Edge)

Since this is a custom automation tool, you can install it manually in 30 seconds:

1. **Download** this repository as a ZIP file and extract it (or clone it).
2. Open your browser and go to the Extensions page:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Toggle the **"Developer mode"** switch (usually in the top right corner).
4. Click the **"Load unpacked"** button.
5. Select the folder where you extracted the files.
6. **Done!** You will see the 🧹 **AI Chat Mass Purger** icon in your toolbar.

---

## 📖 How to Use

1. Navigate to your AI chat (ChatGPT, Gemini, etc.).
2. Click on the extension icon.
3. **Set Safe Zone:** Enter the number of recent chats you want to keep (e.g., `5`).
4. Click **"Start Purge"**.
5. The extension will automatically handle the deletion process. You can stop it at any time by closing the popup or refreshing the page.

## 📦 Installation (Development Mode)

1. Clone this repository:
   ```bash
   git clone [https://github.com/Gampadich/AI-cleaner.git](https://github.com/Gampadich/AI-cleaner.git)
Open Chrome and navigate to chrome://extensions/.

Enable "Developer mode" (top right).

Click "Load unpacked" and select the project folder.

Open your favorite AI chat and start cleaning!

⚙️ How It Works
The extension uses a smart Selector Engine that identifies the specific "Delete" and "Confirm" buttons for each platform. It runs a loop that:

Detects the platform (ChatGPT/Gemini/etc.).

Skips the number of chats defined in your Safe Zone.

Simulates a series of clicks to perform the deletion.

Handles confirmation modals automatically.

👨‍💻 Author Designed & Developed by Gampadich