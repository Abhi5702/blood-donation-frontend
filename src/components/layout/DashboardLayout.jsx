import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{`
        .bdms-layout { min-height: 100vh; background: #fafafa; }
        .bdms-layout-body { display: flex; }
        .bdms-layout-sidebar-slot { flex-shrink: 0; }
        .bdms-layout-content { flex: 1; min-width: 0; padding: 28px; }
        .bdms-layout-mobile-overlay {
          position: fixed; inset: 0; z-index: 90;
          background: rgba(0,0,0,0.25); backdrop-filter: blur(2px);
        }
        .bdms-layout-mobile-sidebar {
          position: fixed; top: 64px; left: 0; bottom: 0;
          width: 240px; z-index: 95; background: #fff;
          border-right: 1px solid #fee2e2;
          animation: sbSlideIn .2s ease; overflow-y: auto;
          display: flex; flex-direction: column; padding: 16px 10px;
        }
        @keyframes sbSlideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @media (min-width: 1081px) {
          .bdms-layout-mobile-overlay,
          .bdms-layout-mobile-sidebar { display: none !important; }
        }
        @media (max-width: 1080px) {
          .bdms-layout-sidebar-slot { display: none; }
          .bdms-layout-content { padding: 20px 16px; }
        }
        @media (max-width: 640px) {
          .bdms-layout-content { padding: 16px 12px; }
        }
      `}</style>

      <div className="bdms-layout">
        <Navbar
          onMobileToggle={() => setMobileOpen(o => !o)}
          mobileOpen={mobileOpen}
        />

        <div className="bdms-layout-body">
          {/* Desktop sidebar */}
          <div className="bdms-layout-sidebar-slot">
            <Sidebar />
          </div>

          {/* Mobile sidebar + overlay */}
          {mobileOpen && (
            <>
              <div
                className="bdms-layout-mobile-overlay"
                onClick={() => setMobileOpen(false)}
              />
              <div className="bdms-layout-mobile-sidebar">
                <Sidebar onClose={() => setMobileOpen(false)} />
              </div>
            </>
          )}

          {/* Page content */}
          <main className="bdms-layout-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;