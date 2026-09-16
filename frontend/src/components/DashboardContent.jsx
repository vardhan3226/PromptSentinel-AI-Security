import { useNavigate } from "react-router-dom";

import FirewallStatus from "./FirewallStatus";
import SecurityHealthCard from "./SecurityHealthCard";
import ThreatTrendCard from "./ThreatTrendcard";
import TopAttackTypesCard from "./TopAttackTypesCard";
import LiveTimeline from "./LiveTimeline";

import StatCard from "./StatCard";
import PromptScanner from "./PromptScanner";
import ResultCard from "./ResultCard";
import RecentActivity from "./RecentActivity";
import AnalyticsChart from "./AnalyticsChart";

import {
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
  BarChart3,
  ArrowRight,
  Download,
} from "lucide-react";

function DashboardContent({
  user,
  stats,
  prompt,
  setPrompt,
  handleScan,
  loading,
  result,
  history,
  handleExportDashboard,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-8">

      {/* ======================================================
          FIREWALL HEADER
      ====================================================== */}

      <FirewallStatus
        user={user}
      />

      {/* ======================================================
          SECURITY OVERVIEW
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

        <SecurityHealthCard
          stats={stats}
        />

        <ThreatTrendCard
          stats={stats}
        />

      </div>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        {/* TOTAL SCANS */}

        <StatCard
          title="Total Scans"
          value={stats.totalScans || 0}
          icon={
            <ScanSearch size={32} />
          }
          color="text-cyan-400"
          bgColor="bg-slate-900 border border-cyan-500/20"
        />

        {/* SAFE PROMPTS */}

        <StatCard
          title="Safe Prompts"
          value={stats.safePrompts || 0}
          icon={
            <ShieldCheck size={32} />
          }
          color="text-green-400"
          bgColor="bg-slate-900 border border-green-500/20"
        />

        {/* HIGH-RISK FINDINGS */}

        <StatCard
          title="High-Risk Findings"
          value={stats.highRiskFindings || 0}
          icon={
            <ShieldAlert size={32} />
          }
          color="text-red-400"
          bgColor="bg-slate-900 border border-red-500/20"
        />

        {/* HIGH-RISK PROMPTS */}

        <StatCard
          title="High Risk"
          value={stats.highRiskPrompts || 0}
          icon={
            <BarChart3 size={32} />
          }
          color="text-yellow-400"
          bgColor="bg-slate-900 border border-yellow-500/20"
        />

      </div>

      {/* ======================================================
          THREAT INTELLIGENCE
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

        <TopAttackTypesCard
          history={history}
        />

        <LiveTimeline
          history={history}
        />

      </div>

      {/* ======================================================
          PROMPT SCANNER
      ====================================================== */}

      <div className="mt-8">

        <PromptScanner
          prompt={prompt}
          setPrompt={setPrompt}
          handleScan={handleScan}
          loading={loading}
        />

      </div>

      {/* ======================================================
          SCAN RESULT
      ====================================================== */}

      {result && (

        <div className="mt-8">

          <ResultCard
            result={result}
          />

        </div>

      )}

      {/* ======================================================
          RECENT ACTIVITY
      ====================================================== */}

      <div className="mt-8">

        <RecentActivity
          history={history}
        />

      </div>

      {/* ======================================================
          ANALYTICS
      ====================================================== */}

      <div className="mt-8 bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-xl">

        {/* ANALYTICS HEADER */}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Analytics Overview
            </h2>

            <p className="text-slate-400 mt-2">
              AI Prompt Security Dashboard
            </p>

          </div>

          {/* ANALYTICS ACTIONS */}

          <div className="flex flex-wrap gap-4">

            {/* EXPORT REPORT */}

            <button
              type="button"
              onClick={handleExportDashboard}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
            >

              <Download size={20} />

              Export Dashboard Report

            </button>

            {/* VIEW ANALYTICS */}

            <button
              type="button"
              onClick={() =>
                navigate("/analytics")
              }
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 px-6 py-3 rounded-xl font-bold text-slate-950 transition-all duration-300 hover:scale-105"
            >

              View Analytics

              <ArrowRight size={18} />

            </button>

          </div>

        </div>

        {/* ANALYTICS CHART */}

        <AnalyticsChart
          stats={stats}
        />

      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <div className="mt-10 text-center border-t border-slate-800 pt-8">

        <h3 className="text-cyan-400 font-bold text-lg">
          PromptSentinel AI Security Platform
        </h3>

        <p className="text-slate-500 mt-2">
          Protecting AI Systems Against Prompt Injection,
          Jailbreaks, Data Leakage and Advanced Prompt Attacks.
        </p>

        <p className="text-slate-600 text-sm mt-3">
          © {new Date().getFullYear()} PromptSentinel |
          Final Year Project
        </p>

      </div>

    </div>
  );
}

export default DashboardContent;