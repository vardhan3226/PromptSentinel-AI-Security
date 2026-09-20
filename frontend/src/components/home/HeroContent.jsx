import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative z-20 max-w-[650px]"
    >
      {/* Made in India */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 shadow-sm"
      >
        <span className="flex overflow-hidden rounded-sm">
          <span className="h-1.5 w-3.5 bg-orange-500" />
          <span className="h-1.5 w-3.5 bg-white border-y border-slate-200" />
          <span className="h-1.5 w-3.5 bg-green-600" />
        </span>

        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Made in India
        </span>
      </motion.div>

      {/* Heading */}

      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-[3.2rem] font-extrabold leading-[1.06] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[4.35rem]"
      >
        Secure AI prompts
        <span className="block">
          before they reach
        </span>

        <span className="block">
          your{" "}
          <span className="text-blue-600">
            model.
          </span>
        </span>
      </motion.h1>

      {/* Description */}

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55 }}
        className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
      >
        PromptSentinel checks your prompts for security
        threats before they are sent to an AI model.
      </motion.p>

      {/* Capabilities */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-7 flex flex-wrap gap-x-7 gap-y-3"
      >
        <SecurityPoint text="Threat detection" />
        <SecurityPoint text="Risk scoring" />
        <SecurityPoint text="AI analysis" />
      </motion.div>

      {/* Buttons */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.55 }}
        className="mt-9 flex flex-col gap-3 sm:flex-row"
      >
        <Link
          to="/register"
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/15 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Start Scanning

          <ArrowRight
            size={18}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>

        <Link
          to="/how-it-works"
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          How It Works
        </Link>
      </motion.div>

      {/* Security statement */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-7 flex items-center gap-2 text-sm text-slate-500"
      >
        <CheckCircle2
          size={16}
          className="text-green-600"
        />

        <span>
          Security analysis before model execution
        </span>
      </motion.div>
    </motion.div>
  );
}

function SecurityPoint({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2
          size={13}
          className="text-green-600"
        />
      </span>

      <span>{text}</span>
    </div>
  );
}

export default HeroContent;