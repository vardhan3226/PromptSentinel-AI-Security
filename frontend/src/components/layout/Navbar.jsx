import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const links = [
    { label: "Home", path: "/home" },
    { label: "Features", path: "/features" },
    { label: "How It Works", path: "/how-it-works" },
    { label: "About", path: "/about" },
    { label: "Technology", path: "/technology" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50">

      <div className="mx-auto max-w-7xl px-5 pt-4 sm:px-8">

        <nav className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">

          {/* Logo */}

          <Link
            to="/home"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
              <ShieldCheck
                size={25}
                className="text-blue-600"
              />
            </div>

            <div>

              <p className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Prompt<span className="text-blue-600">Sentinel</span>
              </p>

              <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                AI Security Platform
              </p>

            </div>

          </Link>

          {/* Desktop links */}

          <div className="hidden items-center gap-7 lg:flex">

            {links.map((link) => {
              const active = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

          </div>

          {/* Actions */}

          <div className="hidden items-center gap-3 sm:flex">

            <Link
              to="/login"
              className="rounded-xl border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-blue-400 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/15 transition hover:bg-blue-700"
            >
              Get Started
            </Link>

          </div>

          {/* Mobile */}

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 sm:hidden"
          >
            {mobileOpen ? (
              <X size={21} />
            ) : (
              <Menu size={21} />
            )}
          </button>

        </nav>

        {mobileOpen && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:hidden">

            <div className="flex flex-col gap-1">

              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                >
                  {link.label}
                </Link>
              ))}

              <div className="my-2 h-px bg-slate-100" />

              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-blue-200 px-4 py-3 text-center text-sm font-semibold text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white"
              >
                Get Started
              </Link>

            </div>

          </div>
        )}

      </div>

    </header>
  );
}

export default Navbar;