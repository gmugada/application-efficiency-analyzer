let startTime = Date.now();
let lastScreen = window.location.pathname; // Store initial screen

function resetTimeSpent() {
    startTime = Date.now();
}

function getTimeSpent() {
    const now = Date.now();
    const elapsedTime = now - startTime;
    const totalSeconds = Math.floor(elapsedTime / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    ].join(':');
}

function getSection(target:any) {
    let section = "Unknown";
    if (target.closest(".sidenav,.sidebar-menu,.mat-sidenav, .sidebar")) section = "Sidenav";
    else if (target.closest(".topbar,.header ,.nav")) section = "Topbar";
    else if (target.closest(".content,.page-container, .page-content-wrapper, .main-body")) section = "Body";
    else if (target.closest(".breadcrumb")) section = "breadcrumb";
    else if (target.closest("app-footer")) section = "Footer";
    return section;
}

export function logEvent(eventType:any, event:any) {
    const currentScreen = window.location.pathname;
    // Reset time spent if the screen has changed
    if (currentScreen !== lastScreen) {
        resetTimeSpent();
        lastScreen = currentScreen; // Update to new screen
    }
    const timeSpent = getTimeSpent();
    const section = getSection(event.target);

    const eventDetails = {
        screen: window.location.pathname,
        section: section,
        // elementTag: event?.target?.tagName,
        // elementId: event?.target?.id || "N/A",
        // elementClass: event?.target?.className || "N/A",
        timeStamp: new Date().toISOString(),
        currentWorking: event?.target?.innerText.trim().slice(0,20) || "N/A",
        timeSpent: timeSpent,
        eventType:eventType
    };

    console.log(`${eventType}_EVENT`, eventDetails);
    sendMessageToBackgroundJs(`${eventType}_EVENT`, eventDetails);
}

function sendMessageToBackgroundJs(eventType:any, data:any) {
    chrome.runtime.sendMessage({ type: eventType, data: data });
}
// Ensure document is fully loaded before running MutationObserver
function initMutationObserver() {
    if (!document.body) {
        console.warn("Document body not ready. Retrying...");
        setTimeout(initMutationObserver, 100); // Retry in 100ms
        return;
    }

    const observer = new MutationObserver(() => {
        const currentScreen = window.location.pathname;
        if (currentScreen !== lastScreen) {
            resetTimeSpent();
            lastScreen = currentScreen;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("MutationObserver initialized");
}

// Run the observer only after the page has fully loaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMutationObserver);
} else {
    initMutationObserver();
}