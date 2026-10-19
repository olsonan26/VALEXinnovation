# A clearer Staff Profiler marketing site

18 October 2026. Website only; operational Staff Profiler application unchanged.

## Direction and finished journey

The new brief supersedes the cinematic/science-led homepage. The audience is business owners, managers and HR teams. The benefit is understanding people and starting useful conversations, without promising retention rates, predicting performance or making hiring decisions.

The homepage has exactly five sections: opening, recognisable working-relationship problem, a two-person example, three reasons to explore, and a closing invitation. Navigation has one supporting link. All three primary links say **See the demo** and lead to the existing `/explorer/` destination. Staff Profiler is the product name on the new homepage and demo; the footer identifies VALEX Innovations.

The visual direction is white, forest green and soft sage, with Manrope throughout, generous spacing and authentic workspace/report screenshots. Crops are CSS viewports over unchanged original JPEGs. Every screenshot identifies fictional demonstration data. The suggested manager question is labelled as a question, not a testimonial.

The homepage contains no scripts, forms, canvas, dialogs, score cards, animated brain, waveform, model terminology or fabricated evidence. The scientific archive and original source modules are retained outside the primary sales journey. Public how-it-works copy now describes the company workflow instead of the calculation method. This change does not make the existing client-side demo a server-side secret.

## Working demo

The existing canonical comparison opens with Amelia Rose Morgan / Amelia Morgan and Oliver James Lewis / Oliver Lewis, using the original fictional dates. It immediately displays both perspectives: **69.5%** and **71.2%**. Its definition of a score is unchanged. No entry or account is required to see the example.

Visitors can optionally open the two-profile form. Editing clears the stale result. The example button restores both profiles and compares them again. Invalid input receives a field error; Clear removes details/results. The individual age-or-birthday explorer remains available in a separate collapsed disclosure. New light demo styling does not alter the model or its reports.

## Completed checks

- Syntax checks and ten-route production build passed.
- All 26 existing model, route, input and asset tests passed. The old homepage-order assertion was updated to the new five-section/consistent-action contract. Approved engine hashes and canonical calculation parity remain unchanged.
- Five functional DOM checks passed against the actual production bundle using temporary jsdom 26.1.0: homepage action targets; immediate canonical example with no page jump; edit/reset behavior; validation/clear; individual age/birthday/annual-value flow.
- Local HTTP checks: all ten generated pages plus the new CSS, demo bundle and semibold font return 200.
- CSS reviewed for 320px and larger layouts, visible focus, readable contrast, native disclosures, hover-capable pointers, and reduced-motion gating. Buttons retain static labels and no important content depends on animation.
- Git whitespace check passed.

## Not verified

Local browser use is disabled in the current Work settings. The browser tool refused to open a page. Actual desktop/mobile rendered layout, overflow, screenshot crops, keyboard focus appearance and browser interaction review could not be verified. A request to enable access was sent while implementation continued. DOM checks do not replace visual or browser testing. No new website screenshot is presented as verified evidence.

Functional DOM verification is reproducible after build with `node scripts/verify-marketing-dom.mjs <folder containing node_modules/jsdom>`. jsdom was installed in a temporary QA folder and is not a production dependency.

## Production publication

PR [#4](https://github.com/olsonan26/VALEXinnovation/pull/4) merged as `67343fd6cfd26f84145b78e2540e8334f16a263f`. Vercel reported a successful [production deployment](https://vercel.com/alex-olsons-projects-43241a84/vale-xinnovation/3L7cnr9GcJfqJhr1GWXut1VsEhQZ).

Fetched the public homepage, demo, both new stylesheets and demo bundle from https://vale-xinnovation.vercel.app/; all returned 200. The public homepage has five sections and three consistent demo links. Stylesheets and the demo bundle match the local verified build after Windows/Linux line-ending normalization. The actual public demo HTML and bundle passed DOM checks for initial 69.5% / 71.2% results, optional profile entry, editing, example reload and clearing. This is functional production-content verification, not a browser or visual layout review.
