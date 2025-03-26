/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/

// === src/background/background.ts ===
// Initialize arrays to store event data
let clickEvents = [];
let mouseoverEvents = [];
let pageTimes = [];
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    var _a;
    if (!message || !message.type)
        return;
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
            if (((_a = sender.tab) === null || _a === void 0 ? void 0 : _a.id) !== undefined) {
                chrome.scripting.executeScript({
                    target: { tabId: sender.tab.id },
                    func: () => {
                        console.log("Injected script running...");
                    }
                }).catch((error) => console.error("Script Injection Error:", error));
            }
            else {
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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixzQkFBc0I7QUFDcEQ7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsb0NBQW9DO0FBQ3ZEO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHlCQUF5QjtBQUMzQztBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2Nocm9tZS1leHRlbnNpb24vLi9zcmMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuLy8gPT09IHNyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHMgPT09XG4vLyBJbml0aWFsaXplIGFycmF5cyB0byBzdG9yZSBldmVudCBkYXRhXG5sZXQgY2xpY2tFdmVudHMgPSBbXTtcbmxldCBtb3VzZW92ZXJFdmVudHMgPSBbXTtcbmxldCBwYWdlVGltZXMgPSBbXTtcbi8vIExpc3RlbiBmb3IgbWVzc2FnZXMgZnJvbSBjb250ZW50IHNjcmlwdHNcbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKCFtZXNzYWdlIHx8ICFtZXNzYWdlLnR5cGUpXG4gICAgICAgIHJldHVybjtcbiAgICBzd2l0Y2ggKG1lc3NhZ2UudHlwZSkge1xuICAgICAgICBjYXNlICdDTElDS19FVkVOVCc6XG4gICAgICAgICAgICBjbGlja0V2ZW50cy5wdXNoKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTU9VU0VPVkVSX0VWRU5UJzpcbiAgICAgICAgICAgIG1vdXNlb3ZlckV2ZW50cy5wdXNoKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUEFHRV9USU1FJzpcbiAgICAgICAgICAgIHBhZ2VUaW1lcy5wdXNoKG1lc3NhZ2UuZGF0YSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnSU5KRUNUX1NDUklQVCc6XG4gICAgICAgICAgICBpZiAoKChfYSA9IHNlbmRlci50YWIpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pZCkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICAgICAgICAgICAgICAgIHRhcmdldDogeyB0YWJJZDogc2VuZGVyLnRhYi5pZCB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkluamVjdGVkIHNjcmlwdCBydW5uaW5nLi4uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmVycm9yKFwiU2NyaXB0IEluamVjdGlvbiBFcnJvcjpcIiwgZXJyb3IpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHRhYiBJRCBmb3Igc2NyaXB0IGluamVjdGlvbi5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gZXZlbnQgdHlwZTpcIiwgbWVzc2FnZS50eXBlKTtcbiAgICB9XG59KTtcbi8vIEZ1bmN0aW9uIHRvIHNlbmQgZGF0YSB0byB0aGUgYmFja2VuZFxuZnVuY3Rpb24gc2VuZERhdGFUb0JhY2tlbmQoKSB7XG4gICAgaWYgKGNsaWNrRXZlbnRzLmxlbmd0aCA9PT0gMCAmJiBtb3VzZW92ZXJFdmVudHMubGVuZ3RoID09PSAwICYmIHBhZ2VUaW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJObyBkYXRhIHRvIHNlbmQsIHNraXBwaW5nLi4uXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHJlcUJPRFkgPSBbXG4gICAgICAgIC4uLmNsaWNrRXZlbnRzLCAvLyBDcmVhdGUgY29waWVzIGJlZm9yZSBjbGVhcmluZ1xuICAgICAgICAuLi5tb3VzZW92ZXJFdmVudHNcbiAgICBdO1xuICAgIGNvbnNvbGUubG9nKFwiU2VuZGluZyBkYXRhIHRvIGJhY2tlbmQ6XCIsIHJlcUJPRFkpO1xuICAgIGZldGNoKFwiaHR0cDovLzE3Mi4xNy4xNS4xNjA6ODA4NS9hcGkvdXNlcnRyYWNraW5nXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXFCT0RZKVxuICAgIH0pXG4gICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgLnRoZW4oZGF0YSA9PiBjb25zb2xlLmxvZyhcIuKchSBEYXRhIHNlbnQgc3VjY2Vzc2Z1bGx5OlwiLCBkYXRhKSlcbiAgICAgICAgLmNhdGNoKGVycm9yID0+IGNvbnNvbGUuZXJyb3IoXCLinYwgRXJyb3Igc2VuZGluZyBkYXRhOlwiLCBlcnJvcikpO1xuICAgIC8vIENsZWFyIHRoZSBldmVudHMgYWZ0ZXIgc2VuZGluZ1xuICAgIGNsaWNrRXZlbnRzID0gW107XG4gICAgbW91c2VvdmVyRXZlbnRzID0gW107XG4gICAgcGFnZVRpbWVzID0gW107XG59XG4vLyBTZW5kIGRhdGEgdG8gdGhlIGJhY2tlbmQgZXZlcnkgMzAgc2Vjb25kc1xuc2V0SW50ZXJ2YWwoc2VuZERhdGFUb0JhY2tlbmQsIDMwMDAwKTtcbi8vIEVuc3VyZSBjb250ZW50IHNjcmlwdHMgcmVsb2FkIHdoZW4gdGFicyBiZWNvbWUgYWN0aXZlXG5jaHJvbWUudGFicy5vbkFjdGl2YXRlZC5hZGRMaXN0ZW5lcigoYWN0aXZlSW5mbykgPT4ge1xuICAgIGNocm9tZS5zY3JpcHRpbmcuZXhlY3V0ZVNjcmlwdCh7XG4gICAgICAgIHRhcmdldDogeyB0YWJJZDogYWN0aXZlSW5mby50YWJJZCB9LFxuICAgICAgICBmaWxlczogW1wiY29udGVudC5qc1wiXVxuICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLndhcm4oXCJGYWlsZWQgdG8gcmVsb2FkIGNvbnRlbnQgc2NyaXB0OlwiLCBlcnIpKTtcbn0pO1xuLy8gS2VlcCB0aGUgc2VydmljZSB3b3JrZXIgYWxpdmUgYnkgcGVyaW9kaWNhbGx5IHBpbmdpbmcgaXRzZWxmXG5zZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgY2hyb21lLnJ1bnRpbWUuZ2V0UGxhdGZvcm1JbmZvKGluZm8gPT4gY29uc29sZS5sb2coXCJCYWNrZ3JvdW5kIHNjcmlwdCBhY3RpdmU6XCIsIGluZm8ub3MpKTtcbn0sIDYwMDAwKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==