import { motion } from "framer-motion";

const stats = [
  {
    value: "99.7%",
    title: "Detection Accuracy",
  },
  {
    value: "25K+",
    title: "Prompts Analyzed",
  },
  {
    value: "500+",
    title: "Threats Blocked",
  },
  {
    value: "24/7",
    title: "AI Protection",
  },
];

function Statistics() {
  return (
    <section className="bg-slate-950 py-20">

      <div className="max-w-7xl mx-auto px-8">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >

          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-cyan-400/10 bg-slate-900/60 backdrop-blur-md p-8 text-center hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]"
            >

              <h2 className="text-5xl font-black text-cyan-400">
                {item.value}
              </h2>

              <p className="mt-4 text-slate-400 text-lg">
                {item.title}
              </p>

            </div>
          ))}

        </motion.div>

      </div>

    </section>
  );
}

export default Statistics;