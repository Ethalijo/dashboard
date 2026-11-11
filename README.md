# UAE Transport — Vercel-ready mobile prototype

A Next.js mobile-first conversion of the Google Colab/Gradio usability prototype.

## Features
- Small header and demo credits balance
- Teal digital transport card
- Transparent 60% journey progress bar
- Horizontally scrollable, icon-only saved locations
- White top-up panel with three preset amounts and a working simulated balance
- Horizontally scrollable coupons
- Bottom Dashboard/Maps navigation
- Interactive Leaflet/OpenStreetMap map showing four illustrative Dubai locations

**This is a demo. No actual payments, stored accounts, transport availability, real routes or tickets. Balance is kept only during the open app session.**

## Run locally
1. Install Node.js 20.9 or newer.
2. Run `npm install` in the project folder.
3. Run `npm run dev`.
4. Open http://localhost:3000.

## Deploy to Vercel
1. Upload this extracted project folder to a GitHub repository (place `package.json` at the repository root).
2. In https://vercel.com/new choose **Import Git Repository** and select that repository.
3. Keep Framework Preset **Next.js**, then click **Deploy**.

No environment variables are required. The map needs an internet connection to load OpenStreetMap tiles.

## Project structure
- `app/page.jsx` — dashboard, top up, coupons, navigation
- `app/globals.css` — white/teal mobile styling
- `components/TransportMap.jsx` — interactive map
- `app/layout.jsx` — app wrapper
