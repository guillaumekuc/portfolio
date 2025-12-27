# Deployment Guide - External Asset Hosting

This guide explains how to deploy your portfolio to GitHub while hosting heavy assets externally on OVH.

## Overview

Heavy assets (audio, video, and large images) are excluded from the Git repository and should be hosted on your OVH server. The codebase uses a configuration system to point to external asset URLs.

## What's Excluded from Git

The following files are excluded via `.gitignore`:
- `public/sound/*.mp3` - All audio files
- `public/vid/**/*.mp4` - All video files  
- `public/img/portfolio/*.jpg` - Large portfolio images
- `public/img/guillaumekuc_*.jpg` - Large background images
- `src/source-assets/*.psd` - Source PSD files

**Small assets (SVGs, small PNGs, etc.) remain in the repository.**

## Setup Steps

### 1. Upload Assets to OVH

Upload the excluded files to your OVH server, maintaining the same directory structure:

```
your-ovh-domain.com/
├── sound/
│   ├── bgmusic.mp3
│   ├── bgmusic2.mp3
│   ├── MallowHazard.mp3
│   └── ... (all other .mp3 files)
├── vid/
│   ├── guillaumekuc_gridzDemo.mp4
│   ├── guillaumekuc_Demoguitar.mp4
│   ├── anim/
│   │   ├── guillaumekuc_encyclo2_XLQ.mp4
│   │   ├── guillaumekuc_encyclo2cover.jpg
│   │   └── ... (all other anim files)
│   └── mode/
│       ├── guillaumekuc_guitar2_XLQ.mp4
│       └── ... (all other mode files)
└── img/
    ├── portfolio/
    │   ├── guillaumekuc_Astur_M.jpg
    │   ├── guillaumekuc_EmpireKeshe_M.jpg
    │   └── ... (all other portfolio images)
    └── guillaumekuc_*.jpg (background images)
```

**Important:** Maintain the exact same folder structure as in your `public/` directory.

### 2. Configure Asset Base URL

Edit `src/config/assets.json` and set your OVH base URL:

```json
{
	"baseUrl": "https://your-ovh-domain.com"
}
```

**For local development:** Leave `baseUrl` as an empty string `""` to use local files.

**For production:** Set `baseUrl` to your OVH domain (e.g., `"https://assets.yourdomain.com"` or `"https://yourdomain.com"`).

### 3. Verify CORS Settings (if using a subdomain)

If your assets are on a different domain/subdomain than your website, ensure CORS headers are properly configured on OVH to allow your website domain to access the assets.

### 4. Test Locally

1. **With local assets (baseUrl = ""):**
   ```bash
   npm run dev
   ```
   The site should work normally using local files.

2. **With external assets:**
   - Set `baseUrl` in `assets.json` to your OVH URL
   - Run `npm run dev`
   - Verify all assets load correctly from OVH

### 5. Build and Deploy

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub:**
   ```bash
   git add .
   git commit -m "Configure external asset hosting"
   git push origin main
   ```

3. **Deploy the built site:**
   - The `dist/` folder contains your production build
   - Deploy this to your hosting (GitHub Pages, Netlify, Vercel, etc.)
   - Make sure `assets.json` has the correct `baseUrl` for production

## How It Works

The asset system uses a simple `getAssetUrl()` function in `src/utils/assets.js` that:
- Returns the original path if `baseUrl` is empty (local development)
- Prepends `baseUrl` to paths starting with `/sound/`, `/vid/`, `/img/portfolio/`, or `/img/guillaumekuc_` (production)
- Leaves other paths unchanged (small assets like SVGs stay local)

All components automatically use this function, so you only need to set `baseUrl` in one place.

## Troubleshooting

### Assets not loading in production

1. **Check `assets.json`:**
   - Verify `baseUrl` is set correctly
   - Ensure no trailing slash in `baseUrl`
   - Check that paths match your OVH directory structure

2. **Check OVH file structure:**
   - Verify files are uploaded to correct paths
   - Check file permissions (should be readable)
   - Test direct URL access (e.g., `https://your-ovh-domain.com/sound/bgmusic.mp3`)

3. **Check browser console:**
   - Look for 404 errors
   - Check CORS errors (if using different domain)
   - Verify network tab shows correct URLs

### Assets loading locally but not from OVH

- Verify OVH server is accessible
- Check OVH file paths match exactly (case-sensitive)
- Ensure HTTPS/HTTP matches your configuration

## Development Workflow

1. **Local development:** Keep `baseUrl: ""` in `assets.json`
2. **Before deploying:** Update `baseUrl` to your OVH URL
3. **After deploying:** Test production site to verify assets load

You can also use environment variables or build scripts to automatically set the baseUrl based on the environment, but the current setup requires manual configuration.

## File Structure Reference

```
portfolio/
├── src/
│   ├── config/
│   │   └── assets.json          ← Configure baseUrl here
│   └── utils/
│       └── assets.js            ← Asset URL resolver
├── public/                      ← Local assets (excluded from Git)
│   ├── sound/                   ← Upload to OVH: /sound/
│   ├── vid/                     ← Upload to OVH: /vid/
│   └── img/
│       ├── portfolio/           ← Upload to OVH: /img/portfolio/
│       └── guillaumekuc_*.jpg   ← Upload to OVH: /img/
└── .gitignore                   ← Excludes heavy assets
```

## Next Steps

1. ✅ Upload assets to OVH
2. ✅ Update `src/config/assets.json` with your OVH base URL
3. ✅ Test locally with external assets
4. ✅ Build and deploy to GitHub
5. ✅ Deploy built site to hosting platform

