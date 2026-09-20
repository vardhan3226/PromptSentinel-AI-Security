import {
  LayoutDashboard,
  ScanSearch,
  History,
  BarChart3,
  User,
  LogOut,
  ShieldCheck,
} from "lucide-react";

function Sidebar({
  active = "Dashboard",
  navigate,
  handleLogout,
}) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Prompt Scanner",
      path: "/scanner",
      icon: ScanSearch,
    },
    {
      name: "Scan History",
      path: "/history",
      icon: History,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ];

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        z-50
        flex
        h-dvh
        w-65
        flex-col
        overflow-hidden
        border-r
        border-white/10
        bg-[#0b1f3a]
        text-white
      "
    >
      {/* =====================================================
          BRAND
      ===================================================== */}

      <div
        className="
          flex
          h-20.5
          min-h-20.5
          shrink-0
          items-center
          border-b
          border-white/10
          px-5
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white/10
            "
          >
            <ShieldCheck
              size={22}
              className="text-cyan-300"
              strokeWidth={2}
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-extrabold tracking-tight">
              Prompt
              <span className="text-cyan-300">
                Sentinel
              </span>
            </h1>

            <p
              className="
                mt-0.5
                truncate
                text-[8px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-slate-400
              "
            >
              AI Security Platform
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-3
          py-5
          scrollbar-thin
        "
      >
        <p
          className="
            mb-3
            px-3
            text-[9px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-slate-500
          "
        >
          Workspace
        </p>

        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => navigate(item.path)}
                className={`
                  group
                  relative
                  flex
                  h-14
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  text-left
                  transition-all
                  duration-200
                  ${
                    isActive
                      ? "bg-linear-to-r from-cyan-300 to-cyan-400 text-[#08203d] shadow-lg shadow-cyan-400/20"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }
                `}
              >
                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-7
                      w-1
                      -translate-y-1/2
                      rounded-r-full
                      bg-white
                    "
                  />
                )}

                <span
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    ${
                      isActive
                        ? "bg-white/30"
                        : "bg-white/6 group-hover:bg-white/10"
                    }
                  `}
                >
                  <Icon
                    size={18}
                    strokeWidth={
                      isActive ? 2.4 : 1.9
                    }
                  />
                </span>

                <span className="truncate text-[13px] font-semibold">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* =====================================================
          BOTTOM AREA
      ===================================================== */}

      <div
        className="
          shrink-0
          border-t
          border-white/10
          bg-[#0b1f3a]
          p-3
        "
      >
        {/* MADE IN INDIA */}

        <div
          className="
            mb-3
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-3
            py-3
          "
        >
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-full">
              <span className="h-1 w-4 bg-orange-400" />
              <span className="h-1 w-4 bg-white" />
              <span className="h-1 w-4 bg-green-500" />
            </div>

            <span className="text-[9px] font-semibold text-slate-400">
              Made in India
            </span>
          </div>

          <p className="mt-2 text-[9px] leading-4 text-slate-500">
            AI security built for a safer future.
          </p>
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            group
            flex
            h-13
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            text-left
            text-slate-400
            transition-all
            duration-200
            hover:bg-red-500/10
            hover:text-red-300
          "
        >
          <span
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-white/6
              group-hover:bg-red-500/10
            "
          >
            <LogOut size={18} />
          </span>

          <span className="text-[13px] font-semibold">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;