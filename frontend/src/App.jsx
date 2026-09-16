import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Splash from "./pages/Splash/Splash";
import Home from "./pages/Home/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";

import PromptScannerPage from "./pages/PromptScannerPage/PromptScanner";
import ScanHistoryPage from "./pages/ScanHistoryPage/ScanHistory";
import AnalyticsPage from "./pages/AnalyticsPage/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/splash" replace />} />

        <Route path="/splash" element={<Splash />} />

        <Route path="/home" element={<Home />} />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/scanner" element={<PromptScannerPage />} />

        <Route path="/history" element={<ScanHistoryPage />} />

        <Route path="/analytics" element={<AnalyticsPage />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="*" element={<Navigate to="/splash" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;