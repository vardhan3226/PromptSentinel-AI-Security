import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
} from "lucide-react";

function HistoryTable({ history = [] }) {
  const getBadge = (level) => {
    switch (level) {
      case "SAFE":
        return "bg-green-500/20 text-green-400";

      case "LOW":
        return "bg-lime-500/20 text-lime-400";

      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400";

      case "HIGH":
        return "bg-orange-500/20 text-orange-400";

      case "CRITICAL":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-cyan-500/20 text-cyan-400";
    }
  };

  const getIcon = (level) => {
    switch (level) {
      case "SAFE":
      case "LOW":
        return <ShieldCheck size={18} />;

      case "MEDIUM":
        return <AlertTriangle size={18} />;

      case "HIGH":
        return <ShieldAlert size={18} />;

      case "CRITICAL":
        return <ShieldX size={18} />;

      default:
        return <ShieldCheck size={18} />;
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 80) return "text-red-400";
    if (risk >= 50) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-xl">

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            Prompt Scan Records
          </h2>

          <p className="text-slate-400 mt-2">
            Complete security scan history
          </p>

        </div>

        <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full font-semibold">
          {history.length} Records
        </span>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700 text-slate-300">

              <th className="text-left py-4 px-4">Prompt</th>
              <th className="text-left py-4 px-4">Threat</th>
              <th className="text-left py-4 px-4">Attack</th>
              <th className="text-left py-4 px-4">Risk</th>
              <th className="text-left py-4 px-4">Confidence</th>
              <th className="text-left py-4 px-4">Scanned</th>

            </tr>

          </thead>

          <tbody>

            {history.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-16 text-slate-500"
                >
                  No Scan History Found
                </td>

              </tr>

            ) : (

              history.map((scan) => (

                <tr
                  key={scan.id}
                  className="border-b border-slate-800 hover:bg-slate-800/50 transition duration-300"
                >

                  <td className="px-4 py-5">

                    <div className="max-w-sm truncate font-medium">
                      {scan.prompt}
                    </div>

                  </td>

                  <td className="px-4 py-5">

                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getBadge(scan.threatLevel)}`}
                    >
                      {getIcon(scan.threatLevel)}
                      {scan.threatLevel}
                    </span>

                  </td>

                  <td className="px-4 py-5 font-medium">
                    {scan.attackType}
                  </td>

                  <td className={`px-4 py-5 font-bold ${getRiskColor(scan.riskScore)}`}>
                    {scan.riskScore}/100
                  </td>

                  <td className="px-4 py-5">

                    <div className="w-28">

                      <div className="w-full bg-slate-700 rounded-full h-2">

                        <div
                          className="bg-green-400 h-2 rounded-full"
                          style={{
                            width: `${scan.confidence}%`,
                          }}
                        />

                      </div>

                      <p className="text-sm mt-2">
                        {scan.confidence}%
                      </p>

                    </div>

                  </td>

                  <td className="px-4 py-5 text-slate-400">

                    {new Date(scan.createdAt).toLocaleString()}

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default HistoryTable;