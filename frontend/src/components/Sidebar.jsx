import {
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  User,
  LogOut,
  ShieldCheck,
  Activity,
  ChevronRight,
} from "lucide-react";

function Sidebar({
  active = "Dashboard",
  navigate,
  handleLogout,
}) {
  const commandItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      name: "Prompt Scanner",
      path: "/scanner",
      icon: <ScanSearch size={19} />,
    },
    {
      name: "Scan History",
      path: "/history",
      icon: <History size={19} />,
    },
  ];

  const intelligenceItems = [
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart3 size={19} />,
    },
  ];

  const userItems = [
    {
      name: "Profile",
      path: "/profile",
      icon: <User size={19} />,
    },
  ];

  const renderMenuItem = (item) => {
    const isActive = active === item.name;

    return (
      <button
        key={item.name}
        onClick={() => navigate(item.path)}
        className={`
          group
          relative
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3.5
          mb-2
          rounded-2xl
          text-left
          transition-all
          duration-300
          ${
            isActive
              ? `
                bg-gradient-to-r
                from-cyan-400
                to-blue-500
                text-slate-950
                font-bold
                shadow-lg
                shadow-cyan-500/20
              `
              : `
                text-slate-400
                hover:text-slate-100
                hover:bg-slate-800/60
              `
          }
        `}
      >
        <span
          className={`
            relative
            z-10
            flex
            items-center
            justify-center
            w-9
            h-9
            rounded-xl
            transition-all
            duration-300
            ${
              isActive
                ? `
                  bg-slate-950/10
                `
                : `
                  bg-slate-800/60
                  group-hover:bg-slate-700/80
                  group-hover:scale-105
                `
            }
          `}
        >
          {item.icon}
        </span>

        <span className="relative z-10 flex-1 text-sm">
          {item.name}
        </span>

        {isActive && (
          <ChevronRight
            size={17}
            strokeWidth={2.5}
            className="relative z-10"
          />
        )}
      </button>
    );
  };

  return (
    <aside
      className="
        relative
        w-72
        min-h-screen
        flex
        flex-col
        overflow-hidden
        border-r
        border-slate-700/40
        bg-slate-950/85
        backdrop-blur-2xl
      "
    >
      {/* Background glow */}

      <div
        className="
          pointer-events-none
          absolute
          top-0
          left-0
          right-0
          h-80
          bg-gradient-to-b
          from-cyan-500/10
          via-blue-500/5
          to-transparent
        "
      />

      {/* Brand */}

      <div
        className="
          relative
          z-10
          px-7
          py-7
          border-b
          border-slate-800/80
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              relative
              flex
              items-center
              justify-center
              w-12
              h-12
              rounded-2xl
              bg-gradient-to-br
              from-cyan-400
              via-blue-500
              to-indigo-600
              shadow-lg
              shadow-cyan-500/20
            "
          >
            <ShieldCheck
              size={27}
              className="text-white"
              strokeWidth={2.3}
            />

            <div
              className="
                absolute
                inset-1
                rounded-xl
                border
                border-white/20
              "
            />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">
              Prompt
              <span className="text-cyan-400">
                Sentinel
              </span>
            </h1>

            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-emerald-400
                  animate-pulse
                "
              />

              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                AI Security OS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <nav
        className="
          relative
          z-10
          flex-1
          px-5
          py-6
          overflow-y-auto
        "
      >
        {/* Command Center */}

        <div className="mb-7">
          <p
            className="
              px-3
              mb-3
              text-[10px]
              font-semibold
              tracking-[0.2em]
              text-slate-600
            "
          >
            COMMAND CENTER
          </p>

          {commandItems.map(renderMenuItem)}
        </div>

        {/* Intelligence */}

        <div className="mb-7">
          <p
            className="
              px-3
              mb-3
              text-[10px]
              font-semibold
              tracking-[0.2em]
              text-slate-600
            "
          >
            INTELLIGENCE
          </p>

          {intelligenceItems.map(renderMenuItem)}
        </div>

        {/* User */}

        <div>
          <p
            className="
              px-3
              mb-3
              text-[10px]
              font-semibold
              tracking-[0.2em]
              text-slate-600
            "
          >
            USER
          </p>

          {userItems.map(renderMenuItem)}
        </div>
      </nav>

      {/* Bottom section */}

      <div
        className="
          relative
          z-10
          p-5
          border-t
          border-slate-800/80
        "
      >
        {/* System status */}

        <div
          className="
            mb-4
            p-4
            rounded-2xl
            border
            border-cyan-500/10
            bg-gradient-to-br
            from-cyan-500/10
            to-blue-500/5
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                items-center
                justify-center
                w-9
                h-9
                rounded-xl
                bg-cyan-500/10
                border
                border-cyan-400/10
              "
            >
              <Activity
                size={17}
                className="text-cyan-400"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200">
                  System Protected
                </span>

                <span className="relative flex h-2 w-2">
                  <span
                    className="
                      absolute
                      inline-flex
                      h-full
                      w-full
                      rounded-full
                      bg-emerald-400
                      opacity-75
                      animate-ping
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      h-2
                      w-2
                      rounded-full
                      bg-emerald-400
                    "
                  />
                </span>
              </div>

              <p className="mt-1 text-[10px] text-slate-500">
                Detection engine online
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="
            group
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3.5
            rounded-2xl
            text-slate-400
            transition-all
            duration-300
            hover:bg-red-500/10
            hover:text-red-400
          "
        >
          <span
            className="
              flex
              items-center
              justify-center
              w-9
              h-9
              rounded-xl
              bg-slate-800/70
              transition-all
              duration-300
              group-hover:bg-red-500/15
            "
          >
            <LogOut size={18} />
          </span>

          <span className="text-sm font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;