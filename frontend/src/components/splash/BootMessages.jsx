import { AnimatePresence, motion } from "framer-motion";

function BootMessages({ message }) {
  return (
    <div className="h-12 flex items-center justify-center">

      <AnimatePresence mode="wait">

        <motion.p
          key={message}
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -12,
          }}
          transition={{
            duration: 0.45,
          }}
          className="text-xl font-medium text-slate-300 tracking-wide text-center"
        >
          {message}
        </motion.p>

      </AnimatePresence>

    </div>
  );
}

export default BootMessages;