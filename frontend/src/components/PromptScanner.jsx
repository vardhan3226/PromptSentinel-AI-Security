import { useState } from "react";

import {
  ScanSearch,
  ShieldCheck,
  Bug,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

function PromptScanner({
  prompt,
  setPrompt,
  handleScan,
  loading,
}) {
  const [redTeamLoading, setRedTeamLoading] =
    useState(false);

  const [robustnessResult, setRobustnessResult] =
    useState(null);

  const wordCount = prompt.trim()
    ? prompt.trim().split(/\s+/).length
    : 0;

  /* ============================================================
     RED TEAM TEST
  ============================================================ */

  const handleRedTeamTest = async () => {
    if (!prompt.trim()) {
      alert(
        "Please enter a prompt before starting the Red-Team test."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert(
        "Your session has expired. Please login again."
      );
      return;
    }

    try {
      setRedTeamLoading(true);
      setRobustnessResult(null);

      const response = await fetch(
        "http://localhost:5000/api/scan/robustness",
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
      } catch {
        throw new Error(
          "Invalid response received from server."
        );
      }

      if (
        response.status === 401 ||
        response.status === 403
      ) {
        localStorage.removeItem("token");

        alert(
          data?.message ||
            "Your session has expired. Please login again."
        );

        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Red-Team test failed. Please try again."
        );
      }

      if (
        data.success &&
        data.robustness
      ) {
        setRobustnessResult(
          data.robustness
        );
      } else {
        throw new Error(
          data?.message ||
            "Red-Team test failed. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Red-Team Error:",
        error
      );

      alert(
        error.message ||
          "Unable to connect to the server."
      );
    } finally {
      setRedTeamLoading(false);
    }
  };

  /* ============================================================
     STATE
  ============================================================ */

  const isBusy =
    loading || redTeamLoading;

  const totalMutations = Number(
    robustnessResult?.totalMutations || 0
  );

  const detectedMutations = Number(
    robustnessResult?.detectedMutations || 0
  );

  const missedMutations = Number(
    robustnessResult?.missedMutations || 0
  );

  const detectionRate = Number(
    robustnessResult?.detectionRate || 0
  );

  const mutationResults =
    Array.isArray(
      robustnessResult?.results
    )
      ? robustnessResult.results
      : [];

  /* ============================================================
     UI
  ============================================================ */

  return (
    <section className="relative overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">

      {/* BACKGROUND ACCENTS */}
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-72 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-56 rounded-full bg-green-100/40 blur-3xl" />

      {/* ========================================================
          HEADER
      ========================================================= */}

      <div className="relative border-b border-slate-100 px-5 py-5 sm:px-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
              <ScanSearch
                size={20}
                className="text-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">

                <h2 className="text-lg font-bold tracking-tight text-[#10254d]">
                  Prompt Scanner
                </h2>

                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600">
                  AI Security
                </span>

              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                Analyze a prompt before sending it to an AI model.
              </p>
            </div>

          </div>

          {/* ENGINE STATUS */}

          <div className="flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:self-auto">

            <span className="relative flex h-2 w-2">

              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

            </span>

            <span className="text-[10px] font-semibold text-emerald-700">
              Engine Ready
            </span>

          </div>

        </div>
      </div>

      {/* ========================================================
          MAIN INPUT AREA
      ========================================================= */}

      <div className="relative px-5 py-5 sm:px-6">

        {/* INPUT LABEL */}

        <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">

          <ScanSearch
            size={16}
            className="shrink-0 text-slate-400"
          />

          <span className="text-xs text-slate-500">
            Paste or type a prompt to analyze...
          </span>

        </div>

        {/* TEXTAREA */}

        <div
          className={`
            overflow-hidden
            rounded-xl
            border
            bg-white
            transition-all
            duration-200
            ${
              loading
                ? "border-blue-300 ring-4 ring-blue-50"
                : "border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50"
            }
          `}
        >

          <textarea
            rows={7}
            value={prompt}
            onChange={(event) => {
              setPrompt(
                event.target.value
              );

              setRobustnessResult(
                null
              );
            }}
            disabled={isBusy}
            placeholder="Type or paste your prompt here..."
            className="
              min-h-[180px]
              w-full
              resize-none
              border-0
              bg-transparent
              px-4
              py-4
              text-sm
              leading-6
              text-slate-700
              outline-none
              placeholder:text-slate-400
              focus:ring-0
              disabled:cursor-not-allowed
              disabled:bg-slate-50
              disabled:opacity-70
            "
          />

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5">

            <span className="text-[11px] text-slate-400">
              {wordCount}{" "}
              {wordCount === 1
                ? "word"
                : "words"}
            </span>

            <span className="text-[11px] font-medium text-slate-400">
              AI Security Analysis
            </span>

          </div>

        </div>

        {/* ======================================================
            BUTTONS
        ====================================================== */}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">

          {/* NORMAL SCAN */}

          <button
            type="button"
            onClick={handleScan}
            disabled={isBusy}
            className="
              flex
              min-h-[48px]
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              text-sm
              font-bold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {loading ? (
              <>
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />

                Scanning...
              </>
            ) : (
              <>
                <ShieldCheck
                  size={17}
                />

                Scan Prompt
              </>
            )}

          </button>

          {/* RED TEAM */}

          <button
            type="button"
            onClick={handleRedTeamTest}
            disabled={isBusy}
            className="
              flex
              min-h-[48px]
              flex-1
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-orange-200
              bg-orange-50
              px-5
              text-sm
              font-bold
              text-orange-700
              transition
              hover:bg-orange-100
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >

            {redTeamLoading ? (
              <>
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />

                Testing...
              </>
            ) : (
              <>
                <Bug size={17} />

                Red-Team Test
              </>
            )}

          </button>

        </div>

        {/* ======================================================
            SECURITY PIPELINE
        ====================================================== */}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">

          <span className="rounded-full bg-slate-100 px-2.5 py-1">
            Input
          </span>

          <span className="text-slate-300">
            →
          </span>

          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-600">
            Detection
          </span>

          <span className="text-slate-300">
            →
          </span>

          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-600">
            AI Analysis
          </span>

          <span className="text-slate-300">
            →
          </span>

          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-600">
            Risk Score
          </span>

          <span className="text-slate-300">
            →
          </span>

          <span className="rounded-full bg-green-50 px-2.5 py-1 text-green-600">
            Result
          </span>

        </div>

        {/* ======================================================
            RED TEAM RESULT
        ====================================================== */}

        {robustnessResult && (
          <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/40 p-4 sm:p-5">

            {/* RESULT HEADER */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <Bug
                    size={18}
                    className="text-orange-600"
                  />

                  <h3 className="text-base font-bold text-slate-800">
                    Red-Team Robustness Test
                  </h3>

                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Mutated versions of the supplied prompt were tested against the local security layers.
                </p>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-1.5">

                <Target
                  size={14}
                  className="text-orange-600"
                />

                <span className="text-xs font-bold text-orange-700">
                  {detectionRate}% detection
                </span>

              </div>

            </div>

            {/* METRICS */}

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Mutations
                </p>

                <p className="mt-1 text-2xl font-extrabold text-slate-800">
                  {totalMutations}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                  Detected
                </p>

                <p className="mt-1 text-2xl font-extrabold text-emerald-700">
                  {detectedMutations}
                </p>
              </div>

              <div className="rounded-xl border border-red-100 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600">
                  Missed
                </p>

                <p className="mt-1 text-2xl font-extrabold text-red-700">
                  {missedMutations}
                </p>
              </div>

              <div className="rounded-xl border border-blue-100 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                  Detection Rate
                </p>

                <p className="mt-1 text-2xl font-extrabold text-blue-700">
                  {detectionRate}%
                </p>
              </div>

            </div>

            {/* MUTATION LIST */}

            {mutationResults.length > 0 && (
              <div className="mt-5">

                <div className="mb-3 flex items-center justify-between">

                  <h4 className="text-sm font-bold text-slate-700">
                    Mutation Results
                  </h4>

                  <span className="text-[10px] text-slate-400">
                    {mutationResults.length} tested
                  </span>

                </div>

                <div className="space-y-2">

                  {mutationResults.map(
                    (item, index) => {
                      const detected =
                        Boolean(
                          item?.detected
                        );

                      return (
                        <div
                          key={
                            item?.index ||
                            index
                          }
                          className="rounded-xl border border-slate-200 bg-white p-3"
                        >

                          <div className="flex items-start gap-3">

                            <div
                              className={`
                                mt-0.5
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                ${
                                  detected
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                                }
                              `}
                            >
                              {detected ? (
                                <CheckCircle2
                                  size={15}
                                />
                              ) : (
                                <XCircle
                                  size={15}
                                />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="break-words text-xs font-medium leading-5 text-slate-700">
                                {item?.mutation ||
                                  "Mutation"}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-1.5">

                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[8px] font-semibold text-slate-500">
                                  {detected
                                    ? "Detected"
                                    : "Missed"}
                                </span>

                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[8px] text-slate-500">
                                  Threat:{" "}
                                  {item?.threatLevel ||
                                    "SAFE"}
                                </span>

                                <span className="rounded-md bg-slate-100 px-2 py-1 text-[8px] text-slate-500">
                                  Similarity:{" "}
                                  {Number(
                                    item?.similarityScore ||
                                      0
                                  )}
                                  %
                                </span>

                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>
            )}

            {/* NO MUTATIONS */}

            {totalMutations === 0 && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-center">

                <Sparkles
                  size={20}
                  className="mx-auto text-blue-500"
                />

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  No attack mutations generated
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  The supplied prompt did not match the current mutation patterns.
                </p>

              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}

export default PromptScanner;