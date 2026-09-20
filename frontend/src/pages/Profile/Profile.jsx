import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import ProfileCard from "../../components/ProfileCard";

const API_BASE_URL =
  "http://localhost:5000";

const initialUser = {
  fullName: "",
  email: "",
  role: "",
};

const initialStats = {
  totalScans: 0,
  safePrompts: 0,
  highRiskFindings: 0,
  threatsBlocked: 0,
};

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState(initialUser);

  const [stats, setStats] =
    useState(initialStats);

  const [loading, setLoading] =
    useState(true);

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    navigate("/login");
  };

  const loadProfile =
    async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);

        const [
          profileResponse,
          statsResponse,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/api/auth/profile`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),

          fetch(
            `${API_BASE_URL}/api/dashboard/stats`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          ),
        ]);

        if (
          profileResponse.status === 401 ||
          profileResponse.status === 403 ||
          statsResponse.status === 401 ||
          statsResponse.status === 403
        ) {
          localStorage.removeItem(
            "token"
          );

          navigate("/login");
          return;
        }

        const profileData =
          await profileResponse.json();

        const statsData =
          await statsResponse.json();

        if (
          profileData.success &&
          profileData.user
        ) {
          setUser(
            profileData.user
          );
        }

        if (
          statsData.success &&
          statsData.stats
        ) {
          const raw =
            statsData.stats;

          const highRisk =
            Number(
              raw.highRiskFindings ||
                (
                  Number(
                    raw.highRiskPrompts ||
                      0
                  ) +
                  Number(
                    raw.criticalRiskPrompts ||
                      0
                  )
                )
            );

          setStats({
            totalScans:
              Number(
                raw.totalScans ||
                  0
              ),

            safePrompts:
              Number(
                raw.safePrompts ||
                  0
              ),

            highRiskFindings:
              highRisk,

            threatsBlocked:
              Number(
                raw.threatsBlocked ||
                  0
              ),
          });
        }
      } catch (error) {
        console.error(
          "Profile error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#f5f8fc]">

      <Sidebar
        active="Profile"
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <main className="min-h-screen w-full pl-[260px]">

        <div className="w-full px-5 py-5 md:px-7 lg:px-8">

          {/* HEADER */}

          <section className="mb-5 rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <ShieldCheck
                    size={21}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#102a63]">
                    My Profile
                  </h1>

                  <p className="mt-1 text-xs text-slate-500">
                    Account information and security activity.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={
                  loadProfile
                }
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  self-start
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  disabled:opacity-50
                  sm:self-auto
                "
              >
                <RefreshCw
                  size={15}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

            </div>

          </section>

          {/* PROFILE CARD */}

          {loading ? (
            <div className="space-y-5">

              <div className="h-[250px] animate-pulse rounded-[24px] bg-white shadow-sm" />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="h-[150px] animate-pulse rounded-[20px] bg-white" />

                <div className="h-[150px] animate-pulse rounded-[20px] bg-white" />

                <div className="h-[150px] animate-pulse rounded-[20px] bg-white" />

              </div>

            </div>
          ) : (
            <ProfileCard
              user={user}
              stats={stats}
            />
          )}

          {/* FOOTER */}

          <div className="flex items-center justify-center gap-3 py-5">

            <div className="flex overflow-hidden rounded-full">
              <span className="h-1.5 w-5 bg-orange-500" />
              <span className="h-1.5 w-5 bg-slate-200" />
              <span className="h-1.5 w-5 bg-green-600" />
            </div>

            <span className="text-xs font-semibold text-slate-400">
              PromptSentinel · Made in India
            </span>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Profile;