# Staff Profiler marketing site

A standalone, static enterprise marketing and educational site. It contains no connection to the operational HR software or company records.

## Run and build

Use Node 22 or later. Install with `npm ci`. `npm run dev` builds and serves the site at http://127.0.0.1:4190/. `npm run build` generates `dist`; `npm run preview` serves an existing build. `npm run check` checks client/build syntax and `npm test` runs model, route and asset tests.

Vercel configuration uses `npm ci`, `npm run build`, and the `dist` output directory. Main is connected to production; approved merges publish the site automatically. Static hosting serves the generated directory routes with trailing slashes. No environment variables or hosted database are needed.

## Pages and experiences

Home, Platform, How It Works, Science, Organizations, Explorer, About, Contact, historical archive and anatomy provenance. The generated documents come from `content/pages.mjs`; `content/research.mjs` owns the study catalogue.

The anatomical experience uses Three.js/OrbitControls and 47 real BodyParts3D meshes. It includes region selection, rotation, zoom, conceptual paths, pause/tour controls and a static view. It is educational, not a neurological measurement. Atlas attribution and adaptations are in `assets/anatomy/attribution.txt` and `docs/anatomy-provenance.json`. The local fictional spoken-name audio has native playback controls and an amplitude waveform.

The personal explorer asks for first and last name, then either current age or full birthday. Birthday derives age and adds current-calendar-year PY/PYE. Optional middle/everyday names enable separate identity layers. Canonical letter-duration helpers are exported in `lib/name-engine.js`; its calculation body is verified against the original `lib/assets/chart-engine.js`. PY uses `.py`; PYE uses `.ess`. No fabricated birthdate is used in age mode.

The original two-person comparison remains in `demo-model.js`/`proof.js`. `lib/compatibility.js` and `lib/assets/chart-engine.js` retain their pinned original hashes in `docs/model-provenance.json`. Model scores are interpretations, not probabilities or employment recommendations. The supported alphabet is A–Z; unsupported characters produce a clear error rather than an invented transliteration.

## Privacy and contact

Personal and comparison entries remain in document memory. There is no application storage, analytics, account, survey upload or personal-data endpoint. Page exit/history return and Clear remove the entries. Local asset fetches load anatomy and waveform data only. Form submission to servers is blocked by the Content Security Policy.

The contact form prepares a local request for Valexinnovations@gmail.com. The visitor can review it, download it, or open an email-app draft and choose Send there. Preparing the request does not send an email. Browser/email-app behavior is outside this site's control.

## Evidence and verification

Research is separated into independent findings, proprietary interpretations and proposed evaluation. Circadian controls show time windows, not physiological predictions. Historical 23/28/33-day cycles are explicitly unsupported mathematics. See `docs/research-audit.md`, `docs/skills-applied.md`, `docs/rebuild-decisions.md`, `docs/motion-review.md` and `docs/qa/rebuild-verification.md` for scope and actual checks.

## Screenshot provenance

The four JPEGs under `assets/screenshots/` were captured on 10 October 2026 from the repository's real production components through `tests/fixtures/marketing-capture.html` in the original Staff Profiler repository. The fixture installs fictional sample records in an in-memory database and uses `createWorkspace` and `createChartWorkspace`; it does not read, mutate or persist company records. It is excluded from the software's production build and the marketing build.

The demo company is Northstar Studio; all people and birthdates are fictional. The captured views are the team timeline, selected-month review, individual report text and workspace overview. These are actual rendered screens, not recreated interface mockups. The report screenshot is a scrolled view of its descriptive sections. No report content, scoring or other production component was modified for the screenshot. The screenshots retain the current software's Staff Profiler branding; the site identifies them as the existing interface transitioning to VALEX Innovations. Rebranding the actual application is a separate change.

Screenshot filenames: `team-timeline.jpg`, `monthly-review.jpg`, `person-report.jpg`, `workspace.jpg`.

## Current homepage and calculated reveal

The homepage uses the supplied Staffprofiler logo, people illustration and product checklist, followed by company workflow, three reasons and a closing invitation. All ten routes use the same white/forest-green palette and Manrope typography. See the demo actions lead to `/explorer/`; the actual-software link goes directly to `/platform/#platform`. Screenshot tabs and enlargement retain the authentic software images.

The main demo offers seven fictional people and one fictional manager. Let’s find out calls the unchanged comparison engine at runtime. The manager-perspective directional overall chooses alignment at 50 or above, differences below 50, without rounding. Four examples meet the cutoff; three fall below it. Scores/formulas stay out of the public reveal. These are fictional model examples, not hiring recommendations.

The supplied green-check animation blends into the page without player chrome or added text overlays and starts only after the reveal action. Four supplied clips cover male/female green-check and X results. The choice is labelled Male / Female, defaults to an explicit assignment for each fictional person, and can be changed. It chooses the visual only; scores remain unchanged. No gender is inferred from a name. All clips are inspected originals with no added caption overlays. Local media is configured in `assets/demo/scan-videos.json`. Original engine calculations, real comparison, age/birthday preview and operational application are preserved. See `docs/scan-video-handoff.md`, `docs/demo-calculation-audit.json` and `docs/scan-video-provenance.json`.

Run optional DOM checks after building:

- `node scripts/verify-marketing-dom.mjs <folder containing node_modules/jsdom>`
- `node scripts/verify-illustrative-media-dom.mjs <folder containing node_modules/jsdom>`

The media script simulates playback methods; actual supplied-video playback is separately verified in the browser.