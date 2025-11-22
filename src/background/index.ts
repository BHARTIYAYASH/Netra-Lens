// Background script
console.log('Netra: Indic Lens Background Service Worker running');

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('Background received message:', message);

    if (message.action === 'TOGGLE_ACTIVE') {
        console.log('Extension active state:', message.value);
        // Broadcast to all tabs
        chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
                if (tab.id) {
                    chrome.tabs.sendMessage(tab.id, message).catch(() => {
                        // Tab might not have content script injected yet
                    });
                }
            });
        });
        sendResponse({ success: true });
    }

    if (message.action === 'CAPTURE_SCREEN') {
        console.log('Screen capture requested');

        // Request desktop capture
        chrome.desktopCapture.chooseDesktopMedia(
            ['screen', 'window', 'tab'],
            _sender.tab,
            (streamId) => {
                if (streamId) {
                    console.log('Screen capture granted:', streamId);
                    sendResponse({ success: true, streamId });
                } else {
                    console.log('Screen capture denied');
                    sendResponse({ success: false, error: 'User denied screen capture' });
                }
            }
        );
        return true; // Keep channel open for async response
    }

    return true;
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
    console.log('Netra: Indic Lens installed');
});
