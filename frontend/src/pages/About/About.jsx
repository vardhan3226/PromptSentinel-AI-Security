import Navbar from "../../components/layout/Navbar";
import {
  ShieldCheck,
  Target,
  Layers3,
  SearchCheck,
  LockKeyhole,
  BrainCircuit,
} from "lucide-react";
import { motion } from "framer-motion";

function About() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F8FAFC] text-[#0B1736]">

      <Navbar />

      <main className="relative pt-28">

        {/* =====================================
            BACKGROUND
        ====================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-40 top-20 h-80 w-[700px] rotate-[-8deg] rounded-full bg-orange-400/[0.06] blur-3xl" />

          <div className="absolute left-1/3 top-[35%] h-80 w-[700px] rounded-full bg-blue-500/[0.05] blur-3xl" />

          <div className="absolute -left-40 bottom-20 h-80 w-[700px] rotate-[8deg] rounded-full bg-green-500/[0.05] blur-3xl" />

        </div>

        {/* =====================================
            HEADER
        ====================================== */}

        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-12 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-3xl text-center">

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-7 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
            >

              <div className="flex overflow-hidden rounded-sm">
                <span className="h-1 w-6 bg-orange-500" />
                <span className="h-1 w-6 bg-slate-200" />
                <span className="h-1 w-6 bg-green-500" />
              </div>

              <span className="text-xs font-bold tracking-[0.2em] text-slate-600">
                MADE IN INDIA
              </span>

            </motion.div>

            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              About PromptSentinel
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Security before
              <span className="block text-blue-600">
                AI execution.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              PromptSentinel checks AI prompts for security risks
              before they reach the model.
            </p>

            <div className="mt-7 flex justify-center gap-1">
              <span className="h-1 w-12 rounded-full bg-orange-500" />
              <span className="h-1 w-12 rounded-full bg-blue-600" />
              <span className="h-1 w-12 rounded-full bg-green-600" />
            </div>

          </div>

        </section>

        {/* =====================================
            WHAT IS PROMPTSENTINEL
        ====================================== */}

        <section className="relative mx-auto max-w-6xl px-6 pb-20 sm:px-8">

          <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">

            {/* Text */}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                The Platform
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                A security layer between
                <span className="block">
                  users and AI models.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">
                AI applications can receive prompts that contain
                unsafe instructions, jailbreak attempts, extraction
                requests, or sensitive information.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                PromptSentinel analyzes these prompts and produces
                a clear security result before the prompt continues
                through the application.
              </p>

            </motion.div>

            {/* Security Visual */}

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative flex min-h-[320px] items-center justify-center"
            >

              {/* Rings */}

              <div className="absolute h-[270px] w-[270px] rounded-full border border-orange-200" />

              <div className="absolute h-[215px] w-[215px] rounded-full border border-blue-200" />

              <div className="absolute h-[160px] w-[160px] rounded-full border border-green-200" />

              {/* Core */}

              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">

                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">

                  <ShieldCheck
                    size={40}
                    strokeWidth={1.6}
                    className="text-blue-600"
                  />

                </div>

              </div>

              {/* Status */}

              <div className="absolute bottom-5 right-4 rounded-xl border border-green-100 bg-white px-4 py-3 shadow-lg">

                <div className="flex items-center gap-2">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs font-bold text-green-600">
                    Security Active
                  </span>

                </div>

              </div>

            </motion.div>

          </div>

        </section>

        {/* =====================================
            CORE PRINCIPLES
        ====================================== */}

        <section className="relative border-y border-slate-200 bg-white">

          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">

            <div className="mx-auto max-w-2xl text-center">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Our Approach
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Built around practical AI security.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                PromptSentinel focuses on clear analysis,
                multiple security layers, and useful results.
              </p>

            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">

              <AboutCard
                icon={ShieldCheck}
                title="Security First"
                description="Analyze prompts before they reach the AI model."
                color="orange"
              />

              <AboutCard
                icon={Layers3}
                title="Multiple Layers"
                description="Combine local, semantic, and AI analysis."
                color="blue"
              />

              <AboutCard
                icon={Target}
                title="Clear Results"
                description="Show risk, confidence, evidence, and recommendations."
                color="green"
              />

            </div>

          </div>

        </section>

        {/* =====================================
            SECURITY COVERAGE
        ====================================== */}

        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8">

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:p-10">

            <div className="max-w-2xl">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Security Coverage
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                What PromptSentinel checks.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                The platform analyzes several common prompt security
                risks and produces structured security evidence.
              </p>

            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

              <CoverageItem
                icon={SearchCheck}
                title="Prompt Injection"
              />

              <CoverageItem
                icon={LockKeyhole}
                title="System Prompt Extraction"
              />

              <CoverageItem
                icon={ShieldCheck}
                title="Jailbreak Detection"
              />

              <CoverageItem
                icon={BrainCircuit}
                title="Semantic Analysis"
              />

              <CoverageItem
                icon={Target}
                title="Risk Assessment"
              />

              <CoverageItem
                icon={Layers3}
                title="Security Evidence"
              />

            </div>

          </div>

        </section>

        {/* =====================================
            SIMPLE END
        ====================================== */}

        <section className="border-t border-slate-200 bg-white">

          <div className="mx-auto max-w-6xl px-6 py-10 text-center sm:px-8">

            <div className="flex justify-center gap-1">
              <span className="h-1 w-10 rounded-full bg-orange-500" />
              <span className="h-1 w-10 rounded-full bg-blue-600" />
              <span className="h-1 w-10 rounded-full bg-green-600" />
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Built for Safer AI
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

function AboutCard({
  icon: Icon,
  title,
  description,
  color,
}) {
  const styles = {
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      text: "text-orange-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-600",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-600",
    },
  };

  const style = styles[color];

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 transition duration-300 hover:-translate-y-1 hover:shadow-md">

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}
      >
        <Icon
          size={22}
          strokeWidth={1.7}
          className={style.text}
        />
      </div>

      <h3 className="mt-6 text-lg font-bold text-[#0B1736]">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}

function CoverageItem({
  icon: Icon,
  title,
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">

        <Icon
          size={17}
          strokeWidth={1.7}
          className="text-blue-600"
        />

      </div>

      <span className="text-sm font-semibold text-slate-700">
        {title}
      </span>

    </div>
  );
}

export default About;