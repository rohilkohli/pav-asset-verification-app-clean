<!-- Project-specific instructions for AI coding agents. Keep this concise and actionable. -->
# PAV Asset Verification — Copilot instructions

Goal: Help an AI agent become productive quickly by describing architecture, key flows, conventions, and exact commands.

## Project Overview

- **Project type**: React single-page app created with Create React App. Entry: `src/index.js`, root component `src/App.jsx`.
- **State and data flow**: Global app state is provided by `src/context/AssetContext.jsx`. Assets are persisted to `localStorage` under key `pav_assets`.
- **Main UI components**: 
  - `src/components/UploadForm.jsx` — file parsing + normalization
  - `src/components/AssetTable.jsx` — display, filter, edit
  - `src/components/EditModal.jsx` — modal edits
  - `src/components/DownloadButton.jsx` — exports XLSX/CSV


## Important Patterns and Conventions

⚠️ **Do not change lightly:**

- **Literal header keys**: The app uses exact spreadsheet column names (for example the long key `PAV Date of visit (DD-MMM-YYYY i.e: 15-Mar-2021)`). Keep these exact strings when mapping or accessing fields.
- **Date normalization**: `UploadForm` converts Excel numeric serials and Date objects into `yyyy-mm-dd` strings using `toJsDateFromPossibleExcel`. Preserve this behavior if you refactor parsing.
- **Persistent storage**: All edits call `setAssets(...)` and are saved to `localStorage` via explicit `saveChanges()` call in `AssetContext`. Tests and patches should account for this side-effect.
- **Validation rules**: Enforced in `AssetTable.jsx` (e.g., when `Asset Availability Remarks` is `Other` require `Comment`; when `Asset picked up by Disposal Vendor` require `Disposal Ticket`). Those rules are implemented inline — prefer editing there or in `EditModal.jsx` to keep UX consistent.

## Development Commands

All commands work on Windows/PowerShell, macOS, and Linux:

```bash
npm install          # Install dependencies
npm start            # Start dev server (opens http://localhost:3000)
npm run build        # Create production build in ./build
npm test             # Run tests (Jest via react-scripts; currently no tests exist)
npm run deploy       # Deploy to gh-pages branch (requires gh-pages package)
```

**Note on testing**: The project uses Create React App's built-in Jest test runner. Currently, there are no test files, but you can add `.test.js` or `.test.jsx` files in the `src` directory to add tests.

**Note on build artifacts**: The `build/` directory is currently tracked in git for GitHub Pages deployment. When making changes, build artifacts will show as modified files.

**Note on linting**: Create React App includes ESLint automatically. It runs during development (`npm start`) and build (`npm run build`).

## Quick Debugging Tips

- To reproduce a user-upload flow, run the app and use `src/components/UploadForm.jsx` UI to upload a small sample Excel/CSV. The code normalizes keys and dates — check `setAssets(normalized)` to see final shape.
- Local persistence: clear `localStorage.removeItem('pav_assets')` to reset app state during testing.
- If you need to inspect production bundle behavior, check `build/static/js/main.*.js` and `build/asset-manifest.json` after `npm run build`.

## Key Files and Implementation Details

- `src/context/AssetContext.jsx` — app-wide state and persistence
- `src/components/UploadForm.jsx` — XLSX parsing, date conversion, key normalization
- `src/components/AssetTable.jsx` — filtering, sorting, UI validation rules
- `src/components/EditModal.jsx` — editing UX and how edits are saved (matches AssetTable validations)

## Examples to Copy or Extend

- When adding a new spreadsheet field, mirror the pattern in `UploadForm.jsx`: add to `keys` array, provide a default, and ensure `AssetTable`/`EditModal` access the exact string key.
- When implementing client-side validation, follow the error tracking pattern in `AssetTable.jsx` (per-row `errors` object keyed by row index).

## Constraints and Integration Points

- There is no backend API; all data is local. Any server-backed changes must add an API layer and adjust `AssetContext` to fetch/save instead of using localStorage.
- The project uses MUI v5 for UI components — follow MUI theming patterns already present in `App.jsx`.

## Deployment

The project uses GitHub Actions for automatic deployment:
- Workflow file: `.github/workflows/gh-pages.yml`
- Triggers on push to `main` or `master` branches
- Builds the app and deploys to `gh-pages` branch
- Live site: `https://rohilkohli.github.io/pav-asset-verification-app-clean`

For manual deployment, run `npm run deploy` (requires the `gh-pages` package).

---

If anything here looks incomplete or you want additional examples (sample XLSX rows, expected JSON shape of `assets[]`, or tests demonstrating date parsing), ask and I will add them.
