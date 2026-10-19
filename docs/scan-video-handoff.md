# Fictional team-fit video handoff

19 October 2026. Both generated scan videos are still to be supplied by the user.

## Experience

The main public demo at `/explorer/` uses fictional people and an explicitly scripted company story. Visitors select Amelia Morgan (closer alignment) or Oliver Lewis (different approaches), then click **Find Out**. No actual personal details, company records, identity documents or Social Security numbers enter this experience. These stories do not call or approximate the real model.

The separate real two-person comparison and individual preview remain in disclosures below. The canonical engines, calculation body, comparison values and operational application are unchanged. The scripted stories must never be substituted for results of a real-person submission.

## Add the videos

1. Inspect the two supplied clips and confirm which depicts closer alignment and which depicts working differences. Do not guess from the filenames.
2. Put the clips under `assets/demo/`, for example `team-alignment.mp4` and `team-differences.mp4`. Provide English WebVTT captions if there is narration or meaningful written content that is not otherwise described in the page. Preserve user-supplied assets unless editing is requested.
3. Set the corresponding `src` and optional `captions` fields in `assets/demo/scan-videos.json`. Only local `/assets/demo/` MP4/WebM and VTT paths are accepted. The current values are intentionally null. No nonexistent clip URLs are requested.
4. Build and check actual playback on desktop and mobile. Test both branches, replay via Find Out, completion, skip, unavailable video, blocked playback, reduced motion and switching profiles while playing.

On Find Out with a configured clip, its native video player appears; the selected scripted result stays hidden until completion or Skip. Playback is muted, inline, controlled and never looping. Reduced motion requires an explicit Play action. Playback failure and slow initial loading fall back to the poster and the correct scripted result. Profile changes clear prior playback/result state; hidden pages pause playback.

Until the clips arrive, Find Out reveals the correct story immediately with the supplied people illustration and the status **The scan video is being prepared.** This is the complete interim flow, not a claim that a clip or a scan exists.

## Transcript direction implemented

| Direction | Website treatment |
| --- | --- |
| Distinctive Staffprofiler identity, red “i” | Supplied original logo in the site header/footer, including supporting pages |
| People stretching into the distance, selected individuals | Supplied original people illustration in the opening and reveal area |
| Product checklist up front | Individual profiles, two-person comparisons, staff/applicants/jobs, team timelines |
| Recruitment and existing staff management | Clear company-view section plus the existing three outcome-focused reasons |
| Show an experience without exposing mechanics | Fictional selection → Find Out → scripted reveal; actual mechanics stay out of the main journey |
| Two scan-video outcomes | Separate alignment/differences media slots and working completion/skip/fallback logic |
| Background checks, 48-hour turnaround, pricing, guaranteed longevity or savings | Not advertised as available: no verified provider, agreed service terms, pricing or outcome evidence supplied |

The checklist sketch is reference material and has not been published as a literal list of verified capabilities. The original attached transcript and private conversation are not committed.

## Verification

- Syntax checks, ten-route build and 29 tests pass, including unchanged model hashes, canonical comparison parity, distinct scripted stories and media-path validation.
- Production-bundle DOM checks pass for both missing-video stories, changing selection, real comparison, validation/clear, age/birthday mode and annual values.
- Simulated-media DOM checks pass for the selected clip/captions, completion, Skip, reduced motion, blocked Play, error and delayed loading. These use mocked media methods, not actual video playback.
- Browser review completed on local production build: desktop/mobile homepage, both fictional outcomes, keyboard selection/Enter, stale-result reset, real example 69.5% / 71.2%, individual example/clear and old `#two-person` destination.
- No page horizontal overflow on home or revealed demo at measured CSS widths 320, 376, 769, 1025 and 1441. Browser zoom causes requested viewport sizes to differ; widths are DOM measurements. No browser errors/warnings observed.
- Actual supplied-video playback remains pending the two files. No generated/placeholder footage has been passed off as the supplied video.

Asset originals, dimensions and SHA-256 hashes are recorded in `docs/brand-asset-provenance.json`. Screenshots are under `docs/qa/illustrative-*`.

## Production confirmation

PR [#5](https://github.com/olsonan26/VALEXinnovation/pull/5) merged as `567f2d5a22d373841326d30a2cbcd3f82f137d8d`. Vercel reports the [production deployment](https://vercel.com/alex-olsons-projects-43241a84/vale-xinnovation/ExciUp4NYko2ro5hZnsNBXSPde6e) completed successfully.

Browser verification at https://vale-xinnovation.vercel.app/ confirmed the new logo/people opening, the demo destination, both Find Out outcomes, switching/reset and the explicit pending-video status. Live mobile result had equal client/scroll widths (338px in this browser's effective viewport). The separate real comparison still displayed 69.5% and 71.2%. No live browser errors/warnings were observed. `illustrative-live-home.jpg` and `illustrative-live-reveal.jpg` capture the public site. Actual video playback remains pending the two files.
