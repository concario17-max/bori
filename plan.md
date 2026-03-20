# 3SIN Fix Plan

## Status

All planned workstreams from the earlier research pass are now complete.

## Completed Workstreams

### [x] A. Encoding and Text Integrity Audit

Completed:
- restored intended Korean-facing labels and copy in actively used UI files
- corrected the page title in `index.html`
- corrected parser string logic for compact chapter labels and opening chapter merge
- corrected the `ReadingHeader` separator glyph
- refreshed visible documentation text in `README.md`

Notes:
- terminal output on this machine can still display UTF-8 Korean as mojibake in some cases
- browser/build behavior is the more reliable source of truth here

### [x] B. Parser Cleanup and Data Contract Hardening

Completed:
- split parser core into `src/lib/parseThreeBodiesCore.js`
- kept `src/lib/parseThreeBodies.js` as the Vite raw-import adapter layer
- removed legacy `buildPrayerData()` / `flattenVerses()` exports
- made parser helpers directly testable
- moved active paragraph restore logic into `src/lib/readingState.js`
- moved chapter parsing off module-level constants and into `useMemo` in `TextPage`

### [x] C. Audio Layer Decision and Cleanup

Decision:
- audio is out of scope for the shipped UI in this repo

Completed:
- removed placeholder audio hook and formatting util
- removed hidden audio UI branch from the main reading flow
- removed dead `AudioPill` component

### [x] D. Unused State and Dead Feature Branch Cleanup

Completed:
- removed unused context state:
  - `isCompendiumOpen`
  - `isLexiconOpen`
- removed dead sidebar components:
  - `NoteEditor.jsx`
  - `ReflectionActions.jsx`
- simplified context contract to the state actually used by the app

### [x] E. Reading Component Contract Cleanup

Completed:
- simplified `TranslationSection` to the current real data model
- kept pronunciation support in the UI contract but aligned it with actual parser output
- removed unused `title` / `chapterTitle` prop passing into `ReadingHeader`
- updated commentary text to clean Korean-facing copy

### [x] F. Desktop/Mobile Layout Regression Pass

Completed:
- preserved the reusable desktop frame model
- kept mobile drawers separate from desktop geometry
- retained header alignment against the desktop frame
- re-ran build and typecheck after the cleanup

### [x] G. Testing and Verification

Completed:
- added `typecheck` script using TypeScript `checkJs`
- added `tsconfig.json`
- added `src/types.d.ts` and `src/globals.d.ts`
- added deterministic test runner script: `tests/run-tests.js`
- added automated checks for:
  - desktop frame mappings
  - parser counts
  - TOC normalization
  - flattened paragraph count
  - stored active paragraph restore behavior

Verification commands now passing:

```powershell
npm test
npm run typecheck
npm run build
```

### [x] H. Documentation Refresh

Completed:
- rewrote `README.md` to match the current app
- refreshed `research.md` to reflect the cleaned architecture and current conclusions
- updated this plan document to show completed status

## Final Notes

The app is now in a cleaner state than at the time of the original research:

- parser responsibilities are separated
- dead code has been removed
- placeholder audio has been removed
- UI context is leaner
- build, test, and typecheck all pass
- the main remaining caution is terminal-side mojibake when inspecting UTF-8 text in PowerShell, which does not necessarily mean the source files themselves are corrupted
