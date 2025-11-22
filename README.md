# Netra: Indic Lens 🔍

A local-first Chrome Extension for real-time OCR and Translation of screen content, supporting English, Hindi, Marathi, and Tamil - **entirely offline**.

## 🎨 Design System

**NeoBrutalism + Flexoki** - A bold, high-contrast design with warm, inky colors:
- **Base**: `#FFFCF0` (Paper White)
- **Primary**: `#BC5215` (Flexoki Orange)
- **Success**: `#66800B` (Flexoki Green)
- **Error**: `#AF3029` (Flexoki Red)
- **Hard shadows**: `4px 4px 0px 0px #100F0F`
- **Bold borders**: `2px solid #100F0F`

## 🏗️ Architecture

### Core Stack
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** (v3) for styling
- **CRXJS** for Chrome Extension build
- **Tesseract.js** (WASM) for OCR
- **Transformers.js** with NLLB-200-distilled-600M for translation

### Components
- **Popup UI** (`src/App.tsx`) - Dashboard to control the extension
- **Content Script** (`src/content/index.tsx`) - Shadow DOM overlay for translations
- **Background Script** (`src/background/index.ts`) - Service worker orchestration
- **Offscreen Document** (`src/offscreen/`) - Heavy ML/OCR processing

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

### Loading in Chrome

1. **Build the extension** (if not already done):
   ```bash
   npm run build
   ```

2. **Open Chrome Extensions page**:
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right)

3. **Load the extension**:
   - Click **"Load unpacked"**
   - Select the `dist` folder from this project

4. **Verify installation**:
   - You should see "Netra: Indic Lens" in your extensions
   - Click the extension icon to open the popup

### Development Mode

```bash
# Run in development mode with hot reload
npm run dev
```

Then load the extension from the `dist` folder as described above. Changes will auto-reload.

## 🧪 Testing the Extension

### 1. **Check Popup UI**
- Click the extension icon in Chrome toolbar
- You should see the NeoBrutalist UI with:
  - NETRA header with eye icon
  - Power button to toggle LENS ACTIVE/INACTIVE
  - Language selection dropdowns (English ↔ Hindi/Marathi/Tamil)
  - Recent translations history panel

### 2. **Test Basic Functionality**
- Toggle the power button - it should change state and color
- Change language selections - they should persist

### 3. **Check Console Logs**
- Right-click the extension popup → **Inspect**
- Open **Console** tab
- Look for: `"Netra: Offscreen script loaded"`

### 4. **Verify Background Script**
- Go to `chrome://extensions/`
- Find "Netra: Indic Lens"
- Click **"Service Worker"** link
- Console should show: `"Netra: Indic Lens Background Service Worker running"`

## 📁 Project Structure

```
d:/Netra Indic Lens/
├── manifest.json              # Chrome Extension manifest (V3)
├── vite.config.ts            # Vite + CRXJS configuration
├── tailwind.config.js        # Flexoki colors + NeoBrutalist shadows
├── postcss.config.js         # PostCSS configuration
├── src/
│   ├── App.tsx               # Popup UI (main dashboard)
│   ├── index.css             # Global styles + Tailwind
│   ├── main.tsx              # React entry point
│   ├── background/
│   │   └── index.ts          # Background service worker
│   ├── content/
│   │   └── index.tsx         # Content script with Shadow DOM
│   ├── offscreen/
│   │   ├── offscreen.html    # Offscreen document HTML
│   │   └── index.ts          # OCR + Translation logic
│   └── lib/                  # Utility functions (future)
└── dist/                     # Build output (load this in Chrome)
```

## 🔧 Current Status

### ✅ Implemented
- [x] Project setup with Vite + React + TypeScript
- [x] Chrome Extension manifest V3
- [x] NeoBrutalist + Flexoki design system
- [x] Popup UI with language selection
- [x] Background service worker
- [x] Offscreen document for ML processing
- [x] Content script with Shadow DOM
- [x] Tesseract.js integration (OCR engine)
- [x] Transformers.js integration (NLLB-200 translation model)

### 🚧 To Be Implemented
- [ ] Screen capture functionality (`chrome.desktopCapture`)
- [ ] Crop selector UI for region selection
- [ ] OCR processing pipeline
- [ ] Translation overlay rendering
- [ ] History persistence
- [ ] Tesseract traineddata files (Hindi, Marathi, Tamil)
- [ ] Performance optimization (throttling, Web Workers)

## 🎯 Next Steps

1. **Implement Screen Capture**:
   - Add `chrome.desktopCapture` API calls
   - Create crop selector UI overlay

2. **OCR Pipeline**:
   - Load Tesseract traineddata files for Indic languages
   - Process captured screen regions

3. **Translation Pipeline**:
   - Connect OCR output to NLLB-200 model
   - Render translated text in overlay boxes

4. **Performance**:
   - Move OCR to Web Worker
   - Throttle processing to 1-2 seconds
   - Optimize model loading

## 📝 Commands Reference

```bash
# Install dependencies
npm install

# Development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔒 Privacy

- **100% Local Processing** - No data leaves your device
- **Offline-First** - Works without internet (after initial model download)
- **No External APIs** - All OCR and translation happens in-browser

## 📦 Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CRXJS** - Chrome Extension build plugin
- **Tailwind CSS v3** - Utility-first CSS
- **Tesseract.js v6** - OCR engine (WASM)
- **Transformers.js** - In-browser ML models
- **NLLB-200-distilled-600M** - Translation model
- **Lucide React** - Icon library

## 🐛 Troubleshooting

### Extension not loading?
- Make sure you built the project: `npm run build`
- Load the `dist` folder, not the root folder
- Check Chrome console for errors

### Popup not showing?
- Verify the extension is enabled in `chrome://extensions/`
- Try reloading the extension

### Models not loading?
- First run requires internet to download models (~300MB)
- Check browser console for download progress
- Models are cached after first download

---

**Built with ❤️ for Indic Language Support**
