import { ShieldCheck } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">

      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">

        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

          {/* Brand */}

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
              <ShieldCheck
                size={21}
                className="text-blue-600"
              />
            </div>

            <div>

              <p className="text-sm font-bold text-slate-900">
                Prompt<span className="text-blue-600">Sentinel</span>
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                AI Security Platform
              </p>

            </div>

          </div>

          {/* Made in India */}

          <div className="flex items-center gap-3">

            <div className="flex overflow-hidden rounded-full">
              <span className="h-1.5 w-5 bg-orange-500" />
              <span className="h-1.5 w-5 bg-slate-200" />
              <span className="h-1.5 w-5 bg-green-600" />
            </div>

            <span className="text-xs font-semibold text-slate-500">
              Made in India
            </span>

          </div>

          {/* Copyright */}

          <p className="text-xs text-slate-400">
            © 2026 PromptSentinel
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;