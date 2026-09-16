/*
|--------------------------------------------------------------------------
| PromptSentinel - Recommendation Engine
|--------------------------------------------------------------------------
|
| Purpose:
| Generate a security recommendation based on the detected attack type
| and final threat level.
|
| This module does NOT perform detection.
| It only explains what action should be taken after detection.
|
|--------------------------------------------------------------------------
*/

export function generateRecommendation(
  attackType,
  threatLevel
) {
  const recommendations = [];

  /*
  |--------------------------------------------------------------------------
  | Prompt Injection
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Prompt Injection"
    )
  ) {
    recommendations.push(
      "Block this prompt immediately. It attempts to override or manipulate the AI's original instructions."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Jailbreak
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Jailbreak"
    )
  ) {
    recommendations.push(
      "Reject this prompt. It attempts to bypass built-in AI safety mechanisms."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Role Manipulation
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Role Manipulation"
    )
  ) {
    recommendations.push(
      "Review carefully before processing. The prompt attempts to change the AI's intended role or behavior."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | System Prompt Extraction
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "System Prompt Extraction"
    )
  ) {
    recommendations.push(
      "Prevent disclosure of hidden system prompts or internal instructions."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Sensitive Data Exposure
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Sensitive Data Exposure"
    )
  ) {
    recommendations.push(
      "Never reveal credentials, API keys, passwords, tokens, or confidential information."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Command Injection
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Command Injection"
    )
  ) {
    recommendations.push(
      "Reject immediately. Potential command execution or operating system manipulation detected."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Code Execution
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Code Execution"
    )
  ) {
    recommendations.push(
      "Block this request. Dynamic code execution attempts should never be processed."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Data Exfiltration
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Data Exfiltration"
    )
  ) {
    recommendations.push(
      "Prevent any attempt to extract or transmit sensitive information."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Social Engineering
  |--------------------------------------------------------------------------
  */

  if (
    attackType.includes(
      "Social Engineering"
    )
  ) {
    recommendations.push(
      "Verify user intent before continuing. Possible manipulation or deception detected."
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Fallback Recommendation
  |--------------------------------------------------------------------------
  |
  | If no specific attack category was detected, use the final threat
  | level to determine the appropriate security action.
  |--------------------------------------------------------------------------
  */

  if (
    recommendations.length === 0
  ) {
    switch (threatLevel) {
      case "CRITICAL":
        return "Immediate blocking is strongly recommended.";

      case "HIGH":
        return "Manual security review is recommended before processing.";

      case "MEDIUM":
        return "Proceed with caution and monitor the response.";

      case "LOW":
        return "Prompt presents a low security risk. Continue with caution.";

      default:
        return "Prompt appears safe and can be processed normally.";
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Combine Recommendations
  |--------------------------------------------------------------------------
  */

  return recommendations.join(
    " "
  );
}