import {
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
} from "lucide-react";

function TopAttackTypesCard({ history = [] }) {
  const attacks = {};

  history.forEach((scan) => {
    const attack =
      scan.attackType ||
      scan.attack_type ||
      scan.threatType ||
      "Unknown";

    const normalizedAttack =
      String(attack).trim();

    // Do not include safe scans as attacks
    const safeValues = [
      "safe",
      "safe prompt",
      "none",
      "normal",
      "no threat",
      "no attack",
    ];

    if (
      safeValues.includes(
        normalizedAttack.toLowerCase()
      )
    ) {
      return;
    }

    attacks[normalizedAttack] =
      (attacks[normalizedAttack] || 0) + 1;
  });

  const sortedAttacks = Object.entries(attacks)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getIcon = (attack) => {
    const attackName =
      attack.toLowerCase();

    if (
      attackName.includes("jailbreak")
    ) {
      return (
        <ShieldX
          className="text-red-500"
          size={22}
        />
      );
    }

    if (
      attackName.includes("prompt injection") ||
      attackName.includes("injection")
    ) {
      return (
        <ShieldAlert
          className="text-orange-400"
          size={22}
        />
      );
    }

    if (
      attackName.includes("data") ||
      attackName.includes("leak")
    ) {
      return (
        <AlertTriangle
          className="text-yellow-400"
          size={22}
        />
      );
    }

    return (
      <ShieldCheck
        className="text-cyan-400"
        size={22}
      />
    );
  };

  return (
    <div className="bg-slate-900 border border-cyan-500/20 rounded-3xl p-8 shadow-lg">

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-3xl font-bold text-white">
            Top Attack Types
          </h2>

          <p className="text-slate-400 mt-2">
            Most Frequently Detected Threats
          </p>

        </div>

        <ShieldAlert
          size={46}
          className="text-red-400"
        />

      </div>

      <div className="mt-10">

        {sortedAttacks.length === 0 ? (

          <div className="text-center py-10 text-slate-500">

            No attacks detected yet.

          </div>

        ) : (

          sortedAttacks.map(
            ([attack, count], index) => (

              <div
                key={attack}
                className="flex justify-between items-center bg-slate-950 rounded-2xl px-6 py-5 mb-4 border border-slate-800 hover:border-cyan-500/30 transition"
              >

                <div className="flex items-center gap-4">

                  <div className="text-cyan-400 font-bold text-lg">

                    #{index + 1}

                  </div>

                  {getIcon(attack)}

                  <div>

                    <h3 className="font-semibold text-white">

                      {attack}

                    </h3>

                    <p className="text-slate-400 text-sm">

                      AI Security Threat

                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <h2 className="text-3xl font-bold text-cyan-400">

                    {count}

                  </h2>

                  <p className="text-slate-400 text-sm">

                    Detection{count > 1 ? "s" : ""}

                  </p>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
}

export default TopAttackTypesCard;