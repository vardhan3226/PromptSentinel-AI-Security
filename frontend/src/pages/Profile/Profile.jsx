import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import ProfileCard from "../../components/ProfileCard";

import {
  User,
  ShieldCheck,
  Mail,
  BadgeCheck,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    totalScans: 0,
    safePrompts: 0,
    highRiskPrompts: 0,
    threatsBlocked: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD PROFILE AND STATISTICS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [profileResponse, statsResponse] =
          await Promise.all([
            fetch(
              "http://localhost:5000/api/auth/profile",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            fetch(
              "http://localhost:5000/api/dashboard/stats",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        const profileData =
          await profileResponse.json();

        const statsData =
          await statsResponse.json();

        if (profileData.success) {
          setUser(profileData.user);
        }

        if (statsData.success) {
          setStats(statsData.stats);
        }
      } catch (error) {
        console.error(
          "Failed to load profile data:",
          error
        );
      }
    };

    loadProfileData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading Profile...
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      <Sidebar
        active="Profile"
        navigate={navigate}
        handleLogout={handleLogout}
      />

      <div className="flex-1 p-8 overflow-y-auto">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="bg-slate-900 rounded-3xl border border-cyan-500/20 p-8">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-4xl font-bold">
                My Profile
              </h1>

              <p className="text-slate-400 mt-2">
                Manage your PromptSentinel account
              </p>

            </div>

            <User
              size={55}
              className="text-cyan-400"
            />

          </div>

        </div>

        {/* =====================================================
            ACCOUNT INFORMATION
        ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          {/* EMAIL */}

          <div className="bg-slate-900 border border-cyan-500/20 rounded-2xl p-6">

            <Mail
              className="text-cyan-400 mb-4"
              size={32}
            />

            <p className="text-slate-400">
              Email Address
            </p>

            <h3 className="font-bold mt-2 break-all">
              {user.email}
            </h3>

          </div>

          {/* ROLE */}

          <div className="bg-slate-900 border border-green-500/20 rounded-2xl p-6">

            <BadgeCheck
              className="text-green-400 mb-4"
              size={32}
            />

            <p className="text-slate-400">
              Role
            </p>

            <h3 className="font-bold mt-2 text-green-400">
              {user.role}
            </h3>

          </div>

          {/* STATUS */}

          <div className="bg-slate-900 border border-yellow-500/20 rounded-2xl p-6">

            <ShieldCheck
              className="text-yellow-400 mb-4"
              size={32}
            />

            <p className="text-slate-400">
              Account Status
            </p>

            <h3 className="font-bold mt-2 text-green-400">
              Active
            </h3>

          </div>

        </div>

        {/* =====================================================
            PROFILE CARD
        ====================================================== */}

        <div className="mt-8">

          <ProfileCard
            user={user}
            stats={stats}
          />

        </div>

      </div>

    </div>
  );
}

export default Profile;