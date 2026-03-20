# 3SIN Research Report

## Overview

`3SIN` is a single-page Vite + React reading application for `밀교의 성불 원리(因位三身行相明燈論)`.

It has:

- no router
- no backend
- no remote API
- no database

Everything is driven from three bundled local text files:

- `1. 삼신 티벳-한글.txt`
- `2. 삼신 영어.txt`
- `3. 삼신 목차.txt`

The app parses those files at runtime into chapters and paragraphs, then renders a reading UI with:

- left chapter/paragraph navigation
- center reading column
- right commentary panel
- persistent dark mode
- persistent last-read paragraph
- responsive desktop/mobile panel behavior

## Architecture

### Entry and shell

- `src/main.jsx`
  - mounts the app under `#root`
  - throws if the root element is missing

- `src/App.jsx`
  - wraps the page in `UIProvider`

- `src/pages/TextPage.jsx`
  - composes the full reading experience
  - owns active paragraph state
  - computes desktop frame columns from UI context
  - renders:
    - `Header`
    - `LeftSidebar`
    - `ReadingPanel`
    - `RightSidebar`
    inside `AppShell`

### Layout system

- `src/components/ui/desktopFrame.js`
  - single source of truth for desktop ratios
  - states:
    - `20 / 60 / 20`
    - `0 / 60 / 40`
    - `20 / 80 / 0`
    - `0 / 100 / 0`

- `src/components/ui/AppShell.jsx`
  - outer frame
  - hosts header, left panel, main scroll container, right panel
  - binds `--desktop-frame-columns`

- `src/components/ui/SidebarLayout.jsx`
  - shared left/right panel shell
  - separates mobile drawer translation from desktop panel geometry
  - this is important for avoiding fake desktop gaps

### UI state

- `src/context/UIContext.jsx`
  - manages:
    - mobile left drawer
    - mobile right drawer
    - desktop left panel
    - desktop right panel
    - dark mode
  - persists:
    - `three-body-theme`
    - `three-body-desktop-sidebar`
    - `three-body-desktop-right-panel`

### Data layer

- `src/lib/parseThreeBodiesCore.js`
  - pure parser helpers
  - testable without Vite raw imports

- `src/lib/parseThreeBodies.js`
  - adapter layer
  - imports the three raw text files and feeds them into the parser core

- `src/lib/readingState.js`
  - pure restore helper for persisted active paragraph ids

## Data Model

The parser produces chapter objects of the form:

```js
{
  id: "1",
  chapterName: "1장",
  title: "제1장 죽음(死有)의 은멸차제",
  paragraphs: [
    {
      id: "1.1",
      title: "Paragraph 1",
      paragraphNumber: 1,
      chapterTitle: "제1장 죽음(死有)의 은멸차제",
      text: {
        tibetan: "...",
        pronunciation: "",
        english: "...",
        korean: "..."
      }
    }
  ]
}
```

Important parser behavior:

- the opening `귀의의 찬시` section is merged into chapter 1
- sidebar chapter labels are compacted from `제1장` to `1장`
- Tibetan/Korean and English sources are matched by paragraph number

Observed counts:

- Korean/Tibetan entries: `168`
- English entries: `168`
- final chapter count after TOC normalization: `4`
- flattened paragraph count: `168`

## Current UI Behavior

### Header

- top fixed header
- mobile: flex row
- desktop: aligned to the same frame model as the reading layout
- controls:
  - chapter menu toggle
  - commentary toggle
  - theme toggle

### Left sidebar

- mobile: drawer
- desktop: panel column in the shared frame
- supports:
  - chapter list
  - per-chapter paragraph list
  - active paragraph highlight

### Reading column

- shows:
  - reading header
  - Tibetan section
  - translations
  - previous/next navigation

Audio is no longer part of the shipped UI.

### Right sidebar

- mobile: commentary drawer
- desktop: commentary panel
- shows:
  - reading lens
  - Tibetan anchor
  - English reference
  - Korean reference

## Persistence

The app remembers:

- dark mode
- desktop left panel state
- desktop right panel state
- active paragraph id

Active paragraph keys:

- primary: `three_body_active_verse`
- legacy fallback: `tibet_active_verse`

The restore path is defensive:

- invalid JSON falls back safely
- stale ids fall back safely
- only paragraph ids are stored, not full paragraph objects

## Cleanup Completed

Compared with the earlier state of the repo, the following cleanup has now been implemented:

- removed dead audio placeholder code
- removed unused note/reflection sidebar components
- removed unused context branches
- removed legacy parser aliases tied to old naming
- split parser core from Vite raw-import adapter
- added automated verification
- added repeatable typecheck support

## Verification State

The repository now has working validation commands:

```powershell
npm test
npm run typecheck
npm run build
```

These currently pass.

What is covered:

- desktop frame mapping
- parser counts and normalized TOC behavior
- flattened paragraph count
- active paragraph restore fallback behavior

## Remaining Caveat

PowerShell on this machine can still display UTF-8 Korean as mojibake in terminal output.

That is a tooling/display concern, not automatically proof of source-file corruption.
The more reliable checks are:

- browser rendering
- build success
- parser output
- file content inspected in a UTF-8-safe editor

## File Role Map

### Core

- `src/main.jsx`
- `src/App.jsx`
- `src/pages/TextPage.jsx`

### Data

- `src/lib/parseThreeBodiesCore.js`
- `src/lib/parseThreeBodies.js`
- `src/lib/readingState.js`

### State

- `src/context/UIContext.jsx`

### Shared layout

- `src/components/ui/desktopFrame.js`
- `src/components/ui/AppShell.jsx`
- `src/components/ui/SidebarLayout.jsx`

### Reading UI

- `src/components/Header.jsx`
- `src/pages/components/LeftSidebar.jsx`
- `src/pages/components/ReadingPanel.jsx`
- `src/pages/components/RightSidebar.jsx`
- `src/components/Reading/ReadingHeader.jsx`
- `src/components/Reading/TibetanSection.jsx`
- `src/components/Reading/TranslationSection.jsx`
- `src/components/Reading/NavigationPill.jsx`

### Sidebar UI

- `src/components/Sidebar/SidebarHeader.jsx`
- `src/components/Sidebar/SidebarChapterList.jsx`
- `src/components/Sidebar/SidebarVerseList.jsx`
- `src/components/Sidebar/ChapterButton.jsx`
- `src/components/Sidebar/ChapterGroup.jsx`

### Typing and checks

- `src/types.d.ts`
- `src/globals.d.ts`
- `tsconfig.json`
- `tests/run-tests.js`
