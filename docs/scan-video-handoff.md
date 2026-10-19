# Calculated fictional scan demo and shared branding

19 October 2026. The green-check clip is supplied and connected. The X clip is still pending user delivery.

## Current experience

The standalone public demo at `/explorer/` offers seven fictional people and one fictional manager. Previous/Next cycle through all seven. **Let’s find out** runs the preserved comparison engine, chooses the corresponding animation and reveals its result after playback. It collects no real applicant or company records.

The selected metric is the original directional overall from the manager's perspective: `comparePair(demoManager, profile).forward.overall`. This is a person-to-manager comparison, not a new organisation-wide score. No averaging, rounding or alternate calculation is introduced. Scores below 50 choose differences; exactly 50 and above choose alignment. Every selected example also falls on the same side of the cutoff from the reverse perspective. The UI keeps percentages, components and formulas out of this main demonstration. Reproducible internal values are in `demo-calculation-audit.json`.

Four examples meet the cutoff and three fall below it. These are computed model results for fictional identities, not proof that a real person will succeed or a hiring recommendation. The separate real two-person comparison and individual age/birthday preview remain below in disclosures, with their existing calculations intact. The operational application is untouched.

## Integrated animation

The supplied `GREEN  CHECK SCAN VIDEO.mp4` is copied byte-for-byte to `assets/demo/green-check-scan.mp4`. It is H.264/AAC, 1916 x 1080, 10.041667 seconds. Inspection frames and the source hash are recorded in the repository.

The animation is borderless, full width and softly blended into the white page. It has no native player controls or added caption/text overlays. It loads only after the visitor triggers the reveal; playback is muted, inline and never looping. The next clip will use the same presentation. Descriptive context and result copy remain outside the animation. The native clip has not been altered or passed off as a literal human scan.

A small Show result action allows the visitor to finish early. Start scan appears only for reduced-motion preference or blocked playback. Slow loading/errors reveal the correct calculated result. Switching profiles clears prior playback/results. Hidden pages pause playback. The X branch currently shows an explicit static X with a truthful pending-video message; it never plays the green clip.

When the X clip arrives, inspect it, copy the original under `assets/demo/`, then configure `differences.src` in `assets/demo/scan-videos.json`. Use only the accepted local MP4/WebM path. Do not add caption overlays. Verify playback on both outcomes and mobile before publishing.

## Shared visual identity

All ten routes now use white backgrounds, forest green buttons, dark green text and Manrope typography. Supporting pages no longer use the navy/gold/serif theme. Their header uses the supplied logo and the same minimal primary action as the homepage. The actual software screens link goes directly to `/platform/#platform`; the four real screenshots, tabs and enlarged image dialog remain available. Screenshots are authentic and unchanged.

Main text is enlarged and ordinary rendered HTML text has a 16px minimum, with 18px body text and larger headings/controls. The homepage workspace image can open at its original resolution. Captions distinguish real software from fictional demonstration data.

## Peter's requested direction

- Supplied Staffprofiler identity and people illustration.
- Clear product checklist: individual profiles, two-person comparisons, staff/applicants/jobs and team timelines.
- Recruitment conversations and ongoing staff support, grounded in existing functions.
- A direct choice -> scan -> result experience, keeping mechanics private.
- Actual calculations on fictional examples, per the user's revised instruction.
- No unverified background-check service, delivery guarantee, pricing or outcome guarantee advertised from the reference sketch.

## Verification

- Syntax checks, ten-route production build and 31 tests pass, including pinned engine hashes, directional parity, all seven examples, both threshold boundaries and media-path validation.
- Production-bundle DOM checks pass: both outcomes/reset, canonical 69.5% / 71.2% real comparison, invalid-input/clear behavior and individual age/birthday preview.
- Simulated media checks cover completion, Show result, profile changes, reduced motion, blocked playback, error and slow loading. They assert no native controls or caption tracks.
- Actual green video playback completed in the browser, with the calculated match revealed at 10.041667 seconds. The low-scoring branch showed the static X without requesting the green video.
- All ten routes were measured at CSS client widths 320, 376, 769 and 1441: white background, Manrope headings, ordinary visible HTML text minimum 16px, no page horizontal overflow. See `qa/calculated-brand-layout-audit.json`.
- Product tabs and enlarged screenshot dialog were reviewed in the shared light branding. Desktop/mobile screenshots are saved under `docs/qa/`.

Production release confirmation is recorded after the deployment is verified.
