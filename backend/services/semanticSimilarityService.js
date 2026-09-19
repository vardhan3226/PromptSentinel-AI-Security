import attackPatterns from "./attackPatterns.js";

const synonymGroups = [
  ["ignore", "disregard", "forget", "override", "bypass", "skip"],
  [
    "instruction",
    "instructions",
    "command",
    "commands",
    "rules",
    "guidelines",
    "policies",
    "directions",
  ],
  [
    "system",
    "systemprompt",
    "prompt",
    "hidden",
    "internal",
    "developer",
  ],
  ["reveal", "show", "display", "print", "repeat", "expose"],
  [
    "safety",
    "safeguards",
    "restrictions",
    "restriction",
    "limitations",
    "controls",
  ],
  [
    "pretend",
    "act",
    "assume",
    "roleplay",
    "impersonate",
    "behave",
  ],
  [
    "unrestricted",
    "uncensored",
    "unfiltered",
    "unlimited",
    "unrestricted",
  ],
  [
    "secret",
    "confidential",
    "private",
    "sensitive",
    "protected",
  ],
  ["extract", "steal", "download", "dump", "export", "copy"],
  ["priority", "precedence", "authority", "highest"],
  ["original", "previous", "earlier", "prior"],
  ["matter", "apply", "follow", "obey", "respect"],
];

const semanticConcepts = [
  {
    attackType: "Prompt Injection",
    pattern: "instruction hierarchy override",
    requiredGroups: [
      ["instruction", "instructions", "command", "commands", "rules", "guidelines", "policies", "directions"],
      ["ignore", "disregard", "forget", "override", "bypass", "skip"],
      ["priority", "precedence", "authority", "highest"],
    ],
    score: 72,
  },
  {
    attackType: "Prompt Injection",
    pattern: "attacker instructions treated as highest priority",
    requiredGroups: [
      ["instruction", "instructions", "command", "commands", "rules", "guidelines", "policies", "directions"],
      ["priority", "precedence", "authority", "highest"],
      ["follow", "obey", "respect"],
    ],
    score: 68,
  },
  {
    attackType: "Jailbreak",
    pattern: "disable or disregard safety restrictions",
    requiredGroups: [
      ["safety", "safeguards", "restrictions", "restriction", "limitations", "controls"],
      ["ignore", "disregard", "forget", "override", "bypass", "skip"],
    ],
    score: 70,
  },
  {
    attackType: "Role Manipulation",
    pattern: "assume an unrestricted role",
    requiredGroups: [
      ["pretend", "act", "assume", "roleplay", "impersonate", "behave"],
      ["unrestricted", "uncensored", "unfiltered", "unlimited"],
    ],
    score: 70,
  },
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text) {
  return normalizeText(text)
    .split(" ")
    .filter((word) => word.length > 2);
}

function areSemanticallyRelated(wordA, wordB) {
  if (wordA === wordB) {
    return true;
  }

  return synonymGroups.some(
    (group) =>
      group.includes(wordA) &&
      group.includes(wordB)
  );
}

function containsRelatedWord(words, group) {
  return words.some((word) =>
    group.some((groupWord) =>
      areSemanticallyRelated(word, groupWord)
    )
  );
}

function analyzeSemanticConcepts(prompt) {
  const words = getWords(prompt);
  const matches = [];

  for (const concept of semanticConcepts) {
    const matchedGroups = concept.requiredGroups.filter(
      (group) => containsRelatedWord(words, group)
    );

    if (
      matchedGroups.length ===
      concept.requiredGroups.length
    ) {
      matches.push({
        attackType: concept.attackType,
        pattern: concept.pattern,
        similarityScore: concept.score,
      });
    }
  }

  return matches;
}

function isCodeSyntaxPattern(attackType, pattern) {
  if (attackType !== "Code Execution") {
    return false;
  }

  return /[^a-zA-Z0-9\s]/.test(pattern);
}

function calculateSimilarity(prompt, pattern) {
  const normalizedPrompt = normalizeText(prompt);
  const normalizedPattern = normalizeText(pattern);

  if (!normalizedPrompt || !normalizedPattern) {
    return 0;
  }

  if (normalizedPrompt.includes(normalizedPattern)) {
    return 100;
  }

  const promptWords = getWords(prompt);
  const patternWords = getWords(pattern);

  if (
    promptWords.length === 0 ||
    patternWords.length === 0
  ) {
    return 0;
  }

  let matchedPatternWords = 0;
  let matchedPromptWords = 0;

  for (const patternWord of patternWords) {
    const matched = promptWords.some((promptWord) =>
      areSemanticallyRelated(
        promptWord,
        patternWord
      )
    );

    if (matched) {
      matchedPatternWords++;
    }
  }

  for (const promptWord of promptWords) {
    const matched = patternWords.some((patternWord) =>
      areSemanticallyRelated(
        promptWord,
        patternWord
      )
    );

    if (matched) {
      matchedPromptWords++;
    }
  }

  const recall =
    matchedPatternWords / patternWords.length;

  const precision =
    matchedPromptWords / promptWords.length;

  if (precision + recall === 0) {
    return 0;
  }

  const f1 =
    (2 * precision * recall) /
    (precision + recall);

  return Math.round(f1 * 100);
}

export function analyzeSemanticSimilarity(prompt) {
  if (
    typeof prompt !== "string" ||
    !prompt.trim()
  ) {
    return {
      detected: false,
      similarityScore: 0,
      matches: [],
      summary: "No semantic similarity detected",
    };
  }

  const matches = [];

  const conceptMatches =
    analyzeSemanticConcepts(prompt);

  matches.push(...conceptMatches);

  for (const attack of attackPatterns) {
    for (const pattern of attack.patterns) {
      if (
        isCodeSyntaxPattern(
          attack.attackType,
          pattern
        )
      ) {
        continue;
      }

      const similarityScore = calculateSimilarity(
        prompt,
        pattern
      );

      if (similarityScore >= 40) {
        matches.push({
          attackType: attack.attackType,
          pattern,
          similarityScore,
        });
      }
    }
  }

  matches.sort(
    (a, b) =>
      b.similarityScore - a.similarityScore
  );

  const uniqueMatches = [];
  const seen = new Set();

  for (const match of matches) {
    const key = `${match.attackType}:${match.pattern}`;

    if (!seen.has(key)) {
      seen.add(key);
      uniqueMatches.push(match);
    }
  }

  const topMatches = uniqueMatches.slice(0, 10);

  const similarityScore =
    topMatches.length > 0
      ? topMatches[0].similarityScore
      : 0;

  return {
    detected: similarityScore >= 40,
    similarityScore,
    matches: topMatches,
    summary:
      similarityScore >= 40
        ? `Semantic similarity detected with ${topMatches[0].attackType} patterns`
        : "No semantic similarity detected",
  };
}

export default analyzeSemanticSimilarity;