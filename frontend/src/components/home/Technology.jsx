import { motion } from "framer-motion";

const technologies = [
  {
    icon: "⚛️",
    title: "React",
    description: "Modern frontend framework for a fast and responsive UI.",
  },
  {
    icon: "🎨",
    title: "Tailwind CSS",
    description: "Utility-first CSS framework for premium modern design.",
  },
  {
    icon: "🚀",
    title: "Node.js",
    description: "Backend runtime for secure API development.",
  },
  {
    icon: "🛠️",
    title: "Express.js",
    description: "Fast and lightweight REST API framework.",
  },
  {
    icon: "🍃",
    title: "MongoDB",
    description: "NoSQL database for storing prompts and reports.",
  },
  {
    icon: "🤖",
    title: "AI Detection Engine",
    description: "Analyzes prompts and identifies AI security threats.",
  },
];

function Technology() {
  return (
    <section className="bg-slate-950 py-28">

      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center">

          <p className="uppercase tracking-[0.3em] text-cyan-400 font-semibold">
            Technology Stack
          </p>

          <h2 className="mt-4 text-5xl font-black text-white">
            Built with Modern Technologies
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-slate-400 text-lg leading-8">
            PromptSentinel combines modern web technologies and AI concepts
            to provide intelligent protection for Large Language Models.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {technologies.map((tech, index) => (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
              }}
              className="rounded-3xl border border-cyan-400/10 bg-slate-900/60 backdrop-blur-xl p-8 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(34,211,238,0.25)] transition-all"
            >

              <div className="text-5xl">
                {tech.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                {tech.title}
              </h3>

              <p className="mt-5 text-slate-400 leading-8">
                {tech.description}
              </p>

            </motion.div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Technology;