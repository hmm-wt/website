# Self-hosted fonts

Installed and served from `/fonts/` per `src/styles/tokens.css`. No third-party font requests at runtime.

| File | Family | Weight | Source |
|---|---|---|---|
| IBMPlexMono-Regular.woff2 | IBM Plex Mono | 400 | github.com/IBM/plex |
| IBMPlexMono-Medium.woff2 | IBM Plex Mono | 500 | github.com/IBM/plex |
| DMSans-VariableFont.woff2 | DM Sans | 100–1000 (variable) | fonts.gstatic.com/s/dmsans/v17 (latin subset) |
| InstrumentSerif-Regular.woff2 | Instrument Serif | 400 | fonts.gstatic.com/s/instrumentserif/v5 (latin subset) |
| InstrumentSerif-Italic.woff2 | Instrument Serif | 400 italic | fonts.gstatic.com/s/instrumentserif/v5 (latin subset) |

Total payload ~170KB. All five are preloaded for the first paint via `Base.astro`.

## Refresh

Re-download from the same upstream URLs when Google Fonts bumps a version (check `v17` / `v5` in URL). Bump the version in tokens.css `src:` if you cache-bust.
