import Navbar from "../../components/layout/Navbar";
import {
  Code2,
  Database,
  Server,
  BrainCircuit,
  ShieldCheck,
  LockKeyhole,
  Workflow,
} from "lucide-react";
import { motion } from "framer-motion";

const technologies = [
  {
    icon: Code2,
    name: "React + Vite",
    description:
      "A fast frontend foundation for building the PromptSentinel security interface.",
    color: "blue",
  },
  {
    icon: ShieldCheck,
    name: "Tailwind CSS",
    description:
      "Responsive utility-based styling used to create the clean and consistent interface.",
    color: "orange",
  },
  {
    icon: Server,
    name: "Node.js + Express",
    description:
      "Backend services that handle authentication, scanning, reports, and security APIs.",
    color: "green",
  },
  {
    icon: Database,
    name: "PostgreSQL + Prisma",
    description:
      "Database infrastructure used to store users, scan records, and application data.",
    color: "blue",
  },
  {
    icon: BrainCircuit,
    name: "Groq AI",
    description:
      "AI analysis works alongside local security detection to analyze suspicious prompts.",
    color: "orange",
  },
  {
    icon: LockKeyhole,
    name: "Security Engine",
    description:
      "Combines local detection, semantic analysis, PII protection, risk scoring, and security fusion.",
    color: "green",
  },
];

const colorStyles = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-600",
    glow: "bg-blue-500/[0.05]",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    text: "text-orange-500",
    glow: "bg-orange-400/[0.05]",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-600",
    glow: "bg-green-500/[0.05]",
  },
};

function Technology() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F8FAFC] text-[#0B1736]">
      <Navbar />

      <main className="relative pt-28">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 top-20 h-80 w-[700px] rotate-[-8deg] rounded-full bg-orange-400/[0.06] blur-3xl" />

          <div className="absolute left-1/3 top-[30%] h-80 w-[700px] rounded-full bg-blue-500/[0.05] blur-3xl" />

          <div className="absolute -left-40 bottom-20 h-80 w-[700px] rotate-[8deg] rounded-full bg-green-500/[0.05] blur-3xl" />
        </div>

        {/* Hero */}
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
              Technology
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Built with modern
              <span className="block text-blue-600">
                security technology.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              PromptSentinel combines a modern web stack, AI analysis,
              database infrastructure, and dedicated security services.
            </p>

            <div className="mt-7 flex justify-center gap-1">
              <span className="h-1 w-12 rounded-full bg-orange-500" />
              <span className="h-1 w-12 rounded-full bg-blue-600" />
              <span className="h-1 w-12 rounded-full bg-green-600" />
            </div>
          </div>
        </section>

        {/* Technology overview */}
        <section className="relative mx-auto max-w-6xl px-6 pb-20 sm:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1fr]">
            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative flex min-h-[330px] items-center justify-center"
            >
              <div className="absolute h-[280px] w-[280px] rounded-full border border-orange-200" />

              <div className="absolute h-[220px] w-[220px] rounded-full border border-blue-200" />

              <div className="absolute h-[160px] w-[160px] rounded-full border border-green-200" />

              <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50">
                  <Workflow
                    size={40}
                    strokeWidth={1.6}
                    className="text-blue-600"
                  />
                </div>
              </div>

              <div className="absolute left-3 top-16 rounded-xl border border-orange-100 bg-white px-4 py-3 shadow-lg">
                <p className="text-xs font-bold text-orange-500">
                  Frontend
                </p>
              </div>

              <div className="absolute right-3 top-12 rounded-xl border border-blue-100 bg-white px-4 py-3 shadow-lg">
                <p className="text-xs font-bold text-blue-600">
                  AI Layer
                </p>
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-xl border border-green-100 bg-white px-4 py-3 shadow-lg">
                <p className="text-xs font-bold text-green-600">
                  Security Engine
                </p>
              </div>
            </motion.div>

            {/* Explanation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Technology Stack
              </p>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Multiple technologies,
                <span className="block">
                  one security workflow.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">
                PromptSentinel is designed as a layered application.
                The frontend provides the interface, the backend
                coordinates security services, and AI analysis adds
                another layer of detection.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                These components work together to transform a prompt
                into a structured security result.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Technology cards */}
        <section className="relative border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Core Technologies
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                The stack behind PromptSentinel.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                Each technology has a specific role in the platform.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {technologies.map((technology, index) => {
                const Icon = technology.icon;
                const style = colorStyles[technology.color];

                return (
                  <motion.div
                    key={technology.name}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.05,
                    }}
                    className="group rounded-2xl border border-slate-200 bg-[#F8FAFC] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_12px_35px_rgba(15,23,42,0.07)]"
                  >
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
                      {technology.name}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {technology.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Architecture flow */}
        <section className="relative mx-auto max-w-6xl px-6 py-20 sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                Application Flow
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                How the stack works together.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                A simple flow connects the user interface with the
                security analysis services.
              </p>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-4">
              <FlowItem
                number="01"
                title="Frontend"
                description="Prompt input"
                color="orange"
              />

              <FlowItem
                number="02"
                title="Backend"
                description="API processing"
                color="blue"
              />

              <FlowItem
                number="03"
                title="AI + Security"
                description="Threat analysis"
                color="green"
              />

              <FlowItem
                number="04"
                title="Database"
                description="Secure records"
                color="blue"
              />
            </div>
          </div>
        </section>

        {/* Bottom identity */}
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

function FlowItem({
  number,
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
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}
      >
        <span className={`text-xs font-black ${style.text}`}>
          {number}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-bold text-[#0B1736]">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Technology;