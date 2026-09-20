import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import DashboardContent from "../../components/DashboardContent";

import { generatePDF } from "../../utils/pdf/generateDashboardReport";

const API_BASE_URL = "http://localhost:5000";

const INITIAL_USER = {
  fullName: "",
  email: "",
  role: "",
};

const INITIAL_STATS = {
  totalScans: 0,
  safePrompts: 0,
  lowRiskPrompts: 0,
  mediumRiskPrompts: 0,
  highRiskPrompts: 0,
  criticalRiskPrompts: 0,
  highRiskFindings: 0,
  threatsBlocked: 0,
  averageRiskScore: 0,
  safePromptRate: 0,
  threatDistribution: {},
  attackTypeDistribution: [],
};

function Dashboard() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [user, setUser] = useState(
    INITIAL_USER
  );

  const [stats, setStats] = useState(
    INITIAL_STATS
  );

  const [history, setHistory] = useState([]);

  const token = localStorage.getItem("token");

  /* ============================================================
     AUTH CHECK
  ============================================================ */

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  /* ============================================================
     COMMON API REQUEST
  ============================================================ */

  const apiRequest = async (
    endpoint,
    options = {}
  ) => {
    if (!token) {
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
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
      }
    );

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

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status}).`
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Request failed with status ${response.status}.`
      );
    }

    return data;
  };

  /* ============================================================
     FETCH PROFILE
  ============================================================ */

  const fetchProfile = async () => {
    try {
      const data = await apiRequest(
        "/api/auth/profile"
      );

      if (data.success && data.user) {
        setUser({
          fullName:
            data.user.fullName || "",
          email:
            data.user.email || "",
          role:
            data.user.role || "",
        });
      }
    } catch (error) {
      console.error(
        "Profile fetch error:",
        error.message
      );
    }
  };

  /* ============================================================
     FORMAT STATS
  ============================================================ */

  const formatStats = (rawStats) => {
    const highRiskFindings =
      Number(rawStats?.highRiskFindings || 0);

    return {
      totalScans:
        Number(rawStats?.totalScans || 0),

      safePrompts:
        Number(rawStats?.safePrompts || 0),

      lowRiskPrompts:
        Number(rawStats?.lowRiskPrompts || 0),

      mediumRiskPrompts:
        Number(rawStats?.mediumRiskPrompts || 0),

      highRiskPrompts:
        Number(rawStats?.highRiskPrompts || 0),

      criticalRiskPrompts:
        Number(
          rawStats?.criticalRiskPrompts || 0
        ),

      highRiskFindings,

      threatsBlocked: highRiskFindings,

      averageRiskScore:
        Number(
          rawStats?.averageRiskScore || 0
        ),

      safePromptRate:
        Number(
          rawStats?.safePromptRate || 0
        ),

      threatDistribution:
        rawStats?.threatDistribution &&
        typeof rawStats.threatDistribution ===
          "object"
          ? rawStats.threatDistribution
          : {},

      attackTypeDistribution:
        Array.isArray(
          rawStats?.attackTypeDistribution
        )
          ? rawStats.attackTypeDistribution
          : [],
    };
  };

  /* ============================================================
     FETCH DASHBOARD STATS
  ============================================================ */

  const fetchStats = async () => {
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
        "Stats fetch error:",
        error.message
      );
    }
  };

  /* ============================================================
     FETCH HISTORY
  ============================================================ */

  const fetchHistory = async () => {
    try {
      const data = await apiRequest(
        "/api/scan/history"
      );

      if (data.success) {
        setHistory(
          Array.isArray(data.history)
            ? data.history
            : []
        );
      }
    } catch (error) {
      console.error(
        "History fetch error:",
        error.message
      );
    }
  };

  /* ============================================================
     INITIAL LOAD
  ============================================================ */

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadDashboard = async () => {
      await Promise.all([
        fetchProfile(),
        fetchStats(),
        fetchHistory(),
      ]);
    };

    loadDashboard();
  }, [token]);

  /* ============================================================
     REFRESH STATS
  ============================================================ */

  const refreshStats = async () => {
    await fetchStats();
  };

  /* ============================================================
     REFRESH HISTORY
  ============================================================ */

  const refreshHistory = async () => {
    await fetchHistory();
  };

  /* ============================================================
     SCAN PROMPT
  ============================================================ */

  const handleScan = async () => {
    const trimmedPrompt =
      prompt.trim();

    if (!trimmedPrompt) {
      alert(
        "Please enter a prompt."
      );
      return;
    }

    if (loading) {
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const data = await apiRequest(
        "/api/scan",
        {
          method: "POST",
          body: JSON.stringify({
            prompt: trimmedPrompt,
          }),
        }
      );

      if (
        data.success &&
        data.result
      ) {
        setResult(data.result);

        await Promise.all([
          refreshStats(),
          refreshHistory(),
        ]);

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

  /* ============================================================
     LOGOUT
  ============================================================ */

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    setUser(INITIAL_USER);
    setStats(INITIAL_STATS);
    setPrompt("");
    setResult(null);
    setHistory([]);

    navigate("/login");
  };

  /* ============================================================
     EXPORT DASHBOARD
  ============================================================ */

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

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      className="
        min-h-dvh
        w-full
        overflow-x-hidden
        bg-[#f6f9fc]
      "
    >
      {/* =====================================================
          FIXED SIDEBAR
      ===================================================== */}

      <Sidebar
        navigate={navigate}
        handleLogout={handleLogout}
        active="Dashboard"
      />

      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <main
        className="
          ml-65
          min-h-dvh
          min-w-0
          overflow-x-hidden
          box-border
        "
      >
        <DashboardContent
          user={user}
          stats={stats}
          prompt={prompt}
          setPrompt={setPrompt}
          handleScan={handleScan}
          loading={loading}
          result={result}
          recentScans={history}
          handleExportDashboard={
            handleExportDashboard
          }
        />
      </main>
    </div>
  );
}

export default Dashboard;