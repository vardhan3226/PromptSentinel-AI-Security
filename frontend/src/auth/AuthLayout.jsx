import { motion } from "framer-motion";

function AuthLayout({ leftContent, rightContent }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">

      <motion.div
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950"
      >

        <div className="absolute w-96 h-96 rounded-full bg-cyan-500/20 blur-[120px]" />

        <div className="absolute top-20 left-20 w-32 h-32 border border-cyan-400/20 rounded-full animate-pulse" />

        <div className="absolute bottom-20 right-20 w-52 h-52 border border-cyan-400/20 rounded-full animate-pulse" />

        <div className="relative z-10 max-w-lg px-10">
          {leftContent}
        </div>

      </motion.div>

      <motion.div
        initial={{ x: 80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 flex items-center justify-center px-6 py-10"
      >

        <div className="w-full max-w-md">
          {rightContent}
        </div>

      </motion.div>

    </div>
  );
}

export default AuthLayout;