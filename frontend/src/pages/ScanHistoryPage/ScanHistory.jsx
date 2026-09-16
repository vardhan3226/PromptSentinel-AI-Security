import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import HistoryTable from "../../components/HistoryTable";

import { generateHistoryReport } from "../../utils/pdf/generateHistoryReport";
import { generateHistoryCSV } from "../../utils/pdf/generateHistoryCSV";

import {
  FileDown,
  FileSpreadsheet,
} from "lucide-react";

function ScanHistoryPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD PROFILE AND HISTORY
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | FETCH PROFILE
        |--------------------------------------------------------------------------
        */

        const profileResponse = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          profileResponse.status === 401 ||
          profileResponse.status === 403
        ) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const profileData =
          await profileResponse.json();

        if (profileData.success) {
          setUser(profileData.user);
        }

        /*
        |--------------------------------------------------------------------------
        | FETCH HISTORY
        |--------------------------------------------------------------------------
        */

        const historyResponse = await fetch(
          "http://localhost:5000/api/scan/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          historyResponse.status === 401 ||
          historyResponse.status === 403
        ) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const historyData =
          await historyResponse.json();

        if (historyData.success) {
          setHistory(
            Array.isArray(historyData.history)
              ? historyData.history
              : []
          );
        }

      } catch (error) {
        console.error(
          "Failed to load scan history data:",
          error
        );
      }
    };

    loadData();
  }, [navigate]);

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
  | EXPORT PDF
  |--------------------------------------------------------------------------
  */

  const handleExportPDF = () => {
    generateHistoryReport(user, history);
  };

  /*
  |--------------------------------------------------------------------------
  | EXPORT CSV
  |--------------------------------------------------------------------------
  */

  const handleExportCSV = () => {
    generateHistoryCSV(history);
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* SIDEBAR */}

      <Sidebar
        active="Scan History"
        navigate={navigate}
        handleLogout={handleLogout}
      />

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8 overflow-y-auto">

        {/* PAGE HEADER */}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">

          <div>

            <h1 className="text-4xl font-bold">
              Scan History
            </h1>

            <p className="text-slate-400 mt-2">
              View and export your prompt scan history.
            </p>

          </div>

          {/* EXPORT BUTTONS */}

          <div className="flex flex-wrap gap-4">

            <button
              type="button"
              onClick={handleExportPDF}
              disabled={history.length === 0}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-bold transition"
            >
              <FileDown size={20} />

              Export PDF

            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={history.length === 0}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed px-5 py-3 rounded-xl font-bold transition"
            >
              <FileSpreadsheet size={20} />

              Export CSV

            </button>

          </div>

        </div>

        {/* HISTORY TABLE */}

        <HistoryTable
          history={history}
        />

      </div>

    </div>
  );
}

export default ScanHistoryPage;