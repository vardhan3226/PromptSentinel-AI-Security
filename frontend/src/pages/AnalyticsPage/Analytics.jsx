import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import AnalyticsChart from "../../components/AnalyticsChart";

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
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/dashboard/stats",
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
    loadAnalytics();
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

          Sidebar = 260px
          Main automatically uses remaining width
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
              CHART
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