import HeroContent from "./HeroContent";
import HeroAnimation from "./HeroAnimation";

function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F8FAFC] pt-32">

      {/* Indian-inspired subtle background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-orange-100/40 blur-[130px]" />

        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-[150px]" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-green-100/40 blur-[130px]" />

      </div>

      {/* Very subtle grid */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(15,23,42,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Hero content */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

        <div className="grid min-h-[calc(100vh-8rem)] items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:py-16">

          <HeroContent />

          <HeroAnimation />

        </div>

      </div>

    </section>
  );
}

export default Hero;