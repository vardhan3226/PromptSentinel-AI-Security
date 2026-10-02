import prisma from "../lib/prisma.js";

/*
|--------------------------------------------------------------------------
| Dashboard / Analytics Statistics
|--------------------------------------------------------------------------
|
| All analytics are calculated from the authenticated user's PromptScan
| records stored in PostgreSQL.
|
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
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
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
  | HIGH + CRITICAL
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
  | Used by Analytics charts.
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
  | A scan may contain multiple attack categories.
  |
  | Example:
  |
  | Prompt Injection, System Prompt Extraction
  |
  | Both categories are counted independently.
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
  | 10. Scan Activity - Last 7 Days
  |--------------------------------------------------------------------------
  |
  | Provides real database-backed daily scan activity.
  |
  */

  const scanActivity = [];

  const now = new Date();

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(now);

    date.setDate(
      date.getDate() - index
    );

    const dateKey = date
      .toISOString()
      .slice(0, 10);

    const dayScans = scans.filter(
      (scan) => {
        if (!scan.createdAt) {
          return false;
        }

        return (
          new Date(scan.createdAt)
            .toISOString()
            .slice(0, 10) === dateKey
        );
      }
    );

    scanActivity.push({
      date: dateKey,
      scans: dayScans.length,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | 11. Daily Threat Activity - Last 7 Days
  |--------------------------------------------------------------------------
  |
  | Gives the Analytics page a day-by-day security breakdown.
  |
  */

  const dailyThreatActivity = [];

  const threatLevels = [
    "SAFE",
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(now);

    date.setDate(
      date.getDate() - index
    );

    const dateKey = date
      .toISOString()
      .slice(0, 10);

    const dayScans = scans.filter(
      (scan) => {
        if (!scan.createdAt) {
          return false;
        }

        return (
          new Date(scan.createdAt)
            .toISOString()
            .slice(0, 10) === dateKey
        );
      }
    );

    const dayData = {
      date: dateKey,
      total: dayScans.length,
    };

    threatLevels.forEach(
      (level) => {
        dayData[level.toLowerCase()] =
          dayScans.filter(
            (scan) =>
              scan.threatLevel === level
          ).length;
      }
    );

    dailyThreatActivity.push(dayData);
  }

  /*
  |--------------------------------------------------------------------------
  | 12. Return Final Analytics Data
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

    /*
    | Trend / activity data
    */

    scanActivity,

    dailyThreatActivity,
  };
};