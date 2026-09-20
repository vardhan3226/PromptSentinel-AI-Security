import React, { useEffect, useState } from "react";
import {
  History,
  RefreshCw,
  Download,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import HistoryTable from "../../components/HistoryTable";

import { generateHistoryReport } from "../../utils/pdf/generateHistoryReport";
import { generateHistoryCSV } from "../../utils/pdf/generateHistoryCSV";

function ScanHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // ==================================================
  // TOKEN
  // ==================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken")
    );
  };

  // ==================================================
  // LOAD HISTORY
  // ==================================================

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError(
          "Authentication token not found. Please login again."
        );

        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/scan/history",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load scan history."
        );
      }

      const scanHistory =
        data?.history ||
        data?.scans ||
        data?.data ||
        data?.results ||
        [];

      setHistory(
        Array.isArray(scanHistory)
          ? scanHistory
          : []
      );

      if (data?.user) {
        setUser(data.user);
      } else {
        const storedUser =
          localStorage.getItem("user") ||
          localStorage.getItem("currentUser");

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        }
      }
    } catch (err) {
      console.error(
        "Scan history loading error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load scan history."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadHistory();
  }, []);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");

    window.location.href = "/login";
  };

  // ==================================================
  // NAVIGATION
  // ==================================================

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  // ==================================================
  // PDF DOWNLOAD
  // ==================================================

  const handlePDFDownload = () => {
    if (!history.length) {
      alert("No scan history available.");
      return;
    }

    try {
      generateHistoryReport(
        user,
        history
      );
    } catch (err) {
      console.error(
        "PDF generation error:",
        err
      );

      alert(
        "Unable to generate PDF report."
      );
    }
  };

  // ==================================================
  // CSV DOWNLOAD
  // ==================================================

  const handleCSVDownload = () => {
    if (!history.length) {
      alert("No scan history available.");
      return;
    }

    try {
      generateHistoryCSV(history);
    } catch (err) {
      console.error(
        "CSV generation error:",
        err
      );

      alert(
        "Unable to generate CSV report."
      );
    }
  };

  // ==================================================
  // STATISTICS
  // ==================================================

  const totalScans = history.length;

  const safeScans = history.filter(
    (scan) =>
      String(
        scan?.threatLevel || ""
      ).toUpperCase() === "SAFE"
  ).length;

  const highRiskScans = history.filter(
    (scan) => {
      const level = String(
        scan?.threatLevel || ""
      ).toUpperCase();

      return (
        level === "HIGH" ||
        level === "CRITICAL"
      );
    }
  ).length;

  const averageRisk =
    history.length > 0
      ? Math.round(
          history.reduce(
            (sum, scan) =>
              sum +
              Number(
                scan?.riskScore || 0
              ),
            0
          ) / history.length
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
        active="Scan History"
        navigate={handleNavigate}
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
              mb-6
              box-border
              w-full
              min-w-0
              rounded-2xl
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
                min-w-0
                flex-col
                gap-4
                md:flex-row
                md:items-center
                md:justify-between
              "
            >

              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <History size={24} />
                </div>

                <div className="min-w-0">

                  <h1
                    className="
                      truncate
                      text-2xl
                      font-bold
                      text-slate-900
                    "
                  >
                    Scan History
                  </h1>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-slate-500
                    "
                  >
                    View and manage your previous
                    security scans.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={loadHistory}
                disabled={loading}
                className="
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  hover:border-blue-200
                  hover:bg-blue-50
                  hover:text-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

            </div>

          </section>

          {/* ==================================================
              STATISTICS
          ================================================== */}

          <section
            className="
              mb-6
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
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-slate-500">
                Total Scans
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {totalScans}
              </p>
            </div>

            {/* SAFE */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-slate-500">
                Safe
              </p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {safeScans}
              </p>
            </div>

            {/* HIGH RISK */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-slate-500">
                High Risk
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-600">
                {highRiskScans}
              </p>
            </div>

            {/* AVERAGE RISK */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
              "
            >
              <p className="text-sm font-medium text-slate-500">
                Average Risk
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {averageRisk}

                <span className="ml-1 text-base font-medium text-slate-400">
                  /100
                </span>
              </p>
            </div>

          </section>

          {/* ==================================================
              EXPORT REPORTS
          ================================================== */}

          <section
            className="
              mb-6
              box-border
              w-full
              min-w-0
              rounded-2xl
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
                min-w-0
                flex-col
                gap-4
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >

              <div className="min-w-0">

                <h2 className="text-base font-bold text-slate-900">
                  Export Reports
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Download your scan history for reporting or analysis.
                </p>

              </div>

              <div className="flex shrink-0 flex-wrap gap-3">

                <button
                  type="button"
                  onClick={handlePDFDownload}
                  disabled={!history.length}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Download size={17} />
                  Export PDF
                </button>

                <button
                  type="button"
                  onClick={handleCSVDownload}
                  disabled={!history.length}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Download size={17} />
                  Export CSV
                </button>

              </div>

            </div>

          </section>

          {/* ==================================================
              ERROR
          ================================================== */}

          {error && (
            <section
              className="
                mb-6
                box-border
                w-full
                min-w-0
                rounded-2xl
                border
                border-red-200
                bg-red-50
                p-4
              "
            >

              <p className="text-sm font-semibold text-red-700">
                Unable to load scan history
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </section>
          )}

          {/* ==================================================
              PREVIOUS SCANS
          ================================================== */}

          <section
            className="
              box-border
              w-full
              min-w-0
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-sm
            "
          >

            <div
              className="
                border-b
                border-slate-200
                px-5
                py-4
              "
            >

              <h2 className="text-lg font-bold text-slate-900">
                Previous Scans
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your previously analyzed prompts and security results.
              </p>

            </div>

            <div
              className="
                min-w-0
                w-full
                overflow-x-auto
              "
            >

              {loading ? (

                <div
                  className="
                    flex
                    min-h-[300px]
                    items-center
                    justify-center
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      text-sm
                      font-medium
                      text-slate-500
                    "
                  >

                    <RefreshCw
                      size={20}
                      className="animate-spin text-blue-600"
                    />

                    Loading scan history...

                  </div>

                </div>

              ) : (

                <HistoryTable
                  history={history}
                  scans={history}
                />

              )}

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default ScanHistory;