import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  icon,
  color = "text-blue-600",
  bgColor = "bg-white",
}) {
  const getAccent = () => {
    if (color.includes("green")) {
      return {
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
        bar: "bg-green-500",
        label: "SAFE",
      };
    }

    if (
      color.includes("red") ||
      color.includes("orange")
    ) {
      return {
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
        bar: "bg-red-500",
        label: "RISK",
      };
    }

    if (color.includes("yellow")) {
      return {
        iconBg: "bg-yellow-50",
        iconColor: "text-yellow-600",
        bar: "bg-yellow-500",
        label: "ALERT",
      };
    }

    return {
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      bar: "bg-blue-500",
      label: "ACTIVE",
    };
  };

  const accent = getAccent();

  const numericValue =
    typeof value === "number"
      ? value
      : Number(value) || 0;

  const progressWidth = Math.min(
    Math.max(numericValue, 0),
    100
  );

  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        transition-shadow
        duration-300
        hover:shadow-md
      "
    >

      {/* TOP ACCENT */}

      <div
        className={`absolute left-0 top-0 h-1 w-full ${accent.bar}`}
      />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div
          className={`
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${accent.iconBg}
            ${accent.iconColor}
          `}
        >
          {icon}
        </div>

        <span
          className={`
            rounded-full
            px-2.5
            py-1
            text-[9px]
            font-bold
            tracking-[0.14em]
            ${accent.iconBg}
            ${accent.iconColor}
          `}
        >
          {accent.label}
        </span>

      </div>

      {/* VALUE */}

      <div className="mt-5">

        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <h2
          className={`
            mt-1
            text-3xl
            font-black
            tracking-tight
            ${accent.iconColor}
          `}
        >
          {value}
        </h2>

      </div>

      {/* PROGRESS */}

      <div className="mt-5">

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: `${progressWidth}%`,
            }}
            transition={{
              duration: 0.7,
              ease: "easeOut",
            }}
            className={`h-full rounded-full ${accent.bar}`}
          />

        </div>

      </div>

      {/* SUBTLE DECORATION */}

      <div
        className={`
          pointer-events-none
          absolute
          -bottom-8
          -right-8
          h-24
          w-24
          rounded-full
          ${accent.iconBg}
          opacity-60
          blur-2xl
        `}
      />

    </motion.div>
  );
}

export default StatCard;