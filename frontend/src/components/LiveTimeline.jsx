import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
} from "lucide-react";

function LiveTimeline({ history = [] }) {

  const getLevel = (scan) => {
    return String(
      scan.threatLevel ||
      scan.threat_level ||
      scan.riskLevel ||
      "UNKNOWN"
    ).toUpperCase();
  };

  const getColor = (level) => {
    switch (level) {
      case "SAFE":
        return "text-green-400";

      case "LOW":
        return "text-lime-400";

      case "MEDIUM":
        return "text-yellow-400";

      case "HIGH":
        return "text-orange-400";

      case "CRITICAL":
        return "text-red-500";

      default:
        return "text-cyan-400";
    }
  };

  const getIcon = (level) => {
    switch (level) {
      case "SAFE":
      case "LOW":
        return <ShieldCheck size={20} />;

      case "MEDIUM":
        return <AlertTriangle size={20} />;

      case "HIGH":
        return <ShieldAlert size={20} />;

      case "CRITICAL":
        return <ShieldX size={20} />;

      default:
        return <ShieldCheck size={20} />;
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown time";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown time";
    }

    return parsedDate.toLocaleString();
  };

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-lg">

      <div>

        <h2 className="text-3xl font-bold text-white">
          Security Timeline
        </h2>

        <p className="text-slate-400 mt-2">
          Latest Prompt Security Events
        </p>

      </div>

      <div className="mt-8">

        {history.length === 0 ? (

          <div className="text-center py-12 text-slate-500">

            No recent activity found.

          </div>

        ) : (

          history
            .slice(0, 8)
            .map((scan, index) => {

              const level = getLevel(scan);

              const attackType =
                scan.attackType ||
                scan.attack_type ||
                scan.threatType ||
                "Unknown Event";

              const prompt =
                scan.prompt ||
                scan.input ||
                "Prompt details unavailable.";

              const riskScore =
                scan.riskScore ??
                scan.risk_score ??
                0;

              const createdAt =
                scan.createdAt ||
                scan.created_at ||
                scan.timestamp;

              return (

                <div
                  key={
                    scan.id ||
                    scan._id ||
                    `${attackType}-${index}`
                  }
                  className="flex gap-5 mb-6"
                >

                  <div
                    className={`mt-1 ${getColor(level)}`}
                  >
                    {getIcon(level)}
                  </div>

                  <div className="flex-1 bg-slate-950 rounded-2xl p-5 border border-slate-800">

                    <div className="flex justify-between items-center gap-4">

                      <h3 className="font-semibold text-white">

                        {attackType}

                      </h3>

                      <span
                        className={`font-bold ${getColor(level)}`}
                      >

                        {level}

                      </span>

                    </div>

                    <p className="text-slate-400 mt-2 truncate">

                      {prompt}

                    </p>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4 text-sm text-slate-500">

                      <span>

                        Risk Score: {riskScore}/100

                      </span>

                      <span>

                        {formatDate(createdAt)}

                      </span>

                    </div>

                  </div>

                </div>

              );
            })

        )}

      </div>

    </div>
  );
}

export default LiveTimeline;