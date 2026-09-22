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
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
} from "lucide-react";

function PromptScannerPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Prompt enhancement state
  const [enhancementLoading, setEnhancementLoading] = useState(false);
  const [enhancement, setEnhancement] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState("");

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
  | SECURITY ACTION CHECK
  |--------------------------------------------------------------------------
  |
  | SAFE     -> Allow
  | LOW      -> Allow + Monitor
  | MEDIUM   -> Allow + Warning
  | HIGH     -> Block
  | CRITICAL -> Block + Alert
  |
  */

  const isPromptAllowed = (threatLevel) => {
    const level = String(threatLevel || "").toUpperCase();

    return (
      level === "SAFE" ||
      level === "LOW" ||
      level === "MEDIUM"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | PROMPT ENHANCEMENT
  |--------------------------------------------------------------------------
  */

  const handlePromptEnhancement = async (
    originalPrompt,
    securityResult
  ) => {
    const threatLevel = securityResult?.threatLevel;

    // Never enhance blocked prompts.
    if (!isPromptAllowed(threatLevel)) {
      setEnhancement(null);
      setSelectedPrompt("");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Your session has expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setEnhancementLoading(true);
      setEnhancement(null);
      setSelectedPrompt("");

      const response = await fetch(
        "http://localhost:5000/api/ai/enhance",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            prompt: originalPrompt,
          }),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch (error) {
        throw new Error(
          "Invalid response received from prompt enhancement service.",
          {
            cause: error,
          }
        );
      }

      console.log(
        "Prompt Enhancement Status:",
        response.status
      );

      console.log(
        "Prompt Enhancement Response:",
        data
      );

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
        throw new Error(
          data?.message ||
            "Unable to analyze the prompt language."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      if (data.success && data.enhancement) {
        setEnhancement(data.enhancement);

        if (data.enhancement.needsImprovement) {
          setSelectedPrompt(
            data.enhancement.improvedPrompt ||
              originalPrompt
          );
        } else {
          setSelectedPrompt(
            data.enhancement.originalPrompt ||
              originalPrompt
          );
        }

        return;
      }

      throw new Error(
        data?.message ||
          "Unable to analyze the prompt language."
      );
    } catch (error) {
      console.error(
        "Prompt Enhancement Error:",
        error
      );

      // The security result must remain visible even if
      // the language-enhancement service fails.
      setEnhancement(null);
      setSelectedPrompt("");

      alert(
        error.message ||
          "Unable to analyze the prompt language."
      );
    } finally {
      setEnhancementLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT ORIGINAL PROMPT
  |--------------------------------------------------------------------------
  */

  const handleUseOriginal = () => {
    if (!enhancement?.originalPrompt) {
      return;
    }

    setSelectedPrompt(
      enhancement.originalPrompt
    );
  };

  /*
  |--------------------------------------------------------------------------
  | SELECT IMPROVED PROMPT
  |--------------------------------------------------------------------------
  */

  const handleUseImproved = () => {
    if (!enhancement?.improvedPrompt) {
      return;
    }

    setSelectedPrompt(
      enhancement.improvedPrompt
    );
  };

  /*
  |--------------------------------------------------------------------------
  | OPEN AI HUB
  |--------------------------------------------------------------------------
  */

  const handleContinueToAIHub = () => {
    const finalPrompt =
      selectedPrompt ||
      enhancement?.improvedPrompt ||
      enhancement?.originalPrompt ||
      prompt.trim();

    if (!finalPrompt) {
      alert(
        "Please select a prompt before continuing."
      );
      return;
    }

    /*
     * Pass the selected prompt to AI Hub.
     *
     * AI Hub will use this value as the initial
     * conversation prompt.
     */
    navigate("/ai-hub", {
      state: {
        prompt: finalPrompt,
        securityResult: result,
      },
    });
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
      setEnhancement(null);
      setEnhancementLoading(false);
      setSelectedPrompt("");

      const originalPrompt = prompt.trim();

      const response = await fetch(
        "http://localhost:5000/api/scan",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            prompt: originalPrompt,
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

      console.log(
        "Scan Status:",
        response.status
      );

      console.log(
        "Backend Response:",
        data
      );

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

      if (data.success && data.result) {
        const securityResult = data.result;

        setResult(securityResult);

        /*
        |--------------------------------------------------------------------------
        | SECURITY GATE
        |--------------------------------------------------------------------------
        |
        | Only SAFE / LOW / MEDIUM continue to
        | prompt-quality analysis.
        |
        | HIGH / CRITICAL remain blocked and are
        | never sent to the enhancement engine.
        |
        */

        if (
          isPromptAllowed(
            securityResult?.threatLevel
          )
        ) {
          /*
          |--------------------------------------------------------------------------
          | Prompt quality / English analysis
          |--------------------------------------------------------------------------
          */

          await handlePromptEnhancement(
            originalPrompt,
            securityResult
          );
        } else {
          /*
          |--------------------------------------------------------------------------
          | BLOCKED PROMPT
          |--------------------------------------------------------------------------
          */

          setEnhancement(null);
          setSelectedPrompt("");
        }
      } else {
        alert(
          data.message ||
            "Scan failed. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Scan Error:",
        error
      );

      alert(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | COPY PROMPT
  |--------------------------------------------------------------------------
  */

  const handleCopyPrompt = async (value) => {
    if (!value) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);

      alert("Prompt copied to clipboard.");
    } catch (error) {
      console.error(
        "Copy Error:",
        error
      );

      alert(
        "Unable to copy the prompt."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | THREAT LEVEL HELPERS
  |--------------------------------------------------------------------------
  */

  const threatLevel = String(
    result?.threatLevel || ""
  ).toUpperCase();

  const promptAllowed =
    isPromptAllowed(threatLevel);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

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
                loading={
                  loading ||
                  enhancementLoading
                }
              />

            </section>

            {/* =========================================================== */}
            {/* SCAN PROGRESS                                                */}
            {/* =========================================================== */}

            {(loading || enhancementLoading) && (
              <section className="mt-5 w-full">

                <ScanProgress />

                {enhancementLoading && !loading && (
                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-blue-100
                      bg-blue-50
                      px-4
                      py-3
                      text-sm
                      font-medium
                      text-blue-700
                    "
                  >
                    <Sparkles
                      size={16}
                      className="animate-pulse"
                    />

                    Checking grammar, clarity,
                    and prompt quality...
                  </div>
                )}

              </section>
            )}

            {/* =========================================================== */}
            {/* SECURITY RESULT                                              */}
            {/* =========================================================== */}

            {result && (
              <section className="mt-6 w-full">

                <ResultCard result={result} />

              </section>
            )}

            {/* =========================================================== */}
            {/* PROMPT ENHANCEMENT                                            */}
            {/* =========================================================== */}

            {enhancement &&
              promptAllowed &&
              !enhancementLoading && (
                <section className="mt-6 w-full">

                  <div
                    className="
                      overflow-hidden
                      rounded-3xl
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                    "
                  >

                    {/* Header */}

                    <div
                      className="
                        border-b
                        border-slate-200
                        bg-gradient-to-r
                        from-blue-50
                        via-white
                        to-indigo-50
                        px-5
                        py-5
                        sm:px-7
                      "
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-4
                          sm:flex-row
                          sm:items-center
                          sm:justify-between
                        "
                      >

                        <div className="flex items-start gap-3">

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              shrink-0
                              items-center
                              justify-center
                              rounded-2xl
                              bg-blue-100
                              text-blue-600
                            "
                          >
                            <Sparkles size={22} />
                          </div>

                          <div>

                            <div className="flex items-center gap-2">

                              <h2
                                className="
                                  text-lg
                                  font-bold
                                  text-slate-900
                                "
                              >
                                Prompt Enhancement
                              </h2>

                              <span
                                className="
                                  rounded-full
                                  bg-blue-100
                                  px-2.5
                                  py-1
                                  text-[10px]
                                  font-bold
                                  uppercase
                                  tracking-wide
                                  text-blue-700
                                "
                              >
                                AI Quality Check
                              </span>

                            </div>

                            <p
                              className="
                                mt-1
                                text-sm
                                leading-6
                                text-slate-500
                              "
                            >
                              We checked the English,
                              grammar, clarity, and structure
                              while preserving your original intent.
                            </p>

                          </div>

                        </div>

                        {enhancement.needsImprovement ? (
                          <div
                            className="
                              flex
                              shrink-0
                              items-center
                              gap-2
                              rounded-full
                              bg-amber-50
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-amber-700
                            "
                          >
                            <AlertCircle size={15} />

                            Improvement suggested
                          </div>
                        ) : (
                          <div
                            className="
                              flex
                              shrink-0
                              items-center
                              gap-2
                              rounded-full
                              bg-green-50
                              px-3
                              py-2
                              text-xs
                              font-semibold
                              text-green-700
                            "
                          >
                            <CheckCircle2 size={15} />

                            Prompt looks good
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Original / Improved */}

                    <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">

                      {/* Original Prompt */}

                      <div
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-5
                        "
                      >

                        <div
                          className="
                            mb-3
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >

                          <div>

                            <p
                              className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                              "
                            >
                              Original Prompt
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                            >
                              Your submitted prompt
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyPrompt(
                                enhancement.originalPrompt
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-1.5
                              rounded-lg
                              border
                              border-slate-200
                              bg-white
                              px-2.5
                              py-1.5
                              text-xs
                              font-medium
                              text-slate-600
                              transition
                              hover:border-slate-300
                              hover:bg-slate-100
                            "
                          >
                            <Copy size={13} />
                            Copy
                          </button>

                        </div>

                        <div
                          className="
                            min-h-28
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            text-sm
                            leading-6
                            text-slate-700
                          "
                        >
                          {enhancement.originalPrompt}
                        </div>

                        <button
                          type="button"
                          onClick={handleUseOriginal}
                          className={`
                            mt-4
                            w-full
                            rounded-xl
                            border
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            transition
                            ${
                              selectedPrompt ===
                              enhancement.originalPrompt
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }
                          `}
                        >
                          {selectedPrompt ===
                          enhancement.originalPrompt
                            ? "✓ Original Selected"
                            : "Use Original Prompt"}
                        </button>

                      </div>

                      {/* Improved Prompt */}

                      <div
                        className="
                          rounded-2xl
                          border
                          border-blue-200
                          bg-blue-50/40
                          p-5
                        "
                      >

                        <div
                          className="
                            mb-3
                            flex
                            items-center
                            justify-between
                            gap-3
                          "
                        >

                          <div>

                            <p
                              className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-blue-600
                              "
                            >
                              Improved Prompt
                            </p>

                            <p
                              className="
                                mt-1
                                text-xs
                                text-slate-400
                              "
                            >
                              Clearer version with the same intent
                            </p>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleCopyPrompt(
                                enhancement.improvedPrompt
                              )
                            }
                            className="
                              flex
                              items-center
                              gap-1.5
                              rounded-lg
                              border
                              border-blue-100
                              bg-white
                              px-2.5
                              py-1.5
                              text-xs
                              font-medium
                              text-blue-600
                              transition
                              hover:bg-blue-50
                            "
                          >
                            <Copy size={13} />
                            Copy
                          </button>

                        </div>

                        <div
                          className="
                            min-h-28
                            rounded-xl
                            border
                            border-blue-100
                            bg-white
                            p-4
                            text-sm
                            leading-6
                            text-slate-800
                          "
                        >
                          {enhancement.improvedPrompt}
                        </div>

                        <button
                          type="button"
                          onClick={handleUseImproved}
                          className={`
                            mt-4
                            w-full
                            rounded-xl
                            border
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            transition
                            ${
                              selectedPrompt ===
                              enhancement.improvedPrompt
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                            }
                          `}
                        >
                          {selectedPrompt ===
                          enhancement.improvedPrompt
                            ? "✓ Improved Selected"
                            : "Use Improved Prompt"}
                        </button>

                      </div>

                    </div>

                    {/* Quality Score + Changes */}

                    <div className="px-5 pb-5 sm:px-7 sm:pb-7">

                      <div
                        className="
                          rounded-2xl
                          border
                          border-slate-200
                          bg-slate-50
                          p-5
                        "
                      >

                        <div className="grid gap-5 lg:grid-cols-2">

                          {/* Quality Score */}

                          <div>

                            <p
                              className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                              "
                            >
                              Prompt Quality Score
                            </p>

                            <div className="mt-3 flex items-center gap-3">
                              <div
                                className="
                                  flex
                                  h-12
                                  w-12
                                  items-center
                                  justify-center
                                  rounded-xl
                                  border
                                  border-blue-200
                                  bg-blue-50
                                  text-sm
                                  font-bold
                                  text-blue-700
                                "
                              >
                                {typeof enhancement.qualityScore === "number"
                                  ? `${enhancement.qualityScore}`
                                  : "—"}
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-800">
                                  {typeof enhancement.qualityScore === "number"
                                    ? "Quality score"
                                    : "Score unavailable"}
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                  Based on the prompt-quality analysis returned by the enhancement service.
                                </p>
                              </div>
                            </div>

                          </div>

                          {/* Changes */}

                          <div>

                            <p
                              className="
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-slate-500
                              "
                            >
                              Detected Changes
                            </p>

                            {Array.isArray(enhancement.changes) &&
                            enhancement.changes.length > 0 ? (
                              <div
                                className="
                                  mt-3
                                  flex
                                  flex-wrap
                                  gap-2
                                "
                              >
                                {enhancement.changes.map(
                                  (change, index) => (
                                    <span
                                      key={`${String(change)}-${index}`}
                                      className="
                                        rounded-full
                                        border
                                        border-amber-200
                                        bg-amber-50
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-amber-700
                                      "
                                    >
                                      {String(change)}
                                    </span>
                                  )
                                )}
                              </div>
                            ) : typeof enhancement.changes === "string" &&
                              enhancement.changes.trim() ? (
                              <p
                                className="
                                  mt-2
                                  text-sm
                                  leading-6
                                  text-slate-600
                                "
                              >
                                {enhancement.changes}
                              </p>
                            ) : (
                              <p
                                className="
                                  mt-2
                                  text-sm
                                  text-slate-500
                                "
                              >
                                No specific changes were required.
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Continue */}

                    <div
                      className="
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-slate-200
                        bg-slate-50
                        px-5
                        py-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:px-7
                      "
                    >

                      <div>

                        <p
                          className="
                            text-sm
                            font-semibold
                            text-slate-800
                          "
                        >
                          Prompt is ready for AI Hub
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-slate-500
                          "
                        >
                          Your selected prompt will be passed
                          to the protected AI conversation.
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={handleContinueToAIHub}
                        disabled={!selectedPrompt}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          bg-slate-900
                          px-5
                          py-3
                          text-sm
                          font-bold
                          text-white
                          shadow-sm
                          transition
                          hover:bg-slate-800
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
                      >
                        Continue to AI Hub

                        <ArrowRight size={17} />

                      </button>

                    </div>

                  </div>

                </section>
              )}

            {/* =========================================================== */}
            {/* BLOCKED PROMPT MESSAGE                                       */}
            {/* =========================================================== */}

            {result &&
              !promptAllowed &&
              !loading && (
                <section className="mt-5 w-full">

                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-2xl
                      border
                      border-red-200
                      bg-red-50
                      p-5
                    "
                  >

                    <AlertCircle
                      size={21}
                      className="
                        mt-0.5
                        shrink-0
                        text-red-600
                      "
                    />

                    <div>

                      <p
                        className="
                          text-sm
                          font-bold
                          text-red-800
                        "
                      >
                        Prompt blocked by the security gateway
                      </p>

                      <p
                        className="
                          mt-1
                          text-sm
                          leading-6
                          text-red-700
                        "
                      >
                        This prompt will not be enhanced or
                        forwarded to AI Hub because the security
                        analysis identified a blocking threat level.
                      </p>

                    </div>

                  </div>

                </section>
              )}

          </div>

        </main>

      </div>

    </div>
  );
}

export default PromptScannerPage;