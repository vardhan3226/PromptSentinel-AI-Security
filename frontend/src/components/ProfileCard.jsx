function ProfileCard({ user, stats }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-cyan-500/20 p-8">

      <div className="flex items-center gap-5">

        <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center text-4xl font-bold text-slate-950">
          {user.fullName?.charAt(0).toUpperCase()}
        </div>

        <div>

          <h2 className="text-3xl font-bold text-white">
            {user.fullName}
          </h2>

          <p className="text-slate-400 mt-2">
            {user.email}
          </p>

          <span className="inline-block mt-3 bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-sm">
            {user.role}
          </span>

        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-10">

        <div className="bg-slate-950 rounded-xl p-5">

          <p className="text-slate-400">
            Total Scans
          </p>

          <h3 className="text-3xl font-bold text-cyan-400 mt-2">
            {stats.totalScans}
          </h3>

        </div>

        <div className="bg-slate-950 rounded-xl p-5">

          <p className="text-slate-400">
            Safe Prompts
          </p>

          <h3 className="text-3xl font-bold text-green-400 mt-2">
            {stats.safePrompts}
          </h3>

        </div>

        <div className="bg-slate-950 rounded-xl p-5">

          <p className="text-slate-400">
            High Risk
          </p>

          <h3 className="text-3xl font-bold text-red-400 mt-2">
            {stats.highRiskPrompts}
          </h3>

        </div>

        <div className="bg-slate-950 rounded-xl p-5">

          <p className="text-slate-400">
            Threats Blocked
          </p>

          <h3 className="text-3xl font-bold text-yellow-400 mt-2">
            {stats.threatsBlocked}
          </h3>

        </div>

      </div>

      <div className="mt-8">

        <p className="text-slate-400">
          Joined On
        </p>

        <h3 className="text-white mt-2">
          {new Date(user.createdAt).toLocaleDateString()}
        </h3>

      </div>

    </div>
  );
}

export default ProfileCard;