import { useState, useEffect, useRef } from 'react';
import { Power, History, Languages, ScanEye, Upload, Type, Monitor, Globe } from 'lucide-react';

const LANG_MAP: Record<string, string> = {
  'eng_Latn': 'en',
  'hin_Deva': 'hi',
  'mar_Deva': 'mr',
  'tam_Taml': 'ta'
};

function App() {
  const [isActive, setIsActive] = useState(false);
  const [useOnline, setUseOnline] = useState(true);
  const [sourceLang, setSourceLang] = useState('eng_Latn');
  const [targetLang, setTargetLang] = useState('hin_Deva');
  const [history, setHistory] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load state from storage
    chrome.storage.local.get(['isActive', 'useOnline', 'sourceLang', 'targetLang', 'history'], (result) => {
      if (result.isActive !== undefined) setIsActive(Boolean(result.isActive));
      if (result.useOnline !== undefined) setUseOnline(Boolean(result.useOnline));
      if (result.sourceLang) setSourceLang(String(result.sourceLang));
      if (result.targetLang) setTargetLang(String(result.targetLang));
      if (result.history) setHistory(result.history as string[]);
    });

    // Listen for translation results
    const messageListener = (message: any) => {
      if (message.action === 'TRANSLATION_RESULT') {
        setIsProcessing(false);
        const translatedText = message.data?.[0]?.translation_text || JSON.stringify(message.data);
        setResult(translatedText);

        // Add to history
        const newHistory = [`${message.original} → ${translatedText}`, ...history].slice(0, 10);
        setHistory(newHistory);
        chrome.storage.local.set({ history: newHistory });
      } else if (message.action === 'OCR_RESULT') {
        setIsProcessing(false);
        setResult('OCR Result: ' + message.text);
      } else if (message.action === 'TRANSLATION_ERROR' || message.action === 'OCR_ERROR') {
        setIsProcessing(false);
        setResult('Error: ' + message.error);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [history]);

  const toggleActive = () => {
    const newState = !isActive;
    setIsActive(newState);
    chrome.storage.local.set({ isActive: newState });
    // Notify background/content
    chrome.runtime.sendMessage({ action: 'TOGGLE_ACTIVE', value: newState });
  };

  const toggleOnline = () => {
    const newState = !useOnline;
    setUseOnline(newState);
    chrome.storage.local.set({ useOnline: newState });
  };

  const handleLangChange = (type: 'source' | 'target', value: string) => {
    if (type === 'source') {
      setSourceLang(value);
      chrome.storage.local.set({ sourceLang: value });
    } else {
      setTargetLang(value);
      chrome.storage.local.set({ targetLang: value });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setResult('Processing image...');

    const reader = new FileReader();
    reader.onload = async () => {
      // TODO: Send to background for OCR processing
      setResult('OCR processing will be implemented here');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleTextTranslate = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setResult('Translating...');

    // Online Mode
    if (useOnline) {
      try {
        const source = LANG_MAP[sourceLang];
        const target = LANG_MAP[targetLang];
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(inputText)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        // data[0] is array of sentences, each [translated, original, ...]
        const translatedText = data[0].map((x: any) => x[0]).join('');

        setResult(translatedText);
        setIsProcessing(false);

        // Add to history
        const newHistory = [`${inputText} → ${translatedText}`, ...history].slice(0, 10);
        setHistory(newHistory);
        chrome.storage.local.set({ history: newHistory });
        return; // Success, don't use local
      } catch (e) {
        console.error("Online translation failed", e);
        setResult("Online translation failed, trying local model...");
        // Continue to local fallback
      }
    }

    try {
      // Send translation request to background script
      chrome.runtime.sendMessage({
        action: 'TRANSLATE',
        text: inputText,
        sourceLang: sourceLang,
        targetLang: targetLang
      }, (response) => {
        if (chrome.runtime.lastError) {
          setResult('Error: ' + chrome.runtime.lastError.message);
          setIsProcessing(false);
          return;
        }

        if (response?.success) {
          setResult('Local translation request sent. Processing...');
        } else {
          setResult('Failed to send translation request');
          setIsProcessing(false);
        }
      });
    } catch (error) {
      setResult('Error: ' + (error as Error).message);
      setIsProcessing(false);
    }
  };

  const handleScreenCapture = async () => {
    setIsProcessing(true);
    setResult('Requesting screen capture...');

    try {
      // Request screen capture
      chrome.runtime.sendMessage({ action: 'CAPTURE_SCREEN' }, (response) => {
        if (response?.success) {
          setResult('Screen captured! Processing...');
        } else {
          setResult('Screen capture failed');
        }
        setIsProcessing(false);
      });
    } catch (error) {
      setResult('Error: ' + (error as Error).message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-flexoki-base p-4 font-sans text-flexoki-text border-4 border-flexoki-text overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScanEye className="w-8 h-8 text-flexoki-primary" />
          <h1 className="text-2xl font-bold tracking-tighter">NETRA</h1>
        </div>
        <div className={`w-3 h-3 rounded-full border-2 border-flexoki-text shadow-neo-sm ${isActive ? 'bg-flexoki-success' : 'bg-gray-400'}`}></div>
      </header>

      {/* Main Action */}
      <div className="mb-4">
        <div className={`card flex flex-col items-center justify-center gap-3 py-3 transition-colors ${isActive ? 'bg-flexoki-surface' : 'bg-gray-200'}`}>
          <span className="font-bold text-sm">{isActive ? 'LENS ACTIVE' : 'LENS INACTIVE'}</span>
          <button
            onClick={toggleActive}
            className={`w-14 h-14 rounded-full border-2 border-flexoki-text flex items-center justify-center shadow-neo transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-sm ${isActive ? 'bg-flexoki-primary text-white' : 'bg-flexoki-base text-flexoki-text'}`}
          >
            <Power className="w-7 h-7" />
          </button>
        </div>
      </div>

      {/* Language Selection */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Languages className="w-4 h-4" />
            <span>Translation</span>
          </div>

          {/* Online Toggle */}
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-1 text-xs border border-flexoki-text px-2 py-0.5 rounded-full ${useOnline ? 'bg-flexoki-success text-white' : 'bg-gray-200 text-gray-500'}`}
          >
            <Globe className="w-3 h-3" />
            <span>{useOnline ? 'Online' : 'Offline'}</span>
          </button>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
          <select
            value={sourceLang}
            onChange={(e) => handleLangChange('source', e.target.value)}
            className="w-full bg-flexoki-base border-2 border-flexoki-text p-2 text-sm font-bold shadow-neo focus:outline-none"
          >
            <option value="eng_Latn">English</option>
            <option value="hin_Deva">Hindi</option>
            <option value="mar_Deva">Marathi</option>
            <option value="tam_Taml">Tamil</option>
          </select>

          <span className="font-bold text-lg">→</span>

          <select
            value={targetLang}
            onChange={(e) => handleLangChange('target', e.target.value)}
            className="w-full bg-flexoki-base border-2 border-flexoki-text p-2 text-sm font-bold shadow-neo focus:outline-none"
          >
            <option value="hin_Deva">Hindi</option>
            <option value="mar_Deva">Marathi</option>
            <option value="tam_Taml">Tamil</option>
            <option value="eng_Latn">English</option>
          </select>
        </div>
      </div>

      {/* Input Methods */}
      <div className="mb-4 space-y-3">
        <div className="font-bold text-sm">Input Method</div>

        {/* Text Input */}
        <div className="space-y-2">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type text here..."
            className="w-full h-20 bg-white border-2 border-flexoki-text p-2 text-sm shadow-neo-sm focus:outline-none resize-none"
          />
          <button
            onClick={handleTextTranslate}
            disabled={!inputText.trim() || isProcessing}
            className="w-full btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Type className="w-4 h-4" />
            Translate Text
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="btn-primary text-sm py-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>

          <button
            onClick={handleScreenCapture}
            disabled={isProcessing}
            className="btn-primary text-sm py-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Monitor className="w-4 h-4" />
            Capture Screen
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Result Display */}
      {result && (
        <div className="mb-4">
          <div className="font-bold text-sm mb-2">Result</div>
          <div className="bg-flexoki-yellow border-2 border-flexoki-text p-3 shadow-neo-sm">
            <p className="text-sm font-bold">{result}</p>
          </div>
        </div>
      )}

      {/* History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 font-bold text-sm mb-2">
          <History className="w-4 h-4" />
          <span>Recent</span>
        </div>
        <div className="flex-1 overflow-y-auto border-2 border-flexoki-text bg-white p-2 shadow-neo-sm max-h-32">
          {history.length === 0 ? (
            <p className="text-gray-400 text-center italic text-xs mt-2">No recent translations</p>
          ) : (
            <ul className="space-y-1">
              {history.map((item, i) => (
                <li key={i} className="text-xs border-b border-gray-200 pb-1 last:border-0">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
