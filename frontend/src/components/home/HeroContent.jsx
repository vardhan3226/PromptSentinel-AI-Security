import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="relative z-20 max-w-2xl"
    >
      {/* Status Badge */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
        </span>

        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
          AI Security Platform
        </span>
      </motion.div>

      {/* Main Heading */}

      <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[4.25rem]">
        Protect your
        <span className="block">
          AI with
          <span className="ml-2 text-cyan-400">
            PromptSentinel.
          </span>
        </span>
      </h1>

      {/* Supporting Text */}

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg"
      >
        Detect prompt injection, jailbreak attempts, prompt
        leakage and other LLM security threats before they
        reach your AI model.
      </motion.p>

      {/* Security Points */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        className="mt-7 grid gap-3 sm:grid-cols-2"
      >
        <SecurityPoint text="Real-time threat detection" />
        <SecurityPoint text="Risk & confidence scoring" />
        <SecurityPoint text="Explainable security results" />
        <SecurityPoint text="Security scan history" />
      </motion.div>

      {/* Buttons */}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-9 flex flex-col gap-3 sm:flex-row"
      >
        <Link
          to="/register"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_30px_rgba(34,211,238,0.18)] transition duration-300 hover:bg-cyan-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.3)]"
        >
          Start Securing Prompts

          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <a
          href="#workflow"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-slate-200 transition duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/5 hover:text-cyan-300"
        >
          <Sparkles size={17} />
          Explore How It Works
        </a>
      </motion.div>

      {/* Small Trust Line */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mt-8 flex items-center gap-3 text-xs text-slate-500"
      >
        <ShieldCheck
          size={17}
          className="text-emerald-400"
        />

        <span>
          Analyze first. Allow safe prompts. Block suspicious ones.
        </span>
      </motion.div>
    </motion.div>
  );
}

function SecurityPoint({ text }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-slate-400">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/10">
        <ShieldCheck
          size={13}
          className="text-cyan-400"
        />
      </div>

      <span>{text}</span>
    </div>
  );
}

export default HeroContent;