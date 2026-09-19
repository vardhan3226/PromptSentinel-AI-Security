import benchmarkDataset from "./benchmarkDataset.js";
import { detectAttack } from "./detectionEngine.js";
import { analyzeSemanticSimilarity } from "./semanticSimilarityService.js";

function classifyPrompt(prompt) {
  const localResult = detectAttack(prompt);
  const semanticResult = analyzeSemanticSimilarity(prompt);

  return (
    localResult.detected === true ||
    semanticResult.detected === true
  )
    ? "MALICIOUS"
    : "SAFE";
}

function calculateCategoryMetrics(category) {
  const categoryCases = benchmarkDataset.filter(
    (testCase) => testCase.category === category
  );

  let correct = 0;
  let incorrect = 0;

  for (const testCase of categoryCases) {
    const predictedThreat = classifyPrompt(
      testCase.prompt
    );

    if (
      predictedThreat === testCase.expectedThreat
    ) {
      correct++;
    } else {
      incorrect++;
    }
  }

  const total = categoryCases.length;

  const accuracy =
    total > 0
      ? (correct / total) * 100
      : 0;

  return {
    category,
    total,
    correct,
    incorrect,
    accuracy: Number(accuracy.toFixed(2)),
  };
}

function runCategoryBenchmark() {
  const categories = [
    "SAFE",
    "Prompt Injection",
    "Jailbreak",
    "System Prompt Extraction",
    "Role Manipulation",
    "Sensitive Information",
    "Data Exfiltration",
    "Code Execution",
  ];

  return categories.map(
    calculateCategoryMetrics
  );
}

const results = runCategoryBenchmark();

console.log("");
console.log("=================================");
console.log("PROMPTSENTINEL");
console.log("DAY 3 CATEGORY METRICS");
console.log("=================================");

console.log("");
console.log(
  "CATEGORY PERFORMANCE"
);
console.log("---------------------------------");

for (const result of results) {
  console.log(
    `${result.category} | ` +
      `Total: ${result.total} | ` +
      `Correct: ${result.correct} | ` +
      `Incorrect: ${result.incorrect} | ` +
      `Accuracy: ${result.accuracy}%`
  );
}

console.log("");
console.log("=================================");
console.log("CATEGORY BENCHMARK COMPLETED");
console.log("=================================");