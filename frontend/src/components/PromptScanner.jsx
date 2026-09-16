import {
  ScanSearch,
  ShieldCheck,
  BrainCircuit,
  Shield,
  Activity,
  Cpu,
  Radar,
  FileText,
  Zap,
} from "lucide-react";

function PromptScanner({
  prompt,
  setPrompt,
  handleScan,
  loading,
}) {
  const wordCount = prompt.trim()
    ? prompt.trim().split(/\s+/).length
    : 0;

  return (
    <section className="relative security-card overflow-hidden">

      {/* =========================================================
          BACKGROUND GLOW
      ========================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-80
          bg-[radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.12),transparent_30%),radial-gradient(circle_at_0%_100%,rgba(59,130,246,0.08),transparent_35%)]
        "
      />

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <div className="relative z-10 p-6 md:p-8 lg:p-10">

        {/* =========================================================
            HEADER
        ========================================================== */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

          <div className="flex items-start sm:items-center gap-4">

            {/* Scanner Icon */}

            <div
              className="
                relative
                shrink-0
                flex
                items-center
                justify-center
                w-14
                h-14
                rounded-2xl
                bg-gradient-to-br
                from-cyan-400
                via-blue-500
                to-indigo-600
                shadow-lg
                shadow-cyan-500/20
              "
            >
              <ScanSearch
                size={29}
                className="text-white relative z-10"
              />

              <div
                className="
                  absolute
                  inset-1
                  rounded-xl
                  border
                  border-white/20
                "
              />
            </div>

            {/* Title */}

            <div>
              <div className="flex items-center gap-3 flex-wrap">

                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Prompt
                  <span className="text-security-gradient">
                    {" "}Scanner
                  </span>
                </h2>

                <span
                  className="
                    px-2.5
                    py-1
                    rounded-lg
                    text-[10px]
                    font-bold
                    tracking-[0.18em]
                    text-cyan-300
                    bg-cyan-500/10
                    border
                    border-cyan-400/10
                  "
                >
                  V1.0
                </span>

              </div>

              <p className="mt-2 text-sm md:text-base text-slate-400">
                Submit untrusted prompts for multi-layer AI security analysis.
              </p>

            </div>

          </div>

          {/* Security Status */}

          <div
            className="
              group
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-2xl
              border
              border-emerald-400/15
              bg-emerald-500/5
              shadow-lg
              shadow-emerald-500/5
            "
          >
            <div className="relative flex items-center justify-center">

              <span
                className="
                  absolute
                  w-8
                  h-8
                  rounded-full
                  bg-emerald-400/10
                  security-pulse
                "
              />

              <ShieldCheck
                size={22}
                className="relative text-emerald-400"
              />

            </div>

            <div>

              <div className="flex items-center gap-2">

                <span className="text-sm font-semibold text-emerald-300">
                  Engine Ready
                </span>

                <span className="relative flex w-2 h-2">

                  <span
                    className="
                      absolute
                      inline-flex
                      w-full
                      h-full
                      rounded-full
                      bg-emerald-400
                      opacity-75
                      animate-ping
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      w-2
                      h-2
                      rounded-full
                      bg-emerald-400
                    "
                  />

                </span>

              </div>

              <p className="text-[10px] mt-0.5 text-slate-500">
                Multi-layer protection active
              </p>

            </div>

          </div>

        </div>

        {/* =========================================================
            SECURITY PIPELINE
        ========================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-7">

          {/* Local Detection */}

          <div
            className="
              group
              relative
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              bg-slate-950/35
              border
              border-slate-700/30
              transition-all
              duration-300
              hover:border-emerald-400/20
              hover:-translate-y-1
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-xl
                bg-emerald-500/10
                border
                border-emerald-400/10
              "
            >
              <Shield
                size={19}
                className="text-emerald-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Local Detection
              </p>

              <p className="text-[11px] text-slate-500 mt-1">
                Pattern analysis engine
              </p>
            </div>

          </div>

          {/* AI Analysis */}

          <div
            className="
              group
              relative
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              bg-slate-950/35
              border
              border-slate-700/30
              transition-all
              duration-300
              hover:border-cyan-400/20
              hover:-translate-y-1
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-xl
                bg-cyan-500/10
                border
                border-cyan-400/10
              "
            >
              <BrainCircuit
                size={19}
                className="text-cyan-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                AI Analysis
              </p>

              <p className="text-[11px] text-slate-500 mt-1">
                Secondary intelligence layer
              </p>
            </div>

          </div>

          {/* Classification */}

          <div
            className="
              group
              relative
              flex
              items-center
              gap-3
              p-4
              rounded-2xl
              bg-slate-950/35
              border
              border-slate-700/30
              transition-all
              duration-300
              hover:border-violet-400/20
              hover:-translate-y-1
            "
          >
            <div
              className="
                flex
                items-center
                justify-center
                w-10
                h-10
                rounded-xl
                bg-violet-500/10
                border
                border-violet-400/10
              "
            >
              <Activity
                size={19}
                className="text-violet-400"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-200">
                Threat Classification
              </p>

              <p className="text-[11px] text-slate-500 mt-1">
                Risk and confidence scoring
              </p>
            </div>

          </div>

        </div>

        {/* =========================================================
            PROMPT CONSOLE
        ========================================================== */}

        <div
          className={`
            relative
            rounded-3xl
            border
            transition-all
            duration-500
            overflow-hidden
            ${
              loading
                ? "border-cyan-400/40 security-glow scanning-effect"
                : "border-slate-700/50"
            }
          `}
        >

          {/* Console Header */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
              px-5
              py-3.5
              bg-slate-950/70
              border-b
              border-slate-800/80
            "
          >

            <div className="flex items-center gap-3">

              <div className="flex gap-1.5">

                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />

                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />

              </div>

              <div className="flex items-center gap-2">

                <Cpu
                  size={14}
                  className="text-cyan-400"
                />

                <span className="text-xs font-medium tracking-wide text-slate-400">
                  UNTRUSTED PROMPT INPUT
                </span>

              </div>

            </div>

            <div className="hidden sm:flex items-center gap-2">

              <Radar
                size={14}
                className={
                  loading
                    ? "text-cyan-400 animate-spin"
                    : "text-slate-600"
                }
              />

              <span className="text-[10px] tracking-[0.16em] text-slate-600">
                {loading
                  ? "SCANNING"
                  : "READY"}
              </span>

            </div>

          </div>

          {/* Textarea */}

          <div className="relative bg-slate-950/40">

            <textarea
              rows={10}
              value={prompt}
              onChange={(e) =>
                setPrompt(e.target.value)
              }
              disabled={loading}
              placeholder="Paste or type a prompt for security analysis..."
              className="
                security-input
                relative
                z-10
                min-h-[280px]
                w-full
                border-0
                rounded-none
                bg-transparent
                p-6
                text-sm
                leading-7
                text-slate-200
                placeholder:text-slate-600
                resize-none
                focus:ring-0
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />

            {/* Decorative corner */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-4
                right-4
                flex
                items-center
                gap-1.5
                opacity-50
              "
            >
              <Zap
                size={13}
                className="text-cyan-400"
              />

              <span className="text-[10px] text-slate-500">
                SECURITY MONITORING
              </span>

            </div>

          </div>

          {/* Console Footer */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              px-5
              py-4
              bg-slate-950/60
              border-t
              border-slate-800/80
            "
          >

            <div className="flex flex-wrap items-center gap-4">

              <div className="flex items-center gap-2">

                <FileText
                  size={14}
                  className="text-slate-500"
                />

                <span className="text-xs text-slate-500">
                  Characters
                </span>

                <span className="text-xs font-semibold text-slate-300">
                  {prompt.length}
                </span>

              </div>

              <div className="w-px h-4 bg-slate-700 hidden sm:block" />

              <div className="flex items-center gap-2">

                <span className="text-xs text-slate-500">
                  Words
                </span>

                <span className="text-xs font-semibold text-slate-300">
                  {wordCount}
                </span>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <span
                className={`
                  w-2
                  h-2
                  rounded-full
                  ${
                    loading
                      ? "bg-cyan-400 animate-pulse"
                      : "bg-emerald-400"
                  }
                `}
              />

              <span
                className={`
                  text-xs
                  font-medium
                  ${
                    loading
                      ? "text-cyan-400"
                      : "text-emerald-400"
                  }
                `}
              >
                {loading
                  ? "Security analysis in progress"
                  : "Threat detection active"}
              </span>

            </div>

          </div>

        </div>

        {/* =========================================================
            SCAN ACTION
        ========================================================== */}

        <button
          onClick={handleScan}
          disabled={loading || !prompt.trim()}
          className="
            security-button
            relative
            mt-7
            w-full
            min-h-[62px]
            flex
            items-center
            justify-center
            gap-3
            text-base
            md:text-lg
            font-bold
            overflow-hidden
            disabled:opacity-40
            disabled:cursor-not-allowed
            disabled:hover:translate-y-0
            disabled:hover:brightness-100
          "
        >

          {/* Button shine */}

          <span
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-r
              from-transparent
              via-white/10
              to-transparent
              -translate-x-full
              group-hover:translate-x-full
              transition-transform
              duration-1000
            "
          />

          {loading ? (
            <>
              <span
                className="
                  w-5
                  h-5
                  rounded-full
                  border-2
                  border-white/30
                  border-t-white
                  animate-spin
                "
              />

              <span className="relative">
                Scanning Security Layers...
              </span>
            </>
          ) : (
            <>
              <ScanSearch
                size={21}
                className="relative"
              />

              <span className="relative">
                Start Security Scan
              </span>
            </>
          )}

        </button>

        {/* =========================================================
            SCAN PIPELINE STATUS
        ========================================================== */}

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-[10px] tracking-[0.14em] text-slate-600">

          <span>
            INPUT
          </span>

          <span className="w-6 h-px bg-slate-700" />

          <span>
            DETECTION
          </span>

          <span className="w-6 h-px bg-slate-700" />

          <span>
            AI ANALYSIS
          </span>

          <span className="w-6 h-px bg-slate-700" />

          <span>
            CLASSIFICATION
          </span>

        </div>

      </div>

    </section>
  );
}

export default PromptScanner;