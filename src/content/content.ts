import { logEvent } from "./eventLogger";

document.addEventListener("click", (event) => {
    logEvent("CLICK", event);
});
document.addEventListener("mouseover", (event) => {
    logEvent("MOUSEOVER", event);
});