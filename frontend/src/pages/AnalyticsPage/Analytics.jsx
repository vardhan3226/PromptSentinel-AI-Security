import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import AnalyticsChart from "../../components/AnalyticsChart";

import {
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";

function AnalyticsPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalScans: 0,
    safePrompts: 0,
    lowRiskPrompts: 0,
    mediumRiskPrompts: 0,
    highRiskPrompts: 0,
    criticalRiskPrompts: 0,
    threatsBlocked: 0,
    highRiskFindings: 0,
    averageRiskScore: 0,
    safePromptRate: 0,
    attackTypeDistribution: [],
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD ANALYTICS STATISTICS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error(
          "Failed to fetch analytics statistics:",
          error
        );
      }
    };

    loadStats();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar
        active="Analytics"
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <div className="flex-1 p-8 overflow-y-auto">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="bg-slate-900 rounded-3xl border border-cyan-500/20 p-8">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-4xl font-bold">
                Security Analytics
              </h1>

              <p className="text-slate-400 mt-2">
                AI Prompt Security Statistics & Threat Insights
              </p>

            </div>

            <BarChart3
              size={55}
              className="text-cyan-400"
            />

          </div>

        </div>

        {/* =====================================================
            STATISTICS CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          {/* TOTAL SCANS */}

          <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6">

            <Activity
              className="text-cyan-400 mb-4"
              size={34}
            />

            <p className="text-slate-400">
              Total Scans
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {stats.totalScans}
            </h2>

          </div>

          {/* SAFE PROMPTS */}

          <div className="bg-slate-900 border border-green-500/20 rounded-2xl p-6">

            <ShieldCheck
              className="text-green-400 mb-4"
              size={34}
            />

            <p className="text-slate-400">
              Safe Prompts
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              {stats.safePrompts}
            </h2>

          </div>

          {/* HIGH RISK PROMPTS */}

          <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6">

            <ShieldAlert
              className="text-red-400 mb-4"
              size={34}
            />

            <p className="text-slate-400">
              High Risk
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              {stats.highRiskPrompts}
            </h2>

          </div>

          {/* THREATS BLOCKED */}

          <div className="bg-slate-900 border border-yellow-500/20 rounded-2xl p-6">

            <ShieldAlert
              className="text-yellow-400 mb-4"
              size={34}
            />

            <p className="text-slate-400">
              Threats Blocked
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              {stats.threatsBlocked}
            </h2>

          </div>

        </div>

        {/* =====================================================
            ANALYTICS CHARTS
        ====================================================== */}

        <div className="mt-10">

          <AnalyticsChart
            stats={stats}
          />

        </div>

      </div>

    </div>
  );
}

export default AnalyticsPage;