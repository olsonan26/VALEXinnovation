# VALEX / Staff Profiler / Lettrology Ecosystem — Working MVP

## Repository selection

This change deliberately extends **olsonan26/VALEXinnovation**, the existing public marketing site, not the operational HR application. The operational application lives in **olsonan26/STAFFprofiler** and is linked from marketing pages. It currently uses browser-local records and demonstration authentication; its README explicitly says production authentication, shared persistence and server-side role enforcement do not yet exist.

The marketing site is a **static site** built by \`build.mjs\` using \`content/pages.mjs\`. Its existing real application screenshots and fictional Explorer were preserved. New ecosystem routes are implemented in \`content/ecosystem.mjs\`, styled in \`ecosystem.css\`, and enhanced by \`ecosystem.js\`.

## Routes implemented

| Route | Purpose | Functional status |
| --- | --- | --- |
| /business/ | Staff Profiler business-facing landing page | Static page with functional links |
| /business/demo/ | Product screens and existing Explorer handoff | Screens and links to functioning fictional demo |
| /business/free-assessment/ | Four-step company discovery wizard | Fully client-side; local recommendation and email-draft handoff |
| /business/pricing/ | Proposed pricing and estimator | Interactive arithmetic calculator; no billing |
| /academy/ | Lettrology Academy public landing | 17-module program announcement |
| /academy/courses/ | Course structure | 17 clearly labeled unpublished placeholders |
| /accreditation/ | Learning-to-qualification explanation | Proposed only; no credentials issued |
| /accreditation/units/ | Draft specialization categories | Proposed only; Peter's approval required |
| /professionals/ | Professional services network concept | Proposed only |
| /consultation/ | Consultation and academy inquiries | Browser-only email-draft preparation; no actual booking |

Navigation to the new pathways is included from the existing homepage/header/footer without changing its established five-section layout.

## Assessment behavior

The four-step wizard asks for company name, name/email of the business contact, approximate employee count, industry and the purpose of an introductory walkthrough. It **does not request staff birth dates** or create a Lettrology score, evaluation, business account or employee record. It displays a relevant product tour suggestion based on the selected goal. It does not send form data to a server. Users may elect to open a mailto draft and manually send the information.

The existing /explorer/ fictional comparison remains the real calculation demonstration.

## Pricing

Peter's draft amounts are presented as proposals, not approved charges: $39/month base, $2/employee/month, $9/report and optional $150 one-time setup. Browser-only estimator: monthly=39+2×employee_count+9×report_count; first month=monthly+(150 if setup selected). Consultations of $150/$350 are likewise marked as proposed. No checkout or subscription is created.

## Academy and professional qualifications

The 17 courses modules are **unpublished placeholders**: Peter has not yet supplied signed-off names, videos, syllabi, assessments or enrollment terms. Draft specialization categories are not official accreditation programs and there are no student accounts, credentials or professional network members on the static site.

## Commercial launch blockers

To offer real accounts, uploads, credential issuance, business onboarding and billing:

1. Decide on backend, database and production authentication. Implement actual tenant-isolated business/employee persistence and server-enforced authorization. Do not rely on existing demo settings.
2. Secure content management and video hosting; official approved 17-module lesson metadata.
3. Learning progress, quizzes, evidence records, assessor workflows and scoped credentials; verification and revocation.
4. Peter's approved accreditation standards, issuing entity and authorization scopes.
5. Final pricing and terms, payment provider configuration, verified webhooks, safe transactional billing.
6. Professional appointment availability, authorized consultant assignments and privacy-controlled case access.
7. Data protection and employment-law review before inviting real staff data or deploying interpretation outputs in HR decision workflows.
8. Independent assessment of any workplace predictive claims; no automated employment selection from Lettrology model scores.

## Validation

Existing \`npm run check\`, \`npm test\`, and \`npm run build\` apply to the expanded routes. Added \`tests/ecosystem.test.mjs\` for route coverage, privacy and readiness messaging. CI configuration includes \`npm ci\` before these commands.

The new module adds static routes and does not modify any name/compatibility calculations in either repository.

## Rollout

Review the separate PR and Vercel preview (if provisioned) before merging. This PR is safe to merge when verified but **not a full launch** of the backend academy, payment system or HR SaaS. It is the first functional, honest customer-facing vertical slice. Approve course and commercial content before accepting enrollments or collecting payments.
