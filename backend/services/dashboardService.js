import prisma from "../lib/prisma.js";

/*
|--------------------------------------------------------------------------
| Dashboard / Analytics Statistics
|--------------------------------------------------------------------------
*/

export const getDashboardStats = async (userId) => {
  const scans = await prisma.promptScan.findMany({
    where: {
      userId,
    },

    select: {
      threatLevel: true,
      riskScore: true,
      attackType: true,
    },
  });

  /*
  |--------------------------------------------------------------------------
  | 1. Total Scans
  |--------------------------------------------------------------------------
  */

  const totalScans = scans.length;

  /*
  |--------------------------------------------------------------------------
  | 2. Threat-Level Counts
  |--------------------------------------------------------------------------
  */

  const safePrompts = scans.filter(
    (scan) => scan.threatLevel === "SAFE"
  ).length;

  const lowRiskPrompts = scans.filter(
    (scan) => scan.threatLevel === "LOW"
  ).length;

  const mediumRiskPrompts = scans.filter(
    (scan) => scan.threatLevel === "MEDIUM"
  ).length;

  const highRiskPrompts = scans.filter(
    (scan) => scan.threatLevel === "HIGH"
  ).length;

  const criticalRiskPrompts = scans.filter(
    (scan) => scan.threatLevel === "CRITICAL"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | 3. High-Risk Findings
  |--------------------------------------------------------------------------
  |
  | HIGH + CRITICAL = High-Risk Findings
  |
  */

  const highRiskFindings =
    highRiskPrompts + criticalRiskPrompts;

  /*
  |--------------------------------------------------------------------------
  | 4. Safe Prompt Rate
  |--------------------------------------------------------------------------
  */

  const safePromptRate =
    totalScans === 0
      ? 0
      : Math.round(
          (safePrompts / totalScans) * 100
        );

  /*
  |--------------------------------------------------------------------------
  | 5. High-Risk Rate
  |--------------------------------------------------------------------------
  */

  const highRiskRate =
    totalScans === 0
      ? 0
      : Math.round(
          (highRiskFindings / totalScans) * 100
        );

  /*
  |--------------------------------------------------------------------------
  | 6. Average Risk Score
  |--------------------------------------------------------------------------
  */

  const totalRiskScore = scans.reduce(
    (total, scan) => {
      return total + Number(scan.riskScore || 0);
    },
    0
  );

  const averageRiskScore =
    totalScans === 0
      ? 0
      : Math.round(
          totalRiskScore / totalScans
        );

  /*
  |--------------------------------------------------------------------------
  | 7. Threat Distribution
  |--------------------------------------------------------------------------
  |
  | Used by the donut/pie chart.
  |
  */

  const threatDistribution = [
    {
      name: "Safe",
      value: safePrompts,
      count: safePrompts,
    },

    {
      name: "Low",
      value: lowRiskPrompts,
      count: lowRiskPrompts,
    },

    {
      name: "Medium",
      value: mediumRiskPrompts,
      count: mediumRiskPrompts,
    },

    {
      name: "High",
      value: highRiskPrompts,
      count: highRiskPrompts,
    },

    {
      name: "Critical",
      value: criticalRiskPrompts,
      count: criticalRiskPrompts,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | 8. Attack-Type Distribution
  |--------------------------------------------------------------------------
  |
  | One scan can contain multiple attack categories.
  |
  | Example:
  |
  | Prompt Injection, System Prompt Extraction
  |
  | Both categories are counted separately.
  |
  */

  const attackTypeCounts = {};

  scans.forEach((scan) => {
    if (!scan.attackType) {
      return;
    }

    const attackTypes = scan.attackType
      .split(",")
      .map((type) => type.trim())
      .filter(Boolean);

    attackTypes.forEach((type) => {
      if (type === "Safe Prompt") {
        return;
      }

      attackTypeCounts[type] =
        (attackTypeCounts[type] || 0) + 1;
    });
  });

  /*
  |--------------------------------------------------------------------------
  | 9. Convert Attack Types to Chart Data
  |--------------------------------------------------------------------------
  */

  const attackTypeDistribution = Object.entries(
    attackTypeCounts
  )
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  /*
  |--------------------------------------------------------------------------
  | 10. Return Final Analytics Data
  |--------------------------------------------------------------------------
  */

  return {
    /*
    | Basic statistics
    */

    totalScans,

    safePrompts,

    lowRiskPrompts,

    mediumRiskPrompts,

    highRiskPrompts,

    criticalRiskPrompts,

    /*
    | Security statistics
    */

    highRiskFindings,

    averageRiskScore,

    safePromptRate,

    highRiskRate,

    /*
    | Chart data
    */

    threatDistribution,

    attackTypeDistribution,
  };
};