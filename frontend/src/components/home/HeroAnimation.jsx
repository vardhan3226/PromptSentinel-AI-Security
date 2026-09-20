import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

function HeroAnimation() {
  return (
    <div className="relative flex min-h-[460px] items-center justify-center lg:min-h-[540px]">

      {/* Soft glow */}

      <div className="absolute h-[360px] w-[360px] rounded-full bg-blue-100/50 blur-[90px]" />

      {/* Tricolor waves behind shield */}

      <div className="absolute inset-0">

        <div className="absolute right-0 top-[25%] h-24 w-full rotate-[7deg] rounded-[50%] border-t-[12px] border-orange-300/40" />

        <div className="absolute right-[-5%] top-[42%] h-28 w-full -rotate-[5deg] rounded-[50%] border-t-[12px] border-green-300/40" />

      </div>

      {/* Shield */}

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -7, 0],
        }}
        transition={{
          opacity: {
            duration: 0.7,
          },
          scale: {
            duration: 0.7,
          },
          y: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="relative z-10"
      >

        {/* Outer shadow */}

        <div className="absolute inset-0 scale-110 rounded-full bg-blue-300/20 blur-3xl" />

        {/* Shield body */}

        <div
          className="relative flex h-[290px] w-[240px] items-center justify-center bg-gradient-to-br from-slate-100 to-white shadow-[0_25px_60px_rgba(15,23,42,0.18)]"
          style={{
            clipPath:
              "polygon(50% 0%, 94% 16%, 88% 65%, 76% 82%, 50% 100%, 24% 82%, 12% 65%, 6% 16%)",
          }}
        >

          {/* Inner shield */}

          <div
            className="flex h-[260px] w-[212px] items-center justify-center bg-gradient-to-br from-orange-500 via-white to-green-600"
            style={{
              clipPath:
                "polygon(50% 0%, 94% 16%, 88% 65%, 76% 82%, 50% 100%, 24% 82%, 12% 65%, 6% 16%)",
            }}
          >

            <div
              className="flex h-[244px] w-[198px] items-center justify-center bg-white"
              style={{
                clipPath:
                  "polygon(50% 0%, 94% 16%, 88% 65%, 76% 82%, 50% 100%, 24% 82%, 12% 65%, 6% 16%)",
              }}
            >

              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 shadow-inner">

                <ShieldCheck
                  size={55}
                  strokeWidth={1.5}
                  className="text-blue-600"
                />

              </div>

            </div>

          </div>

        </div>

      </motion.div>

      {/* Right label */}

      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.5,
        }}
        className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 border-l-2 border-slate-300 pl-5 sm:block"
      >

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Built
        </p>

        <p className="text-lg font-bold text-slate-700">
          in India
        </p>

        <p className="mt-1 max-w-[150px] text-xs leading-5 text-slate-500">
          For a safer AI world
        </p>

        <div className="mt-3 flex w-16 overflow-hidden rounded-full">
          <span className="h-1 flex-1 bg-orange-500" />
          <span className="h-1 flex-1 bg-slate-200" />
          <span className="h-1 flex-1 bg-green-600" />
        </div>

      </motion.div>

    </div>
  );
}

export default HeroAnimation;