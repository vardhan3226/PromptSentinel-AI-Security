import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">

        <nav className="relative flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-2xl backdrop-blur-2xl sm:px-6">

          {/* Logo */}

          <Link
            to="/home"
            onClick={closeMenu}
            className="flex items-center gap-3 group"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10"
            >
              <ShieldCheck
                size={25}
                className="text-cyan-400"
              />
            </motion.div>

            <div className="leading-none">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Prompt<span className="text-cyan-400">Sentinel</span>
              </h1>

              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                AI Security Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#home"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              Home
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              How It Works
            </a>

            <a
              href="#technology"
              className="text-sm font-medium text-slate-300 transition hover:text-cyan-400"
            >
              Technology
            </a>

          </div>

          {/* Desktop Actions */}

          <div className="hidden items-center gap-3 md:flex">

            <Link
              to="/login"
              className="rounded-xl border border-cyan-400/30 px-4 py-2.5 text-sm font-semibold text-cyan-400 transition hover:border-cyan-400 hover:bg-cyan-400/10"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 hover:shadow-cyan-400/30"
            >
              Get Started
            </Link>

          </div>

          {/* Mobile Button */}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-400 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Mobile Navigation */}

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 right-0 top-[calc(100%+10px)] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-2xl md:hidden"
              >

                <div className="flex flex-col gap-2">

                  <a
                    href="#home"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-400"
                  >
                    Home
                  </a>

                  <a
                    href="#features"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-400"
                  >
                    Features
                  </a>

                  <a
                    href="#workflow"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-400"
                  >
                    How It Works
                  </a>

                  <a
                    href="#technology"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-cyan-400/10 hover:text-cyan-400"
                  >
                    Technology
                  </a>

                  <div className="my-2 h-px bg-white/10" />

                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-cyan-400/20 px-4 py-3 text-center text-sm font-semibold text-cyan-400 transition hover:bg-cyan-400/10"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                  >
                    Get Started
                  </Link>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </nav>
      </div>
    </motion.header>
  );
}

export default Navbar;