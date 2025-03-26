export function trackClicks(event: MouseEvent) {
    const target = event.target as HTMLElement;
    console.log("Click event:", target.tagName, target.id, target.className);
    
    chrome.runtime.sendMessage({
        type: "CLICK_EVENT",
        data: {
            element: target.tagName,
            id: target.id,
            className: target.className,
            timestamp: new Date().toISOString()
        }
    });
}

export function trackMouseOver(event: MouseEvent) {
    const target = event.target as HTMLElement;
    console.log("Mouseover event:", target.tagName, target.id, target.className);
}
