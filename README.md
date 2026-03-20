# 3SIN React Reader

`3SIN` is a Vite + React reading application for `밀교의 성불 원리(因位三身行相明燈論)`.

It reads three local text files at build time and turns them into a desktop/mobile reading interface with:

- left chapter navigation
- center reading column
- right commentary panel
- persistent dark mode
- persistent last-read paragraph
- responsive mobile drawers

## Source Text Files

The app bundles these three source files with Vite raw imports:

- `1. 삼신 티벳-한글.txt`
- `2. 삼신 영어.txt`
- `3. 삼신 목차.txt`

Their roles are:

- Tibetan and Korean source text
- English translation
- chapter/range metadata

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Run Locally

```powershell
cd C:\Users\roadsea\Desktop\3SIN
npm install
npm run dev
```

If PowerShell blocks `npm`, use:

```powershell
npm.cmd install
cmd /c npm run dev
```

## Scripts

```powershell
npm run dev
npm run build
npm run preview
npm run typecheck
npm test
```

## Layout Behavior

Desktop frame states:

- left open + right open: `20 / 60 / 20`
- left closed + right open: `0 / 60 / 40`
- left open + right closed: `20 / 80 / 0`
- left closed + right closed: `0 / 100 / 0`

Mobile behavior:

- left sidebar is a drawer
- right commentary panel is a drawer
- drawer animation is separate from desktop geometry

## Persistence

Local storage keys currently used:

- `three-body-theme`
- `three-body-desktop-sidebar`
- `three-body-desktop-right-panel`
- `three_body_active_verse`
- `tibet_active_verse` (legacy fallback only)

## Audio

Audio playback is currently out of scope for the shipped UI.

The old placeholder audio layer has been removed so the app no longer carries dead playback code paths.

## Main Files

- App entry: `src/main.jsx`
- Context/state: `src/context/UIContext.jsx`
- Shell/layout: `src/components/ui/AppShell.jsx`
- Header: `src/components/Header.jsx`
- Parser: `src/lib/parseThreeBodies.js`
- Page composition: `src/pages/TextPage.jsx`
