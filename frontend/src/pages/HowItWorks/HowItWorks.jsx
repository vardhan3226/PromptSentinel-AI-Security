import Navbar from "../../components/layout/Navbar";
import {
  MessageSquareText,
  ScanSearch,
  BrainCircuit,
  ShieldCheck,
  Gauge,
  FileCheck2,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: MessageSquareText,
    title: "Prompt Input",
    description:
      "You submit a prompt that needs to be checked before reaching the AI model.",
    color: "saffron",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "Preprocessing",
    description:
      "The prompt is cleaned and prepared for security checks and sensitive-data detection.",
    color: "blue",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Local Detection",
    description:
      "Known attacks, jailbreak signals, extraction attempts, and suspicious patterns are checked.",
    color: "saffron",
  },
  {
    number: "04",
    icon: BrainCircuit,
    title: "Semantic & AI Analysis",
    description:
      "The system examines the meaning and intent of the prompt for possible threats.",
    color: "blue",
  },
  {
    number: "05",
    icon: Gauge,
    title: "Security Fusion",
    description:
      "Evidence from different security layers is combined into one security assessment.",
    color: "green",
  },
  {
    number: "06",
    icon: FileCheck2,
    title: "Final Security Result",
    description:
      "You receive the threat level, risk score, confidence, explanation, and recommendation.",
    color: "green",
  },
];

const colorStyles = {
  saffron: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-500",
    line: "bg-orange-400",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    line: "bg-blue-600",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-600",
    line: "bg-green-500",
  },
};

function HowItWorks() {
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

        <section className="relative mx-auto max-w-7xl px-6 pb-14 pt-12 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-3xl text-center">

            {/* Made in India */}

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

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600"
            >
              How It Works
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            >
              From prompt to
              <span className="block text-blue-600">
                security result.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg"
            >
              Every prompt passes through multiple security checks
              before the final result is produced.
            </motion.p>

            {/* Tricolor */}

            <div className="mt-7 flex justify-center gap-1">

              <span className="h-1 w-12 rounded-full bg-orange-500" />
              <span className="h-1 w-12 rounded-full bg-blue-600" />
              <span className="h-1 w-12 rounded-full bg-green-600" />

            </div>

          </div>

        </section>

        {/* =====================================
            WORKFLOW
        ====================================== */}

        <section className="relative mx-auto max-w-5xl px-6 pb-20 sm:px-8">

          <div className="relative">

            {/* Vertical line */}

            <div className="absolute bottom-10 left-7 top-10 hidden w-px bg-gradient-to-b from-orange-300 via-blue-300 to-green-300 md:block" />

            <div className="space-y-5">

              {steps.map((step, index) => {

                const Icon = step.icon;
                const style = colorStyles[step.color];

                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.06,
                    }}
                    className="relative"
                  >

                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-7">

                      {/* Accent */}

                      <div
                        className={`absolute left-0 top-0 h-full w-1 ${style.line}`}
                      />

                      <div className="flex items-start gap-5">

                        {/* Number */}

                        <div className="relative z-10 flex shrink-0 flex-col items-center">

                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${style.border} ${style.bg}`}
                          >
                            <Icon
                              size={24}
                              strokeWidth={1.8}
                              className={style.text}
                            />
                          </div>

                          <span className="mt-2 text-[10px] font-bold tracking-widest text-slate-400">
                            {step.number}
                          </span>

                        </div>

                        {/* Content */}

                        <div className="flex-1 pt-1">

                          <h2 className="text-xl font-bold text-[#0B1736]">
                            {step.title}
                          </h2>

                          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                            {step.description}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Connector */}

                    {index < steps.length - 1 && (
                      <div className="flex justify-center py-2 md:hidden">
                        <ArrowDown
                          size={18}
                          className="text-slate-300"
                        />
                      </div>
                    )}

                  </motion.div>
                );
              })}

            </div>

          </div>

        </section>

        {/* =====================================
            SIMPLE FLOW SUMMARY
        ====================================== */}

        <section className="relative border-t border-slate-200 bg-white">

          <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">

            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8">

              <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Security Pipeline
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold">

                <FlowItem text="Prompt" color="orange" />
                <ArrowDown className="hidden rotate-[-90deg] text-slate-300 sm:block" size={16} />

                <FlowItem text="Analysis" color="blue" />
                <ArrowDown className="hidden rotate-[-90deg] text-slate-300 sm:block" size={16} />

                <FlowItem text="Risk" color="blue" />
                <ArrowDown className="hidden rotate-[-90deg] text-slate-300 sm:block" size={16} />

                <FlowItem text="Result" color="green" />

              </div>

            </div>

            <div className="mt-10 flex justify-center gap-1">

              <span className="h-1 w-10 rounded-full bg-orange-500" />
              <span className="h-1 w-10 rounded-full bg-blue-600" />
              <span className="h-1 w-10 rounded-full bg-green-600" />

            </div>

            <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Made in India · Built for Safer AI
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

function FlowItem({ text, color }) {
  const styles = {
    orange: "border-orange-100 bg-orange-50 text-orange-600",
    blue: "border-blue-100 bg-blue-50 text-blue-600",
    green: "border-green-100 bg-green-50 text-green-600",
  };

  return (
    <span
      className={`rounded-full border px-4 py-2 ${styles[color]}`}
    >
      {text}
    </span>
  );
}

export default HowItWorks;