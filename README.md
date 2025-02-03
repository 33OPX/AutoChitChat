# Chat Automation Extension

✨ **Automate Your Chat Interactions!**

This Chrome extension automates chat interactions by skipping inactive chats or chats containing specific keywords (`M`, `m`, or `male`). It also includes a 30-second inactivity timer to skip chats with no activity. A pause/play toggle button allows you to control the script's execution.

---

## 🔧 Features

- **Keyword Detection:** Automatically skips chats containing `M`, `m`, or `male`.
- **Inactivity Timer:** Skips chats with no activity for 30 seconds.
- **Pause/Play Toggle:** Easily pause or resume the script with a toggle button.
- **Customizable:** Modify the script to detect other keywords or adjust the inactivity timer.

---

## 🔄 How It Works

### Keyword Detection
- The script scans chat messages for specific keywords (`M`, `m`, or `male`).
- If a keyword is found, it skips the chat by clicking **SKIP**, **CONFIRM?**, and **START** buttons.

### Inactivity Timer
- If no messages are sent in a chat for 30 seconds, the script skips the chat automatically.

### Pause/Play Toggle
- Click the **Turn OFF** button to pause the script.
- Click the **Turn ON** button to resume the script.

---

## 📁 Installation

### 1. Download the Extension
- Clone or download this repository to your computer.

### 2. Load the Extension in Chrome
1. Go to `chrome://extensions/`.
2. Enable **Developer Mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the folder containing the extension files.

### 3. Use the Extension
- Navigate to your chat site.
- The script will run automatically. Use the toggle button to pause or resume.

---

## 📂 Files

- `manifest.json`: Configuration file for the extension.
- `content.js`: Main script that runs on the chat page.
- `popup.html` *(optional)*: Popup UI for the extension.
- `popup.js` *(optional)*: Script for popup functionality.
- `background.js` *(optional)*: Background script for additional tasks.
- `README.md`: This file.

---

## 🛠️ Customization

### Change Keywords
- Modify the `keywords` array in `content.js` to detect other keywords.

### Adjust Inactivity Timer
- Change the `INACTIVITY_LIMIT` variable in `content.js` to adjust the timer.

---

## 😎 Support
If you encounter any issues or have questions, feel free to open an issue in this repository or contact the developer. I am also open to donations as well, anything helps! :)
[GitHub](https://www.paypal.com/donate/?business=T2EP6GNUVE3NJ&no_recurring=1&item_name=Hello%21+Thank+you+for+supporting+my+work%2C+I+really+do+appreciate+every+donation%21+May+you+have+a+blessed+day%2C+happy+to+help%21&currency_code=USD)


---

## 🔒 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

