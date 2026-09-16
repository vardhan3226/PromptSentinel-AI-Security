import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  LockKeyhole,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";

const particles = [
  { left: "12%", top: "18%", delay: 0 },
  { left: "82%", top: "14%", delay: 0.8 },
  { left: "88%", top: "70%", delay: 1.4 },
  { left: "18%", top: "78%", delay: 2 },
  { left: "7%", top: "48%", delay: 1.1 },
  { left: "91%", top: "42%", delay: 2.3 },
];

function HeroAnimation() {
  return (
    <div className="relative flex min-h-[520px] items-center justify-center lg:min-h-[600px]">

      {/* Background Glow */}

      <motion.div
        className="absolute h-[360px] w-[360px] rounded-full bg-cyan-500/10 blur-[100px]"
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Particles */}

      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -14, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + index * 0.3,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Main Security Panel */}

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.9,
          delay: 0.2,
          ease: "easeOut",
        }}
        className="relative w-full max-w-[520px]"
      >
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-[0_0_70px_rgba(34,211,238,0.1)] backdrop-blur-2xl sm:p-7">

          {/* Top Bar */}

          <div className="flex items-center justify-between border-b border-white/5 pb-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <ShieldCheck
                  size={21}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  PromptSentinel
                </p>

                <p className="text-xs text-slate-500">
                  Security Gateway
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                Protected
              </span>
            </div>

          </div>

          {/* Prompt Input */}

          <div className="mt-6">

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Incoming Prompt
              </span>

              <ScanSearch
                size={15}
                className="text-cyan-400"
              />
            </div>

            <div className="rounded-2xl border border-white/5 bg-slate-950/80 p-4">

              <p className="font-mono text-xs leading-6 text-slate-400 sm:text-sm">
                Analyze this request before sending it
                to the language model...
              </p>

            </div>

          </div>

          {/* Scan Line */}

          <div className="relative my-6 flex items-center justify-center">

            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            <motion.div
              className="absolute h-8 w-20 rounded-full bg-cyan-400/20 blur-xl"
              animate={{
                x: [-150, 150, -150],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="absolute flex h-9 w-9 items-center justify-center rounded-full border border-cyan-400/30 bg-slate-950">
              <ScanSearch
                size={16}
                className="text-cyan-400"
              />
            </div>

          </div>

          {/* Detection Engine */}

          <div className="rounded-2xl border border-cyan-400/10 bg-slate-950/60 p-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10">
                  <LockKeyhole
                    size={17}
                    className="text-cyan-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Threat Detection Engine
                  </p>

                  <p className="text-xs text-slate-500">
                    Scanning prompt security
                  </p>
                </div>

              </div>

              <span className="text-xs font-bold text-cyan-400">
                ACTIVE
              </span>

            </div>

            {/* Detection Bars */}

            <div className="mt-5 space-y-3">

              <DetectionBar
                label="Prompt Injection"
                value="94%"
              />

              <DetectionBar
                label="Jailbreak"
                value="91%"
              />

              <DetectionBar
                label="Data Leakage"
                value="88%"
              />

            </div>

          </div>

          {/* Result */}

          <motion.div
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mt-5 flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
                <CheckCircle2
                  size={21}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <p className="text-sm font-bold text-emerald-400">
                  Prompt Cleared
                </p>

                <p className="text-xs text-slate-500">
                  Security analysis complete
                </p>
              </div>

            </div>

            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">
              SAFE
            </span>

          </motion.div>

          {/* Decorative Corner */}

          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full border border-cyan-400/10" />

          <div className="pointer-events-none absolute -bottom-24 -left-20 h-44 w-44 rounded-full border border-cyan-400/10" />

        </div>
      </motion.div>

      {/* Small Floating Status */}

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 1,
          duration: 0.6,
        }}
        className="absolute -right-2 top-20 hidden rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block lg:-right-5"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle
            size={15}
            className="text-yellow-400"
          />

          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Detection
            </p>

            <p className="text-xs font-bold text-yellow-400">
              Monitoring
            </p>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

function DetectionBar({ label, value }) {
  return (
    <div>

      <div className="mb-1.5 flex justify-between">

        <span className="text-xs text-slate-400">
          {label}
        </span>

        <span className="text-xs font-semibold text-cyan-400">
          {value}
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: value }}
          transition={{
            duration: 1.2,
            delay: 0.8,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300"
        />

      </div>

    </div>
  );
}

export default HeroAnimation;