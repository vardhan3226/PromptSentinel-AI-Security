import fs from "fs";
import path from "path";
import benchmarkDataset from "./benchmarkDataset.js";
import { detectAttack } from "./detectionEngine.js";
import { analyzeSemanticSimilarity } from "./semanticSimilarityService.js";

function classifyPrompt(prompt) {
  const localResult = detectAttack(prompt);

  const semanticResult =
    analyzeSemanticSimilarity(prompt);

  const predictedThreat =
    localResult.detected === true ||
    semanticResult.detected === true
      ? "MALICIOUS"
      : "SAFE";

  return {
    predictedThreat,
    localDetected:
      localResult.detected === true,
    semanticDetected:
      semanticResult.detected === true,
    similarityScore:
      semanticResult.similarityScore,
  };
}

function calculateMetrics(results) {
  let truePositive = 0;
  let trueNegative = 0;
  let falsePositive = 0;
  let falseNegative = 0;

  for (const result of results) {
    const actualMalicious =
      result.expectedThreat === "MALICIOUS";

    const predictedMalicious =
      result.predictedThreat === "MALICIOUS";

    if (actualMalicious && predictedMalicious) {
      truePositive++;
    } else if (
      !actualMalicious &&
      !predictedMalicious
    ) {
      trueNegative++;
    } else if (
      !actualMalicious &&
      predictedMalicious
    ) {
      falsePositive++;
    } else {
      falseNegative++;
    }
  }

  const total = results.length;

  const accuracy =
    ((truePositive + trueNegative) / total) *
    100;

  const precision =
    truePositive + falsePositive > 0
      ? (truePositive /
          (truePositive + falsePositive)) *
        100
      : 0;

  const recall =
    truePositive + falseNegative > 0
      ? (truePositive /
          (truePositive + falseNegative)) *
        100
      : 0;

  const f1Score =
    precision + recall > 0
      ? (2 * precision * recall) /
        (precision + recall)
      : 0;

  return {
    total,
    truePositive,
    trueNegative,
    falsePositive,
    falseNegative,
    accuracy: Number(accuracy.toFixed(2)),
    precision: Number(precision.toFixed(2)),
    recall: Number(recall.toFixed(2)),
    f1Score: Number(f1Score.toFixed(2)),
  };
}

function calculateCategoryMetrics(results) {
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

  return categories.map((category) => {
    const categoryResults =
      results.filter(
        (result) =>
          result.category === category
      );

    const correct =
      categoryResults.filter(
        (result) => result.correct
      ).length;

    const total = categoryResults.length;

    return {
      category,
      total,
      correct,
      incorrect: total - correct,
      accuracy:
        total > 0
          ? Number(
              ((correct / total) * 100).toFixed(2)
            )
          : 0,
    };
  });
}

function generateReport() {
  const results = benchmarkDataset.map(
    (testCase) => {
      const prediction = classifyPrompt(
        testCase.prompt
      );

      return {
        id: testCase.id,
        category: testCase.category,
        expectedThreat:
          testCase.expectedThreat,
        predictedThreat:
          prediction.predictedThreat,
        correct:
          prediction.predictedThreat ===
          testCase.expectedThreat,
        localDetected:
          prediction.localDetected,
        semanticDetected:
          prediction.semanticDetected,
        similarityScore:
          prediction.similarityScore,
      };
    }
  );

  return {
    project: "PromptSentinel",
    evaluation: {
      name: "Day 3 Benchmark Evaluation",
      datasetSize: benchmarkDataset.length,
      date: new Date().toISOString(),
    },
    metrics: calculateMetrics(results),
    categoryMetrics:
      calculateCategoryMetrics(results),
    results,
  };
}

const report = generateReport();

const reportsDirectory = path.join(
  process.cwd(),
  "benchmark-reports"
);

fs.mkdirSync(reportsDirectory, {
  recursive: true,
});

const reportPath = path.join(
  reportsDirectory,
  "day3-benchmark-report.json"
);

fs.writeFileSync(
  reportPath,
  JSON.stringify(report, null, 2),
  "utf8"
);

console.log("");
console.log("=================================");
console.log("PROMPTSENTINEL");
console.log("DAY 3 EVALUATION REPORT");
console.log("=================================");
console.log("");
console.log(
  `Dataset Size: ${report.evaluation.datasetSize}`
);
console.log(
  `Accuracy: ${report.metrics.accuracy}%`
);
console.log(
  `Precision: ${report.metrics.precision}%`
);
console.log(
  `Recall: ${report.metrics.recall}%`
);
console.log(
  `F1 Score: ${report.metrics.f1Score}%`
);
console.log("");
console.log(
  `Report saved: ${reportPath}`
);
console.log("");
console.log("=================================");
console.log("REPORT GENERATION COMPLETED");
console.log("=================================");