import { motion } from "framer-motion";

const features = [
  {
    icon: "🛡️",
    title: "Prompt Injection Detection",
    description:
      "Detects malicious prompts that attempt to manipulate or override AI instructions.",
  },
  {
    icon: "🤖",
    title: "Jailbreak Protection",
    description:
      "Identifies jailbreak attempts designed to bypass AI safety mechanisms.",
  },
  {
    icon: "🔒",
    title: "Prompt Leakage Prevention",
    description:
      "Protects confidential system prompts from unauthorized extraction.",
  },
  {
    icon: "📊",
    title: "Threat Analytics",
    description:
      "Visualize attacks, security reports, and AI threat trends in real time.",
  },
  {
    icon: "⚡",
    title: "Real-Time Detection",
    description:
      "Analyze prompts instantly with fast AI-powered security assessment.",
  },
  {
    icon: "🧠",
    title: "Explainable AI",
    description:
      "Understand why a prompt is considered safe or malicious through clear explanations.",
  },
];

function Features() {
  return (
    <section className="bg-slate-950 py-28">

      <div className="max-w-7xl mx-auto px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >

          <p className="text-cyan-400 uppercase tracking-[0.3em] font-semibold">
            Features
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Powerful AI Security Features
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg leading-8">
            PromptSentinel provides intelligent protection for Large Language
            Models by detecting, analyzing, and preventing advanced prompt-based
            attacks in real time.
          </p>

        </motion.div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-20">

          {features.map((feature, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="rounded-3xl border border-cyan-400/10 bg-slate-900/60 backdrop-blur-xl p-8 transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)]"
            >

              <div className="text-5xl">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                {feature.title}
              </h3>

              <p className="mt-5 text-slate-400 leading-8">
                {feature.description}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;