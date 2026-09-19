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

const initialBenchmark = {
  metrics: {
    total: 0,
    truePositive: 0,
    trueNegative: 0,
    falsePositive: 0,
    falseNegative: 0,
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
  },
  results: [],
};

const initialRobustness = {
  originalPrompt: "",
  totalMutations: 0,
  detectedMutations: 0,
  missedMutations: 0,
  detectionRate: 0,
  results: [],
};

function Dashboard() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [user, setUser] = useState(initialUser);

  const [stats, setStats] = useState(initialStats);

  const [history, setHistory] = useState([]);

  const [benchmark, setBenchmark] =
    useState(initialBenchmark);

  const [robustness, setRobustness] =
    useState(initialRobustness);

  const [robustnessLoading, setRobustnessLoading] =
    useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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

        const [
          profileResponse,
          statsResponse,
          historyResponse,
          benchmarkResponse,
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

          fetch(
            `${API_BASE_URL}/api/dashboard/benchmark`,
            {
              headers,
            }
          ),
        ]);

        const responses = [
          profileResponse,
          statsResponse,
          historyResponse,
          benchmarkResponse,
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

        const [
          profileData,
          statsData,
          historyData,
          benchmarkData,
        ] = await Promise.all([
          profileResponse.json(),
          statsResponse.json(),
          historyResponse.json(),
          benchmarkResponse.json(),
        ]);

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

        if (
          statsResponse.ok &&
          statsData.success &&
          statsData.stats
        ) {
          setStats(
            formatStats(statsData.stats)
          );
        }

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

        if (
          benchmarkResponse.ok &&
          benchmarkData.success &&
          benchmarkData.benchmark
        ) {
          setBenchmark(
            benchmarkData.benchmark
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

  const handleScan = async () => {
    const trimmedPrompt = prompt.trim();

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

  const handleRobustnessTest = async () => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      alert(
        "Enter a prompt before starting the robustness test."
      );

      return;
    }

    if (robustnessLoading) {
      return;
    }

    try {
      setRobustnessLoading(true);

      setRobustness(initialRobustness);

      const data = await apiRequest(
        "/api/scan/robustness",
        {
          method: "POST",

          body: JSON.stringify({
            prompt: trimmedPrompt,
          }),
        }
      );

      if (
        data.success &&
        data.robustness
      ) {
        setRobustness(
          data.robustness
        );
      } else {
        throw new Error(
          data?.message ||
          "Robustness test failed."
        );
      }
    } catch (error) {
      console.error(
        "Robustness test error:",
        error
      );

      alert(
        error.message ||
        "Unable to run robustness test."
      );
    } finally {
      setRobustnessLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUser(initialUser);

    setStats(initialStats);

    setPrompt("");

    setResult(null);

    setHistory([]);

    setBenchmark(initialBenchmark);

    setRobustness(initialRobustness);

    setRobustnessLoading(false);

    navigate("/login");
  };

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

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar
        navigate={navigate}
        handleLogout={handleLogout}
        active="Dashboard"
      />

      <DashboardContent
        user={user}
        stats={stats}
        benchmark={benchmark}
        robustness={robustness}
        robustnessLoading={robustnessLoading}
        prompt={prompt}
        setPrompt={setPrompt}
        handleScan={handleScan}
        handleRobustnessTest={
          handleRobustnessTest
        }
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