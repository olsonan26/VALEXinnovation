# Rebuild verification · 12 October 2026

Local production build, Node 22+ static preview, Codex in-app Chromium browser.

- `npm run check`: pass.
- `npm test`: 21 pass. Includes unchanged canonical hashes; bidirectional comparison fixtures; helper-body parity; all initial age boundaries; required first/last names; age/birthday alternatives; current-year PY/PYE; optional identity layers without dates; invalid dates; midnight schedule math; leap-day historical math; route links/IDs and genuine atlas geometry.
- `npm run build`: ten generated routes with local bundled dependencies, fonts and asset licences.
- Browser matrix: all ten routes at rendered document widths 320, 376, 769, 1025 and 1441 pixels; no horizontal page overflow. Additional wider/narrower overrides also passed. The browser's default zoom was accounted for when choosing viewport overrides.
- Personal flow: age-only sample, full birthday with derived age/current-year PY/PYE, scrubbing, maximum 40/60-character names at age 120, unsupported markup rejection and focused error, clearing entries.
- Preserved two-person fictional example: 69.5% and 71.2%; separate directions remain intact.
- Product flow: tab changes, expanded screenshot, guided tour next step, Escape close and opener focus handling.
- Science flow: hippocampus/amygdala selection and explanations; rotate/reset controls; static-view switch with active descriptions; auditory step changes; day/night presets and changed times; historical date changes and toggled curves.
- Contact: fictional business request rendered locally; mailto points to Valexinnovations@gmail.com with the expected subject/body. No test email sent. Download fallback is implemented; actual sending depends on the visitor's email application.
- Mobile navigation opens/closes; Escape returns focus. Inputs have labels and 16px text, dialogs contain scrolling, keyboard alternatives accompany canvas gestures, and reduced-motion handling is present in CSS and scene code.
- No website JavaScript console errors observed in these runs. All internal links, fragment targets and source assets pass the automated route check.

Screenshots: `before-home.jpg`, `after-home.jpg`, `after-explorer.jpg`. These are actual browser captures. The anatomical fallback is a screenshot of the same licensed geometry, not an invented illustration.

Payload checks: Three viewer bundle approximately 587KB raw / 150KB gzip; atlas JSON 5.49MB raw / 1.84MB gzip; CSS approximately 30KB / 7.2KB gzip; shared entry script approximately 4KB / 1.6KB gzip. The viewer and atlas are loaded when approaching the viewport. On-demand rendering, a 30fps movement cap, visibility pause and DPR cap are implemented. These numbers are file-size measurements, not Core Web Vitals or mobile GPU benchmarks.

Limitations: physical phones, Safari keyboard/safe-area behavior, live OS reduced-motion switching, complete screen-reader testing and hardware frame timing are not verified. No WCAG certification or Lighthouse score is claimed. The complete Gateway report remains unavailable at its original CIA link, disclosed in the research audit. Company backend/authentication and server-submitted inquiries are outside this standalone site.

This records local verification before production publication. The user subsequently authorised push, merge and live deployment. Production verification is recorded separately after publication.

## Company-conversation refinement

The revised homepage leads with the company proposition and real product showcase; the personal analyser follows the company demonstration near the end. The three rejected phrases are covered by a regression check. Rechecked all ten routes at document widths 320/376/769/1025/1441: 50 checks, no horizontal page overflow. Compact anatomy disclosure, region explanation, static/interactive switch and age/birthday results passed in the browser. No website console errors observed. `npm test` now passes 22 tests.

The light page interactions are bundled into the deferred shared entry. The 3D module remains lazy. This avoids a first-click race while downloading individual modules. The 3D model draws its first frame before removing the static fallback. Region leader lines use the current scene dimensions.

The source conversation was reviewed as company-provided material. Practical themes were incorporated; accuracy figures and endorsements were not treated as verified evidence. Dedicated science content remains available for interested visitors. `refined-home.jpg` records the updated local render.
