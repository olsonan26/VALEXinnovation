> Historical handoff before publication. This website now lives independently at https://github.com/olsonan26/VALEXinnovation with its runnable files at the repository root. Use the root README for current build and hosting instructions; the marketing/ paths below describe the original development location.

# VALEX-innoVAtion standalone website — 10 October 2026

## Request and scope

The user requested a professionally designed, descriptive HR marketing website with real software screenshots and 3D aspects. They specified that it must be its **own site**, separate from the software, with a demo for now. The latest steering names the software **VALEX-innoVAtion** and asks for a visual explanation plus an actual **you and one other person** proof of concept.

Work is in the dedicated `STAFFprofiler` repository on `main`. Starting commit: `79ea7e1`. The existing production app and its build files have not been changed. No remote publication or new hosting project has been performed.

## Delivered structure

- `marketing/`: independently buildable website; preview http://127.0.0.1:4190/.
- `marketing/index.html`, `site.css`, `site.js`: branded page, real screenshots, descriptive use cases, psychology-informed conversation practices, 3D projected orbit, perspective layers, product tabs, screenshot enlargement, four-step guided walkthrough, mobile navigation and FAQs.
- `marketing/proof.js`, `demo-model.js`: real two-profile browser-local comparison and field validation.
- `marketing/lib/`: unchanged copies of the production comparison model and compiled calculation engine. All client imports remain inside the marketing directory, with no app connection.
- `marketing/build.mjs`, `server.mjs`, `package.json`, `vercel.json`: independent twelve-file build, preview and separate deployment configuration. Use Root Directory **marketing** for a future separate project; keep the app's existing hosting root unchanged.
- `tests/fixtures/marketing-capture.html` and `.js`: in-memory fictional capture fixture using the actual production screen renderers. Excluded from both published builds.
- Four real software captures under `marketing/assets/screenshots/`. Current app branding is preserved in them and explained on the website.

The proof of concept compares A→B and B→A, presenting overall, weighted full-name and weighted everyday-name results. It defaults a blank everyday name to the full name. It uses the exact existing model; it does not reinterpret the scores as psychological measurements, stress levels, hiring suitability or probabilities. Data is never persisted or transmitted. Clear details and reload remove inputs. A changed name or date immediately removes stale results.

## Verification

The existing app passes `npm run check`, all **119** tests, `npm run build` (35 static files) and `git diff --check`. The separate website passes its syntax check, **8** model/parity/input-validation tests and its independent twelve-file build.

Browser verification on the production marketing build confirmed:

- Fictional pair: Amelia Rose Morgan / Amelia Morgan, 1 February 1970; Oliver James Lewis / Oliver Lewis, 12 July 1985.
- A→B: overall **69.5%**, full name **78.7%**, everyday name **82.0%**. B→A: overall **71.2%**, full name **80.3%**, everyday name **73.8%**. Unrounded values feed bar widths.
- Clearing a date removes old results immediately. Unsupported markup receives a field-specific error, and the field gets focus.
- Clear details works; demo input never enters the URL.
- Product tab mouse interaction and ArrowRight selection work; screenshot enlargement and Escape dismissal work.
- All four walkthrough steps, Previous/Next, completion and focus return work.
- Mobile menu opens, anchor selection closes it, and results stack at phone width.
- No document horizontal overflow at effective CSS widths **375**, **768**, **1024** and **1440**. Browser viewport settings are affected by the desktop's 90% zoom; measurements use actual `innerWidth` and `clientWidth`.
- Reloading cleared all six input fields and the result. History restoration also clears the form on `pageshow`.
- No browser console errors or warnings in the inspected run.
- The website's rendered copy contains none of the terminology the user asked to omit.

Evidence screenshots are in `docs/valex-proof-concept-desktop.jpg` and `docs/valex-proof-concept-mobile.jpg`; final homepage evidence is `docs/valex-home-desktop.jpg`.

## Continuation

Finish any visual refinements in `marketing/`, run its checks/build and reload the preview. Keep the software scoring, app files and company data untouched unless a later request explicitly changes that scope. The site uses the new VALEX-innoVAtion name; the underlying software is still branded Staff Profiler. Obtain a real booking destination only when the user is ready to replace the on-site demos. A future public deployment needs a separate project/domain, not replacement of the current software deployment.
