CREATE TABLE IF NOT EXISTS assessment_submissions (
  submission_id TEXT PRIMARY KEY,
  receipt_id TEXT NOT NULL UNIQUE,
  received_at TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  candidate_location TEXT NOT NULL,
  assessment TEXT NOT NULL,
  completed_at TEXT,
  responses_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_received_at
  ON assessment_submissions(received_at DESC);
