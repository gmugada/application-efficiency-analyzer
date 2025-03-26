// === src/background/background.ts ===

// Define interfaces for event data
interface ClickEvent {
    /* Define properties relevant to click events */
}

interface MouseOverEvent {
    /* Define properties relevant to mouseover events */
}

interface PageTime {
    /* Define properties relevant to page time tracking */
}

// Initialize arrays to store event data
let clickEvents: ClickEvent[] = [];
let mouseoverEvents: MouseOverEvent[] = [];
let pageTimes: PageTime[] = [];

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message || !message.type) return;

    switch (message.type) {
        case 'CLICK_EVENT':
            clickEvents.push(message.data);
            break;
        case 'MOUSEOVER_EVENT':
            mouseoverEvents.push(message.data);
            break;
        case 'PAGE_TIME':
            pageTimes.push(message.data);
            break;
        case 'INJECT_SCRIPT':
            if (sender.tab?.id !== undefined) {
                chrome.scripting.executeScript({
                    target: { tabId: sender.tab.id },
                    func: () => {
                        console.log("Injected script running...");
                    }
                }).catch((error) => console.error("Script Injection Error:", error));
            } else {
                console.error("Invalid tab ID for script injection.");
            }
            break;
        default:
            console.warn("Unknown event type:", message.type);
    }
});

// Function to send data to the backend
function sendDataToBackend() {
    if (clickEvents.length === 0 && mouseoverEvents.length === 0 && pageTimes.length === 0) {
        console.log("No data to send, skipping...");
        return;
    }

    const reqBODY = [
        ...clickEvents, // Create copies before clearing
        ...mouseoverEvents
    ];

    console.log("Sending data to backend:", reqBODY);

    fetch("http://172.17.15.160:8085/api/usertracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBODY)
    })
    .then(response => response.json())
    .then(data => console.log("✅ Data sent successfully:", data))
    .catch(error => console.error("❌ Error sending data:", error));

    // Clear the events after sending
    clickEvents = [];
    mouseoverEvents = [];
    pageTimes = [];
}

// Send data to the backend every 30 seconds
setInterval(sendDataToBackend, 30000);

// Ensure content scripts reload when tabs become active
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        files: ["content.js"]
    }).catch(err => console.warn("Failed to reload content script:", err));
});

// Keep the service worker alive by periodically pinging itself
setInterval(() => {
    chrome.runtime.getPlatformInfo(info => console.log("Background script active:", info.os));
}, 60000);
