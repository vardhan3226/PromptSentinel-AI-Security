import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.png";

import Background from "../../components/splash/Background";
import Particles from "../../components/splash/Particles";
import BootMessages from "../../components/splash/BootMessages";
import LoadingBar from "../../components/splash/LoadingBar";

const messages = [
  "Initializing AI Firewall...",
  "Loading Threat Detection Engine...",
  "Scanning Prompt Database...",
  "Activating Security Modules...",
  "Checking AI Security...",
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">

      <Background />

      <Particles />

      <div className="relative z-20 flex flex-col items-center">

        <motion.img
          src={logo}
          alt="PromptSentinel Logo"
          initial={{
            opacity: 0,
            scale: 0.6,
            y: 40,
          }}
          animate={{
            opacity: 1,
            scale: [1, 1.05, 1],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-60 h-60 object-contain drop-shadow-[0_0_70px_#22d3ee]"
        />

        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
          }}
          className="mt-6 text-6xl font-extrabold tracking-wide text-cyan-400"
        >
          PromptSentinel
        </motion.h1>

        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.5,
          }}
          className="mt-2 text-lg text-slate-400 tracking-[0.25em] uppercase"
        >
          Artificial Intelligence Firewall
        </motion.p>

        <div className="mt-10 w-[500px]">

          <BootMessages
            message={messages[messageIndex]}
          />

        </div>

        <div className="mt-8 w-[500px]">

          <LoadingBar
            progress={progress}
          />

        </div>

      </div>

    </div>
  );
}

export default Splash;