# Assessment response storage

The Command Centre Operator assessment posts completed submissions to the same-origin `/api/assessments` endpoint. The Cloudflare Worker writes each submission to the `assessment_submissions` table in the `me2-assessment-submissions` D1 database. It returns a receipt only after reading the saved row back. A repeated submission with the same submission ID is idempotent.

The Worker accepts writes only from `https://mesquaredagency.com`; branch previews cannot write applicant data to the production database. Candidate information and answers are not written to Worker logs.

## View submissions

In the Me² Cloudflare account, open **Workers & Pages → D1 SQL Database → me2-assessment-submissions → Console**, then run:

```sql
SELECT receipt_id, received_at, candidate_name, candidate_email,
       candidate_location, assessment, completed_at, responses_json
FROM assessment_submissions
ORDER BY received_at DESC;
```

There is no public endpoint for reading submissions. Treat these records as confidential applicant data and limit dashboard access accordingly. Set a retention period and delete records when they are no longer needed.
