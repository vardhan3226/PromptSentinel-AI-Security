import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  icon,
  color,
  bgColor,
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -5,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`relative overflow-hidden rounded-3xl p-6 border shadow-xl ${bgColor}`}
    >
      <div className="absolute -right-6 -top-6 opacity-10">
        <div className="text-[90px]">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-400 text-sm uppercase tracking-wider">
            {title}
          </p>

          <h2 className={`text-5xl font-bold mt-3 ${color}`}>
            {value}
          </h2>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-950 ${color}`}
        >
          {icon}
        </div>

      </div>

      <div className="mt-6 h-2 bg-slate-800 rounded-full overflow-hidden">

        <div
          className={`h-full ${color.replace(
            "text",
            "bg"
          )}`}
          style={{
            width: `${Math.min(value || 0, 100)}%`,
          }}
        />

      </div>

    </motion.div>
  );
}

export default StatCard;