import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import PromptScanner from "../../components/PromptScanner";
import ResultCard from "../../components/ResultCard";
import ScanProgress from "../../components/ScanProgress";

import {
  ShieldCheck,
  Cpu,
  Activity,
  Wifi,
} from "lucide-react";

function PromptScannerPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /*
  |--------------------------------------------------------------------------
  | SCAN PROMPT
  |--------------------------------------------------------------------------
  */

  const handleScan = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt before scanning.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await fetch(
        "http://localhost:5000/api/scan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch (error) {
        throw new Error(
          "Invalid response received from server.",
          {
            cause: error,
          }
        );
      }

      console.log("Scan Status:", response.status);
      console.log("Backend Response:", data);

      /*
      |--------------------------------------------------------------------------
      | TOKEN EXPIRED OR INVALID
      |--------------------------------------------------------------------------
      */

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");

        alert(
          data?.message ||
          "Your session has expired. Please login again."
        );

        navigate("/login");
        return;
      }

      /*
      |--------------------------------------------------------------------------
      | OTHER BACKEND ERRORS
      |--------------------------------------------------------------------------
      */

      if (!response.ok) {
        alert(
          data?.message ||
          "Unable to scan the prompt. Please try again."
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESSFUL SCAN
      |--------------------------------------------------------------------------
      */

      if (data.success) {
        setResult(data.result);
      } else {
        alert(
          data.message ||
          "Scan failed. Please try again."
        );
      }

    } catch (error) {
      console.error("Scan Error:", error);

      alert(
        error.message ||
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <Sidebar
        active="Prompt Scanner"
        navigate={navigate}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT */}

      <main className="flex-1 overflow-y-auto">

        <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-10">

          {/* PAGE HEADER */}

          <section className="relative overflow-hidden bg-slate-900 border border-cyan-500/20 rounded-3xl p-6 md:p-8">

            {/* Background Glow */}

            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

              {/* TITLE */}

              <div>

                <div className="flex items-center gap-3 mb-4">

                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                    <ShieldCheck
                      size={25}
                      className="text-cyan-400"
                    />

                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-400">

                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                    Security System Online

                  </div>

                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  AI Prompt Scanner
                </h1>

                <p className="text-slate-400 mt-3 max-w-2xl">

                  Analyze AI prompts for potential security threats,
                  prompt injection attempts, and malicious instructions
                  before sending them to an AI model.

                </p>

              </div>

              {/* SYSTEM STATUS */}

              <div className="grid grid-cols-3 gap-3 md:gap-5">

                {/* FIREWALL */}

                <div className="min-w-25 bg-slate-950/60 border border-green-500/10 rounded-2xl px-4 py-4 text-center">

                  <ShieldCheck
                    size={28}
                    className="mx-auto text-green-400"
                  />

                  <p className="text-xs md:text-sm text-slate-400 mt-3">
                    Firewall
                  </p>

                  <p className="text-xs text-green-400 font-semibold mt-1">
                    Active
                  </p>

                </div>

                {/* AI ENGINE */}

                <div className="min-w-25 bg-slate-950/60 border border-cyan-500/10 rounded-2xl px-4 py-4 text-center">

                  <Cpu
                    size={28}
                    className="mx-auto text-cyan-400"
                  />

                  <p className="text-xs md:text-sm text-slate-400 mt-3">
                    AI Engine
                  </p>

                  <p className="text-xs text-cyan-400 font-semibold mt-1">
                    Ready
                  </p>

                </div>

                {/* MONITORING */}

                <div className="min-w-25 bg-slate-950/60 border border-yellow-500/10 rounded-2xl px-4 py-4 text-center">

                  <Activity
                    size={28}
                    className="mx-auto text-yellow-400"
                  />

                  <p className="text-xs md:text-sm text-slate-400 mt-3">
                    Monitor
                  </p>

                  <p className="text-xs text-yellow-400 font-semibold mt-1">
                    Live
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* CONNECTION STATUS */}

          <div className="flex items-center gap-2 mt-5 text-sm text-slate-500">

            <Wifi
              size={15}
              className="text-cyan-400"
            />

            <span>
              Connected to PromptSentinel Security Engine
            </span>

          </div>

          {/* PROMPT SCANNER */}

          <section className="mt-6">

            <PromptScanner
              prompt={prompt}
              setPrompt={setPrompt}
              handleScan={handleScan}
              loading={loading}
            />

          </section>

          {/* SCANNING PROGRESS */}

          {loading && (

            <section className="mt-6">
              <ScanProgress />
            </section>

          )}

          {/* RESULT */}

          {result && (

            <section className="mt-8">
              <ResultCard result={result} />
            </section>

          )}

        </div>

      </main>

    </div>
  );
}

export default PromptScannerPage;