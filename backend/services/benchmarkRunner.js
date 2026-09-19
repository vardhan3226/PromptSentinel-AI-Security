import benchmarkDataset from "./benchmarkDataset.js";
import { detectAttack } from "./detectionEngine.js";
import { analyzeSemanticSimilarity } from "./semanticSimilarityService.js";

function isMalicious(result, semanticResult) {
  return (
    result.detected === true ||
    semanticResult.detected === true
  );
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
      ? ((truePositive + trueNegative) /
          total) *
        100
      : 0;

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
    accuracy: Number(
      accuracy.toFixed(2)
    ),
    precision: Number(
      precision.toFixed(2)
    ),
    recall: Number(
      recall.toFixed(2)
    ),
    f1Score: Number(
      f1Score.toFixed(2)
    ),
  };
}

export function runBenchmark() {
  const results = [];

  for (const testCase of benchmarkDataset) {
    const localResult =
      detectAttack(testCase.prompt);

    const semanticResult =
      analyzeSemanticSimilarity(
        testCase.prompt
      );

    const predictedThreat =
      isMalicious(
        localResult,
        semanticResult
      )
        ? "MALICIOUS"
        : "SAFE";

    results.push({
      id: testCase.id,

      category:
        testCase.category,

      prompt:
        testCase.prompt,

      expectedThreat:
        testCase.expectedThreat,

      predictedThreat,

      correct:
        testCase.expectedThreat ===
        predictedThreat,

      localDetected:
        localResult.detected === true,

      semanticDetected:
        semanticResult.detected === true,

      similarityScore:
        semanticResult.similarityScore,
    });
  }

  const metrics =
    calculateMetrics(results);

  return {
    metrics,
    results,
  };
}

function printBenchmarkReport(report) {
  console.log("");
  console.log("=================================");
  console.log("PROMPTSENTINEL");
  console.log("DAY 3 BENCHMARK");
  console.log("=================================");

  console.log("");
  console.log("BENCHMARK SIZE");
  console.log("---------------------------------");
  console.log(
    `Total Test Cases: ${report.metrics.total}`
  );

  console.log("");
  console.log("CONFUSION MATRIX");
  console.log("---------------------------------");
  console.log(
    `True Positive:  ${report.metrics.truePositive}`
  );
  console.log(
    `True Negative:  ${report.metrics.trueNegative}`
  );
  console.log(
    `False Positive: ${report.metrics.falsePositive}`
  );
  console.log(
    `False Negative: ${report.metrics.falseNegative}`
  );

  console.log("");
  console.log("EVALUATION METRICS");
  console.log("---------------------------------");
  console.log(
    `Accuracy:  ${report.metrics.accuracy}%`
  );
  console.log(
    `Precision: ${report.metrics.precision}%`
  );
  console.log(
    `Recall:    ${report.metrics.recall}%`
  );
  console.log(
    `F1 Score:  ${report.metrics.f1Score}%`
  );

  console.log("");
  console.log("CASE RESULTS");
  console.log("---------------------------------");

  for (const result of report.results) {
    console.log(
      `${result.correct ? "PASS" : "FAIL"} | ` +
        `${result.id} | ` +
        `Expected: ${result.expectedThreat} | ` +
        `Predicted: ${result.predictedThreat} | ` +
        `Semantic: ${result.semanticDetected} | ` +
        `Score: ${result.similarityScore}`
    );
  }

  console.log("");
  console.log("=================================");
  console.log("BENCHMARK COMPLETED");
  console.log("=================================");
}

if (
  process.argv[1]?.endsWith(
    "benchmarkRunner.js"
  )
) {
  const report = runBenchmark();

  printBenchmarkReport(report);
}