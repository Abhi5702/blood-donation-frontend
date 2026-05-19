import { Link, useLocation } from "react-router-dom";
import { useRole } from "../../hooks/useRole";
import {
  LayoutDashboard, Users, Droplets, Building2,
  ClipboardList, Package, CalendarCheck,
  Settings, ChevronRight, TrendingUp
} from "lucide-react";

const NAV = {
  SUPER_ADMIN: [
    { label: "Dashboard", icon: LayoutDashboard, href: "/super-admin/dashboard" },
    { label: "Manage Users", icon: Users,          href: "/super-admin/users"     },
  ],
  ADMIN: [
    { label: "Dashboard",   icon: LayoutDashboard, href: "/admin/dashboard"  },
    { label: "Donors",      icon: Droplets,        href: "/admin/donors"     },
    { label: "Requests",    icon: ClipboardList,   href: "/admin/requests"   },
    { label: "Appointments",icon: CalendarCheck,   href: "/admin/appointments"},
  ],
  HOSPITAL_STAFF: [
    { label: "Dashboard",  icon: LayoutDashboard, href: "/hospital/dashboard" },
    { label: "Profile",    icon: Building2,       href: "/hospital/profile"   },
    { label: "Requests",   icon: ClipboardList,   href: "/hospital/requests"  },
    { label: "Inventory",  icon: Package,         href: "/hospital/inventory" },
    { label: "Appointments",icon: CalendarCheck,  href: "/hospital/appointments"},
  ],
  DONOR: [
    { label: "Dashboard",   icon: LayoutDashboard, href: "/donor/dashboard"    },
    { label: "My Profile",  icon: Droplets,        href: "/donor/profile"      },
    { label: "Appointments",icon: CalendarCheck,   href: "/donor/appointments" },
    { label: "Blood Requests", icon: ClipboardList,href: "/donor/requests"     },
  ],
};

const Sidebar = ({ onClose }) => {
  const { role } = useRole();
  const location = useLocation();
  const items = NAV[role] || [];

  const roleColor = {
    SUPER_ADMIN:    "#7c3aed",
    ADMIN:          "#2563eb",
    HOSPITAL_STAFF: "#dc2626",
    DONOR:          "#dc2626",
  }[role] || "#dc2626";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@400;500&display=swap');
        .bdms-sb {
          width: 230px; flex-shrink: 0;
          height: calc(100vh - 64px);
          position: sticky; top: 64px;
          background: #fff; border-right: 1px solid #fee2e2;
          display: flex; flex-direction: column;
          padding: 16px 10px; font-family: 'Outfit', sans-serif;
          overflow-y: auto;
        }
        .bdms-sb::-webkit-scrollbar { width: 0; }
        .bdms-sb-section {
          font-size: 9px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #9ca3af; padding: 0 10px;
          margin-bottom: 6px; margin-top: 8px;
        }
        .bdms-sb-item {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          text-decoration: none; cursor: pointer;
          transition: all .15s; position: relative;
          margin-bottom: 2px; font-size: 13px;
          font-weight: 400; color: #4b5563;
        }
        .bdms-sb-item:hover { background: #fef2f2; color: #dc2626; }
        .bdms-sb-item:hover .bdms-sb-icon { color: #dc2626; }
        .bdms-sb-item.active {
          background: #fef2f2; color: #dc2626; font-weight: 500;
        }
        .bdms-sb-item.active::before {
          content: ''; position: absolute; left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 60%; border-radius: 0 3px 3px 0;
          background: #dc2626;
        }
        .bdms-sb-icon { flex-shrink: 0; color: #9ca3af; transition: color .15s; }
        .bdms-sb-item.active .bdms-sb-icon { color: #dc2626; }
        .bdms-sb-chevron { margin-left: auto; color: #d1d5db; }
        .bdms-sb-item.active .bdms-sb-chevron { color: #fca5a5; }
        .bdms-sb-div { height: 1px; background: #f3f4f6; margin: 10px 4px; }
        .bdms-sb-spacer { flex: 1; }
        .bdms-sb-upgrade {
          margin: 8px 4px;
          background: linear-gradient(135deg, #1a0000 0%, #3d0000 100%);
          border-radius: 14px; padding: 14px 16px; position: relative; overflow: hidden;
        }
        .bdms-sb-upgrade-glow {
          position: absolute; bottom: -20px; right: -20px;
          width: 80px; height: 80px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%);
        }
        .bdms-sb-upgrade-title {
          font-family: 'Syne', sans-serif; font-size: 13px;
          font-weight: 700; color: #fff; margin-bottom: 4px;
        }
        .bdms-sb-upgrade-sub {
          font-size: 11px; color: rgba(255,255,255,0.45);
          line-height: 1.5; margin-bottom: 10px;
        }
        .bdms-sb-upgrade-btn {
          width: 100%; padding: 7px 12px; background: #dc2626;
          border: none; border-radius: 8px; cursor: pointer;
          font-size: 11px; font-weight: 600; color: #fff;
          font-family: 'Syne', sans-serif; transition: background .15s;
        }
        .bdms-sb-upgrade-btn:hover { background: #b91c1c; }
      `}</style>

      <aside className="bdms-sb">
        <div className="bdms-sb-section">Navigation</div>

        {items.map(({ label, icon: Icon, href }) => {
          const active = location.pathname === href;
          return (
            <Link
              key={label}
              to={href}
              className={`bdms-sb-item ${active ? "active" : ""}`}
              onClick={onClose}
            >
              <Icon size={16} className="bdms-sb-icon" />
              {label}
              {active && <ChevronRight size={13} className="bdms-sb-chevron" />}
            </Link>
          );
        })}

        <div className="bdms-sb-div" />
        

        <div className="bdms-sb-spacer" />

       
      </aside>
    </>
  );
};

export default Sidebar;