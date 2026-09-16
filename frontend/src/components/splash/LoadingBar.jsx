import { motion } from "framer-motion";

function LoadingBar({ progress }) {
  return (
    <div className="w-full flex flex-col items-center">

      <motion.p
        className="text-3xl font-bold text-cyan-400 mb-4"
        animate={{
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        {progress}%
      </motion.p>

      <div className="relative w-[450px] h-3 rounded-full bg-slate-800 overflow-hidden">

        <motion.div
          className="h-full rounded-full bg-cyan-400"
          animate={{
            width: `${progress}%`,
          }}
          transition={{
            duration: 0.15,
            ease: "linear",
          }}
        />

        <motion.div
          className="absolute top-0 h-full w-24 bg-white/30 blur-sm"
          animate={{
            x: [-120, 520],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

      </div>

    </div>
  );
}

export default LoadingBar;