export function handleEvent(message: any, sender: any, sendResponse: any) {
    if (!message || !message.type) return;
    console.log("Received event:", message.type, message.data);
}