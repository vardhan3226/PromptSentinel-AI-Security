import Sidebar from "./Sidebar";

function AuthenticatedLayout({
  children,
  active = "Dashboard",
  navigate,
  handleLogout,
}) {
  return (
    <div className="flex min-h-screen w-full bg-[#f6f9fc] text-slate-900">
      {/* =========================================================
          SIDEBAR
      ========================================================== */}

      <div className="relative z-30 shrink-0">
        <Sidebar
          active={active}
          navigate={navigate}
          handleLogout={handleLogout}
        />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================== */}

      <main className="min-w-0 flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

export default AuthenticatedLayout;