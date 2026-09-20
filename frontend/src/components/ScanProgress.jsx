import { useEffect, useState } from "react";
import {
  Cpu,
  ShieldCheck,
  Search,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| SCAN STEPS
|--------------------------------------------------------------------------
*/

const steps = [
  {
    icon: Cpu,
    title: "Initializing AI Engine",
    description: "Preparing the security analysis engine.",
  },
  {
    icon: Search,
    title: "Checking Prompt Injection",
    description: "Analyzing the prompt for injection patterns.",
  },
  {
    icon: ShieldAlert,
    title: "Analyzing Threat Level",
    description: "Evaluating detected security indicators.",
  },
  {
    icon: ShieldCheck,
    title: "Calculating Risk Score",
    description: "Combining security signals into a risk score.",
  },
  {
    icon: CheckCircle,
    title: "Scan Completed",
    description: "Security analysis completed successfully.",
  },
];

/*
|--------------------------------------------------------------------------
| SCAN PROGRESS
|--------------------------------------------------------------------------
*/

function ScanProgress() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }

        return prev;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const progress =
    ((step + 1) / steps.length) * 100;

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      {/* Header */}

      <div className="border-b border-slate-100 px-6 py-5 sm:px-8">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <ShieldCheck
                size={22}
                className="text-blue-600"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                AI Security Engine
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Analyzing your prompt securely
              </p>
            </div>

          </div>

          <div className="hidden items-center gap-2 sm:flex">

            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

            <span className="text-xs font-semibold text-slate-500">
              Analysis in progress
            </span>

          </div>

        </div>

        {/* Progress */}

        <div className="mt-5">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              Security analysis
            </span>

            <span className="text-xs font-bold text-blue-600">
              {Math.round(progress)}%
            </span>

          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>

      {/* Steps */}

      <div className="space-y-3 p-5 sm:p-7">

        {steps.map((item, index) => {
          const Icon = item.icon;

          const completed = index < step;
          const active = index === step;
          const pending = index > step;

          return (
            <div
              key={item.title}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-500 ${
                active
                  ? "border-blue-200 bg-blue-50/70"
                  : completed
                  ? "border-slate-100 bg-slate-50"
                  : "border-slate-100 bg-white opacity-50"
              }`}
            >

              {/* Icon */}

              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : completed
                    ? "bg-green-50 text-green-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >

                <Icon
                  size={20}
                  strokeWidth={1.8}
                  className={
                    active
                      ? "animate-pulse"
                      : ""
                  }
                />

              </div>

              {/* Content */}

              <div className="min-w-0 flex-1">

                <div className="flex items-center justify-between gap-3">

                  <p
                    className={`text-sm font-semibold ${
                      active || completed
                        ? "text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    {item.title}
                  </p>

                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase tracking-wider ${
                      active
                        ? "text-blue-600"
                        : completed
                        ? "text-green-600"
                        : "text-slate-400"
                    }`}
                  >
                    {active
                      ? "Running"
                      : completed
                      ? "Done"
                      : "Waiting"}
                  </span>

                </div>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {item.description}
                </p>

                {/* Step progress */}

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      active
                        ? "bg-blue-500"
                        : completed
                        ? "bg-green-500"
                        : "bg-transparent"
                    }`}
                    style={{
                      width:
                        completed || active
                          ? "100%"
                          : "0%",
                    }}
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Footer status */}

      <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:px-8">

        <CheckCircle
          size={15}
          className={
            step === steps.length - 1
              ? "text-green-600"
              : "text-blue-600"
          }
        />

        <p className="text-xs font-medium text-slate-500">
          {step === steps.length - 1
            ? "PromptSentinel security analysis completed."
            : "PromptSentinel is securely analyzing the prompt."}
        </p>

      </div>

    </div>
  );
}

export default ScanProgress;