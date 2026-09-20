import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  ShieldCheck,
  Network,
  LockKeyhole,
} from "lucide-react";
import { Link } from "react-router-dom";
import HeroAnimation from "../../components/home/HeroAnimation";

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">

      <Navbar />

      <main className="relative overflow-hidden pt-28">

        {/* =========================
            BACKGROUND
        ========================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* Orange wave */}

          <svg
            className="absolute -right-20 top-[-30px] h-[360px] w-[1050px]"
            viewBox="0 0 1050 360"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 190C180 80 300 80 470 170C650 265 760 300 1050 80"
              stroke="#FF9933"
              strokeWidth="52"
              strokeLinecap="round"
              opacity="0.10"
            />

            <path
              d="M160 260C330 170 450 170 610 230C760 285 890 285 1050 180"
              stroke="#FF9933"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.08"
            />
          </svg>

          {/* Green wave */}

          <svg
            className="absolute -right-20 top-[260px] h-[350px] w-[1050px]"
            viewBox="0 0 1050 350"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 250C180 140 310 140 480 220C650 300 820 340 1050 120"
              stroke="#138808"
              strokeWidth="52"
              strokeLinecap="round"
              opacity="0.08"
            />

            <path
              d="M120 320C300 230 430 230 600 290C760 345 900 335 1050 230"
              stroke="#138808"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.07"
            />
          </svg>

          {/* Blue light */}

          <div className="absolute right-[20%] top-[20%] h-[480px] w-[480px] rounded-full bg-blue-100/50 blur-[120px]" />

        </div>

        {/* =========================
            HERO
        ========================= */}

        <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

          <div className="grid min-h-[590px] items-center gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">

            {/* LEFT CONTENT */}

            <div className="max-w-[680px]">

              {/* Made in India */}

              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">

                <div className="flex flex-col gap-[2px] overflow-hidden rounded-sm">
                  <span className="h-1 w-6 bg-orange-500" />
                  <span className="h-1 w-6 bg-white" />
                  <span className="h-1 w-6 bg-green-600" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Made in India
                </span>

              </div>

              {/* Heading */}

              <h1 className="max-w-3xl text-[3.4rem] font-extrabold leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[4.6rem]">

                Safer AI
                <span className="block">
                  for a{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 bg-clip-text text-transparent">
                    brighter tomorrow.
                  </span>
                </span>

              </h1>

              {/* Description */}

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                Analyze AI prompts, detect security risks,
                and protect your AI model before they reach
                the model.
              </p>

              {/* Buttons */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Start Securing Prompts
                  <span className="ml-3 text-lg">
                    →
                  </span>
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 transition hover:bg-blue-50"
                >
                  Learn More
                </Link>

              </div>

            </div>

            {/* RIGHT VISUAL */}

            <HeroAnimation />

          </div>

        </section>

        {/* =========================
            SECURITY HIGHLIGHTS
        ========================= */}

        <section className="relative z-20 mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">

          <div className="grid gap-5 md:grid-cols-3">

            <FeatureCard
              icon={ShieldCheck}
              iconBg="bg-orange-50"
              iconColor="text-orange-500"
              title="Threat Detection"
              description="Find harmful or unsafe prompts before they run."
            />

            <FeatureCard
              icon={Network}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
              title="Smart Analysis"
              description="Use multiple security layers to understand prompt intent."
            />

            <FeatureCard
              icon={LockKeyhole}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              title="Clear Results"
              description="Get a risk level and simple security recommendations."
            />

          </div>

        </section>

      </main>

      <Footer />

    </div>
  );
}

function FeatureCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
}) {
  return (
    <div className="group flex min-h-[150px] items-center gap-6 rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-[0_8px_30px_rgba(15,23,42,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(15,23,42,0.08)]">

      <div
        className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <Icon
          size={34}
          strokeWidth={1.8}
          className={iconColor}
        />
      </div>

      <div>

        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
}

export default Home;