Deployment instructions for GitHub Pages

1. Update package.json "homepage" with your GitHub username and repository name. For example:

   "homepage": "https://your-username.github.io/your-repo-name"

2. Install the gh-pages package (adds it locally):

   npm install --save-dev gh-pages

3. Commit your changes and push to GitHub (master/main branch or whatever branch you use for Pages):

   git add package.json README-deploy.md
   git commit -m "Add GitHub Pages deploy script"
   git push origin main

4. Deploy:

   npm run deploy

This will build the app and publish the contents of the `build` folder to gh-pages branch automatically.

Notes:
- If your repo uses `main` as the default branch, GitHub Pages will serve from the `gh-pages` branch by default when using this flow.
- Make sure repository settings allow GitHub Pages for the `gh-pages` branch.
- If you want to use a custom domain, add `CNAME` to the `public` folder before deploying and configure DNS appropriately.
