import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import DashboardContent from "../../components/DashboardContent";

import { generatePDF } from "../../utils/pdf/generateDashboardReport";

const API_BASE_URL = "http://localhost:5000";

const initialUser = {
  fullName: "",
  email: "",
  role: "",
};

const initialStats = {
  totalScans: 0,
  safePrompts: 0,
  lowRiskPrompts: 0,
  mediumRiskPrompts: 0,
  highRiskPrompts: 0,
  criticalRiskPrompts: 0,
  highRiskFindings: 0,
  averageRiskScore: 0,
  safePromptRate: 0,
  attackTypeDistribution: [],
};

function Dashboard() {
  const navigate = useNavigate();

  // ============================================================
  // STATE
  // ============================================================

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [user, setUser] = useState(initialUser);

  const [stats, setStats] = useState(initialStats);

  const [history, setHistory] = useState([]);

  // ============================================================
  // TOKEN
  // ============================================================

  const token = localStorage.getItem("token");

  // ============================================================
  // AUTH CHECK
  // ============================================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ============================================================
  // FORMAT STATS
  // ============================================================

  const formatStats = (rawStats) => {
    return {
      totalScans: rawStats?.totalScans || 0,

      safePrompts: rawStats?.safePrompts || 0,

      lowRiskPrompts:
        rawStats?.lowRiskPrompts || 0,

      mediumRiskPrompts:
        rawStats?.mediumRiskPrompts || 0,

      highRiskPrompts:
        rawStats?.highRiskPrompts || 0,

      criticalRiskPrompts:
        rawStats?.criticalRiskPrompts || 0,

      highRiskFindings:
        rawStats?.highRiskFindings || 0,

      averageRiskScore:
        rawStats?.averageRiskScore || 0,

      safePromptRate:
        rawStats?.safePromptRate || 0,

      attackTypeDistribution:
        Array.isArray(
          rawStats?.attackTypeDistribution
        )
          ? rawStats.attackTypeDistribution
          : [],
    };
  };

  // ============================================================
  // API REQUEST
  // ============================================================

  const apiRequest = async (
    endpoint,
    options = {}
  ) => {
    const currentToken =
      localStorage.getItem("token");

    if (!currentToken) {
      navigate("/login");

      throw new Error(
        "Authentication token not found."
      );
    }

    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,

        headers: {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${currentToken}`,

          ...(options.headers || {}),
        },
      }
    );

    // ==========================================================
    // HANDLE UNAUTHORIZED
    // ==========================================================

    if (
      response.status === 401 ||
      response.status === 403
    ) {
      localStorage.removeItem("token");

      navigate("/login");

      throw new Error(
        "Your session has expired. Please login again."
      );
    }

    // ==========================================================
    // PARSE RESPONSE
    // ==========================================================

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status}).`
      );
    }

    // ==========================================================
    // HANDLE BACKEND ERRORS
    // ==========================================================

    if (!response.ok) {
      throw new Error(
        data?.message ||
        `Request failed with status ${response.status}.`
      );
    }

    return data;
  };

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadDashboard = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",

          Authorization:
            `Bearer ${token}`,
        };

        // ======================================================
        // FETCH ALL DASHBOARD DATA IN PARALLEL
        // ======================================================

        const [
          profileResponse,
          statsResponse,
          historyResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/auth/profile`,
            {
              headers,
            }
          ),

          fetch(
            `${API_BASE_URL}/api/dashboard/stats`,
            {
              headers,
            }
          ),

          fetch(
            `${API_BASE_URL}/api/scan/history`,
            {
              headers,
            }
          ),
        ]);

        // ======================================================
        // HANDLE UNAUTHORIZED
        // ======================================================

        const responses = [
          profileResponse,
          statsResponse,
          historyResponse,
        ];

        const unauthorized =
          responses.some(
            (response) =>
              response.status === 401 ||
              response.status === 403
          );

        if (unauthorized) {
          localStorage.removeItem("token");

          navigate("/login");

          return;
        }

        // ======================================================
        // PARSE RESPONSES
        // ======================================================

        const [
          profileData,
          statsData,
          historyData,
        ] = await Promise.all([
          profileResponse.json(),
          statsResponse.json(),
          historyResponse.json(),
        ]);

        // ======================================================
        // UPDATE PROFILE
        // ======================================================

        if (
          profileResponse.ok &&
          profileData.success &&
          profileData.user
        ) {
          setUser({
            fullName:
              profileData.user.fullName || "",

            email:
              profileData.user.email || "",

            role:
              profileData.user.role || "",
          });
        }

        // ======================================================
        // UPDATE STATS
        // ======================================================

        if (
          statsResponse.ok &&
          statsData.success &&
          statsData.stats
        ) {
          setStats(
            formatStats(statsData.stats)
          );
        }

        // ======================================================
        // UPDATE HISTORY
        // ======================================================

        if (
          historyResponse.ok &&
          historyData.success
        ) {
          setHistory(
            Array.isArray(
              historyData.history
            )
              ? historyData.history
              : []
          );
        }

      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );
      }
    };

    loadDashboard();

  }, [token, navigate]);

  // ============================================================
  // REFRESH STATS
  // ============================================================

  const refreshStats = async () => {
    try {
      const data = await apiRequest(
        "/api/dashboard/stats"
      );

      if (
        data.success &&
        data.stats
      ) {
        setStats(
          formatStats(data.stats)
        );
      }

    } catch (error) {
      console.error(
        "Stats refresh error:",
        error.message
      );
    }
  };

  // ============================================================
  // REFRESH HISTORY
  // ============================================================

  const refreshHistory = async () => {
    try {
      const data = await apiRequest(
        "/api/scan/history"
      );

      if (data.success) {
        setHistory(
          Array.isArray(
            data.history
          )
            ? data.history
            : []
        );
      }

    } catch (error) {
      console.error(
        "History refresh error:",
        error.message
      );
    }
  };

  // ============================================================
  // SCAN PROMPT
  // ============================================================

  const handleScan = async () => {
    const trimmedPrompt = prompt.trim();

    // ==========================================================
    // VALIDATE PROMPT
    // ==========================================================

    if (!trimmedPrompt) {
      alert(
        "Please enter a prompt."
      );

      return;
    }

    // ==========================================================
    // PREVENT DUPLICATE REQUESTS
    // ==========================================================

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // CLEAR PREVIOUS RESULT
      // ========================================================

      setResult(null);

      // ========================================================
      // SEND PROMPT
      // ========================================================

      const data = await apiRequest(
        "/api/scan",
        {
          method: "POST",

          body: JSON.stringify({
            prompt: trimmedPrompt,
          }),
        }
      );

      // ========================================================
      // HANDLE SUCCESS
      // ========================================================

      if (
        data.success &&
        data.result
      ) {
        setResult(data.result);

        // ======================================================
        // REFRESH REAL DASHBOARD DATA
        // ======================================================

        await Promise.all([
          refreshStats(),
          refreshHistory(),
        ]);

        // ======================================================
        // CLEAR PROMPT
        // ======================================================

        setPrompt("");

      } else {
        throw new Error(
          data?.message ||
          "Prompt scanning failed."
        );
      }

    } catch (error) {
      console.error(
        "Prompt scan error:",
        error
      );

      alert(
        error.message ||
        "Unable to scan the prompt."
      );

    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(initialUser);

    setStats(initialStats);

    setPrompt("");

    setResult(null);

    setHistory([]);

    navigate("/login");
  };

  // ============================================================
  // EXPORT DASHBOARD REPORT
  // ============================================================

  const handleExportDashboard = () => {
    try {
      generatePDF(
        user,
        stats,
        history
      );

    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      alert(
        "Unable to generate the dashboard report."
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <Sidebar
        navigate={navigate}
        handleLogout={handleLogout}
        active="Dashboard"
      />

      {/* MAIN DASHBOARD */}

      <DashboardContent
        user={user}
        stats={stats}
        prompt={prompt}
        setPrompt={setPrompt}
        handleScan={handleScan}
        loading={loading}
        result={result}
        history={history}
        handleExportDashboard={
          handleExportDashboard
        }
      />

    </div>
  );
}

export default Dashboard;