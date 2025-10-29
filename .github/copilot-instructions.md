<!-- Project-specific instructions for AI coding agents. Keep this concise and actionable. -->
# PAV Asset Verification — Copilot instructions

Goal: Help an AI agent become productive quickly by describing architecture, key flows, conventions, and exact commands.

- Project type: React single-page app created with Create React App. Entry: `src/index.js`, root component `src/App.jsx`.
- State and data flow: global app state is provided by `src/context/AssetContext.jsx`. Assets are persisted to `localStorage` under key `pav_assets`.
- Main UI components: `src/components/UploadForm.jsx` (file parsing + normalization), `src/components/AssetTable.jsx` (display, filter, edit), `src/components/EditModal.jsx` (modal edits), `src/components/DownloadButton.jsx` (exports XLSX/CSV).

Important patterns and conventions (do not change lightly):

- Literal header keys: the app uses exact spreadsheet column names (for example the long key `PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)`). Keep these exact strings when mapping or accessing fields.
- Date normalization: `UploadForm` converts Excel numeric serials and Date objects into `yyyy-mm-dd` strings using `toJsDateFromPossibleExcel`. Preserve this behavior if you refactor parsing.
- Persistent storage: all edits call `setAssets(...)` and are saved to `localStorage` via `useEffect` inside `AssetContext`. Tests and patches should account for this side-effect.
- Validation rules are enforced in `AssetTable.jsx` (e.g., when `Asset Availability Remarks` is `Other` require `Comment`; when `Asset picked up by Disposal Vendor` require `Disposal Ticket`). Those rules are implemented inline — prefer editing there or in `EditModal.jsx` to keep UX consistent.

Build / dev / test commands (Windows/pwsh):

```
npm install
npm start
npm run build
npm test
```

Quick debugging tips:

- Sample test data is available in `test-data/` directory. Use `test-data/Rohil_Kohli_2025_10_17.xlsx` for manual testing.
- To reproduce a user-upload flow, run the app and use `src/components/UploadForm.jsx` UI to upload a small sample Excel/CSV. The code normalizes keys and dates — check `setAssets(normalized)` to see final shape.
- Local persistence: clear `localStorage.removeItem('pav_assets')` to reset app state during testing.
- If you need to inspect production bundle behavior, check `build/static/js/main.*.js` and `build/asset-manifest.json` after `npm run build`.

Files worth reading for implementation details:

- `src/context/AssetContext.jsx` — app-wide state and persistence
- `src/components/UploadForm.jsx` — XLSX parsing, date conversion, key normalization
- `src/components/AssetTable.jsx` — filtering, sorting, UI validation rules
- `src/components/EditModal.jsx` — editing UX and how edits are saved (matches AssetTable validations)

Examples to copy or extend:

- When adding a new spreadsheet field, mirror the pattern in `UploadForm.jsx`: add to `keys` array, provide a default, and ensure `AssetTable`/`EditModal` access the exact string key.
- When implementing client-side validation, follow the error tracking pattern in `AssetTable.jsx` (per-row `errors` object keyed by row index).

Constraints and integration points:

- There is no backend API; all data is local. Any server-backed changes must add an API layer and adjust `AssetContext` to fetch/save instead of using localStorage.
- The project uses MUI v5 for UI components — follow MUI theming patterns already present in `App.jsx`.

If anything here looks incomplete or you want additional examples (sample XLSX rows, expected JSON shape of `assets[]`, or tests demonstrating date parsing), ask and I will add them.
