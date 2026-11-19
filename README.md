# Anomaly Intelligence website

The public site at https://anomalyintelligence.app, hosted by GitHub Pages from `main`.

The landing page is plain HTML, CSS and JavaScript. Support and privacy remain Markdown pages, rendered by GitHub Pages with the shared `_layouts/policy.html` layout. Their published text is preserved.

## Local preview

```sh
npm ci
npm run build
npm run check
npm run preview
```

Open http://127.0.0.1:4173. The local build renders the same policy template and Markdown without requiring Ruby. `dist/` is a local preview output; GitHub Pages builds the tracked source directly.

The build generates the self-hosted App Store QR code. Checks decode its destination, verify the published SVG, check internal links and protect the policy/support text. The interactive sensor panel is explicitly illustrative and never accesses microphones, sensors or user data. Fonts, images and QR artwork are served locally without third-party asset services.
