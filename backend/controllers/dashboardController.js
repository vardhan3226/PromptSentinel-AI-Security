import { getDashboardStats } from "../services/dashboardService.js";
import { runBenchmark } from "../services/benchmarkRunner.js";

export const dashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStats(req.user.id);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

export const dashboardBenchmark = async (req, res) => {
  try {
    const benchmark = runBenchmark();

    return res.status(200).json({
      success: true,
      benchmark,
    });
  } catch (error) {
    console.error(
      "Benchmark Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Benchmark execution failed.",
    });
  }
};