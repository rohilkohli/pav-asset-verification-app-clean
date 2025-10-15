# PAV Asset Verification App

This is a small React single-page app for Physical Asset Verification (PAV).

Getting started

1. Install dependencies

```powershell
npm install
```

2. Start the dev server

```powershell
npm start
```

Notes

- Upload an Excel (.xlsx) or CSV via the Upload button.
- Use the Filter and Search controls to narrow results.
- Results are shown as cards; click Edit to open the modal and make changes.
- Changes are saved to localStorage automatically. Use the Download button to export the updated sheet.

If you want server-side persistence or pagination for large sheets, open an issue or request and I can scaffold a small API and wire it up.


Deploy to GitHub Pages
----------------------

This repository includes a GitHub Actions workflow that builds the app and publishes the `build` output to the `gh-pages` branch. To deploy the project to GitHub Pages under your account (username: `rohilkohli`), follow these steps locally:

1. Create a new remote repository on GitHub named `pav-asset-verification-app-clean` (or any name you prefer). If you use a different name, update the `homepage` field in `package.json`.

2. Push the local repo to GitHub (replace <your-email> and <your-name> accordingly).

If you prefer `main` as the primary branch:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/rohilkohli/pav-asset-verification-app-clean.git
git push -u origin main
```

If you prefer `master` as the primary branch (this repo's current branch):

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/rohilkohli/pav-asset-verification-app-clean.git
git push -u origin master
```

3. The GitHub Actions workflow will run on push to `main` or `master` and deploy to Pages automatically (the built site will be on `https://rohilkohli.github.io/pav-asset-verification-app-clean`).

4. If you prefer to deploy locally instead of using Actions, you can run:

```powershell
npm run deploy
```

This uses the `gh-pages` package and will push the `build` directory to the `gh-pages` branch.

Troubleshooting
---------------
- If the site doesn't appear, check the `Actions` tab in GitHub to see the `Deploy to GitHub Pages` workflow run status.
- Ensure the repository name matches the `homepage` value in `package.json`, or update `homepage` accordingly.

Security
--------
This project uses npm package overrides to address known security vulnerabilities. See [SECURITY.md](SECURITY.md) for details about resolved and known vulnerabilities. Run `npm audit` to check the current security status.
