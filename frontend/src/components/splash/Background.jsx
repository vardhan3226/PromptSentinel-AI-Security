import { motion } from "framer-motion";

function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black" />

      <motion.div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-52 -right-52 w-[650px] h-[650px] rounded-full bg-blue-500/10 blur-3xl"
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_65%)]" />

    </div>
  );
}

export default Background;