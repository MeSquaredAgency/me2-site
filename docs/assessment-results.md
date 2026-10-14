# Assessment results

## Where submissions go

Completed work samples are stored in Cloudflare D1, in the `me2-assessment-submissions` database and `assessment_submissions` table. They are not emailed. Candidate answers are in `responses_json`.

Open **Cloudflare Dashboard → Workers & Pages → D1 → me2-assessment-submissions → Console**. Paste and run [the results query](docs/assessment-results.sql) to see scores for existing compatible submissions. It returns the receipt, candidate name, objective score breakdown, net typing speed, and accuracy without dumping the full answer text.

## What the score means

The objective work sample is scored out of 75:

- Numbers and accuracy: 20 points across the four rent calculations.
- Detail and safe judgment: 20 points for flagging the four unsupported or inappropriate draft statements.
- Prioritization: 15 points for clear, time-sensitive ordering constraints. Other relative ordering choices are not penalized.
- Authority and escalation: 10 points for handling the agreed instalment separately and escalating a permanent repair above the candidate's authority.
- Typing: 10 points. Net speed contributes up to 6 points at 50 WPM; accuracy contributes up to 4 points at 98%.

The current score is a set of job-related signals, not a pass/fail decision. It does not score the work-style snapshot as personality or culture fit. The written answers need a human read. Suggested review anchors:

- Owner update (0–5): accurate facts, concise wording, clear follow-up.
- Queue plan (0–5): sensible first actions, safe escalation, clear update to the manager.
- Tenant reply (0–5): acknowledges the concern, stays respectful, gives a concrete next step.
- Initiative example (0–10): specific situation, personal ownership, follow-through, outcome or learning.

Use the written responses and work-style preferences to guide a structured interview. Do not treat the objective score as a standalone hiring decision.

## New submissions

The Worker calculates the objective result on the server and stores it under `responses_json.results`. This avoids trusting a score supplied by the browser. The reviewer query also calculates results for older v6 submissions that do not yet have a stored score. Earlier assessment versions are marked with no score because their question set does not match this rubric.
