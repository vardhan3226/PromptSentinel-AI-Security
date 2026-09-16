import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function RecentActivity({ history = [] }) {
  const navigate = useNavigate();

  const getBadge = (level) => {
    switch (level) {
      case "SAFE":
        return {
          color: "bg-green-500/20 text-green-400",
          icon: <ShieldCheck size={18} />,
        };

      case "LOW":
        return {
          color: "bg-lime-500/20 text-lime-400",
          icon: <ShieldCheck size={18} />,
        };

      case "MEDIUM":
        return {
          color: "bg-yellow-500/20 text-yellow-400",
          icon: <AlertTriangle size={18} />,
        };

      case "HIGH":
        return {
          color: "bg-orange-500/20 text-orange-400",
          icon: <ShieldAlert size={18} />,
        };

      case "CRITICAL":
        return {
          color: "bg-red-500/20 text-red-400",
          icon: <ShieldX size={18} />,
        };

      default:
        return {
          color: "bg-slate-500/20 text-slate-400",
          icon: <AlertTriangle size={18} />,
        };
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Time unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Time unavailable";
    }

    return parsedDate.toLocaleString("en-IN");
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-cyan-500/20 p-8">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            Recent Security Events
          </h2>

          <p className="text-slate-400 mt-2">
            Latest prompt scan activities
          </p>

        </div>

        <button
          onClick={() => navigate("/history")}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl transition"
        >
          View Full History
        </button>

      </div>

      {history.length === 0 ? (

        <div className="text-center py-10 text-slate-400">
          No recent activity.
        </div>

      ) : (

        history.slice(0, 5).map((scan, index) => {
          const badge = getBadge(scan.threatLevel);

          return (
            <div
              key={scan.id || `${scan.createdAt}-${index}`}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-slate-950 rounded-2xl border border-slate-800 p-5 mb-4 hover:border-cyan-500/50 transition"
            >

              <div className="flex items-center gap-4 min-w-0">

                <div className={`p-3 rounded-xl ${badge.color}`}>
                  {badge.icon}
                </div>

                <div className="min-w-0">

                  <h3 className="font-semibold truncate max-w-xl">
                    {scan.prompt || "Prompt unavailable"}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    {scan.attackType || "Unknown"}
                  </p>

                </div>

              </div>

              <div className="text-left sm:text-right flex-shrink-0">

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${badge.color}`}
                >
                  {scan.threatLevel || "UNKNOWN"}
                </span>

                <p className="text-xs text-slate-500 mt-2">
                  {formatDate(scan.createdAt)}
                </p>

              </div>

            </div>
          );
        })

      )}

    </div>
  );
}

export default RecentActivity;