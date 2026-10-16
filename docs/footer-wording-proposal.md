# Footer wording — narrowly scoped proposal

Status: **proposal only.** Not implemented. The approved Phase 1 baseline (`baseline/phase1-approved`, `246f2ac`) is unchanged and stays unchanged until Eli approves the implementation.

## Current text (Phase 1, approved)
`footer.simulatedNote`, shown in the site footer on every page:

> Any lab or demo data on this site is simulated for training and is clearly labelled. No real customer or security event data is shown.

## Requested text (Eli, 2026-10-16)
> Technical investigations and hands-on projects are documented using personal lab environments. Evidence is reviewed before publication.

## Accuracy check against what is actually published
| Fact on the public site today | Consequence |
|---|---|
| No case file is documented and approved, so no technical investigation is published. | Shown today, the first sentence would describe content that does not exist yet. That implies completed work, which Eli asked to avoid. |
| Published evidence today = the three original certificates (redacted, reviewed). | "Evidence is reviewed before publication" is accurate today. |
| The home hero's animated network scene keeps its own small label ("Simulated topology · demo visual, not live data"). | The footer note is not needed to explain the scene. That label stays as approved in Phase 1 (separate decision; not part of this change). |

## Proposal: the sentence follows the content
The footer line is decided at build time from the case-file data, so it can never run ahead of what is published:

| Public site state | Footer line |
|---|---|
| No documented case yet (today) | **No line.** The simulated-data note is removed and nothing replaces it. |
| At least one documented, approved case is public (CF-01 onwards) | **Technical investigations and hands-on projects are documented using personal lab environments. Evidence is reviewed before publication.** |

The protected preview build follows the same rule, so what Eli reviews is what the public site will show.

### Translations (for approval with the wording)
- **EN** Technical investigations and hands-on projects are documented using personal lab environments. Evidence is reviewed before publication.
- **HE** חקירות טכניות ופרויקטים מעשיים מתועדים בסביבות מעבדה אישיות. הראיות נבדקות לפני פרסום.
- **AR** تُوثَّق التحقيقات التقنية والمشاريع العملية في بيئات مختبر شخصية، وتُراجَع الأدلة قبل النشر.

## Implementation scope (when approved)
- `messages/*.json`: replace `footer.simulatedNote` with `footer.labNote` (the three strings above).
- `SiteFooter.tsx`: render `labNote` only when at least one case file is approved. Nothing else in the footer changes.
- Tests:
  - public build with no approved case → no lab or simulated note in the footer;
  - with one approved case (fixture) → the exact sentence, in all three languages;
  - the hero scene label is unchanged.
- Delivered on its own branch, separate from Phase 1 and from the Case Files work, with before/after screenshots. Merged only with Eli's approval.

## Not affected
- The hero scene label, "Simulated training lab" labels on any future simulated content (the Interactive SOC Lab), and every internal evidence, privacy and integrity check.
