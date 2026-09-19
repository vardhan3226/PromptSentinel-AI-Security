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
  Target,
  CheckCircle,
  XCircle,
  Activity,
  ShieldX,
  RefreshCw,
} from "lucide-react";

function DashboardContent({
  user,
  stats,
  benchmark,
  robustness,
  robustnessLoading,
  prompt,
  setPrompt,
  handleScan,
  handleRobustnessTest,
  loading,
  result,
  history,
  handleExportDashboard,
}) {
  const navigate = useNavigate();

  const benchmarkMetrics =
    benchmark?.metrics || {};

  const robustnessResults =
    Array.isArray(robustness?.results)
      ? robustness.results
      : [];

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-8">

      <FirewallStatus
        user={user}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

        <SecurityHealthCard
          stats={stats}
        />

        <ThreatTrendCard
          stats={stats}
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        <StatCard
          title="Total Scans"
          value={stats.totalScans || 0}
          icon={
            <ScanSearch size={32} />
          }
          color="text-cyan-400"
          bgColor="bg-slate-900 border border-cyan-500/20"
        />

        <StatCard
          title="Safe Prompts"
          value={stats.safePrompts || 0}
          icon={
            <ShieldCheck size={32} />
          }
          color="text-green-400"
          bgColor="bg-slate-900 border border-green-500/20"
        />

        <StatCard
          title="High-Risk Findings"
          value={stats.highRiskFindings || 0}
          icon={
            <ShieldAlert size={32} />
          }
          color="text-red-400"
          bgColor="bg-slate-900 border border-red-500/20"
        />

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">

        <TopAttackTypesCard
          history={history}
        />

        <LiveTimeline
          history={history}
        />

      </div>

      <div className="mt-8">

        <PromptScanner
          prompt={prompt}
          setPrompt={setPrompt}
          handleScan={handleScan}
          loading={loading}
        />

      </div>

      <div className="mt-8 bg-slate-900 border border-orange-500/20 rounded-3xl p-8 shadow-xl">

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

          <div>

            <div className="flex items-center gap-3">

              <RefreshCw
                size={30}
                className="text-orange-400"
              />

              <h2 className="text-3xl font-bold text-white">
                Attack Robustness Test
              </h2>

            </div>

            <p className="text-slate-400 mt-2">
              Day 5 mutation testing evaluates whether
              PromptSentinel can detect modified versions
              of the same attack.
            </p>

          </div>

          <button
            type="button"
            onClick={handleRobustnessTest}
            disabled={
              robustnessLoading ||
              !prompt.trim()
            }
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-3 rounded-xl transition-all duration-300"
          >

            <RefreshCw
              size={20}
              className={
                robustnessLoading
                  ? "animate-spin"
                  : ""
              }
            />

            {robustnessLoading
              ? "Testing..."
              : "Run Robustness Test"}

          </button>

        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-slate-950 border border-orange-500/20 rounded-2xl p-6">

            <p className="text-slate-400">
              Total Mutations
            </p>

            <p className="text-4xl font-bold text-orange-400 mt-3">
              {robustness?.totalMutations || 0}
            </p>

          </div>

          <div className="bg-slate-950 border border-green-500/20 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <p className="text-slate-400">
                Detected
              </p>

              <CheckCircle
                size={22}
                className="text-green-400"
              />

            </div>

            <p className="text-4xl font-bold text-green-400 mt-3">
              {robustness?.detectedMutations || 0}
            </p>

          </div>

          <div className="bg-slate-950 border border-red-500/20 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <p className="text-slate-400">
                Missed
              </p>

              <XCircle
                size={22}
                className="text-red-400"
              />

            </div>

            <p className="text-4xl font-bold text-red-400 mt-3">
              {robustness?.missedMutations || 0}
            </p>

          </div>

          <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <p className="text-slate-400">
                Detection Rate
              </p>

              <Target
                size={22}
                className="text-cyan-400"
              />

            </div>

            <p className="text-4xl font-bold text-cyan-400 mt-3">
              {robustness?.detectionRate || 0}%
            </p>

          </div>

        </div>

        {robustness?.originalPrompt && (
          <div className="mt-6 bg-slate-950 border border-slate-700 rounded-2xl p-6">

            <div className="flex items-center gap-3 mb-3">

              <ScanSearch
                size={22}
                className="text-orange-400"
              />

              <h3 className="font-bold text-lg text-white">
                Tested Attack
              </h3>

            </div>

            <p className="text-slate-300 leading-7 whitespace-pre-wrap break-words">
              {robustness.originalPrompt}
            </p>

          </div>
        )}

        {robustnessResults.length > 0 && (
          <div className="mt-6">

            <div className="flex items-center gap-3 mb-5">

              <ShieldCheck
                size={24}
                className="text-cyan-400"
              />

              <div>

                <h3 className="font-bold text-lg text-white">
                  Mutation Results
                </h3>

                <p className="text-sm text-slate-500">
                  Detection performance across generated attack variations
                </p>

              </div>

            </div>

            <div className="space-y-3">

              {robustnessResults.map(
                (item) => (
                  <div
                    key={item.index}
                    className={`bg-slate-950 border rounded-2xl p-5 ${
                      item.detected
                        ? "border-green-500/20"
                        : "border-red-500/20"
                    }`}
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div className="flex items-start gap-4">

                        <div
                          className={`shrink-0 mt-1 ${
                            item.detected
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >

                          {item.detected ? (
                            <CheckCircle size={22} />
                          ) : (
                            <ShieldX size={22} />
                          )}

                        </div>

                        <div>

                          <p className="text-white font-semibold">
                            Mutation {item.index}
                          </p>

                          <p className="text-slate-400 mt-2 leading-6 break-words">
                            {item.mutation}
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            item.detected
                              ? "bg-green-500/10 border border-green-500/20 text-green-400"
                              : "bg-red-500/10 border border-red-500/20 text-red-400"
                          }`}
                        >
                          {item.detected
                            ? "Detected"
                            : "Missed"}
                        </span>

                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          Semantic {item.similarityScore || 0}%
                        </span>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {!robustness?.originalPrompt &&
          !robustnessLoading && (
            <div className="mt-6 bg-slate-950 border border-slate-700 rounded-2xl p-6 text-center">

              <RefreshCw
                size={32}
                className="text-slate-600 mx-auto mb-3"
              />

              <p className="text-slate-400">
                Enter an attack prompt above and run the
                robustness test to evaluate mutation detection.
              </p>

            </div>
          )}

      </div>

      {result && (
        <div className="mt-8">

          <ResultCard
            result={result}
          />

        </div>
      )}

      <div className="mt-8">

        <RecentActivity
          history={history}
        />

      </div>

      <div className="mt-8 bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-xl">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">

          <div>

            <h2 className="text-3xl font-bold text-white">
              Analytics Overview
            </h2>

            <p className="text-slate-400 mt-2">
              AI Prompt Security Dashboard
            </p>

          </div>

          <div className="flex flex-wrap gap-4">

            <button
              type="button"
              onClick={handleExportDashboard}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
            >

              <Download size={20} />

              Export Dashboard Report

            </button>

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

        <AnalyticsChart
          stats={stats}
        />

      </div>

      <div className="mt-8 bg-slate-900 border border-purple-500/20 rounded-3xl p-8 shadow-xl">

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">

          <div>

            <div className="flex items-center gap-3">

              <Target
                size={30}
                className="text-purple-400"
              />

              <h2 className="text-3xl font-bold text-white">
                Benchmark & Evaluation
              </h2>

            </div>

            <p className="text-slate-400 mt-2">
              Day 3 security detection evaluation
              using the PromptSentinel benchmark
              dataset.
            </p>

          </div>

          <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">

            <span className="text-purple-400 font-semibold">
              {benchmarkMetrics.total || 0} Test Cases
            </span>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <p className="text-slate-400">
                Accuracy
              </p>

              <Target
                size={22}
                className="text-cyan-400"
              />

            </div>

            <p className="text-4xl font-bold text-cyan-400 mt-3">
              {benchmarkMetrics.accuracy || 0}%
            </p>

          </div>

          <div className="bg-slate-950 border border-green-500/20 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <p className="text-slate-400">
                Precision
              </p>

              <CheckCircle
                size={22}
                className="text-green-400"
              />

            </div>

            <p className="text-4xl font-bold text-green-400 mt-3">
              {benchmarkMetrics.precision || 0}%
            </p>

          </div>

          <div className="bg-slate-950 border border-blue-500/20 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <p className="text-slate-400">
                Recall
              </p>

              <Activity
                size={22}
                className="text-blue-400"
              />

            </div>

            <p className="text-4xl font-bold text-blue-400 mt-3">
              {benchmarkMetrics.recall || 0}%
            </p>

          </div>

          <div className="bg-slate-950 border border-purple-500/20 rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <p className="text-slate-400">
                F1 Score
              </p>

              <Target
                size={22}
                className="text-purple-400"
              />

            </div>

            <p className="text-4xl font-bold text-purple-400 mt-3">
              {benchmarkMetrics.f1Score || 0}%
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">

          <div className="bg-slate-950 border border-green-500/20 rounded-2xl p-5">

            <p className="text-slate-400">
              True Positive
            </p>

            <p className="text-3xl font-bold text-green-400 mt-2">
              {benchmarkMetrics.truePositive || 0}
            </p>

          </div>

          <div className="bg-slate-950 border border-cyan-500/20 rounded-2xl p-5">

            <p className="text-slate-400">
              True Negative
            </p>

            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {benchmarkMetrics.trueNegative || 0}
            </p>

          </div>

          <div className="bg-slate-950 border border-yellow-500/20 rounded-2xl p-5">

            <p className="text-slate-400">
              False Positive
            </p>

            <div className="flex items-center gap-2 mt-2">

              <p className="text-3xl font-bold text-yellow-400">
                {benchmarkMetrics.falsePositive || 0}
              </p>

              <XCircle
                size={20}
                className="text-yellow-400"
              />

            </div>

          </div>

          <div className="bg-slate-950 border border-red-500/20 rounded-2xl p-5">

            <p className="text-slate-400">
              False Negative
            </p>

            <div className="flex items-center gap-2 mt-2">

              <p className="text-3xl font-bold text-red-400">
                {benchmarkMetrics.falseNegative || 0}
              </p>

              <XCircle
                size={20}
                className="text-red-400"
              />

            </div>

          </div>

        </div>

      </div>

      <div className="mt-10 text-center border-t border-slate-800 pt-8">

        <h3 className="text-cyan-400 font-bold text-lg">
          PromptSentinel AI Security Platform
        </h3>

        <p className="text-slate-500 mt-2">
          Protecting AI Systems Against Prompt Injection,
          Jailbreaks, Data Leakage and Advanced Prompt Attacks.
        </p>

        <p className="text-slate-600 text-sm mt-3">
          ©️ {new Date().getFullYear()} PromptSentinel |
          Final Year Project
        </p>

      </div>

    </div>
  );
}

export default DashboardContent;