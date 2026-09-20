import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  BrainCircuit,
  LockKeyhole,
  BarChart3,
  Users,
  FileSearch,
  Globe2,
} from "lucide-react";

import Background from "../../components/splash/Background";
import Particles from "../../components/splash/Particles";
import BootMessages from "../../components/splash/BootMessages";
import LoadingBar from "../../components/splash/LoadingBar";

const messages = [
  "Initializing AI Firewall...",
  "Loading Threat Detection Engine...",
  "Connecting AI Security Services...",
  "Activating Security Modules...",
  "Preparing Secure Environment...",
  "System Ready ✓",
];

function Splash() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }

        return prev + 1;
      });
    }, 60);

    return () => clearInterval(progressTimer);
  }, []);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }

        return prev;
      });
    }, 1000);

    return () => clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        navigate("/home");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [progress, navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020817] text-white">
      <Background />
      <Particles />

      {/* =========================================================
          ATMOSPHERE
      ========================================================= */}
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        {/* central blue atmosphere */}
        <div className="absolute left-1/2 top-[2%] h-[650px] w-[850px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[150px]" />

        {/* saffron light */}
        <div className="absolute -left-[180px] top-[28%] h-[500px] w-[500px] rounded-full bg-orange-500/[0.09] blur-[130px]" />

        {/* green light */}
        <div className="absolute -right-[180px] top-[30%] h-[500px] w-[500px] rounded-full bg-green-500/[0.07] blur-[130px]" />

        {/* bottom cyan */}
        <div className="absolute bottom-[-300px] left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-cyan-500/[0.06] blur-[150px]" />

        {/* horizon */}
        <div className="absolute bottom-[12%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
      </div>

      {/* =========================================================
          TOP IDENTITY
      ========================================================= */}
      <div className="absolute left-7 top-6 z-30 flex items-center gap-3 sm:left-10">
        <TricolorLine />

        <span className="text-[9px] font-semibold tracking-[0.38em] text-slate-300 sm:text-[10px]">
          MADE IN INDIA
        </span>
      </div>

      <div className="absolute right-7 top-6 z-30 hidden items-center gap-3 sm:right-10 sm:flex">
        <span className="text-[9px] font-semibold tracking-[0.35em] text-slate-400">
          FOR A SAFER AI WORLD
        </span>

        <TricolorLine />
      </div>

      {/* =========================================================
          SIDE STATEMENTS
      ========================================================= */}
      <div className="absolute left-8 top-[34%] z-20 hidden xl:block">
        <SideStatement
          title="INDIAN"
          subtitle="INNOVATION"
          text="GLOBAL IMPACT"
          align="left"
        />
      </div>

      <div className="absolute right-8 top-[48%] z-20 hidden xl:block">
        <SideStatement
          title="PEOPLE"
          subtitle="TECHNOLOGY"
          text="SAFER AI TOGETHER"
          align="right"
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <main className="relative z-10 flex min-h-screen flex-col items-center px-4 pb-7 pt-20 sm:px-6">
        {/* =====================================================
            SECURITY CORE
        ===================================================== */}
        <div className="relative h-[330px] w-[330px] sm:h-[390px] sm:w-[390px] lg:h-[420px] lg:w-[420px]">

          {/* outer HUD ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-[2%] rounded-full border border-cyan-400/20"
          >
            <div className="absolute left-1/2 top-[-3px] h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_16px_#22d3ee]" />

            <div className="absolute bottom-[8%] right-[9%] h-1.5 w-1.5 rounded-full bg-blue-300" />
          </motion.div>

          {/* dashed HUD ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-[10%] rounded-full border border-blue-400/20 border-dashed"
          >
            <div className="absolute left-[8%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_14px_#f97316]" />

            <div className="absolute right-[10%] top-[25%] h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_12px_#22c55e]" />
          </motion.div>

          {/* inner ring */}
          <motion.div
            animate={{
              scale: [1, 1.025, 1],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-[17%] rounded-full border border-cyan-300/15 bg-blue-500/[0.025] shadow-[0_0_80px_rgba(34,211,238,0.08)]"
          />

          {/* DIGITAL GLOBE */}
          <div className="absolute inset-[18%] flex items-center justify-center">
            <motion.div
              animate={{
                rotateY: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative h-full w-full rounded-full"
            >
              <div className="absolute inset-0 rounded-full border border-blue-400/20" />

              <div className="absolute inset-[7%] rounded-full border border-cyan-400/10" />

              <div className="absolute inset-[16%] rounded-full border border-blue-300/[0.08]" />

              <Globe2
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-300/20"
                size={185}
                strokeWidth={0.55}
              />

              {/* globe dots */}
              <GlowDot className="left-[25%] top-[28%]" color="blue" />
              <GlowDot className="left-[68%] top-[20%]" color="cyan" />
              <GlowDot className="left-[74%] top-[56%]" color="green" />
              <GlowDot className="left-[34%] top-[72%]" color="blue" />
              <GlowDot className="left-[52%] top-[45%]" color="cyan" />
            </motion.div>
          </div>

          {/* =================================================
              TRICOLOR ORBIT
          ================================================= */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-[18%] z-20 rounded-full"
          >
            <div className="absolute left-1/2 top-[-1px] h-[4px] w-[120px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-500 shadow-[0_0_14px_rgba(255,255,255,0.45)]" />

            <div className="absolute bottom-0 left-1/2 h-[3px] w-[80px] -translate-x-1/2 rounded-full bg-gradient-to-r from-green-500 via-white to-orange-500" />
          </motion.div>

          {/* =================================================
              MAIN SHIELD
          ================================================= */}
          <motion.div
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 z-30 flex h-[155px] w-[125px] -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:h-[180px] sm:w-[145px]"
          >
            {/* glow */}
            <div className="absolute inset-[-25px] rounded-full bg-cyan-400/10 blur-[35px]" />

            {/* shield */}
            <div className="relative h-full w-full [clip-path:polygon(50%_0%,91%_15%,87%_62%,74%_82%,50%_100%,26%_82%,13%_62%,9%_15%)] bg-gradient-to-br from-orange-500 via-white to-green-500 p-[3px] shadow-[0_0_45px_rgba(34,211,238,0.45)]">
              <div className="relative flex h-full w-full items-center justify-center [clip-path:polygon(50%_0%,91%_15%,87%_62%,74%_82%,50%_100%,26%_82%,13%_62%,9%_15%)] bg-[#071326]">
                {/* center circle */}
                <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border border-blue-300/30 bg-blue-500/[0.08] shadow-[0_0_30px_rgba(59,130,246,0.35)] sm:h-[78px] sm:w-[78px]">
                  <ShieldCheck
                    size={42}
                    strokeWidth={1.15}
                    className="text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.9)] sm:h-[48px] sm:w-[48px]"
                  />

                  {/* Ashoka-like center */}
                  <div className="absolute inset-[10px] rounded-full border border-blue-300/10" />
                </div>

                {/* shield reflection */}
                <div className="absolute left-0 right-1/2 top-0 h-full bg-orange-500/[0.08]" />

                <div className="absolute bottom-0 left-1/2 right-0 h-1/2 bg-green-500/[0.08]" />
              </div>
            </div>
          </motion.div>

          {/* energy particles */}
          <EnergyParticle className="left-[13%] top-[40%]" color="orange" />
          <EnergyParticle className="right-[11%] top-[42%]" color="green" />
          <EnergyParticle className="left-[28%] top-[12%]" color="blue" />
          <EnergyParticle className="right-[27%] bottom-[13%]" color="cyan" />
        </div>

        {/* =====================================================
            FLOATING MODULES
        ===================================================== */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <FloatingModule
            className="left-[16%] top-[19%]"
            icon={ShieldCheck}
            title="DETECT"
            subtitle="THREATS"
            color="orange"
          />

          <FloatingModule
            className="left-[18%] top-[36%]"
            icon={BrainCircuit}
            title="ANALYZE"
            subtitle="INTENT"
            color="blue"
          />

          <FloatingModule
            className="left-[23%] top-[53%]"
            icon={FileSearch}
            title="PREVENT"
            subtitle="RISKS"
            color="blue"
          />

          <FloatingModule
            className="right-[16%] top-[19%]"
            icon={LockKeyhole}
            title="SECURE"
            subtitle="AI SYSTEMS"
            color="green"
          />

          <FloatingModule
            className="right-[18%] top-[36%]"
            icon={BarChart3}
            title="EMPOWER"
            subtitle="INDIA"
            color="blue"
          />

          <FloatingModule
            className="right-[23%] top-[53%]"
            icon={Users}
            title="BUILD A"
            subtitle="SAFER TOMORROW"
            color="green"
          />
        </div>

        {/* =====================================================
            BRANDING
        ===================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-40 -mt-4 text-center sm:-mt-8"
        >
          <h1 className="whitespace-nowrap text-[42px] font-black tracking-[-0.04em] sm:text-6xl lg:text-[72px]">
            <span className="text-white">Prompt</span>
            <span className="text-cyan-400 drop-shadow-[0_0_22px_rgba(34,211,238,0.35)]">
              Sentinel
            </span>
          </h1>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.5em] text-slate-400 sm:text-xs">
            AI Security Platform
          </p>

          <p className="mt-3 text-sm tracking-[0.12em] text-slate-300 sm:text-base">
            Securing AI for a Brighter Tomorrow.
          </p>

          <div className="mx-auto mt-4 flex h-[4px] w-32 overflow-hidden rounded-full">
            <span className="w-1/3 bg-orange-500" />
            <span className="w-1/3 bg-white" />
            <span className="w-1/3 bg-green-500" />
          </div>
        </motion.section>

        {/* =====================================================
            LOADING
        ===================================================== */}
        <section className="relative z-40 mt-7 w-full max-w-[650px]">
          <BootMessages message={messages[messageIndex]} />

          <div className="mt-5">
            <LoadingBar progress={progress} />
          </div>

          <div className="mt-2 flex justify-center">
            <motion.span
              key={progress}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold tabular-nums text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.45)]"
            >
              {progress}%
            </motion.span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <SystemStatus
              color="orange"
              text="Loading Security Modules"
              active={progress >= 10}
            />

            <SystemStatus
              color="blue"
              text="Connecting AI Services"
              active={progress >= 35}
            />

            <SystemStatus
              color="green"
              text="Preparing Secure Environment"
              active={progress >= 70}
            />
          </div>
        </section>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <div className="mt-6 flex items-center gap-4 text-[8px] font-semibold uppercase tracking-[0.38em] text-slate-600 sm:mt-7">
          <span className="hidden h-px w-20 bg-slate-700 sm:block" />

          <span>Built With Purpose</span>

          <span className="hidden h-px w-20 bg-slate-700 sm:block" />
        </div>
      </main>
    </div>
  );
}

/* =============================================================
   SMALL COMPONENTS
============================================================= */

function TricolorLine() {
  return (
    <div className="flex h-[4px] w-12 overflow-hidden rounded-full">
      <span className="w-1/3 bg-orange-500" />
      <span className="w-1/3 bg-white" />
      <span className="w-1/3 bg-green-500" />
    </div>
  );
}

function SideStatement({
  title,
  subtitle,
  text,
}) {
  return (
    <div className="space-y-1 text-[9px] font-medium uppercase tracking-[0.28em] text-slate-400">
      <p>{title}</p>
      <p>{subtitle}</p>
      <p>{text}</p>
    </div>
  );
}

function FloatingModule({
  className,
  icon: Icon,
  title,
  subtitle,
  color,
}) {
  const colors = {
    orange: {
      border: "border-orange-400/25",
      icon: "text-orange-400",
      glow: "shadow-[0_0_25px_rgba(249,115,22,0.08)]",
    },
    blue: {
      border: "border-blue-400/25",
      icon: "text-blue-400",
      glow: "shadow-[0_0_25px_rgba(59,130,246,0.08)]",
    },
    green: {
      border: "border-green-400/25",
      icon: "text-green-400",
      glow: "shadow-[0_0_25px_rgba(34,197,94,0.08)]",
    },
  };

  const style = colors[color];

  return (
    <motion.div
      animate={{
        y: [0, -5, 0],
        opacity: [0.75, 1, 0.75],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute ${className} flex w-28 flex-col items-center rounded-2xl border ${style.border} bg-slate-950/30 px-3 py-3 backdrop-blur-md ${style.glow}`}
    >
      <Icon
        size={21}
        strokeWidth={1.4}
        className={style.icon}
      />

      <span className="mt-2 text-[8px] font-bold tracking-[0.2em] text-slate-300">
        {title}
      </span>

      <span className="mt-0.5 text-[8px] font-medium tracking-[0.13em] text-slate-500">
        {subtitle}
      </span>
    </motion.div>
  );
}

function GlowDot({ className, color }) {
  const colors = {
    blue: "bg-blue-400 shadow-[0_0_10px_#60a5fa]",
    cyan: "bg-cyan-300 shadow-[0_0_10px_#22d3ee]",
    green: "bg-green-400 shadow-[0_0_10px_#4ade80]",
  };

  return (
    <motion.span
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [0.8, 1.2, 0.8],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute h-1.5 w-1.5 rounded-full ${colors[color]} ${className}`}
    />
  );
}

function EnergyParticle({ className, color }) {
  const colors = {
    orange:
      "bg-orange-400 shadow-[0_0_15px_#f97316]",
    green:
      "bg-green-400 shadow-[0_0_15px_#22c55e]",
    blue:
      "bg-blue-400 shadow-[0_0_15px_#3b82f6]",
    cyan:
      "bg-cyan-300 shadow-[0_0_15px_#22d3ee]",
  };

  return (
    <motion.span
      animate={{
        opacity: [0.2, 1, 0.2],
        scale: [0.7, 1.4, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute h-2 w-2 rounded-full ${colors[color]} ${className}`}
    />
  );
}

function SystemStatus({
  color,
  text,
  active,
}) {
  const colors = {
    orange: "bg-orange-400 shadow-[0_0_10px_#f97316]",
    blue: "bg-blue-400 shadow-[0_0_10px_#3b82f6]",
    green: "bg-green-400 shadow-[0_0_10px_#22c55e]",
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-2 transition-all duration-500 ${
        active ? "opacity-100" : "opacity-35"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          active ? colors[color] : "bg-slate-700"
        }`}
      />

      <span className="text-[8px] font-medium tracking-wide text-slate-400">
        {text}
      </span>
    </div>
  );
}

export default Splash;