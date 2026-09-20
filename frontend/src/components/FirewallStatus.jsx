import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Server,
  Cpu,
  Clock3,
  User,
  Activity,
} from "lucide-react";

function FirewallStatus({ user }) {
  const [currentTime, setCurrentTime] = useState(
    new Date()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }
  );

  const formattedDate = currentTime.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* TOP ACCENT */}

      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-orange-500 via-blue-500 to-green-600" />

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
            <ShieldCheck
              size={22}
              className="text-green-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Firewall Status
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              PromptSentinel system status
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5">

          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

          <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">
            Operational
          </span>

        </div>

      </div>

      {/* CURRENT TIME */}

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
            <Clock3
              size={19}
              className="text-blue-600"
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-500">
              Current Time
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">
              {formattedTime}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {formattedDate}
            </p>
          </div>

        </div>

      </div>

      {/* SYSTEM INFORMATION */}

      <div className="mt-5 space-y-3">

        {/* USER */}

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <User
                size={17}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Logged User
              </p>

              <p className="mt-0.5 max-w-[180px] truncate text-sm font-semibold text-slate-700">
                {user?.fullName ||
                  user?.email ||
                  "Authenticated User"}
              </p>
            </div>

          </div>

          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-bold text-green-700">
            AUTHENTICATED
          </span>

        </div>

        {/* SECURITY MODE */}

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
              <ShieldCheck
                size={17}
                className="text-orange-600"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Security Mode
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                AI Threat Detection
              </p>
            </div>

          </div>

          <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[9px] font-bold text-orange-700">
            ACTIVE
          </span>

        </div>

        {/* BACKEND */}

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
              <Server
                size={17}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Backend Service
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                API Server
              </p>
            </div>

          </div>

          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-bold text-green-700">
            ONLINE
          </span>

        </div>

        {/* DETECTION ENGINE */}

        <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
              <Cpu
                size={17}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Detection Engine
              </p>

              <p className="mt-0.5 text-sm font-semibold text-slate-700">
                Local + AI Analysis
              </p>
            </div>

          </div>

          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[9px] font-bold text-blue-700">
            READY
          </span>

        </div>

      </div>

      {/* STATUS FOOTER */}

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">

        <Activity
          size={15}
          className="text-green-500"
        />

        <p className="text-[11px] text-slate-500">
          Security services are ready for prompt
          analysis.
        </p>

      </div>

    </div>
  );
}

export default FirewallStatus;