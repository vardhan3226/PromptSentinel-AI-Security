import Navbar from "../../components/layout/Navbar";
import {
  ShieldAlert,
  ShieldCheck,
  LockKeyhole,
  BrainCircuit,
  Gauge,
  FileSearch,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: ShieldAlert,
    title: "Prompt Injection Detection",
    description:
      "Find prompts that try to change or bypass trusted AI instructions.",
    accent: "saffron",
  },
  {
    icon: ShieldCheck,
    title: "Jailbreak Protection",
    description:
      "Identify attempts to bypass safety rules and change model behavior.",
    accent: "blue",
  },
  {
    icon: LockKeyhole,
    title: "Prompt Leakage Protection",
    description:
      "Detect attempts to extract system prompts, secrets, or sensitive information.",
    accent: "green",
  },
  {
    icon: BrainCircuit,
    title: "Semantic Analysis",
    description:
      "Understand the meaning of a prompt even when the attack uses different words.",
    accent: "blue",
  },
  {
    icon: Gauge,
    title: "Risk & Confidence Scoring",
    description:
      "Show the security risk and confidence level for every analyzed prompt.",
    accent: "green",
  },
  {
    icon: FileSearch,
    title: "Explainable Results",
    description:
      "Show attack types, security indicators, reasoning, and recommendations.",
    accent: "saffron",
  },
];

function Features() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F8FAFC] text-[#0B1736]">

      <Navbar />

      <main className="relative pt-28">

        {/* =====================================
            SUBTLE TRICOLOR BACKGROUND
        ====================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* Saffron */}
          <div className="absolute -right-32 top-20 h-72 w-[650px] rotate-[-8deg] rounded-full bg-orange-400/[0.07] blur-3xl" />

          {/* Blue */}
          <div className="absolute left-1/3 top-80 h-80 w-[650px] rounded-full bg-blue-500/[0.06] blur-3xl" />

          {/* Green */}
          <div className="absolute -left-40 bottom-20 h-72 w-[650px] rotate-[8deg] rounded-full bg-green-500/[0.06] blur-3xl" />

        </div>

        {/* =====================================
            PAGE HEADER
        ====================================== */}

        <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-12 sm:px-8 lg:px-10">

          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">

            {/* Left */}

            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >

              {/* Made in India */}

              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">

                <div className="flex overflow-hidden rounded-sm">
                  <span className="h-1 w-6 bg-orange-500" />
                  <span className="h-1 w-6 bg-slate-200" />
                  <span className="h-1 w-6 bg-green-500" />
                </div>

                <span className="text-xs font-bold tracking-[0.2em] text-slate-600">
                  MADE IN INDIA
                </span>

              </div>

              <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
                Security Features
              </p>

              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Simple tools for
                <span className="block">
                  safer AI.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                PromptSentinel checks AI prompts for security risks
                before they reach the model.
              </p>

              {/* Tricolor line */}

              <div className="mt-8 flex items-center gap-1">

                <span className="h-1 w-12 rounded-full bg-orange-500" />
                <span className="h-1 w-12 rounded-full bg-blue-600" />
                <span className="h-1 w-12 rounded-full bg-green-600" />

              </div>

            </motion.div>

            {/* Right — Security overview */}

            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative flex justify-center"
            >

              <div className="relative flex h-[280px] w-[280px] items-center justify-center sm:h-[320px] sm:w-[320px]">

                {/* Outer rings */}

                <div className="absolute inset-0 rounded-full border border-blue-200" />

                <div className="absolute inset-7 rounded-full border border-orange-200" />

                <div className="absolute inset-14 rounded-full border border-green-200" />

                {/* Center */}

                <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full border border-blue-100 bg-white shadow-[0_20px_60px_rgba(37,99,235,0.12)]">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">

                    <ShieldCheck
                      size={34}
                      strokeWidth={1.8}
                      className="text-blue-600"
                    />

                  </div>

                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Protected
                  </p>

                </div>

                {/* Floating labels */}

                <div className="absolute -right-3 top-10 rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-lg">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Detection
                  </p>

                  <p className="mt-1 text-sm font-bold text-orange-500">
                    Active
                  </p>

                </div>

                <div className="absolute -bottom-2 -left-4 rounded-xl border border-green-100 bg-white px-4 py-3 shadow-lg">

                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Protection
                  </p>

                  <p className="mt-1 text-sm font-bold text-green-600">
                    Ready
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </section>

        {/* =====================================
            FEATURE CARDS
        ====================================== */}

        <section className="relative mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              const accentStyles = {
                saffron: {
                  iconBg: "bg-orange-50",
                  iconBorder: "border-orange-100",
                  icon: "text-orange-500",
                  line: "bg-orange-400",
                },

                blue: {
                  iconBg: "bg-blue-50",
                  iconBorder: "border-blue-100",
                  icon: "text-blue-600",
                  line: "bg-blue-600",
                },

                green: {
                  iconBg: "bg-green-50",
                  iconBorder: "border-green-100",
                  icon: "text-green-600",
                  line: "bg-green-500",
                },
              };

              const style = accentStyles[feature.accent];

              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
                >

                  {/* Top accent */}

                  <div
                    className={`absolute left-0 right-0 top-0 h-1 ${style.line}`}
                  />

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${style.iconBorder} ${style.iconBg}`}
                  >
                    <Icon
                      size={23}
                      strokeWidth={1.8}
                      className={style.icon}
                    />
                  </div>

                  <h2 className="mt-6 text-xl font-bold text-[#0B1736]">
                    {feature.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-400">

                    <CheckCircle2
                      size={15}
                      className="text-green-500"
                    />

                    Security layer

                  </div>

                </motion.article>
              );
            })}

          </div>

        </section>

        {/* =====================================
            BOTTOM MESSAGE
        ====================================== */}

        <section className="relative border-t border-slate-200 bg-white">

          <div className="mx-auto max-w-7xl px-6 py-12 text-center sm:px-8">

            <div className="mx-auto flex items-center justify-center gap-1">

              <span className="h-1 w-10 rounded-full bg-orange-500" />
              <span className="h-1 w-10 rounded-full bg-blue-600" />
              <span className="h-1 w-10 rounded-full bg-green-600" />

            </div>

            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Made in India · Built for Safer AI
            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Features;