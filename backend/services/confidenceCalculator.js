/*
|--------------------------------------------------------------------------
| PromptSentinel - Confidence Calculator
|--------------------------------------------------------------------------
|
| Purpose:
| Calculate the confidence level of the local security detection.
|
| This does NOT determine whether a prompt is malicious.
| It estimates how strongly the available evidence supports the
| detected threat level.
|
|--------------------------------------------------------------------------
*/

export function calculateConfidence(
  threatLevel,
  matchedPatterns = []
) {
  /*
  |--------------------------------------------------------------------------
  | 1. Base Confidence
  |--------------------------------------------------------------------------
  */

  let confidence;

  switch (threatLevel) {
    case "SAFE":
      confidence = 90;
      break;

    case "LOW":
      confidence = 80;
      break;

    case "MEDIUM":
      confidence = 85;
      break;

    case "HIGH":
      confidence = 92;
      break;

    case "CRITICAL":
      confidence = 96;
      break;

    default:
      confidence = 70;
  }

  /*
  |--------------------------------------------------------------------------
  | 2. Pattern Evidence
  |--------------------------------------------------------------------------
  |
  | Multiple detected patterns provide additional evidence.
  |
  | The bonus is deliberately capped so that a large number of
  | matching patterns cannot automatically produce 100% confidence.
  |--------------------------------------------------------------------------
  */

  const patternCount =
    Array.isArray(matchedPatterns)
      ? matchedPatterns.length
      : 0;

  const patternBonus = Math.min(
    patternCount * 2,
    6
  );

  confidence += patternBonus;

  /*
  |--------------------------------------------------------------------------
  | 3. Strong Evidence Bonus
  |--------------------------------------------------------------------------
  |
  | A larger number of independent indicators increases confidence.
  |--------------------------------------------------------------------------
  */

  if (patternCount >= 5) {
    confidence += 2;
  }

  if (patternCount >= 8) {
    confidence += 2;
  }

  /*
  |--------------------------------------------------------------------------
  | 4. Normalize Confidence
  |--------------------------------------------------------------------------
  */

  confidence = Math.min(
    100,
    Math.max(
      0,
      confidence
    )
  );

  /*
  |--------------------------------------------------------------------------
  | 5. Return Final Confidence
  |--------------------------------------------------------------------------
  */

  return Math.round(
    confidence
  );
}