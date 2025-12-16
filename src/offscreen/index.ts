import { pipeline, env } from '@xenova/transformers';
import Tesseract from 'tesseract.js';

// Configure Transformers.js to use local models if possible, or allow download
env.allowLocalModels = false; // We want to download first, then cache.
env.useBrowserCache = true;

console.log('Netra: Offscreen script loaded');

// Placeholder for model loading
let translator: any = null;

async function loadTranslationModel() {
    if (!translator) {
        console.log('Loading translation model...');
        // Using NLLB-200-distilled-600M
        translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
            device: 'webgpu', // Fallback to wasm handled by library
        } as any);
        console.log('Translation model loaded');
    }
    return translator;
}

// OCR function
// Worker cache to reuse workers and support offline better (re-initialization needs network if not cached)
const workerCache: Record<string, Tesseract.Worker> = {};

async function performOCR(imageUrl: string, lang: string) {
    console.log(`Performing OCR for ${lang}...`);

    // access global Tesseract
    if (!workerCache[lang]) {
        console.log(`Creating new worker for ${lang}...`);
        try {
            const worker = await Tesseract.createWorker(lang);
            workerCache[lang] = worker;
        } catch (err) {
            if (!navigator.onLine) {
                throw new Error(`Offline: Cannot download ${lang} language data. Please connect to internet for the first run.`);
            }
            throw err;
        }
    }

    const worker = workerCache[lang];
    const ret = await worker.recognize(imageUrl);
    // Do not terminate worker to allow reuse
    return ret.data.text;
}

chrome.runtime.onMessage.addListener((message: any, _sender: chrome.runtime.MessageSender, _sendResponse: (response?: any) => void) => {
    if (message.action === 'TRANSLATE') {
        (async () => {
            try {
                console.log('Translation requested:', message);
                const model = await loadTranslationModel();
                const output = await model(message.text, {
                    src_lang: message.sourceLang, // e.g., 'eng_Latn'
                    tgt_lang: message.targetLang, // e.g., 'hin_Deva'
                });
                console.log('Translation result:', output);
                chrome.runtime.sendMessage({
                    action: 'TRANSLATION_RESULT',
                    data: output,
                    original: message.text
                });
            } catch (err) {
                console.error('Translation error:', err);
                chrome.runtime.sendMessage({
                    action: 'TRANSLATION_ERROR',
                    error: err instanceof Error ? err.message : 'Translation failed'
                });
            }
        })();
    } else if (message.action === 'OCR') {
        (async () => {
            try {
                console.log('OCR requested:', message);
                const text = await performOCR(message.imageUrl, message.lang);
                console.log('OCR result:', text);
                chrome.runtime.sendMessage({
                    action: 'OCR_RESULT',
                    text: text
                });
            } catch (err) {
                console.error('OCR error:', err);
                chrome.runtime.sendMessage({
                    action: 'OCR_ERROR',
                    error: err instanceof Error ? err.message : 'OCR failed'
                });
            }
        })();
    }
    return true;
});
