/*
|--------------------------------------------------------------------------
| PromptSentinel - Risk Calculator
|--------------------------------------------------------------------------
|
| Purpose:
| Convert the threat level and available detection evidence into a
| normalized risk score from 0 to 100.
|
| The calculator does NOT detect attacks.
| It only calculates how risky the already-detected prompt is.
|
|--------------------------------------------------------------------------
*/

export function calculateRisk(
  threatLevel,
  matchedPatterns = []
) {
  /*
  |--------------------------------------------------------------------------
  | 1. Base Risk Score
  |--------------------------------------------------------------------------
  */

  let baseScore;

  switch (threatLevel) {
    case "SAFE":
      baseScore = 0;
      break;

    case "LOW":
      baseScore = 20;
      break;

    case "MEDIUM":
      baseScore = 45;
      break;

    case "HIGH":
      baseScore = 75;
      break;

    case "CRITICAL":
      baseScore = 90;
      break;

    default:
      baseScore = 0;
  }

  /*
  |--------------------------------------------------------------------------
  | 2. Pattern Evidence
  |--------------------------------------------------------------------------
  |
  | More detected indicators provide additional evidence.
  |
  | The bonus is intentionally capped so that a large number of
  | matching keywords cannot automatically produce a score of 100.
  |
  |--------------------------------------------------------------------------
  */

  const patternCount =
    Array.isArray(matchedPatterns)
      ? matchedPatterns.length
      : 0;

  const patternBonus = Math.min(
    patternCount * 3,
    12
  );

  /*
  |--------------------------------------------------------------------------
  | 3. Multiple Indicator Bonus
  |--------------------------------------------------------------------------
  |
  | Multiple indicators suggest stronger evidence.
  |--------------------------------------------------------------------------
  */

  let complexityBonus = 0;

  if (patternCount >= 3) {
    complexityBonus = 3;
  }

  if (patternCount >= 6) {
    complexityBonus = 6;
  }

  if (patternCount >= 10) {
    complexityBonus = 8;
  }

  /*
  |--------------------------------------------------------------------------
  | 4. Calculate Initial Risk
  |--------------------------------------------------------------------------
  */

  let riskScore =
    baseScore +
    patternBonus +
    complexityBonus;

  /*
  |--------------------------------------------------------------------------
  | 5. Safe Prompt Protection
  |--------------------------------------------------------------------------
  |
  | A SAFE prompt should never receive a high risk score simply because
  | of accidental or weak indicators.
  |--------------------------------------------------------------------------
  */

  if (threatLevel === "SAFE") {
    riskScore = Math.min(
      riskScore,
      5
    );
  }

  /*
  |--------------------------------------------------------------------------
  | 6. Normalize Risk Score
  |--------------------------------------------------------------------------
  */

  riskScore = Math.min(
    100,
    Math.max(
      0,
      riskScore
    )
  );

  /*
  |--------------------------------------------------------------------------
  | 7. Return Final Score
  |--------------------------------------------------------------------------
  */

  return Math.round(
    riskScore
  );
}