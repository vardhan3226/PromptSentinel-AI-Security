import { motion } from "framer-motion";

const particles = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  size: Math.random() * 6 + 2,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 5,
}));

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400"

          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            opacity: 0.25,
          }}

          animate={{
            y: [-20, -180],
            opacity: [0.1, 0.8, 0],
            scale: [0.5, 1.3, 0.4],
          }}

          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

    </div>
  );
}

export default Particles;