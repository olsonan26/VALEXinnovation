# Calculated fictional scan demo and shared branding

19 October 2026. Both replacement green-check and X clips are supplied, inspected and connected.

## Current experience

The standalone public demo at `/explorer/` offers seven fictional people and one fictional manager. Previous/Next cycle through all seven. **Let’s find out** runs the preserved comparison engine, chooses the corresponding animation and reveals its result after playback. It collects no real applicant or company records.

The selected metric is the original directional overall from the manager's perspective: `comparePair(demoManager, profile).forward.overall`. This is a person-to-manager comparison, not a new organisation-wide score. No averaging, rounding or alternate calculation is introduced. Scores below 50 choose differences; exactly 50 and above choose alignment. Every selected example also falls on the same side of the cutoff from the reverse perspective. The UI keeps percentages, components and formulas out of this main demonstration. Reproducible internal values are in `demo-calculation-audit.json`.

Four examples meet the cutoff and three fall below it. These are computed model results for fictional identities, not proof that a real person will succeed or a hiring recommendation. The separate real two-person comparison and individual age/birthday preview remain below in disclosures, with their existing calculations intact. The operational application is untouched.

## Integrated animation

The supplied `GREEN CHECK MARKS THE PERSON.mp4` and `X marks the person.mp4` are copied byte-for-byte to `assets/demo/green-match-scan.mp4` and `assets/demo/x-no-match-scan.mp4`. Both are silent H.264, 1916 x 1080, 10.041667 seconds. Inspected final frames show the correct green check/red X. Source hashes are recorded in `scan-video-provenance.json`. The superseded public green clip was removed; original downloads remain untouched.

The animation is borderless, full width and softly blended into the white page. It has no native player controls or added caption/text overlays. It loads only after the visitor triggers the reveal; playback is muted, inline and never looping. Both clips use the same presentation. Descriptive context and result copy remain outside the animation. The native clip has not been altered or passed off as a literal human scan.

A small Show result action allows the visitor to finish early. Start scan appears for reduced-motion preference, blocked playback or resuming a paused scan. Slow loading/errors reveal the correct calculated result. Switching profiles clears prior playback/results. Hidden pages pause playback. The X branch plays the supplied red-X animation. It never plays the green clip. Both results remain hidden until their animation completes or Show result is selected.

Clip selection is configured in `assets/demo/scan-videos.json`. Only accepted local MP4/WebM paths are allowed; caption overlays are intentionally omitted.

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
- Both replacement clips completed in the local production build browser at 10.041667 seconds: Amelia revealed Good match in this demo after the green clip; Freya revealed Not a match in this demo after the X clip. Native controls are disabled and no text tracks are attached. The X path was also reviewed at 376px CSS client width without overflow.
- All ten routes were measured at CSS client widths 320, 376, 769 and 1441: white background, Manrope headings, ordinary visible HTML text minimum 16px, no page horizontal overflow. See `qa/calculated-brand-layout-audit.json`.
- Product tabs and enlarged screenshot dialog were reviewed in the shared light branding. Desktop/mobile screenshots are saved under `docs/qa/`.

The branding/calculated-demo release merged in PR #6 as 7984c2d7034daecaaf39a3f976dcdcd77f468f4a. Vercel reported success and the public site was checked for all seven outcomes, full clip completion, original 69.5% / 71.2% comparison and the matching light product page. The replacement-video deployment is recorded in its pull request after live verification.

## Male and female animation variants

The two female clips are added alongside the two male clips, with originals preserved byte-for-byte. All four are silent H.264, 1916 x 1080 and 10.041667 seconds. Inspected end frames confirm the female green check and red X.

Each fictional record now has an explicit `animation` assignment authored for this demonstration: Amelia, Freya, Grace, Mia and Zoe use female clips; Oliver and Noah use male clips. This is stored fictional presentation data, not an inference of gender from a name. Real personal-entry tools do not infer gender. Any future scan tied to freely entered people should offer an explicit animation preference rather than guessing.

The existing calculation alone still selects green at 50 or above and X below 50. The animation assignment only chooses the matching visual variant; it has no effect on scores. Unit and production DOM checks cover all four combinations, preserving original score fixtures and reset/playback behavior.

The demo also offers an explicit choice labelled simply **Male** / **Female**, under Person being compared. Selecting a fictional person sets its authored default; the visitor can change it. Changing either choice clears prior playback and results. This selection changes only the clip variant, never the comparison result. No name-based gender detection is performed.

## Female video delivery optimization

After a user report of lag, production HTTP inspection confirmed correct 206 range delivery and source MP4 inspection confirmed early moov metadata. Source female green was 15,233,644 bytes / 12.13 Mbps; source female X was 13,610,417 bytes / 10.84 Mbps. High delivery bitrate is a plausible buffering contributor; exact user-device stutter could not be reproduced because local browser access was disabled in Work settings.

The female media slots now use optimized web derivatives: green 2,927,152 bytes / 2.33 Mbps; X 2,671,246 bytes / 2.13 Mbps. Both preserve 1916x1080, 24fps, 241 frames and 10.041667 seconds. Encode: H.264 Main level 4.1, yuv420p, CRF 23, 3 Mbps maxrate / 6 Mbps buffer, 48-frame keyframes and faststart. Source files remain unmodified. SSIM versus originals: green 0.987391, X 0.988306. The final green frame was visually inspected. This reduces transfer/decode burden but is not evidence of smooth playback on the user's device.

Build, 32 tests and production-bundle DOM checks pass. Regression checks enforce a 4 MB budget and moov-before-mdat for the female web clips. Labels remain Male and Female; calculations and outcomes remain unchanged.
