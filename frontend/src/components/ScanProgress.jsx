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
    icon: <Cpu className="text-cyan-400" size={24} />,
    title: "Initializing AI Engine...",
  },
  {
    icon: <Search className="text-blue-400" size={24} />,
    title: "Checking Prompt Injection...",
  },
  {
    icon: <ShieldAlert className="text-yellow-400" size={24} />,
    title: "Analyzing Threat Level...",
  },
  {
    icon: <ShieldCheck className="text-green-400" size={24} />,
    title: "Calculating Risk Score...",
  },
  {
    icon: <CheckCircle className="text-green-500" size={24} />,
    title: "Scan Completed Successfully",
  },
];

function ScanProgress() {
  const [step, setStep] = useState(0);

  /*
  |--------------------------------------------------------------------------
  | PROGRESS ANIMATION
  |--------------------------------------------------------------------------
  */

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

  return (
    <div className="mt-8 bg-slate-900 border border-cyan-500/20 rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-6 text-white">
        AI Security Engine
      </h2>

      <div className="space-y-5">

        {steps.map((item, index) => (

          <div
            key={item.title}
            className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
              index <= step
                ? "bg-slate-800 border border-cyan-500/30"
                : "opacity-40"
            }`}
          >

            {item.icon}

            <div className="flex-1">

              <p className="font-semibold">
                {item.title}
              </p>

              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">

                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index <= step
                      ? "bg-cyan-400 w-full"
                      : "w-0"
                  }`}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default ScanProgress;