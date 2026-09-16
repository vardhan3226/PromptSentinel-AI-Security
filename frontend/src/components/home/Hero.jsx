import HeroContent from "./HeroContent";
import HeroAnimation from "./HeroAnimation";

function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-slate-950 pt-28"
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      {/* Background Glow */}
      <div className="absolute -top-48 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute left-[-250px] top-1/2 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        <div className="grid min-h-[calc(100vh-7rem)] items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-16">

          <HeroContent />

          <HeroAnimation />

        </div>

      </div>

      {/* Bottom Fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

    </section>
  );
}

export default Hero;