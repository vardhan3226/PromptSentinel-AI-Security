/*
|--------------------------------------------------------------------------
| PromptSentinel - Prompt Preprocessor
|--------------------------------------------------------------------------
|
| Purpose:
| Prepare an incoming prompt before security detection.
|
| This does NOT decide whether a prompt is malicious.
| It extracts useful security features for the detection engine.
|
|--------------------------------------------------------------------------
*/

export function preprocessPrompt(prompt) {
  if (typeof prompt !== "string") {
    throw new Error("Prompt must be a string.");
  }

  const originalPrompt = prompt;

  const normalizedPrompt = prompt
    .normalize("NFKC")
    .toLowerCase()
    .trim();

  /*
  |--------------------------------------------------------------------------
  | Basic statistics
  |--------------------------------------------------------------------------
  */

  const characterCount = originalPrompt.length;

  const wordCount =
    normalizedPrompt.length === 0
      ? 0
      : normalizedPrompt.split(/\s+/).length;

  const lineCount =
    originalPrompt.length === 0
      ? 0
      : originalPrompt.split(/\r?\n/).length;

  /*
  |--------------------------------------------------------------------------
  | Detect URLs
  |--------------------------------------------------------------------------
  */

  const urls =
    originalPrompt.match(
      /https?:\/\/[^\s]+/gi
    ) || [];

  /*
  |--------------------------------------------------------------------------
  | Detect encoded content
  |--------------------------------------------------------------------------
  */

  const base64Like =
    /(?:[A-Za-z0-9+/]{20,}={0,2})/.test(
      originalPrompt
    );

  const hexLike =
    /(?:0x[0-9a-f]{4,}|(?:[0-9a-f]{2}\s*){8,})/i.test(
      originalPrompt
    );

  /*
  |--------------------------------------------------------------------------
  | Detect instruction hierarchy manipulation
  |--------------------------------------------------------------------------
  */

  const hierarchyPatterns = [
    "ignore previous",
    "ignore all previous",
    "disregard previous",
    "override previous",
    "override system",
    "new system instruction",
    "new developer instruction",
    "highest priority",
    "higher priority",
    "system message",
    "developer message",
    "you must obey",
    "you are required to obey",
  ];

  const hierarchyIndicators =
    hierarchyPatterns.filter((pattern) =>
      normalizedPrompt.includes(pattern)
    );

  /*
  |--------------------------------------------------------------------------
  | Detect role manipulation
  |--------------------------------------------------------------------------
  */

  const rolePatterns = [
    "you are now",
    "act as",
    "pretend to be",
    "roleplay as",
    "assume the role",
    "impersonate",
    "you are the system",
    "you are the developer",
    "you are an administrator",
  ];

  const roleIndicators =
    rolePatterns.filter((pattern) =>
      normalizedPrompt.includes(pattern)
    );

  /*
  |--------------------------------------------------------------------------
  | Detect security bypass language
  |--------------------------------------------------------------------------
  */

  const bypassPatterns = [
    "bypass",
    "disable safety",
    "remove restrictions",
    "without restrictions",
    "ignore safety",
    "ignore policy",
    "ignore policies",
    "disable filters",
    "uncensored",
    "unfiltered",
    "no limitations",
  ];

  const bypassIndicators =
    bypassPatterns.filter((pattern) =>
      normalizedPrompt.includes(pattern)
    );

  /*
  |--------------------------------------------------------------------------
  | Detect extraction intent
  |--------------------------------------------------------------------------
  */

  const extractionPatterns = [
    "reveal system prompt",
    "show system prompt",
    "print system prompt",
    "reveal hidden instructions",
    "show hidden instructions",
    "reveal your instructions",
    "show your instructions",
    "what are your instructions",
    "reveal internal configuration",
    "show internal configuration",
  ];

  const extractionIndicators =
    extractionPatterns.filter((pattern) =>
      normalizedPrompt.includes(pattern)
    );

  /*
  |--------------------------------------------------------------------------
  | Detect secret / credential requests
  |--------------------------------------------------------------------------
  */

  const secretPatterns = [
    "api key",
    "secret key",
    "password",
    "private key",
    "access token",
    "authentication token",
    "jwt secret",
    "database credentials",
    "environment variables",
    ".env",
  ];

  const secretIndicators =
    secretPatterns.filter((pattern) =>
      normalizedPrompt.includes(pattern)
    );

  /*
  |--------------------------------------------------------------------------
  | Detect suspicious command/code execution language
  |--------------------------------------------------------------------------
  */

  const executionPatterns = [
    "execute arbitrary code",
    "run arbitrary code",
    "execute this code",
    "run this command",
    "execute this command",
    "shell command",
    "powershell",
    "cmd.exe",
    "sudo",
    "eval(",
    "exec(",
    "os.system(",
    "subprocess",
  ];

  const executionIndicators =
    executionPatterns.filter((pattern) =>
      normalizedPrompt.includes(pattern)
    );

  /*
  |--------------------------------------------------------------------------
  | Detect suspicious delimiter usage
  |--------------------------------------------------------------------------
  |
  | Attackers sometimes try to make untrusted text look like
  | system/developer messages.
  |
  |--------------------------------------------------------------------------
  */

  const delimiterPatterns = [
    "<system>",
    "</system>",
    "<developer>",
    "</developer>",
    "<assistant>",
    "</assistant>",
    "[system]",
    "[developer]",
    "[assistant]",
    "system:",
    "developer:",
    "assistant:",
  ];

  const delimiterIndicators =
    delimiterPatterns.filter((pattern) =>
      normalizedPrompt.includes(pattern)
    );

  /*
  |--------------------------------------------------------------------------
  | Calculate structural risk indicators
  |--------------------------------------------------------------------------
  */

  const featureCount =
    hierarchyIndicators.length +
    roleIndicators.length +
    bypassIndicators.length +
    extractionIndicators.length +
    secretIndicators.length +
    executionIndicators.length +
    delimiterIndicators.length;

  /*
  |--------------------------------------------------------------------------
  | Return extracted security features
  |--------------------------------------------------------------------------
  */

  return {
    originalPrompt,

    normalizedPrompt,

    characterCount,

    wordCount,

    lineCount,

    urls,

    urlCount: urls.length,

    encodingIndicators: {
      base64Like,
      hexLike,
    },

    hierarchyIndicators,

    roleIndicators,

    bypassIndicators,

    extractionIndicators,

    secretIndicators,

    executionIndicators,

    delimiterIndicators,

    featureCount,
  };
}

export default preprocessPrompt;