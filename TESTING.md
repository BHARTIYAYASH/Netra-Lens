# Testing Guide for Netra: Indic Lens

## Quick Start Commands

### Build the Extension
```bash
npm run build
```

### Load in Chrome

1. Open Chrome browser
2. Navigate to: `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right)
4. Click **"Load unpacked"**
5. Select folder: `d:\Netra Indic Lens\dist`

## Verification Steps

### ✅ Step 1: Check Extension Loaded
- Extension should appear in `chrome://extensions/`
- Name: "Netra: Indic Lens"
- Version: 1.0.0
- Status: Enabled

### ✅ Step 2: Test Popup UI
- Click extension icon in Chrome toolbar
- Should see NeoBrutalist design:
  - Cream background (#FFFCF0)
  - Black borders (2px solid)
  - Orange power button (#BC5215)
  - Hard shadows (4px 4px)

### ✅ Step 3: Check Background Script
1. Go to `chrome://extensions/`
2. Find "Netra: Indic Lens"
3. Click **"Service Worker"** link
4. Console should show:
   ```
   Netra: Indic Lens Background Service Worker running
   ```

### ✅ Step 4: Check Offscreen Document
1. Right-click extension popup
2. Select **"Inspect"**
3. Open Console tab
4. Should see:
   ```
   Netra: Offscreen script loaded
   ```

### ✅ Step 5: Test UI Interactions
- Toggle power button (LENS ACTIVE/INACTIVE)
- Change source language dropdown
- Change target language dropdown
- Settings should persist when reopening popup

## Development Workflow

### Make Changes
```bash
# Edit files in src/
# Then rebuild:
npm run build
```

### Reload Extension
1. Go to `chrome://extensions/`
2. Click refresh icon on "Netra: Indic Lens"

### Development Mode (Hot Reload)
```bash
npm run dev
```
Then reload extension manually after changes.

## Troubleshooting

### Extension not appearing?
- Check you selected the `dist` folder, not root
- Verify `npm run build` completed successfully
- Look for errors in `chrome://extensions/`

### Popup not opening?
- Check extension is enabled
- Try removing and re-adding the extension
- Check browser console for errors

### Build errors?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Next: Implementing Features

The foundation is ready. Next steps:
1. Screen capture functionality
2. OCR processing
3. Translation overlay
4. Performance optimization
