# 🚨 IMPORTANT: Don't Use `npm run dev` for Chrome Extensions!

## ❌ What Went Wrong

You ran `npm run dev` which starts a **development server** for web apps. Chrome extensions **cannot** load from a dev server - they need static files.

The MIME type error happened because:
1. Dev server serves files differently than Chrome expects
2. Chrome extensions need pre-built JavaScript files
3. Module loading doesn't work the same way in extensions

## ✅ The Correct Workflow

### For Chrome Extensions, ALWAYS use:

```bash
# Build the extension
npm run build

# Then load the 'dist' folder in Chrome
```

**NEVER** use `npm run dev` for Chrome extensions!

## 🔧 Steps to Fix Right Now

### 1. Remove the Broken Extension
- Go to `chrome://extensions/`
- Find "Netra: Indic Lens"
- Click **"Remove"**

### 2. Load the Fresh Build
- I just rebuilt it for you ✅
- Click **"Load unpacked"**
- Select: `d:\Netra Indic Lens\dist`

### 3. Verify It Works
- Extension should show **"Enabled"**
- Service Worker should show **"Active"** (blue link)
- Click extension icon → Popup should open

## 📝 Development Workflow

When you want to make changes:

```bash
# 1. Edit files in src/
# (Edit App.tsx, content/index.tsx, etc.)

# 2. Build
npm run build

# 3. Reload extension in Chrome
# Go to chrome://extensions/ and click the refresh icon
```

## 🎯 Quick Test

After loading the extension:

1. **Click extension icon** → Should see NeoBrutalist popup
2. **Click "Service Worker"** → Console shows: `"Netra: Indic Lens Background Service Worker running"`
3. **Toggle power button** → Should work smoothly

## 💡 Why This Matters

- `npm run dev` = For testing web apps in browser
- `npm run build` = For Chrome extensions (creates static files)

Chrome extensions need **static, pre-built files** in the `dist` folder. The dev server doesn't work because Chrome has strict security policies for extensions.

## 🆘 Still Having Issues?

If you see any errors after following these steps, let me know and I'll help debug!
