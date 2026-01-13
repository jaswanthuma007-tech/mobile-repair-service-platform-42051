import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SideNav from "./components/SideNav";
import Overview from "./pages/Overview";
import Jobs from "./pages/Jobs";
import Technicians from "./pages/Technicians";
import SpareParts from "./pages/SpareParts";
import Billing from "./pages/Billing";

// PUBLIC_INTERFACE
function App() {
  /** Service center portal entrypoint: manage technicians, jobs, billing, and spare parts. */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <div className="App scShell">
      <BrowserRouter>
        <SideNav />
        <div className="scMain">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/spare-parts" element={<SpareParts />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <footer className="footer">
            <div className="footer__inner">
              <span className="muted small">Mobile Repair Service Platform • Service Center</span>
              <span className="muted small">Ocean Professional theme</span>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
