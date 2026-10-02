import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import AnalyticsChart from "../../components/AnalyticsChart";
import API_BASE_URL from "../../config/api";

function Analytics() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");

    navigate("/login");
  };

  // ==================================================
  // LOAD ANALYTICS
  // ==================================================

  const loadAnalytics = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error(
        "Analytics error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAnalytics();
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================================================
  // STATISTICS
  // ==================================================

  const totalScans = Number(
    stats?.totalScans || 0
  );

  const safePrompts = Number(
    stats?.safePrompts || 0
  );

  const highRiskFindings = Number(
    stats?.highRiskFindings ||
      (
        Number(
          stats?.highRiskPrompts || 0
        ) +
        Number(
          stats?.criticalRiskPrompts || 0
        )
      )
  );

  const averageRisk = Number(
    stats?.averageRiskScore || 0
  );

  const safeRate =
    totalScans > 0
      ? Math.round(
          (safePrompts / totalScans) *
            100
        )
      : 0;

  const highRiskRate =
    totalScans > 0
      ? Math.round(
          (highRiskFindings /
            totalScans) *
            100
        )
      : 0;

  // ==================================================
  // NEW ANALYTICS DATA
  // ==================================================

  const scanActivity = Array.isArray(
    stats?.scanActivity
  )
    ? stats.scanActivity
    : [];

  const dailyThreatActivity = Array.isArray(
    stats?.dailyThreatActivity
  )
    ? stats.dailyThreatActivity
    : [];

  // ==================================================
  // 7-DAY SCAN ACTIVITY HELPERS
  // ==================================================

  const maxDailyScans = Math.max(
    1,
    ...scanActivity.map(
      (item) =>
        Number(item?.scans || 0)
    )
  );

  const formatActivityDate = (dateValue) => {
    if (!dateValue) {
      return "--";
    }

    try {
      const date = new Date(
        `${dateValue}T00:00:00`
      );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return dateValue;
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
        }
      );
    } catch {
      return dateValue;
    }
  };

  const formatActivityDay = (dateValue) => {
    if (!dateValue) {
      return "--";
    }

    try {
      const date = new Date(
        `${dateValue}T00:00:00`
      );

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "--";
      }

      return date.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
        }
      );
    } catch {
      return "--";
    }
  };

  // ==================================================
  // THREAT ACTIVITY TOTALS
  // ==================================================

  const threatActivityTotals = {
    safe: dailyThreatActivity.reduce(
      (total, item) =>
        total +
        Number(item?.safe || 0),
      0
    ),

    low: dailyThreatActivity.reduce(
      (total, item) =>
        total +
        Number(item?.low || 0),
      0
    ),

    medium: dailyThreatActivity.reduce(
      (total, item) =>
        total +
        Number(item?.medium || 0),
      0
    ),

    high: dailyThreatActivity.reduce(
      (total, item) =>
        total +
        Number(item?.high || 0),
      0
    ),

    critical: dailyThreatActivity.reduce(
      (total, item) =>
        total +
        Number(item?.critical || 0),
      0
    ),
  };

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="min-h-dvh w-full overflow-x-hidden bg-[#f5f8fc]">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <Sidebar
        active="Analytics"
        navigate={navigate}
        handleLogout={handleLogout}
      />

      {/* ==================================================
          MAIN PAGE
      ================================================== */}

      <main
        className="
          ml-[260px]
          min-h-dvh
          w-auto
          max-w-none
          overflow-x-hidden
          box-border
        "
      >

        <div
          className="
            box-border
            min-w-0
            w-full
            px-5
            py-5
            md:px-7
            lg:px-8
          "
        >

          {/* ==================================================
              HEADER
          ================================================== */}

          <section
            className="
              mb-5
              box-border
              w-full
              min-w-0
              rounded-3xl
              border
              border-slate-200
              bg-white
              px-6
              py-6
              shadow-sm
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                "
              >
                <BarChart3
                  size={21}
                  className="text-blue-600"
                />
              </div>

              <div className="min-w-0">

                <h1
                  className="
                    text-2xl
                    font-extrabold
                    tracking-tight
                    text-[#102a63]
                  "
                >
                  Threat Analytics
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  Security insights from your PromptSentinel scans.
                </p>

              </div>

            </div>

          </section>

          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <section
            className="
              mb-5
              grid
              min-w-0
              w-full
              grid-cols-1
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            {/* TOTAL SCANS */}

            <div
              className="
                min-w-0
                rounded-[20px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Total Scans
              </p>

              <p
                className="
                  mt-1
                  text-3xl
                  font-extrabold
                  text-blue-600
                "
              >
                {totalScans}
              </p>

            </div>

            {/* SAFE PROMPTS */}

            <div
              className="
                min-w-0
                rounded-[20px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Safe Prompts
              </p>

              <p
                className="
                  mt-1
                  text-3xl
                  font-extrabold
                  text-emerald-600
                "
              >
                {safePrompts}
              </p>

            </div>

            {/* HIGH RISK */}

            <div
              className="
                min-w-0
                rounded-[20px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                High-Risk Findings
              </p>

              <p
                className="
                  mt-1
                  text-3xl
                  font-extrabold
                  text-red-600
                "
              >
                {highRiskFindings}
              </p>

            </div>

            {/* AVERAGE RISK */}

            <div
              className="
                min-w-0
                rounded-[20px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-slate-400
                "
              >
                Average Risk
              </p>

              <p
                className="
                  mt-1
                  text-3xl
                  font-extrabold
                  text-violet-600
                "
              >
                {averageRisk}
              </p>

            </div>

          </section>

          {/* ==================================================
              EXISTING ANALYTICS CHART
          ================================================== */}

          <section
            className="
              w-full
              min-w-0
              overflow-hidden
              rounded-[20px]
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >

            {loading ? (

              <div
                className="
                  flex
                  min-h-[400px]
                  items-center
                  justify-center
                "
              >

                <RefreshCw
                  size={26}
                  className="
                    animate-spin
                    text-blue-600
                  "
                />

              </div>

            ) : (

              <AnalyticsChart
                stats={stats || {}}
              />

            )}

          </section>

          {/* ==================================================
              7-DAY SCAN ACTIVITY
          ================================================== */}

          <section
            className="
              mt-5
              w-full
              min-w-0
              rounded-[20px]
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
            "
          >

            <div
              className="
                flex
                flex-col
                gap-1
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <h2 className="text-lg font-bold text-[#102a63]">
                  7-Day Scan Activity
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Number of security scans performed each day.
                </p>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  text-blue-600
                "
              >
                <BarChart3 size={17} />
                <span>
                  Last 7 days
                </span>
              </div>

            </div>

            {scanActivity.length > 0 ? (

              <div className="mt-6">

                <div
                  className="
                    flex
                    h-56
                    items-end
                    gap-2
                    overflow-x-auto
                    pb-1
                    sm:gap-4
                  "
                >

                  {scanActivity.map(
                    (item, index) => {

                      const scanCount =
                        Number(
                          item?.scans || 0
                        );

                      const barHeight =
                        scanCount === 0
                          ? 4
                          : Math.max(
                              8,
                              Math.round(
                                (scanCount /
                                  maxDailyScans) *
                                  100
                              )
                            );

                      return (
                        <div
                          key={
                            item?.date ||
                            index
                          }
                          className="
                            flex
                            min-w-[58px]
                            flex-1
                            flex-col
                            items-center
                            justify-end
                            gap-2
                          "
                        >

                          <span
                            className="
                              text-xs
                              font-bold
                              text-slate-600
                            "
                          >
                            {scanCount}
                          </span>

                          <div
                            className="
                              flex
                              h-40
                              w-full
                              max-w-[64px]
                              items-end
                              rounded-xl
                              bg-slate-100
                              p-1
                            "
                          >

                            <div
                              className="
                                w-full
                                rounded-lg
                                bg-blue-500
                                transition-all
                              "
                              style={{
                                height: `${barHeight}%`,
                              }}
                              title={`${scanCount} scans`}
                            />

                          </div>

                          <div className="text-center">

                            <p
                              className="
                                text-[11px]
                                font-bold
                                text-slate-700
                              "
                            >
                              {formatActivityDay(
                                item?.date
                              )}
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[10px]
                                text-slate-400
                              "
                            >
                              {formatActivityDate(
                                item?.date
                              )}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

            ) : (

              <div
                className="
                  mt-5
                  rounded-xl
                  border
                  border-dashed
                  border-slate-200
                  bg-slate-50
                  px-5
                  py-10
                  text-center
                "
              >

                <BarChart3
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-2 text-sm font-semibold text-slate-500">
                  No scan activity available yet.
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Scan prompts to generate activity data.
                </p>

              </div>

            )}

          </section>

          {/* ==================================================
              DAILY THREAT ACTIVITY
          ================================================== */}

          <section
            className="
              mt-5
              w-full
              min-w-0
              overflow-hidden
              rounded-[20px]
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >

            <div className="p-5">

              <div
                className="
                  flex
                  flex-col
                  gap-1
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >

                <div>

                  <h2 className="text-lg font-bold text-[#102a63]">
                    Daily Threat Activity
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Threat-level breakdown from your recent scans.
                  </p>

                </div>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-semibold
                    text-slate-500
                  "
                >
                  <ShieldCheck size={17} />
                  <span>
                    Security activity
                  </span>
                </div>

              </div>

              {/* THREAT TOTALS */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-3
                  sm:grid-cols-5
                "
              >

                <div
                  className="
                    rounded-xl
                    border
                    border-emerald-100
                    bg-emerald-50
                    px-3
                    py-3
                  "
                >

                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                    Safe
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-emerald-700">
                    {threatActivityTotals.safe}
                  </p>

                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-amber-100
                    bg-amber-50
                    px-3
                    py-3
                  "
                >

                  <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">
                    Low
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-amber-700">
                    {threatActivityTotals.low}
                  </p>

                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-orange-100
                    bg-orange-50
                    px-3
                    py-3
                  "
                >

                  <p className="text-[10px] font-bold uppercase tracking-wide text-orange-600">
                    Medium
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-orange-700">
                    {threatActivityTotals.medium}
                  </p>

                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-3
                    py-3
                  "
                >

                  <p className="text-[10px] font-bold uppercase tracking-wide text-red-600">
                    High
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-red-700">
                    {threatActivityTotals.high}
                  </p>

                </div>

                <div
                  className="
                    rounded-xl
                    border
                    border-rose-100
                    bg-rose-50
                    px-3
                    py-3
                  "
                >

                  <p className="text-[10px] font-bold uppercase tracking-wide text-rose-600">
                    Critical
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-rose-700">
                    {threatActivityTotals.critical}
                  </p>

                </div>

              </div>

              {/* DAILY TABLE */}

              {dailyThreatActivity.length > 0 ? (

                <div className="mt-6 overflow-x-auto">

                  <table className="w-full min-w-[700px] border-collapse">

                    <thead>

                      <tr className="border-b border-slate-100">

                        <th
                          className="
                            px-3
                            py-3
                            text-left
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          Date
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-center
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-400
                          "
                        >
                          Total
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-center
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-emerald-500
                          "
                        >
                          Safe
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-center
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-amber-500
                          "
                        >
                          Low
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-center
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-orange-500
                          "
                        >
                          Medium
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-center
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-red-500
                          "
                        >
                          High
                        </th>

                        <th
                          className="
                            px-3
                            py-3
                            text-center
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-rose-500
                          "
                        >
                          Critical
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {dailyThreatActivity.map(
                        (item, index) => (

                          <tr
                            key={
                              item?.date ||
                              index
                            }
                            className="
                              border-b
                              border-slate-50
                              transition
                              hover:bg-slate-50
                            "
                          >

                            <td
                              className="
                                px-3
                                py-3
                                text-sm
                                font-semibold
                                text-slate-700
                              "
                            >
                              {formatActivityDate(
                                item?.date
                              )}
                            </td>

                            <td
                              className="
                                px-3
                                py-3
                                text-center
                                text-sm
                                font-bold
                                text-blue-600
                              "
                            >
                              {Number(
                                item?.total || 0
                              )}
                            </td>

                            <td
                              className="
                                px-3
                                py-3
                                text-center
                                text-sm
                                font-semibold
                                text-emerald-600
                              "
                            >
                              {Number(
                                item?.safe || 0
                              )}
                            </td>

                            <td
                              className="
                                px-3
                                py-3
                                text-center
                                text-sm
                                font-semibold
                                text-amber-600
                              "
                            >
                              {Number(
                                item?.low || 0
                              )}
                            </td>

                            <td
                              className="
                                px-3
                                py-3
                                text-center
                                text-sm
                                font-semibold
                                text-orange-600
                              "
                            >
                              {Number(
                                item?.medium || 0
                              )}
                            </td>

                            <td
                              className="
                                px-3
                                py-3
                                text-center
                                text-sm
                                font-semibold
                                text-red-600
                              "
                            >
                              {Number(
                                item?.high || 0
                              )}
                            </td>

                            <td
                              className="
                                px-3
                                py-3
                                text-center
                                text-sm
                                font-semibold
                                text-rose-600
                              "
                            >
                              {Number(
                                item?.critical || 0
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-dashed
                    border-slate-200
                    bg-slate-50
                    px-5
                    py-10
                    text-center
                  "
                >

                  <ShieldCheck
                    size={28}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    No daily threat activity available yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Security scan activity will appear here.
                  </p>

                </div>

              )}

            </div>

          </section>

          {/* ==================================================
              SUMMARY CARDS
          ================================================== */}

          <section
            className="
              mt-5
              grid
              w-full
              grid-cols-1
              gap-4
              md:grid-cols-2
            "
          >

            {/* SAFE RATE */}

            <div
              className="
                min-w-0
                rounded-[20px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-emerald-50
                  "
                >
                  <ShieldCheck
                    size={20}
                    className="text-emerald-600"
                  />
                </div>

                <div className="min-w-0">

                  <h2 className="font-bold text-slate-800">
                    Safe Prompt Rate
                  </h2>

                  <p className="text-xs text-slate-400">
                    Safe scans relative to total scans.
                  </p>

                </div>

              </div>

              <p
                className="
                  mt-5
                  text-4xl
                  font-extrabold
                  text-emerald-600
                "
              >
                {safeRate}%
              </p>

            </div>

            {/* HIGH RISK RATE */}

            <div
              className="
                min-w-0
                rounded-[20px]
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-50
                  "
                >
                  <BarChart3
                    size={20}
                    className="text-red-600"
                  />
                </div>

                <div className="min-w-0">

                  <h2 className="font-bold text-slate-800">
                    High-Risk Rate
                  </h2>

                  <p className="text-xs text-slate-400">
                    High and critical findings.
                  </p>

                </div>

              </div>

              <p
                className="
                  mt-5
                  text-4xl
                  font-extrabold
                  text-red-600
                "
              >
                {highRiskRate}%
              </p>

            </div>

          </section>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-3
              py-5
            "
          >

            <div
              className="
                flex
                overflow-hidden
                rounded-full
              "
            >
              <span className="h-1.5 w-5 bg-orange-500" />
              <span className="h-1.5 w-5 bg-slate-200" />
              <span className="h-1.5 w-5 bg-green-600" />
            </div>

            <span
              className="
                text-xs
                font-semibold
                text-slate-400
              "
            >
              PromptSentinel · Made in India
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Analytics;