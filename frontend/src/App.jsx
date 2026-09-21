import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// =========================
// Public Pages
// =========================

import Splash from "./pages/Splash/Splash";
import Home from "./pages/Home/Home";
import Features from "./pages/Features/Features";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import About from "./pages/About/About";
import Technology from "./pages/Technology/Technology";

// =========================
// Authentication
// =========================

import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerifyEmail from "./pages/Auth/VerifyEmail";

// =========================
// Application Pages
// =========================

import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import PromptScannerPage from "./pages/PromptScannerPage/PromptScanner";
import ScanHistoryPage from "./pages/ScanHistoryPage/ScanHistory";
import AnalyticsPage from "./pages/AnalyticsPage/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================
            PUBLIC WEBSITE
        ===================================== */}

        <Route
          path="/"
          element={<Navigate to="/splash" replace />}
        />

        <Route
          path="/splash"
          element={<Splash />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/features"
          element={<Features />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/technology"
          element={<Technology />}
        />

        {/* =====================================
            AUTHENTICATION
        ===================================== */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        {/* =====================================
            APPLICATION
        ===================================== */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/scanner"
          element={<PromptScannerPage />}
        />

        <Route
          path="/history"
          element={<ScanHistoryPage />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        {/* =====================================
            FALLBACK
        ===================================== */}

        <Route
          path="*"
          element={<Navigate to="/splash" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;