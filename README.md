# VALEX-innoVAtion marketing website

A standalone marketing site for the new **VALEX-innoVAtion** brand, separate from the current Staff Profiler application. Its own page, assets, preview, build and deployment configuration live here. It does not import modules from the running app, share storage, connect to the software or send employee information anywhere. A self-contained copy of the calculation model powers the two-person proof of concept. The existing app entrypoint, routes and build remain unchanged.

## Preview and build

From this directory, run `npm start` and open http://127.0.0.1:4190/. Run `npm run check`, `npm test` and `npm run build` to validate and generate `dist`; `npm run preview` serves that output. There are no package dependencies, external fonts, trackers or runtime requests to third-party services. All twelve published files come from this directory; it is independently portable.

To publish independently, create a separate deployment project with **Root Directory = .**, framework **Other**, build `npm run build`, output `dist`. This repository is dedicated to the website. Connecting a hosting project and public domain is separate from publishing its source to GitHub.

## Design and interactions

- Ivory, forest, lime, warm peach and muted lavender; editorial serif accents paired with system sans-serif text.
- A projected 3D sphere with orbit rings, perspective screenshot layers, pointer tilt and restrained section reveals. Animation stops when hidden and respects reduced-motion preferences.
- Four-view product gallery, keyboard-operated tabs, screenshot enlargement, a four-step guided demo, mobile navigation and native expandable FAQs.
- A business-focused journey from the people problem to the product, a free two-person experience, and a company preview. The trial presents one comparison from each person’s perspective; calculation components and methodology are not part of the sales presentation. Fictional examples are available, and edited or cleared inputs immediately invalidate previous results.
- **Try your team connection** is the primary invitation. Results lead to **Explore VALEX for your company**. **Explore the company demo** opens a four-view screenshot tour that returns visitors to the personal trial. The current offer is this on-site preview; a personalised consultation, booking destination, and company pilot require separate arrangements.

## Standalone model and data handling

`lib/compatibility.js` and `lib/assets/chart-engine.js` are byte-for-byte copies of the current software's approved comparison module and compiled preserved arithmetic. `demo-model.js` validates inputs and calls those functions without changing the matrix, coefficients, weights or arithmetic. `proof.js` renders the result with DOM text nodes, without interpreting scores as psychological traits or employment conclusions. Unavailable model terms remain unavailable.

The page uses no fetch, analytics, form transmission, cookies, local storage or session storage. Inputs exist only in the current document. Reloading or Clear details removes them. The preview and deployment policies forbid connections and form submission. Use another person's information only with permission.

`npm test` checks pinned canonical file hashes and known sample scores, parity with the bundled approved model in both directions, swapped perspectives, optional-name fallback, nonmutation, invalid/incomplete/future dates, unsupported names and markup, unavailable terms and bounded scores. `docs/model-provenance.json` records the original repository, source revision, and SHA-256 hashes. If upstream calculation code changes, update both standalone copies deliberately and rerun the parity checks. The site requires names using A–Z letters, spaces or hyphens, matching the preserved engine's supported alphabet.

## Screenshot provenance

The four JPEGs under `assets/screenshots/` were captured on 10 October 2026 from the repository's real production components through `tests/fixtures/marketing-capture.html` in the original Staff Profiler repository. The fixture installs fictional sample records in an in-memory database and uses `createWorkspace` and `createChartWorkspace`; it does not read, mutate or persist company records. It is excluded from the software's production build and the marketing build.

The demo company is Northstar Studio; all people and birthdates are fictional. The captured views are the team timeline, selected-month review, individual report text and workspace overview. These are actual rendered screens, not recreated interface mockups. The report screenshot is a scrolled view of its descriptive sections. No report content, scoring or other production component was modified for the screenshot. The screenshots retain the current software's Staff Profiler branding; the site identifies them as the existing interface transitioning to VALEX-innoVAtion. Rebranding the actual application is a separate change.

Screenshot filenames: `team-timeline.jpg`, `monthly-review.jpg`, `person-report.jpg`, `workspace.jpg`.

## Copy and evidence

The marketing language focuses on the employer’s people investment, team relationships, retention conversations, hiring context and onboarding. The visitor sees benefits and the product experience rather than explanations of the calculation. It does not claim validated psychometrics, measured stress, mental-health diagnosis, predictive hiring, guaranteed retention, cloud accounts or production security capabilities. The FAQ explains the current software demo's browser-local storage and the separate work required for company rollout.

Conversation-practice references, checked for this website:

- [Gallup: A Great Manager's Most Important Habit](https://www.gallup.com/workplace/505370/great-manager-important-habit.aspx) — meaningful feedback and manager conversations.
- [Google re:Work: Understand team effectiveness](https://rework.withgoogle.com/intl/en/guides/understand-team-effectiveness) — psychological safety and speaking up in teams.
- [US Office of Personnel Management: Structured Interviews](https://www.opm.gov/policy-data-oversight/assessment-and-selection/structured-interviews/) — consistent assessment of job-related competencies.

These sources inform the recommended use practices and do not validate VALEX-innoVAtion's calculations. The website states this distinction explicitly. No unsupported customer logos, testimonials, pricing, outcome statistics or certifications are included.

## Repository contents

The runnable website is at the repository root. docs/ contains design screenshots, model provenance, and the original development handoff. The archived capture fixture in docs/screenshot-capture/ documents how screenshots were produced; its imports require the original Staff Profiler source tree and it is not part of this website's runtime or tests.

## Sales presentation rebuild

See `docs/sales-journey-handoff.md` for the updated conversion journey and verification. The supplied business document informed the investment, retention, team connection, hiring and start-small messages. Hook, story, offer and a progression from a small experience to a company preview informed the page structure. No endorsement by Russell Brunson is implied.

This presentation does not conceal the implementation: the standalone calculation modules remain downloadable browser code, and this source repository is public. Genuine proprietary-code protection would require a separate server-backed architecture. The rebuild changes the sales experience while preserving the approved arithmetic and the existing static Vercel deployment.
