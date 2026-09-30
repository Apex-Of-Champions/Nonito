# Nonito Molijon — engineering portfolio

Static HTML, CSS, and JavaScript. Open `index.html` directly, or serve this directory using any static server. No build step or animation framework is required.

## Structure

- `index.html`: semantic page content, existing links, and theme initialization.
- `css/style.css`: original design tokens and component foundation.
- `css/components.css`: visual refinements and responsive layouts.
- `css/animations.css`: entrances, reveals, and reduced-motion rules.
- `js/projects.js`: project case-study data.
- `js/main.js`: navigation, theme, modal lifecycle, project filters, architecture, and CLI.
- `js/animations.js`: bounded hero network, role rotation, reveals, and pointer effects.
- `assets/`: optimized WebP images and SVG favicon. Original images remain in the project root.
- `artifacts/`: browser screenshots.
- `verify.cjs`: local Chrome/CDP smoke checks using Node built-ins. Run `node verify.cjs` on Windows with Chrome installed; uses localhost ports 4173 and 9223. Creates a disposable `.browser-check` Chrome profile.

## Design and behavior

The existing dark AI/engineering identity, portrait, case studies, architecture diagram, capabilities, CLI Sandbox, experience, contact links, and light theme are retained. Changes add an editorial hero, restrained teal accents, consistent surfaces, responsive architecture nodes, project preview affordances, engineering considerations, keyboard-operable cards, modal focus isolation/restoration, active navigation, CLI shortcuts, favicon, and reduced-motion support.

Project outcomes and profile metrics are supplied content, not independently verified benchmarks. Engineering considerations describe constraints implied by the supplied architectures, not newly claimed implementation results.

## Performance

Seven displayed images were converted to WebP: 5,546,100 bytes → 776,036 bytes (86% smaller). Below-fold images load lazily, the portrait receives high fetch priority, and image dimensions reserve space. The network is capped at 48 particles, draws at approximately 30 fps, and pauses when the hero is offscreen or the document is hidden. Reduced motion disables decorative animation and role rotation. No new runtime dependencies were added.

## Validation

Chrome layout checks at 320, 390, 768, 1024, and 1440 pixels; no horizontal overflow. Interaction checks cover AI project filtering, keyboard modal opening, Escape/focus restoration, experience previews, architecture selection, CLI escaping and unknown commands, command shortcuts, mobile navigation, theme switching, and reduced-motion styling. JavaScript syntax checks pass. Browser results are smoke checks, not a complete accessibility audit or cross-browser certification.

## Before publishing

- Add a real résumé file and verified GitHub/repository or live-demo links when available.
- Set an absolute `og:image` URL and canonical URL once the production domain is known; the current OpenGraph image is a local asset reference.
- Supply measurement context for project metrics (dataset, test conditions, and dates).
- Consider self-hosting fonts, and check Safari/Firefox and real mobile devices.

The existing package manifest was left intact. Its Framer Motion dependency is not loaded by this vanilla site.
