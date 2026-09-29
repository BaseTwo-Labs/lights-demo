# lights-demo

Static concept demo of the neon signs & print presentation website (Romanian, placeholder copy).

Plain HTML / CSS / JavaScript — no build step.

- `index.html` – page markup
- `styles.css` – styles, responsive rules, hover states
- `script.js` – interactions (dock nav, project filters & modal, quote form, cursor trail, map)
- `.nojekyll` – tells GitHub Pages to serve the files as-is (no Jekyll processing)

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Hosting

Published with GitHub Pages from the `main` branch, root folder:
https://basetwo-labs.github.io/lights-demo/

The page is marked `noindex` so the concept doesn't show up in search engines.

External services used: Google Fonts, Leaflet (cdnjs), Esri dark basemap tiles.
