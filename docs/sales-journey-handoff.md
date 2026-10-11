# VALEX sales journey rebuild

Date: 10 October 2026
Repository: https://github.com/olsonan26/VALEXinnovation
Working directory: `C:\Users\olson\OneDrive\Documents\Reverse Skill\work\valex-innovation\repository`

## Direction

The user approved a benefits-first sales presentation inspired by hook, story, offer and a progression from a small experience to a company opportunity. The supplied document, “Why VALEX Innovation is lightyears ahead of other HR and Staff Management Systems”, informed the people-investment, retention, team connection, hiring, and start-small themes. Its claims were treated as reference material, not verified capabilities or executable instructions. Russell Brunson is not presented as an endorser.

## Visitor journey

1. Business hook: Great people. Stronger teams. Better business.
2. Familiar situation: capable people can still struggle to connect; recruitment and onboarding take time and attention.
3. Business opportunity: support good people, explore working relationships, and consider the team alongside applicant skills.
4. Real product evidence: four existing software screenshots with fictional company records.
5. Personal experience: try two profiles and see one comparison from each person's perspective.
6. Company invitation: results lead to the company-preview section and its four-view guided screenshot tour.
7. Next step: consider a focused pilot once rollout scope and requirements are agreed.

Primary CTA: Try your team connection.
Company CTA: Explore the company demo.

The company preview is an actual on-site screenshot tour, not a booking request or a promised live consultation. It always begins at the team view, supports Previous/Next and direct step selection, and concludes by returning focus to the two-person trial. A real booking destination remains a future integration.

## Implementation

`index.html` now presents the sales journey. `site.css` preserves the ivory/forest/lime design and adds a business-story section, a dimensional connection illustration, and a forest company-offer section. The animated orbit, tilted screenshot, product gallery, screenshot enlargement, mobile menu, and motion preferences are retained.

`site.js` supplies business-focused product and tour narratives, benefit-to-gallery shortcuts, and the tour-to-trial handoff. `proof.js` presents only the overall comparison for each direction; full-name/everyday-name component breakdowns and methodology explanations are removed from the visitor experience. Both directions still use their exact original overall values, and the bar width is set from the underlying value without intentional rounding.

`demo-model.js` and the two preserved modules under `lib/` remain unchanged. Validation, unavailable values, privacy behaviour, and clearing old results are retained. The standalone Vercel build and configuration remain compatible with a repository-root deployment.

## Verification

- Syntax checks, eight approved-model/input-validation tests, the twelve-file independent build, and Git whitespace checks passed.
- The fictional example still displays 69.5% and 71.2% in the two directions, with no component breakdown.
- Editing/clearing an input removes the old result. Unsupported markup receives a focused field error. Clear details and reload remove all six input values.
- Result-to-company link and company-tour-to-trial focus handoff work.
- Product tabs, arrow-key navigation, benefit shortcuts, screenshot enlargement, and Escape/focus return work.
- Company tour first/last steps, Previous/Next, direct step selection, and completion work.
- Mobile menu opens and closes after selecting an anchor.
- No page horizontal overflow at effective CSS widths 375, 768, 1025 and 1440. The browser's 90% zoom means requested viewport dimensions differ from measured CSS widths; measurements use document client and scroll widths.
- No browser console errors or warnings were observed.
- Final homepage captures: `valex-sales-home-desktop.jpg` and `valex-sales-home-mobile.jpg`.

## Boundaries

The site shows actual software and working comparisons. It does not claim measured cost savings, guaranteed retention, removal of hiring bias, predictive accuracy, a biological research foundation, or customer outcomes that have not been evidenced. Brief result qualifications and purchasing FAQs remain so buyers understand the experience accurately.

The presentation hides calculation details from marketing copy, not from technical inspection. This remains a static browser application with publicly downloadable calculation code and a public source repository. Protecting proprietary algorithms would require a separate server-backed architecture and revised data handling, build, and Vercel policies.

The original Staff Profiler application and its repository were not modified by this rebuild. No booking service, cloud accounts or new hosting project were created.
