export function saveToStorage(key: string, value: any) {
    chrome.storage.local.set({ [key]: value }, () => {
        console.log("Saved to storage:", key, value);
    });
}

export function getFromStorage(key: string, callback: (value: any) => void) {
    chrome.storage.local.get([key], (result) => {
        callback(result[key]);
    });
}
