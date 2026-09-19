import preprocessPrompt from "./promptPreprocessor.js";
import { detectAttack } from "./detectionEngine.js";
import { analyzeSemanticSimilarity } from "./semanticSimilarityService.js";
import { generateAttackMutations } from "./attackMutationService.js";

function analyzeMutation(prompt) {
  const preprocessed = preprocessPrompt(prompt);
  const localResult = detectAttack(preprocessed);
  const semanticResult = analyzeSemanticSimilarity(prompt);

  const localDetected =
    localResult.threatLevel !== "SAFE";

  const semanticDetected =
    semanticResult.detected;

  return {
    detected:
      localDetected || semanticDetected,
    localDetected,
    semanticDetected,
    threatLevel:
      localResult.threatLevel,
    similarityScore:
      semanticResult.similarityScore,
  };
}

export function testAttackRobustness(prompt) {
  if (
    typeof prompt !== "string" ||
    !prompt.trim()
  ) {
    return {
      originalPrompt: prompt,
      totalMutations: 0,
      detectedMutations: 0,
      missedMutations: 0,
      detectionRate: 0,
      results: [],
    };
  }

  const mutations =
    generateAttackMutations(prompt);

  const results = mutations.map(
    (mutation, index) => {
      const analysis =
        analyzeMutation(mutation);

      return {
        index: index + 1,
        mutation,
        ...analysis,
      };
    }
  );

  const detectedMutations =
    results.filter(
      (result) => result.detected
    ).length;

  const missedMutations =
    results.length -
    detectedMutations;

  const detectionRate =
    results.length > 0
      ? Math.round(
          (detectedMutations /
            results.length) *
            100
        )
      : 0;

  return {
    originalPrompt: prompt,
    totalMutations: results.length,
    detectedMutations,
    missedMutations,
    detectionRate,
    results,
  };
}

export default testAttackRobustness;