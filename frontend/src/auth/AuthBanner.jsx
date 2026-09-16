import { motion } from "framer-motion";
import logo from "../assets/images/logo.png";

function AuthBanner() {
  return (
    <div className="text-white">

      <motion.img
        src={logo}
        alt="PromptSentinel"
        className="w-24 h-24 mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-black leading-tight"
      >
        Prompt
        <span className="text-cyan-400">Sentinel</span>
      </motion.h1>

      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-slate-300 text-lg leading-8"
      >
        AI Firewall for Large Language Models that detects prompt injection,
        jailbreak attacks, prompt leakage, and other AI security threats in
        real time.
      </motion.p>

      <div className="mt-10 space-y-5">

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-slate-300">
            Prompt Injection Detection
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-slate-300">
            Jailbreak Protection
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-slate-300">
            Prompt Leakage Prevention
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-slate-300">
            Real-Time AI Threat Analysis
          </span>
        </div>

      </div>

    </div>
  );
}

export default AuthBanner;