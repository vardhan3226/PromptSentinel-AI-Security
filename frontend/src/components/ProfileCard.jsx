import {
  User,
  ScanSearch,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

function ProfileCard({ user, stats }) {
  const totalScans = stats?.totalScans || 0;
  const safePrompts = stats?.safePrompts || 0;
  const highRiskPrompts = stats?.highRiskPrompts || 0;
  const threatsBlocked = stats?.threatsBlocked || 0;

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "—";

  const initials =
    user?.fullName
      ?.split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

      {/* TOP ACCENT */}

      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-orange-500 via-blue-500 to-green-600" />

      {/* PROFILE HEADER */}

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-5">

          {/* AVATAR */}

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-2xl font-black text-blue-600 shadow-sm">
            {initials}
          </div>

          {/* USER INFO */}

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-2">

              <h2 className="truncate text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                {user?.fullName || "User"}
              </h2>

              <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-green-700">
                <ShieldCheck size={12} />
                Active
              </span>

            </div>

            <p className="mt-2 break-all text-sm text-slate-500">
              {user?.email}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">

              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                {user?.role || "USER"}
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <CalendarDays size={13} />
                Joined {joinedDate}
              </span>

            </div>

          </div>

        </div>

        {/* PROFILE ICON */}

        <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-slate-50 sm:flex">
          <User
            size={22}
            className="text-slate-400"
          />
        </div>

      </div>

      {/* DIVIDER */}

      <div className="my-7 h-px bg-slate-100" />

      {/* SECURITY ACTIVITY */}

      <div>

        <div className="mb-5">

          <h3 className="text-lg font-bold text-slate-900">
            Security Activity
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Overview of your PromptSentinel usage
          </p>

        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL SCANS */}

          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <ScanSearch
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-500">
                SCANS
              </span>

            </div>

            <p className="mt-5 text-xs font-medium text-slate-500">
              Total Scans
            </p>

            <p className="mt-1 text-3xl font-black text-blue-600">
              {totalScans}
            </p>

          </div>

          {/* SAFE PROMPTS */}

          <div className="rounded-2xl border border-green-100 bg-green-50/60 p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <ShieldCheck
                  size={19}
                  className="text-green-600"
                />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-green-600">
                SAFE
              </span>

            </div>

            <p className="mt-5 text-xs font-medium text-slate-500">
              Safe Prompts
            </p>

            <p className="mt-1 text-3xl font-black text-green-600">
              {safePrompts}
            </p>

          </div>

          {/* HIGH RISK */}

          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <ShieldAlert
                  size={19}
                  className="text-red-600"
                />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-red-600">
                RISK
              </span>

            </div>

            <p className="mt-5 text-xs font-medium text-slate-500">
              High Risk
            </p>

            <p className="mt-1 text-3xl font-black text-red-600">
              {highRiskPrompts}
            </p>

          </div>

          {/* THREATS BLOCKED */}

          <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-5">

            <div className="flex items-center justify-between">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                <AlertTriangle
                  size={19}
                  className="text-orange-500"
                />
              </div>

              <span className="text-[9px] font-bold uppercase tracking-wider text-orange-600">
                BLOCKED
              </span>

            </div>

            <p className="mt-5 text-xs font-medium text-slate-500">
              Threats Blocked
            </p>

            <p className="mt-1 text-3xl font-black text-orange-500">
              {threatsBlocked}
            </p>

          </div>

        </div>

      </div>

      {/* ACCOUNT DETAILS */}

      <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Account Information
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-700">
              PromptSentinel security account
            </p>

          </div>

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="h-2 w-2 rounded-full bg-slate-300" />
            <span className="h-2 w-2 rounded-full bg-green-600" />

            <span className="ml-1 text-xs font-semibold text-slate-500">
              Made in India
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProfileCard;