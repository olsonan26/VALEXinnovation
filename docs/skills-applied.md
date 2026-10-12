# Skill inventory and decisions

Verified nineteen installed entries in `C:/Users/olson/.codex/skills`. The requested eighteen plus existing UI/UX Pro Max total nineteen. Prior audit and this continuation read the skills and applicable references; only relevant web guidance changes this implementation.

| Skill | Decision in this project |
| --- | --- |
| frontend-design | Subject-led anatomy hero; quiet editorial typography; deliberate supplied palette rather than a generic card kit. |
| ui-ux-pro-max | Ran design-system and Three.js searches. Adopted accessibility and reactive reduced-motion guidance. Rejected generic neumorphism, Inter, invented client logos and login CTAs because they conflict with the brief and actual product. |
| better-ui | 0.96 press scale in 150ms, hover capability gates, image outline, coherent inner/outer radii, scroll containment in dialogs. |
| emil-design-eng | Instant frequent control feedback; original engine retained; first-render data is not cleared after a user starts typing. |
| animate | One intentional hero entrance; explicit feedback purpose for press transitions; no routine tab choreography. |
| animation-performance | Transform/opacity CSS; lazy Three import, on-demand rendering when signals are paused, 30fps cap while moving, offscreen/hidden pause and DPR cap. These are design limits, not measured mobile frame-rate claims. |
| animation-vocabulary | Distinguished acoustic waveform, conceptual signal propagation, camera rotation and opacity transitions in implementation notes. |
| apple-design | Restrained depth, native controls and predictable navigation rather than decorative motion everywhere. |
| mobile-native | 16px input text, safe-area padding, dynamic dialog viewport height, preserved browser zoom, hover gating and touch/keyboard alternatives. Real hardware validation remains separate from responsive browser testing. |
| web-design-guidelines | Fetched current upstream guidelines. Audited labels, focus, form errors, semantics, touch alternatives, reduced motion, links and overflow. |
| break-ui | Tested supported single-letter, hyphenated and maximum-length names, empty and invalid values, dates, long results and narrow layout. No production test toggle added. User already authorises fixing findings. |
| review-animations | Reviewed 150ms presses, 300ms entrance, native dialogs, paused signals and user-started tour. No broad transition-all or uncontrolled hidden animation. |
| improve-animations | Informed the motion inventory; no unrelated refactor or performance claim. |
| find-animation-opportunities | Kept explanatory signals and user feedback; rejected continuous page decoration and mouse-following effects. |
| pick-ui-library | Existing vanilla stack, Three/OrbitControls and native dialogs meet requirements; no React migration. |
| ask-sonner | Evaluated; inline semantic feedback suffices. No toast package or React dependency introduced. |
| prototype | Evaluated; a disconnected visual-picker prototype would duplicate the actual requested rebuild, so not applied. |
| animate-expo | Native-only instructions; no Expo app exists, so not applied. |
| write-swift | Native-only instructions; no Swift code exists, so not applied. |

Relevant references included animation recipes, performance guidance, better-ui surfaces/icons/enter-exit, review standards and the worst-case catalogue. Browser-emulated responsive checks do not establish touch, Safari, physical GPU or vestibular comfort certification.
