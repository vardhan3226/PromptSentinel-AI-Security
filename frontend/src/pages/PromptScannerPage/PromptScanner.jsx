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
      | SESSION ERROR
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
      | BACKEND ERROR
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
      | SUCCESS
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
    <div className="min-h-screen bg-slate-50">

      {/* ================================================================= */}
      {/* DESKTOP LAYOUT                                                    */}
      {/* ================================================================= */}

      <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">

        {/* =============================================================== */}
        {/* SIDEBAR                                                         */}
        {/* =============================================================== */}

        <aside className="relative z-30">

          <Sidebar
            active="Prompt Scanner"
            navigate={navigate}
            handleLogout={handleLogout}
          />

        </aside>

        {/* =============================================================== */}
        {/* MAIN CONTENT                                                    */}
        {/* =============================================================== */}

        <main
          className="
            min-w-0
            min-h-screen
            bg-slate-50
          "
        >

          <div
            className="
              w-full
              px-4
              py-5
              sm:px-6
              sm:py-6
              lg:px-7
              lg:py-7
              xl:px-8
            "
          >

            {/* =========================================================== */}
            {/* PAGE HEADER                                                  */}
            {/* =========================================================== */}

            <section
              className="
                relative
                w-full
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-sm
              "
            >

              {/* Blue glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-24
                  -top-24
                  h-72
                  w-72
                  rounded-full
                  bg-blue-100/60
                  blur-3xl
                "
              />

              {/* Green glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-28
                  -left-24
                  h-64
                  w-64
                  rounded-full
                  bg-green-100/40
                  blur-3xl
                "
              />

              {/* Orange glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  right-1/3
                  h-52
                  w-52
                  rounded-full
                  bg-orange-100/30
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  px-5
                  py-6
                  sm:px-7
                  sm:py-7
                  lg:px-8
                  lg:py-8
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-7
                    xl:flex-row
                    xl:items-center
                    xl:justify-between
                  "
                >

                  {/* ===================================================== */}
                  {/* TITLE                                                   */}
                  {/* ===================================================== */}

                  <div className="min-w-0 flex-1">

                    <div
                      className="
                        mb-4
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-blue-100
                          bg-blue-50
                        "
                      >
                        <ShieldCheck
                          size={23}
                          className="text-blue-600"
                        />
                      </div>

                      <div className="flex items-center gap-2">

                        <span
                          className="
                            h-2
                            w-2
                            animate-pulse
                            rounded-full
                            bg-green-500
                          "
                        />

                        <span
                          className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-slate-500
                          "
                        >
                          Security System Online
                        </span>

                      </div>

                    </div>

                    <h1
                      className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-slate-900
                        sm:text-3xl
                      "
                    >
                      AI Prompt Scanner
                    </h1>

                    <p
                      className="
                        mt-2
                        max-w-3xl
                        text-sm
                        leading-6
                        text-slate-500
                        sm:text-base
                      "
                    >
                      Analyze AI prompts for prompt injection,
                      jailbreak attempts, sensitive information
                      exposure, and other security risks before
                      sending them to an AI model.
                    </p>

                    {/* Made in India */}

                    <div
                      className="
                        mt-5
                        flex
                        items-center
                        gap-2
                      "
                    >

                      <div className="flex overflow-hidden rounded-full">

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
                        Made in India
                      </span>

                    </div>

                  </div>

                  {/* ===================================================== */}
                  {/* STATUS CARDS                                           */}
                  {/* ===================================================== */}

                  <div
                    className="
                      grid
                      w-full
                      shrink-0
                      grid-cols-3
                      gap-3
                      xl:w-105
                    "
                  >

                    {/* Firewall */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3
                        py-4
                        text-center
                      "
                    >

                      <div
                        className="
                          mx-auto
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-green-50
                        "
                      >
                        <ShieldCheck
                          size={20}
                          className="text-green-600"
                        />
                      </div>

                      <p
                        className="
                          mt-2
                          text-xs
                          font-medium
                          text-slate-500
                        "
                      >
                        Firewall
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          font-bold
                          text-green-600
                        "
                      >
                        Active
                      </p>

                    </div>

                    {/* AI Engine */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3
                        py-4
                        text-center
                      "
                    >

                      <div
                        className="
                          mx-auto
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                        "
                      >
                        <Cpu
                          size={20}
                          className="text-blue-600"
                        />
                      </div>

                      <p
                        className="
                          mt-2
                          text-xs
                          font-medium
                          text-slate-500
                        "
                      >
                        AI Engine
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          font-bold
                          text-blue-600
                        "
                      >
                        Ready
                      </p>

                    </div>

                    {/* Monitor */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-3
                        py-4
                        text-center
                      "
                    >

                      <div
                        className="
                          mx-auto
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-orange-50
                        "
                      >
                        <Activity
                          size={20}
                          className="text-orange-500"
                        />
                      </div>

                      <p
                        className="
                          mt-2
                          text-xs
                          font-medium
                          text-slate-500
                        "
                      >
                        Monitor
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          font-bold
                          text-orange-500
                        "
                      >
                        Live
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </section>

            {/* =========================================================== */}
            {/* CONNECTION STATUS                                            */}
            {/* =========================================================== */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                px-1
              "
            >

              <Wifi
                size={14}
                className="shrink-0 text-blue-500"
              />

              <span
                className="
                  text-xs
                  font-medium
                  text-slate-400
                "
              >
                Connected to PromptSentinel Security Engine
              </span>

            </div>

            {/* =========================================================== */}
            {/* PROMPT SCANNER                                               */}
            {/* =========================================================== */}

            <section className="mt-5 w-full">

              <PromptScanner
                prompt={prompt}
                setPrompt={setPrompt}
                handleScan={handleScan}
                loading={loading}
              />

            </section>

            {/* =========================================================== */}
            {/* SCAN PROGRESS                                                */}
            {/* =========================================================== */}

            {loading && (
              <section className="mt-5 w-full">

                <ScanProgress />

              </section>
            )}

            {/* =========================================================== */}
            {/* RESULT                                                       */}
            {/* =========================================================== */}

            {result && (
              <section className="mt-6 w-full">

                <ResultCard result={result} />

              </section>
            )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default PromptScannerPage;