-- Private reviewer query for Me² Command Centre Operator assessment submissions.
-- Run in Cloudflare Dashboard → D1 → me2-assessment-submissions → Console.
-- It computes the current objective score for existing v6 submissions and reads the
-- server-calculated score for new submissions. Older, incompatible tests show NULL.

WITH raw AS (
  SELECT
    receipt_id,
    received_at,
    candidate_name,
    assessment,
    responses_json,
    json_extract(responses_json, '$.typingCompleted') AS typing_completed,
    json_type(responses_json, '$.queueOrder') AS queue_type,
    COALESCE(CAST(json_extract(responses_json, '$.results.earned') AS REAL), NULL) AS stored_auto_score,
    COALESCE(
      CAST(json_extract(responses_json, '$.results.domains[4].details.netWpm') AS REAL),
      CAST(json_extract(responses_json, '$.typingNetWpm') AS REAL),
      0
    ) AS net_wpm,
    COALESCE(
      CAST(json_extract(responses_json, '$.results.domains[4].details.accuracy') AS REAL),
      CAST(json_extract(responses_json, '$.typingAccuracy') AS REAL),
      0
    ) AS typing_accuracy,
    (SELECT CAST(j.key AS INTEGER) FROM json_each(responses_json, '$.queueOrder') AS j WHERE j.value = 'leak' LIMIT 1) AS leak_pos,
    (SELECT CAST(j.key AS INTEGER) FROM json_each(responses_json, '$.queueOrder') AS j WHERE j.value = 'rent' LIMIT 1) AS rent_pos,
    (SELECT CAST(j.key AS INTEGER) FROM json_each(responses_json, '$.queueOrder') AS j WHERE j.value = 'hotwater' LIMIT 1) AS hotwater_pos,
    (SELECT CAST(j.key AS INTEGER) FROM json_each(responses_json, '$.queueOrder') AS j WHERE j.value = 'report' LIMIT 1) AS report_pos
  FROM assessment_submissions
),
parts AS (
  SELECT
    *,
    CASE WHEN ABS(CAST(json_extract(responses_json, '$.patelAmount') AS REAL) - 160) < 0.011 THEN 5 ELSE 0 END
      + CASE WHEN ABS(CAST(json_extract(responses_json, '$.taylorAmount') AS REAL) - 630) < 0.011 THEN 5 ELSE 0 END
      + CASE WHEN ABS(CAST(json_extract(responses_json, '$.doyleAmount') AS REAL) - 980) < 0.011 THEN 5 ELSE 0 END
      + CASE WHEN ABS(CAST(json_extract(responses_json, '$.rentTotal') AS REAL) - 1770) < 0.011 THEN 5 ELSE 0 END
      AS numbers_score,
    (CASE WHEN EXISTS (SELECT 1 FROM json_each(responses_json, '$.riskyLines') AS j WHERE j.value = 'blame') THEN 5 ELSE 0 END
      + CASE WHEN EXISTS (SELECT 1 FROM json_each(responses_json, '$.riskyLines') AS j WHERE j.value = 'alarm') THEN 5 ELSE 0 END
      + CASE WHEN EXISTS (SELECT 1 FROM json_each(responses_json, '$.riskyLines') AS j WHERE j.value = 'private') THEN 5 ELSE 0 END
      + CASE WHEN EXISTS (SELECT 1 FROM json_each(responses_json, '$.riskyLines') AS j WHERE j.value = 'maintenance') THEN 5 ELSE 0 END)
      AS detail_score,
    (CASE WHEN leak_pos < rent_pos THEN 3 ELSE 0 END
      + CASE WHEN leak_pos < hotwater_pos THEN 3 ELSE 0 END
      + CASE WHEN leak_pos < report_pos THEN 3 ELSE 0 END
      + CASE WHEN rent_pos < report_pos THEN 3 ELSE 0 END
      + CASE WHEN hotwater_pos < report_pos THEN 3 ELSE 0 END)
      AS prioritization_score,
    (CASE WHEN json_extract(responses_json, '$.planAction') = 'separate' THEN 5 ELSE 0 END
      + CASE WHEN json_extract(responses_json, '$.quoteMove') = 'escalate' THEN 5 ELSE 0 END)
      AS authority_score,
    MIN(6.0, MAX(0.0, net_wpm / 50.0 * 6.0))
      + MIN(4.0, MAX(0.0, typing_accuracy / 98.0 * 4.0))
      AS typing_score
  FROM raw
)
SELECT
  receipt_id,
  received_at,
  candidate_name,
  assessment,
  CASE
    WHEN typing_completed = 1 AND queue_type = 'array'
    THEN ROUND(COALESCE(stored_auto_score, numbers_score + detail_score + prioritization_score + authority_score + typing_score), 1)
    ELSE NULL
  END AS objective_score_out_of_75,
  CASE WHEN typing_completed = 1 AND queue_type = 'array' THEN numbers_score END AS numbers_out_of_20,
  CASE WHEN typing_completed = 1 AND queue_type = 'array' THEN detail_score END AS detail_and_judgment_out_of_20,
  CASE WHEN typing_completed = 1 AND queue_type = 'array' THEN prioritization_score END AS prioritization_out_of_15,
  CASE WHEN typing_completed = 1 AND queue_type = 'array' THEN authority_score END AS authority_out_of_10,
  CASE WHEN typing_completed = 1 AND queue_type = 'array' THEN ROUND(typing_score, 1) END AS typing_out_of_10,
  ROUND(net_wpm, 1) AS net_wpm,
  ROUND(typing_accuracy, 1) AS typing_accuracy_percent
FROM parts
ORDER BY received_at DESC;
