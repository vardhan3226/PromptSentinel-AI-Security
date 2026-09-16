import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Enter Prompt",
    description:
      "Users submit a prompt that needs to be analyzed for potential security threats.",
    icon: "📝",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "PromptSentinel analyzes the prompt using AI-powered detection algorithms.",
    icon: "🤖",
  },
  {
    number: "03",
    title: "Threat Detection",
    description:
      "The system identifies prompt injection, jailbreaks, prompt leakage, and other risks.",
    icon: "🛡️",
  },
  {
    number: "04",
    title: "Security Report",
    description:
      "A detailed report with risk score, confidence level, and recommendations is generated.",
    icon: "📊",
  },
];

function HowItWorks() {
  return (
    <section className="bg-slate-950 py-28">

      <div className="max-w-7xl mx-auto px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold">
            Workflow
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            How PromptSentinel Works
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg leading-8">
            PromptSentinel follows an intelligent AI workflow to analyze,
            detect, and protect Large Language Models from prompt-based attacks.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mt-20">

          {steps.map((step, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="relative rounded-3xl border border-cyan-400/10 bg-slate-900/60 backdrop-blur-xl p-8 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)] transition-all"
            >

              <span className="absolute top-5 right-6 text-6xl font-black text-cyan-400/10">
                {step.number}
              </span>

              <div className="text-5xl">
                {step.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                {step.title}
              </h3>

              <p className="mt-5 leading-8 text-slate-400">
                {step.description}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;