export function isLineBrowser() {
    if (typeof window === "undefined") return false;
    return /Line/i.test(window.navigator.userAgent);
}
