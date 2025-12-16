// Background script
console.log('Netra: Indic Lens Background Service Worker running');

// Offscreen document management
const OFFSCREEN_DOCUMENT_PATH = 'src/offscreen/offscreen.html';
let creating: Promise<void> | null = null;

async function setupOffscreenDocument() {
    // Check if an offscreen document already exists
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT' as chrome.runtime.ContextType]
    });

    if (existingContexts.length > 0) {
        return;
    }

    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: ['DOM_SCRAPING' as chrome.offscreen.Reason],
            justification: 'ML model processing for OCR and translation'
        });

        await creating;
        creating = null;
    }
}

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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

    if (message.action === 'TRANSLATE' || message.action === 'OCR') {
        // Forward to offscreen document
        (async () => {
            try {
                await setupOffscreenDocument();

                // Forward the message to offscreen document
                chrome.runtime.sendMessage(message);

                sendResponse({ success: true });
            } catch (error) {
                console.error('Error setting up offscreen document:', error);
                sendResponse({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        })();
        return true; // Keep channel open for async response
    }

    if (message.action === 'CAPTURE_SCREEN') {
        console.log('Screen capture requested');

        // Request desktop capture
        chrome.desktopCapture.chooseDesktopMedia(
            ['screen', 'window', 'tab'],
            sender.tab,
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
