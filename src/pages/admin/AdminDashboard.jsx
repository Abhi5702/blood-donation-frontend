import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplets, ClipboardList, CalendarCheck,
  Building2, RefreshCw, ArrowRight,
  Users, CheckCircle2, TrendingUp, Search
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const Skel = ({ h = "100%" }) => (
  <div style={{
    height: h, borderRadius: 10,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%", animation: "skelShim 1.4s infinite",
  }} />
);

const RequestRow = ({ req }) => {
  const urgencyVariant = { CRITICAL:"red", MEDIUM:"amber", LOW:"green" }[req.urgency] || "gray";
  const statusVariant  = { OPEN:"blue", IN_PROGRESS:"amber", FULFILLED:"green", CANCELLED:"gray" }[req.status] || "gray";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", borderBottom:"1px solid #f3f4f6" }}>
      <div style={{ width:38, height:38, borderRadius:9, flexShrink:0, background:"#fee2e2", border:"1px solid #fecaca", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Droplets size={17} color="#dc2626" />
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:500, color:"#111" }}>{req.hospitalName}</div>
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>
          {req.bloodType.replace("_"," ")} · {req.unitsNeeded} units ·{" "}
          {new Date(req.requestedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
        </div>
      </div>
      <div style={{ display:"flex", gap:6, flexShrink:0 }}>
        <Badge label={req.urgency} variant={urgencyVariant} />
        <Badge label={req.status.replace("_"," ")} variant={statusVariant} />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard,    setDashboard]    = useState(null);
  const [requests,     setRequests]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  const fetchAll = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [dashRes, reqRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.DASHBOARD),
        axiosInstance.get(ENDPOINTS.OPEN_REQUESTS),
      ]);
      setDashboard(dashRes.data.data);
      setRequests(reqRes.data.data || []);
    } catch { toast.error("Failed to load dashboard"); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const stats = [
    { icon: ClipboardList, label: "Open Requests",       value: dashboard?.totalOpenRequests      ?? 0, color: "#dc2626", delay: "0ms"   },
    { icon: Users,         label: "Available Donors",    value: dashboard?.totalAvailableDonors   ?? 0, color: "#16a34a", delay: "60ms"  },
    { icon: Building2,     label: "Total Hospitals",     value: dashboard?.totalHospitals         ?? 0, color: "#2563eb", delay: "120ms" },
    { icon: CalendarCheck, label: "Total Appointments",  value: dashboard?.totalAppointments      ?? 0, color: "#7c3aed", delay: "180ms" },
    { icon: CheckCircle2,  label: "Fulfilled Requests",  value: dashboard?.totalFulfilledRequests ?? 0, color: "#16a34a", delay: "240ms" },
    { icon: TrendingUp,    label: "Total Requests",      value: dashboard?.totalRequests          ?? 0, color: "#d97706", delay: "300ms" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes skelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .adm-page { font-family:'Outfit',sans-serif; }
        .adm-header {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-bottom:24px; flex-wrap:wrap; gap:12px;
          animation:fadeUp .3s ease both;
        }
        .adm-title {
          font-family:'Syne',sans-serif; font-size:22px;
          font-weight:700; color:#111; letter-spacing:-0.02em;
        }
        .adm-title span { color:#2563eb; }
        .adm-sub  { font-size:12px; color:#9ca3af; margin-top:3px; }
        .adm-actions { display:flex; gap:8px; }
        .adm-btn {
          display:flex; align-items:center; gap:6px;
          padding:8px 14px; border-radius:9px;
          font-size:12px; font-weight:500; cursor:pointer;
          transition:all .15s; font-family:'Outfit',sans-serif; border:none;
        }
        .adm-btn.primary   { background:#2563eb; color:#fff; box-shadow:0 2px 8px rgba(37,99,235,0.25); }
        .adm-btn.primary:hover { background:#1d4ed8; }
        .adm-btn.secondary { background:#fff; color:#374151; border:1px solid #e5e7eb; }
        .adm-btn.secondary:hover { background:#eff6ff; border-color:#bfdbfe; color:#2563eb; }
        .adm-stat-grid {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
          gap:16px; margin-bottom:24px;
        }
        .adm-main-grid {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:20px;
        }
        .adm-card {
          background:#fff; border:1px solid #f3f4f6;
          border-radius:16px; padding:20px 22px;
          animation:fadeUp .4s ease both;
        }
        .adm-card-header {
          display:flex; align-items:center;
          justify-content:space-between; margin-bottom:14px;
        }
        .adm-card-title {
          font-family:'Syne',sans-serif; font-size:14px;
          font-weight:700; color:#111; letter-spacing:-0.01em;
        }
        .adm-card-sub  { font-size:11px; color:#9ca3af; margin-top:2px; }
        .adm-card-more {
          display:flex; align-items:center; gap:4px;
          font-size:12px; font-weight:500; color:#2563eb;
          background:none; border:none; cursor:pointer;
          font-family:'Outfit',sans-serif; padding:5px 8px;
          border-radius:7px; transition:background .15s;
        }
        .adm-card-more:hover { background:#eff6ff; }
        .adm-empty {
          padding:28px; text-align:center;
          background:#fafafa; border-radius:10px;
          font-size:13px; color:#9ca3af;
        }

        /* quick actions */
        .adm-quick-grid {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
          gap:10px; margin-bottom:24px;
          animation:fadeUp .34s ease both;
        }
        .adm-quick-card {
          display:flex; flex-direction:column; align-items:center;
          gap:10px; padding:18px 12px;
          background:#fff; border:1px solid #f3f4f6; border-radius:14px;
          cursor:pointer; transition:all .15s; text-align:center;
        }
        .adm-quick-card:hover {
          border-color:#bfdbfe; background:#eff6ff;
          transform:translateY(-2px); box-shadow:0 4px 16px rgba(37,99,235,0.08);
        }
        .adm-quick-icon {
          width:42px; height:42px; border-radius:12px;
          display:flex; align-items:center; justify-content:center;
        }
        .adm-quick-label { font-size:12px; font-weight:500; color:#374151; }
      `}</style>

      <DashboardLayout>
        <div className="adm-page">

          {/* Header */}
          <div className="adm-header">
            <div>
              <div className="adm-title">Admin <span>Dashboard</span></div>
              <div className="adm-sub">
                {new Date().toLocaleDateString("en-IN", {
                  weekday:"long", year:"numeric", month:"long", day:"numeric",
                })}
              </div>
            </div>
            <div className="adm-actions">
              <button className="adm-btn secondary" onClick={() => fetchAll(true)}>
                <RefreshCw size={13} className={refreshing ? "bdms-spin" : ""} /> Refresh
              </button>
              <button className="adm-btn primary" onClick={() => navigate("/admin/donors")}>
                <Search size={13} /> Search Donors
              </button>
            </div>
          </div>

          {/* Quick actions */}
          {[
            { icon: Droplets,     bg:"#fee2e2", color:"#dc2626", label:"Search Donors",    href:"/admin/donors"       },
            { icon: ClipboardList,bg:"#fef3c7", color:"#d97706", label:"View Requests",    href:"/admin/requests"     },
            { icon: CalendarCheck,bg:"#eff6ff", color:"#2563eb", label:"Appointments",     href:"/admin/appointments" },
            { icon: Building2,    bg:"#f0fdf4", color:"#16a34a", label:"Hospitals",        href:"/hospitals"          },
          ].map(({ icon: Icon, bg, color, label, href }) => (
            <div
              key={label}
              className="adm-quick-card"
              onClick={() => navigate(href)}
              style={{ display: "none" }} // rendered in grid below
            />
          ))}

          <div className="adm-quick-grid">
            {[
              { icon: Droplets,     bg:"#fee2e2", color:"#dc2626", label:"Search Donors",   href:"/admin/donors"       },
              { icon: ClipboardList,bg:"#fef3c7", color:"#d97706", label:"Blood Requests",  href:"/admin/requests"     },
              { icon: CalendarCheck,bg:"#eff6ff", color:"#2563eb", label:"Appointments",    href:"/admin/appointments" },
              { icon: Building2,    bg:"#f0fdf4", color:"#16a34a", label:"All Hospitals",   href:"/hospitals"          },
            ].map(({ icon: Icon, bg, color, label, href }) => (
              <div key={label} className="adm-quick-card" onClick={() => navigate(href)}>
                <div className="adm-quick-icon" style={{ background: bg }}>
                  <Icon size={20} color={color} />
                </div>
                <span className="adm-quick-label">{label}</span>
              </div>
            ))}
          </div>

          {/* Stat cards */}
          {loading ? (
            <div className="adm-stat-grid" style={{ marginBottom:24 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{ background:"#fff", border:"1px solid #f3f4f6", borderRadius:16, padding:"20px 22px", height:110 }}>
                  <Skel h="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="adm-stat-grid">
              {stats.map(s => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>
          )}

          {/* Open requests */}
          {loading ? (
            <div className="adm-card"><Skel h="250px" /></div>
          ) : (
            <div className="adm-main-grid">
              <div className="adm-card" style={{ animationDelay:"200ms" }}>
                <div className="adm-card-header">
                  <div>
                    <div className="adm-card-title">Open Blood Requests</div>
                    <div className="adm-card-sub">Requests needing attention</div>
                  </div>
                  <button className="adm-card-more" onClick={() => navigate("/admin/requests")}>
                    View all <ArrowRight size={13} />
                  </button>
                </div>
                {requests.length === 0 ? (
                  <div className="adm-empty">No open requests right now ✓</div>
                ) : (
                  requests.slice(0, 6).map(req => <RequestRow key={req.id} req={req} />)
                )}
              </div>

              {/* Stats summary card */}
              <div className="adm-card" style={{ animationDelay:"240ms" }}>
                <div className="adm-card-header">
                  <div>
                    <div className="adm-card-title">Platform Summary</div>
                    <div className="adm-card-sub">Overall system health</div>
                  </div>
                </div>
                {[
                  { label:"Total Requests",       value: dashboard?.totalRequests          ?? 0, color:"#6b7280" },
                  { label:"Fulfilled",            value: dashboard?.totalFulfilledRequests ?? 0, color:"#16a34a" },
                  { label:"Open",                 value: dashboard?.totalOpenRequests      ?? 0, color:"#2563eb" },
                  { label:"Total Donors",         value: dashboard?.totalDonors            ?? 0, color:"#7c3aed" },
                  { label:"Available Donors",     value: dashboard?.totalAvailableDonors   ?? 0, color:"#16a34a" },
                  { label:"Completed Appts",      value: dashboard?.totalCompletedAppointments ?? 0, color:"#16a34a" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{
                    display:"flex", alignItems:"center",
                    justifyContent:"space-between",
                    padding:"11px 0", borderBottom:"1px solid #f3f4f6",
                  }}>
                    <span style={{ fontSize:13, color:"#6b7280" }}>{label}</span>
                    <span style={{
                      fontFamily:"'Syne',sans-serif", fontSize:16,
                      fontWeight:700, color,
                    }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminDashboard;