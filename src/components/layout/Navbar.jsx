import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Bell, ChevronDown, LogOut,
  User, Menu, X, Droplets
} from "lucide-react";

const Navbar = ({ onMobileToggle, mobileOpen }) => {
  const { user, logout } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "BL";

  const roleLabel = {
    SUPER_ADMIN:    "Super Admin",
    ADMIN:          "Admin",
    HOSPITAL_STAFF: "Hospital Staff",
    DONOR:          "Donor",
  }[user?.role] || "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@400;500&display=swap');
        .bdms-nav {
          position: sticky; top: 0; z-index: 100;
          height: 64px; background: #fff;
          border-bottom: 1px solid #fee2e2;
          display: flex; align-items: center;
          padding: 0 20px; gap: 12px;
          box-shadow: 0 1px 0 #fee2e2, 0 2px 12px rgba(220,38,38,0.04);
          font-family: 'Outfit', sans-serif;
        }
        .bdms-nav-burger {
          width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid #e5e7eb; background: #f9fafb;
          display: none; align-items: center; justify-content: center;
          cursor: pointer; transition: all .15s; flex-shrink: 0;
        }
        .bdms-nav-burger:hover { background: #fef2f2; border-color: #fecaca; }
        .bdms-nav-brand {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; flex-shrink: 0;
        }
        .bdms-nav-brand-icon {
          width: 36px; height: 36px; border-radius: 9px;
          background: linear-gradient(135deg, #dc2626, #991b1b);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(220,38,38,0.3);
        }
        .bdms-nav-brand-name {
          font-family: 'Syne', sans-serif; font-size: 17px;
          font-weight: 700; color: #111; letter-spacing: -0.02em;
        }
        .bdms-nav-brand-name span { color: #dc2626; }
        .bdms-nav-divider {
          width: 1px; height: 24px; background: #e5e7eb; margin: 0 4px;
        }
        .bdms-nav-role {
          font-size: 12px; color: #6b7280; font-weight: 400;
        }
        .bdms-nav-spacer { flex: 1; }
        .bdms-nav-bell {
          position: relative; width: 36px; height: 36px; border-radius: 9px;
          border: 1px solid #e5e7eb; background: #f9fafb;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .15s;
        }
        .bdms-nav-bell:hover { background: #fef2f2; border-color: #fecaca; }
        .bdms-nav-bell-dot {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #dc2626; border: 1.5px solid #fff;
        }
        .bdms-nav-user {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          border: 1px solid #e5e7eb; border-radius: 999px;
          background: #f9fafb; cursor: pointer;
          transition: all .15s; position: relative;
        }
        .bdms-nav-user:hover { background: #fef2f2; border-color: #fecaca; }
        .bdms-nav-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; font-weight: 700; color: #fff;
          font-family: 'Syne', sans-serif; flex-shrink: 0; overflow: hidden;
        }
        .bdms-nav-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .bdms-nav-uname {
          font-size: 13px; font-weight: 500; color: #111;
          max-width: 110px; overflow: hidden;
          text-overflow: ellipsis; white-space: nowrap;
        }
        .bdms-nav-chevron { color: #9ca3af; transition: transform .2s; }
        .bdms-nav-chevron.open { transform: rotate(180deg); }
        .bdms-nav-dropdown {
          position: absolute; top: calc(100% + 8px); right: 0;
          width: 200px; background: #fff;
          border: 1px solid #e5e7eb; border-radius: 12px;
          padding: 6px; box-shadow: 0 8px 32px rgba(0,0,0,0.08);
          z-index: 200; animation: ddIn .15s ease;
        }
        @keyframes ddIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        .bdms-nav-dd-info {
          padding: 10px 12px 8px; border-bottom: 1px solid #f3f4f6; margin-bottom: 4px;
        }
        .bdms-nav-dd-name { font-size: 13px; font-weight: 500; color: #111; }
        .bdms-nav-dd-role {
          font-size: 11px; color: #9ca3af; margin-top: 2px;
          display: inline-flex; padding: 1px 6px;
          background: #fee2e2; color: #dc2626;
          border-radius: 999px; font-weight: 500;
        }
        .bdms-nav-dd-item {
          display: flex; align-items: center; gap: 9px;
          padding: 8px 12px; border-radius: 8px;
          font-size: 13px; color: #374151; cursor: pointer;
          transition: background .12s; font-family: 'Outfit', sans-serif;
        }
        .bdms-nav-dd-item:hover { background: #f0fdf4; color: #16a34a; }
        .bdms-nav-dd-item.danger:hover { background: #fef2f2; color: #dc2626; }
        .bdms-nav-dd-divider { height: 1px; background: #f3f4f6; margin: 4px 0; }
        @media (max-width: 1080px) {
          .bdms-nav-burger { display: flex; }
          .bdms-nav-divider, .bdms-nav-role { display: none; }
        }
      `}</style>

      <header className="bdms-nav">
        <button className="bdms-nav-burger" onClick={onMobileToggle}>
          {mobileOpen
            ? <X size={17} color="#374151" />
            : <Menu size={17} color="#374151" />
          }
        </button>

        <a href="/" className="bdms-nav-brand">
          <div className="bdms-nav-brand-icon">
            <Droplets size={18} color="#fff" />
          </div>
          <span className="bdms-nav-brand-name">Blood<span>Link</span></span>
        </a>

        <div className="bdms-nav-divider" />
        <span className="bdms-nav-role">{roleLabel}</span>

        <div className="bdms-nav-spacer" />

        <div className="bdms-nav-bell">
          <Bell size={16} color="#374151" />
          <span className="bdms-nav-bell-dot" />
        </div>

        <div className="bdms-nav-user" onClick={() => setDropdown(o => !o)}>
          <div className="bdms-nav-avatar">
            {user?.profileImageUrl
              ? <img src={user.profileImageUrl} alt={user.fullName} />
              : initials
            }
          </div>
          <span className="bdms-nav-uname">
            {user?.fullName?.split(" ")[0] || "User"}
          </span>
          <ChevronDown
            size={14}
            className={`bdms-nav-chevron ${dropdown ? "open" : ""}`}
          />

          {dropdown && (
            <div
              className="bdms-nav-dropdown"
              onClick={e => e.stopPropagation()}
            >
              <div className="bdms-nav-dd-info">
                <div className="bdms-nav-dd-name">{user?.fullName}</div>
                <span className="bdms-nav-dd-role">{roleLabel}</span>
              </div>
              <div
                className="bdms-nav-dd-item"
                onClick={() => { setDropdown(false); navigate("/profile"); }}
              >
                <User size={14} /> My Profile
              </div>
              <div className="bdms-nav-dd-divider" />
              <div
                className="bdms-nav-dd-item danger"
                onClick={handleLogout}
              >
                <LogOut size={14} /> Sign Out
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;