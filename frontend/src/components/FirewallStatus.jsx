import { useEffect, useState } from "react";

import {
  ShieldCheck,
  Activity,
  Server,
  Clock,
  User,
  Cpu,
} from "lucide-react";

function FirewallStatus({ user }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleString("en-IN", {
          dateStyle: "full",
          timeStyle: "medium",
        })
      );
    };

    updateTime();

    const timer = setInterval(
      updateTime,
      1000
    );

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-xl">

      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start gap-8">

        {/* PLATFORM INFORMATION */}

        <div>

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={42}
              className="text-cyan-400"
            />

            <div>

              <h1 className="text-4xl font-bold text-white">
                PromptSentinel
              </h1>

              <p className="text-slate-400">
                AI Prompt Security Platform
              </p>

            </div>

          </div>


          {/* SYSTEM INFORMATION */}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* USER */}

            <div className="flex items-center gap-3">

              <User className="text-cyan-400" />

              <div>

                <p className="text-slate-400 text-sm">
                  Logged User
                </p>

                <p className="font-semibold text-white">
                  {user?.fullName || "User"}
                </p>

              </div>

            </div>


            {/* SECURITY */}

            <div className="flex items-center gap-3">

              <Activity className="text-green-400" />

              <div>

                <p className="text-slate-400 text-sm">
                  Security Mode
                </p>

                <p className="text-green-400 font-semibold">
                  Prompt Analysis
                </p>

              </div>

            </div>


            {/* BACKEND */}

            <div className="flex items-center gap-3">

              <Server className="text-cyan-400" />

              <div>

                <p className="text-slate-400 text-sm">
                  Backend Service
                </p>

                <p className="font-semibold text-white">
                  API Connected
                </p>

              </div>

            </div>


            {/* ENGINE */}

            <div className="flex items-center gap-3">

              <Cpu className="text-yellow-400" />

              <div>

                <p className="text-slate-400 text-sm">
                  Detection Engine
                </p>

                <p className="font-semibold text-white">
                  Ready for Scanning
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* CURRENT TIME */}

        <div className="bg-slate-950 rounded-2xl p-6 border border-cyan-500/20 min-w-70">

          <div className="flex items-center gap-2 mb-3">

            <Clock className="text-cyan-400" />

            <span className="text-slate-300 font-semibold">
              Current Time
            </span>

          </div>

          <p className="text-sm text-slate-400 leading-6">

            {currentTime}

          </p>

          <div className="mt-6 flex items-center gap-2">

            <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />

            <span className="text-cyan-400 font-semibold">

              Dashboard Active

            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default FirewallStatus;