
import benchmarkUnseenDataset from "./benchmarkUnseenDataset.js";
import { detectAttack } from "./detectionEngine.js";
import { analyzeSemanticSimilarity } from "./semanticSimilarityService.js";

// Check local detection.
function isLocalDetected(result) {
  return Boolean(
    result?.threatLevel &&
      result.threatLevel !== "SAFE"
  );
}

// Check semantic detection.
function isSemanticDetected(result) {
  return result?.detected === true;
}

// Combine both detection engines.
function classifyPrompt(prompt) {
  const localResult = detectAttack(prompt);
  const semanticResult =
    analyzeSemanticSimilarity(prompt);

  const localDetected = isLocalDetected(localResult);
  const semanticDetected =
    isSemanticDetected(semanticResult);

  return {
    predictedThreat:
      localDetected || semanticDetected
        ? "MALICIOUS"
        : "SAFE",
    localDetected,
    semanticDetected,
    localThreatLevel:
      localResult?.threatLevel ?? "SAFE",
    similarityScore:
      semanticResult?.similarityScore ?? 0,
  };
}

// Calculate evaluation metrics.
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
    } else if (
      actualMalicious &&
      !predictedMalicious
    ) {
      falseNegative++;
    }
  }

  const total = results.length;

  const accuracy =
    total > 0
      ? ((truePositive + trueNegative) / total) * 100
      : 0;

  const precision =
    truePositive + falsePositive > 0
      ? (truePositive / (truePositive + falsePositive)) * 100
      : 0;

  const recall =
    truePositive + falseNegative > 0
      ? (truePositive / (truePositive + falseNegative)) * 100
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

// Run the unseen benchmark.
export function runUnseenBenchmark() {
  const results = [];

  for (const testCase of benchmarkUnseenDataset) {
    const detection = classifyPrompt(testCase.prompt);

    results.push({
      id: testCase.id,
      category: testCase.category,
      prompt: testCase.prompt,
      expectedThreat: testCase.expectedThreat,
      predictedThreat: detection.predictedThreat,
      correct:
        testCase.expectedThreat ===
        detection.predictedThreat,
      localDetected: detection.localDetected,
      semanticDetected: detection.semanticDetected,
      localThreatLevel: detection.localThreatLevel,
      similarityScore: detection.similarityScore,
    });
  }

  return {
    metrics: calculateMetrics(results),
    results,
  };
}

// Print the unseen benchmark report.
function printUnseenBenchmarkReport(report) {
  console.log("");
  console.log("=================================");
  console.log("PROMPTSENTINEL");
  console.log("UNSEEN PROMPT EVALUATION");
  console.log("=================================");

  console.log("");
  console.log("BENCHMARK SIZE");
  console.log("---------------------------------");
  console.log(`Total Test Cases: ${report.metrics.total}`);

  console.log("");
  console.log("CONFUSION MATRIX");
  console.log("---------------------------------");
  console.log(`True Positive:  ${report.metrics.truePositive}`);
  console.log(`True Negative:  ${report.metrics.trueNegative}`);
  console.log(`False Positive: ${report.metrics.falsePositive}`);
  console.log(`False Negative: ${report.metrics.falseNegative}`);

  console.log("");
  console.log("EVALUATION METRICS");
  console.log("---------------------------------");
  console.log(`Accuracy:  ${report.metrics.accuracy}%`);
  console.log(`Precision: ${report.metrics.precision}%`);
  console.log(`Recall:    ${report.metrics.recall}%`);
  console.log(`F1 Score:  ${report.metrics.f1Score}%`);

  console.log("");
  console.log("CASE RESULTS");
  console.log("---------------------------------");

  for (const result of report.results) {
    console.log(
      `${result.correct ? "PASS" : "FAIL"} | ` +
        `${result.id} | ` +
        `Expected: ${result.expectedThreat} | ` +
        `Predicted: ${result.predictedThreat} | ` +
        `Local: ${result.localDetected} (${result.localThreatLevel}) | ` +
        `Semantic: ${result.semanticDetected} | ` +
        `Score: ${result.similarityScore}`
    );
  }

  console.log("");
  console.log("=================================");
  console.log("UNSEEN BENCHMARK COMPLETED");
  console.log("=================================");
}

// Execute when this file is run directly.
if (
  process.argv[1]?.endsWith("benchmarkUnseenRunner.js")
) {
  const report = runUnseenBenchmark();
  printUnseenBenchmarkReport(report);
}