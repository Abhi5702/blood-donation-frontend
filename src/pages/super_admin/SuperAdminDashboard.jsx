import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, Droplets, Building2, ClipboardList,
  CalendarCheck, CheckCircle2, XCircle,
  TrendingUp, RefreshCw, ArrowRight, Shield
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
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

const MetricRow = ({ label, value, color = "#111", border = true }) => (
  <div style={{
    display:"flex", alignItems:"center", justifyContent:"space-between",
    padding:"12px 0",
    borderBottom: border ? "1px solid #f3f4f6" : "none",
  }}>
    <span style={{ fontSize:13, color:"#6b7280" }}>{label}</span>
    <span style={{
      fontFamily:"'Syne',sans-serif", fontSize:17,
      fontWeight:700, color,
    }}>{value}</span>
  </div>
);

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboard,  setDashboard]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.DASHBOARD);
      setDashboard(res.data.data);
    } catch { toast.error("Failed to load dashboard"); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const d = dashboard;

  const statCards = [
    { icon:Users,         label:"Total Users",           value: d?.totalUsers                ?? 0, color:"#7c3aed", delay:"0ms"   },
    { icon:Droplets,      label:"Total Donors",          value: d?.totalDonors               ?? 0, color:"#dc2626", delay:"60ms"  },
    { icon:Building2,     label:"Total Hospitals",       value: d?.totalHospitals            ?? 0, color:"#2563eb", delay:"120ms" },
    { icon:ClipboardList, label:"Total Requests",        value: d?.totalRequests             ?? 0, color:"#d97706", delay:"180ms" },
    { icon:CalendarCheck, label:"Total Appointments",    value: d?.totalAppointments         ?? 0, color:"#0891b2", delay:"240ms" },
    { icon:CheckCircle2,  label:"Available Donors",      value: d?.totalAvailableDonors      ?? 0, color:"#16a34a", delay:"300ms" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes skelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .sa-page { font-family:'Outfit',sans-serif; }
        .sa-header {
          display:flex; align-items:flex-end; justify-content:space-between;
          margin-bottom:24px; flex-wrap:wrap; gap:12px;
          animation:fadeUp .3s ease both;
        }
        .sa-title {
          font-family:'Syne',sans-serif; font-size:22px;
          font-weight:700; color:#111; letter-spacing:-0.02em;
        }
        .sa-title span { color:#7c3aed; }
        .sa-sub { font-size:12px; color:#9ca3af; margin-top:3px; }
        .sa-actions { display:flex; gap:8px; }
        .sa-btn {
          display:flex; align-items:center; gap:6px;
          padding:8px 14px; border-radius:9px;
          font-size:12px; font-weight:500; cursor:pointer;
          transition:all .15s; font-family:'Outfit',sans-serif; border:none;
        }
        .sa-btn.primary { background:#7c3aed; color:#fff; box-shadow:0 2px 8px rgba(124,58,237,0.25); }
        .sa-btn.primary:hover { background:#6d28d9; }
        .sa-btn.secondary { background:#fff; color:#374151; border:1px solid #e5e7eb; }
        .sa-btn.secondary:hover { background:#f5f3ff; border-color:#ddd6fe; color:#7c3aed; }

        /* Banner */
        .sa-banner {
          background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%);
          border-radius:16px; padding:20px 24px;
          display:flex; align-items:center; gap:16px;
          margin-bottom:24px; position:relative; overflow:hidden;
          animation:fadeUp .32s ease both;
        }
        .sa-banner-glow {
          position:absolute; right:-30px; top:-30px;
          width:160px; height:160px; border-radius:50%;
          background:radial-gradient(circle,rgba(167,139,250,0.3) 0%,transparent 70%);
        }
        .sa-banner-icon {
          width:48px; height:48px; border-radius:14px; flex-shrink:0;
          background:rgba(167,139,250,0.2); border:1px solid rgba(167,139,250,0.3);
          display:flex; align-items:center; justify-content:center;
        }
        .sa-banner-title {
          font-family:'Syne',sans-serif; font-size:16px;
          font-weight:700; color:#fff; margin-bottom:3px;
        }
        .sa-banner-sub { font-size:12px; color:rgba(255,255,255,0.5); }
        .sa-banner-action {
          margin-left:auto; flex-shrink:0;
          padding:9px 18px; background:#7c3aed; border:none;
          border-radius:9px; font-size:12px; font-weight:600;
          color:#fff; cursor:pointer; font-family:'Syne',sans-serif;
          transition:background .15s; white-space:nowrap;
        }
        .sa-banner-action:hover { background:#6d28d9; }

        .sa-stat-grid {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(165px,1fr));
          gap:16px; margin-bottom:24px;
        }
        .sa-main-grid {
          display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr));
          gap:20px;
        }
        .sa-card {
          background:#fff; border:1px solid #f3f4f6;
          border-radius:16px; padding:20px 22px;
          animation:fadeUp .4s ease both;
        }
        .sa-card-header {
          display:flex; align-items:center;
          justify-content:space-between; margin-bottom:16px;
        }
        .sa-card-title {
          font-family:'Syne',sans-serif; font-size:14px;
          font-weight:700; color:#111; letter-spacing:-0.01em;
        }
        .sa-card-sub { font-size:11px; color:#9ca3af; margin-top:2px; }
        .sa-card-more {
          display:flex; align-items:center; gap:4px;
          font-size:12px; font-weight:500; color:#7c3aed;
          background:none; border:none; cursor:pointer;
          font-family:'Outfit',sans-serif; padding:5px 8px;
          border-radius:7px; transition:background .15s;
        }
        .sa-card-more:hover { background:#f5f3ff; }

        /* Donut-style progress bars */
        .sa-progress-item { margin-bottom:16px; }
        .sa-progress-header {
          display:flex; justify-content:space-between;
          font-size:12px; color:#6b7280; margin-bottom:6px;
        }
        .sa-progress-val { font-weight:600; color:#111; }
        .sa-progress-bar {
          height:6px; background:#f3f4f6; border-radius:999px; overflow:hidden;
        }
        .sa-progress-fill {
          height:100%; border-radius:999px;
          transition:width .8s cubic-bezier(.4,0,.2,1);
        }
      `}</style>

      <DashboardLayout>
        <div className="sa-page">

          {/* Header */}
          <div className="sa-header">
            <div>
              <div className="sa-title">Super Admin <span>Dashboard</span></div>
              <div className="sa-sub">
                {new Date().toLocaleDateString("en-IN", {
                  weekday:"long", year:"numeric", month:"long", day:"numeric",
                })}
              </div>
            </div>
            <div className="sa-actions">
              <button className="sa-btn secondary" onClick={() => fetchAll(true)}>
                <RefreshCw size={13} className={refreshing ? "bdms-spin" : ""} /> Refresh
              </button>
              <button className="sa-btn primary" onClick={() => navigate("/super-admin/users")}>
                <Users size={13} /> Manage Users
              </button>
            </div>
          </div>

          {/* Banner */}
          <div className="sa-banner">
            <div className="sa-banner-glow" />
            <div className="sa-banner-icon">
              <Shield size={22} color="#a78bfa" />
            </div>
            <div>
              <div className="sa-banner-title">Full System Control</div>
              <div className="sa-banner-sub">
                You have super admin access — manage users, roles, and all platform data
              </div>
            </div>
            <button
              className="sa-banner-action"
              onClick={() => navigate("/super-admin/users")}
            >
              Manage Users →
            </button>
          </div>

          {/* Stat cards */}
          {loading ? (
            <div className="sa-stat-grid" style={{ marginBottom:24 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{ background:"#fff", border:"1px solid #f3f4f6", borderRadius:16, padding:"20px 22px", height:110 }}>
                  <Skel h="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="sa-stat-grid">
              {statCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>
          )}

          {/* Detail cards */}
          {loading ? (
            <div className="sa-main-grid">
              {[0,1,2].map(i => (
                <div key={i} style={{ background:"#fff", border:"1px solid #f3f4f6", borderRadius:16, padding:"20px 22px", height:280 }}>
                  <Skel h="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="sa-main-grid">

              {/* Request breakdown */}
              <div className="sa-card" style={{ animationDelay:"200ms" }}>
                <div className="sa-card-header">
                  <div>
                    <div className="sa-card-title">Request Breakdown</div>
                    <div className="sa-card-sub">All blood request statuses</div>
                  </div>
                  <button className="sa-card-more" onClick={() => navigate("/admin/requests")}>
                    View <ArrowRight size={13} />
                  </button>
                </div>
                {[
                  { label:"Open",      value: d?.totalOpenRequests      ?? 0, color:"#2563eb", total: d?.totalRequests ?? 1 },
                  { label:"Fulfilled", value: d?.totalFulfilledRequests ?? 0, color:"#16a34a", total: d?.totalRequests ?? 1 },
                  { label:"Cancelled", value: d?.totalCancelledRequests ?? 0, color:"#dc2626", total: d?.totalRequests ?? 1 },
                ].map(({ label, value, color, total }) => (
                  <div className="sa-progress-item" key={label}>
                    <div className="sa-progress-header">
                      <span>{label}</span>
                      <span className="sa-progress-val">{value}</span>
                    </div>
                    <div className="sa-progress-bar">
                      <div
                        className="sa-progress-fill"
                        style={{
                          width: `${total > 0 ? (value / total) * 100 : 0}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Donor stats */}
              <div className="sa-card" style={{ animationDelay:"240ms" }}>
                <div className="sa-card-header">
                  <div>
                    <div className="sa-card-title">Donor Overview</div>
                    <div className="sa-card-sub">Registered vs available donors</div>
                  </div>
                </div>
                <MetricRow label="Total Registered Donors" value={d?.totalDonors ?? 0} color="#dc2626" />
                <MetricRow label="Currently Available"     value={d?.totalAvailableDonors ?? 0} color="#16a34a" />
                <MetricRow
                  label="Unavailable"
                  value={(d?.totalDonors ?? 0) - (d?.totalAvailableDonors ?? 0)}
                  color="#9ca3af"
                />
                <div className="sa-progress-item" style={{ marginTop:16 }}>
                  <div className="sa-progress-header">
                    <span>Availability rate</span>
                    <span className="sa-progress-val">
                      {d?.totalDonors > 0
                        ? Math.round((d.totalAvailableDonors / d.totalDonors) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="sa-progress-bar">
                    <div className="sa-progress-fill" style={{
                      width: d?.totalDonors > 0
                        ? `${(d.totalAvailableDonors / d.totalDonors) * 100}%`
                        : "0%",
                      background:"#16a34a",
                    }} />
                  </div>
                </div>
              </div>

              {/* Appointment stats */}
              <div className="sa-card" style={{ animationDelay:"280ms" }}>
                <div className="sa-card-header">
                  <div>
                    <div className="sa-card-title">Appointment Stats</div>
                    <div className="sa-card-sub">Platform-wide appointments</div>
                  </div>
                </div>
                <MetricRow label="Total Appointments"   value={d?.totalAppointments          ?? 0} color="#0891b2" />
                <MetricRow label="Completed"            value={d?.totalCompletedAppointments ?? 0} color="#16a34a" />
                <MetricRow label="Total Hospitals"      value={d?.totalHospitals             ?? 0} color="#2563eb" />
                <MetricRow label="Total Users"          value={d?.totalUsers                 ?? 0} color="#7c3aed" border={false} />
                <div style={{ marginTop:16 }}>
                  <button
                    onClick={() => navigate("/super-admin/users")}
                    style={{
                      width:"100%", padding:"10px",
                      background:"#f5f3ff", color:"#7c3aed",
                      border:"1px solid #ddd6fe", borderRadius:9,
                      fontSize:13, fontWeight:500, cursor:"pointer",
                      fontFamily:"'Outfit',sans-serif",
                      display:"flex", alignItems:"center",
                      justifyContent:"center", gap:6,
                    }}
                  >
                    <Users size={14} /> Manage All Users
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default SuperAdminDashboard;