# Assay landing page

Marketing site for Assay, the done-for-you AI reliability audit service.

## Source of truth

- Edit the React/Vite app in `app/`.
- GitHub Pages serves the generated static build from `docs/`.
- The root `index.html` is a legacy static snapshot and is not the deployed page.

## Local workflow

```bash
cd app
npm install
npm run dev
```

## Publish workflow

```bash
cd app
npm run build
```

The build writes to `../docs` via `app/vite.config.js`. Commit both the app
source changes and the regenerated `docs/` assets before sharing the public
GitHub Pages URL.

Contact email used by the live CTAs: `abhishekatm1@gmail.com`.
