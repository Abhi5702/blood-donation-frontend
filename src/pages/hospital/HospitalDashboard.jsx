import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplets, ClipboardList, Package,
  CalendarCheck, RefreshCw, ArrowRight,
  Plus, AlertCircle, CheckCircle2,
  Clock, TrendingUp
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

/* ── Skeleton ── */
const Skel = ({ h = "100%", r = "10px" }) => (
  <div style={{
    height: h, borderRadius: r,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "skelShim 1.4s infinite",
  }} />
);

/* ── Blood Request Row ── */
const RequestRow = ({ req }) => {
  const urgencyVariant = {
    CRITICAL: "red", MEDIUM: "amber", LOW: "green",
  }[req.urgency] || "gray";

  const statusVariant = {
    OPEN: "blue", IN_PROGRESS: "amber",
    FULFILLED: "green", CANCELLED: "gray",
  }[req.status] || "gray";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 0", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        background: "#fee2e2", border: "1px solid #fecaca",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Droplets size={17} color="#dc2626" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
          {req.bloodType.replace("_", " ")} — {req.unitsNeeded} units
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
          {new Date(req.requestedAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <Badge label={req.urgency}  variant={urgencyVariant} />
        <Badge label={req.status.replace("_", " ")} variant={statusVariant} />
      </div>
    </div>
  );
};

/* ── Inventory Row ── */
const InventoryRow = ({ inv }) => {
  const isLow     = inv.unitsAvailable <= 3;
  const isExpiring = inv.expiryDate &&
    new Date(inv.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 0", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        background: isLow ? "#fee2e2" : "#f0fdf4",
        border: `1px solid ${isLow ? "#fecaca" : "#bbf7d0"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Package size={17} color={isLow ? "#dc2626" : "#16a34a"} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
          {inv.bloodType.replace("_", " ")}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
          {inv.expiryDate
            ? `Expires: ${new Date(inv.expiryDate).toLocaleDateString("en-IN")}`
            : "No expiry set"
          }
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {isExpiring && <Badge label="Expiring" variant="amber" />}
        {isLow      && <Badge label="Low Stock" variant="red"  />}
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 16,
          fontWeight: 700, color: isLow ? "#dc2626" : "#16a34a",
        }}>
          {inv.unitsAvailable}
          <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af", marginLeft: 3 }}>
            units
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Appointment Row ── */
const ApptRow = ({ appt }) => {
  const statusVariant = {
    SCHEDULED: "blue", COMPLETED: "green",
    CANCELLED: "red",  NO_SHOW: "gray",
  }[appt.status] || "gray";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 0", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 9, flexShrink: 0,
        background: "#eff6ff", border: "1px solid #bfdbfe",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <CalendarCheck size={17} color="#2563eb" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
          {appt.donorName}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
          {appt.donorBloodType?.replace("_", " ")} ·{" "}
          {new Date(appt.scheduledAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short",
            hour: "2-digit", minute: "2-digit",
          })}
        </div>
      </div>
      <Badge label={appt.status} variant={statusVariant} />
    </div>
  );
};

/* ── Main ── */
const HospitalDashboard = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [dashboard,    setDashboard]    = useState(null);
  const [requests,     setRequests]     = useState([]);
  const [inventory,    setInventory]    = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);

  const fetchAll = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [dashRes, reqRes, invRes, apptRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.DASHBOARD),
        axiosInstance.get(ENDPOINTS.MY_REQUESTS),
        axiosInstance.get(ENDPOINTS.MY_INVENTORY),
        axiosInstance.get(ENDPOINTS.HOSPITAL_APPTS),
      ]);
      setDashboard(dashRes.data.data);
      setRequests(reqRes.data.data   || []);
      setInventory(invRes.data.data  || []);
      setAppointments(apptRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load dashboard");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const lowStock   = inventory.filter(i => i.unitsAvailable <= 3).length;
  const criticalReq = requests.filter(r => r.urgency === "CRITICAL" && r.status === "OPEN").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes skelShim {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .hosp-page { font-family: 'Outfit', sans-serif; }
        .hosp-header {
          display:flex; align-items:flex-end;
          justify-content:space-between;
          margin-bottom:24px; flex-wrap:wrap; gap:12px;
          animation: fadeUp .3s ease both;
        }
        .hosp-title {
          font-family:'Syne',sans-serif; font-size:22px;
          font-weight:700; color:#111; letter-spacing:-0.02em;
        }
        .hosp-title span { color:#dc2626; }
        .hosp-sub { font-size:12px; color:#9ca3af; margin-top:3px; }
        .hosp-actions { display:flex; gap:8px; }
        .hosp-btn {
          display:flex; align-items:center; gap:6px;
          padding:8px 14px; border-radius:9px;
          font-size:12px; font-weight:500; cursor:pointer;
          transition:all .15s; font-family:'Outfit',sans-serif; border:none;
        }
        .hosp-btn.primary {
          background:#dc2626; color:#fff;
          box-shadow:0 2px 8px rgba(220,38,38,0.25);
        }
        .hosp-btn.primary:hover { background:#b91c1c; }
        .hosp-btn.secondary {
          background:#fff; color:#374151; border:1px solid #e5e7eb;
        }
        .hosp-btn.secondary:hover {
          background:#fef2f2; border-color:#fecaca; color:#dc2626;
        }

        .hosp-stat-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(170px,1fr));
          gap:16px; margin-bottom:20px;
        }

        /* Alert bar */
        .hosp-alert {
          display:flex; align-items:center; gap:12px;
          padding:12px 18px; border-radius:12px; margin-bottom:20px;
          animation: fadeUp .32s ease both;
        }
        .hosp-alert.critical {
          background:#fef2f2; border:1px solid #fecaca;
        }
        .hosp-alert.warning {
          background:#fffbeb; border:1px solid #fde68a;
        }
        .hosp-alert-text { font-size:13px; font-weight:500; }
        .hosp-alert-sub  { font-size:11px; color:#9ca3af; margin-top:2px; }

        .hosp-main-grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
          gap:20px;
        }
        .hosp-card {
          background:#fff; border:1px solid #f3f4f6;
          border-radius:16px; padding:20px 22px;
          animation: fadeUp .4s ease both;
        }
        .hosp-card-header {
          display:flex; align-items:center;
          justify-content:space-between; margin-bottom:14px;
        }
        .hosp-card-title {
          font-family:'Syne',sans-serif; font-size:14px;
          font-weight:700; color:#111; letter-spacing:-0.01em;
        }
        .hosp-card-sub { font-size:11px; color:#9ca3af; margin-top:2px; }
        .hosp-card-more {
          display:flex; align-items:center; gap:4px;
          font-size:12px; font-weight:500; color:#dc2626;
          background:none; border:none; cursor:pointer;
          font-family:'Outfit',sans-serif; padding:5px 8px;
          border-radius:7px; transition:background .15s;
        }
        .hosp-card-more:hover { background:#fef2f2; }
        .hosp-empty {
          padding:28px; text-align:center;
          background:#fafafa; border-radius:10px;
          font-size:13px; color:#9ca3af;
        }
        .hosp-empty-btn {
          margin-top:12px; padding:7px 16px;
          background:#dc2626; color:#fff;
          border:none; border-radius:8px;
          font-size:12px; font-weight:500; cursor:pointer;
          font-family:'Outfit',sans-serif;
        }
      `}</style>

      <DashboardLayout>
        <div className="hosp-page">

          {/* ── Header ── */}
          <div className="hosp-header">
            <div>
              <div className="hosp-title">
                Hospital <span>Dashboard</span>
              </div>
              <div className="hosp-sub">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long", year: "numeric",
                  month: "long", day: "numeric",
                })}
              </div>
            </div>
            <div className="hosp-actions">
              <button
                className="hosp-btn secondary"
                onClick={() => fetchAll(true)}
              >
                <RefreshCw size={13} className={refreshing ? "bdms-spin" : ""} />
                Refresh
              </button>
              <button
                className="hosp-btn secondary"
                onClick={() => navigate("/hospital/inventory")}
              >
                <Package size={13} /> Manage Inventory
              </button>
              <button
                className="hosp-btn primary"
                onClick={() => navigate("/hospital/requests")}
              >
                <Plus size={13} /> New Request
              </button>
            </div>
          </div>

          {/* ── Alert bars ── */}
          {!loading && criticalReq > 0 && (
            <div className="hosp-alert critical">
              <AlertCircle size={18} color="#dc2626" />
              <div>
                <div className="hosp-alert-text" style={{ color: "#dc2626" }}>
                  {criticalReq} critical blood request{criticalReq > 1 ? "s" : ""} open
                </div>
                <div className="hosp-alert-sub">
                  These requests need immediate attention
                </div>
              </div>
              <button
                onClick={() => navigate("/hospital/requests")}
                style={{
                  marginLeft: "auto", padding: "6px 14px",
                  background: "#dc2626", color: "#fff",
                  border: "none", borderRadius: 7,
                  fontSize: 12, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", flexShrink: 0,
                }}
              >
                View →
              </button>
            </div>
          )}

          {!loading && lowStock > 0 && (
            <div className="hosp-alert warning">
              <AlertCircle size={18} color="#d97706" />
              <div>
                <div className="hosp-alert-text" style={{ color: "#d97706" }}>
                  {lowStock} blood type{lowStock > 1 ? "s" : ""} running low
                </div>
                <div className="hosp-alert-sub">
                  Stock is at 3 units or below
                </div>
              </div>
              <button
                onClick={() => navigate("/hospital/inventory")}
                style={{
                  marginLeft: "auto", padding: "6px 14px",
                  background: "#d97706", color: "#fff",
                  border: "none", borderRadius: 7,
                  fontSize: 12, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", flexShrink: 0,
                }}
              >
                Update →
              </button>
            </div>
          )}

          {/* ── Stat cards ── */}
          {loading ? (
            <div className="hosp-stat-grid" style={{ marginBottom: 20 }}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} style={{
                  background: "#fff", border: "1px solid #f3f4f6",
                  borderRadius: 16, padding: "20px 22px", height: 110,
                }}>
                  <Skel h="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="hosp-stat-grid">
              <StatCard
                icon={ClipboardList}
                label="Open Requests"
                value={dashboard?.myOpenRequests ?? 0}
                color="#dc2626"
                delay="0ms"
              />
              <StatCard
                icon={TrendingUp}
                label="Total Requests"
                value={dashboard?.myTotalRequests ?? 0}
                color="#7c3aed"
                delay="60ms"
              />
              <StatCard
                icon={CalendarCheck}
                label="Upcoming Appointments"
                value={dashboard?.myUpcomingAppointments ?? 0}
                color="#2563eb"
                delay="120ms"
              />
              <StatCard
                icon={Package}
                label="Inventory Types"
                value={dashboard?.myInventoryTypes ?? 0}
                color="#16a34a"
                delay="180ms"
              />
            </div>
          )}

          {/* ── Main grid ── */}
          {loading ? (
            <div className="hosp-main-grid">
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  background: "#fff", border: "1px solid #f3f4f6",
                  borderRadius: 16, padding: "20px 22px", height: 280,
                }}>
                  <Skel h="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="hosp-main-grid">

              {/* Blood Requests */}
              <div className="hosp-card" style={{ animationDelay: "200ms" }}>
                <div className="hosp-card-header">
                  <div>
                    <div className="hosp-card-title">Blood Requests</div>
                    <div className="hosp-card-sub">Your hospital's requests</div>
                  </div>
                  <button
                    className="hosp-card-more"
                    onClick={() => navigate("/hospital/requests")}
                  >
                    View all <ArrowRight size={13} />
                  </button>
                </div>

                {requests.length === 0 ? (
                  <div className="hosp-empty">
                    <ClipboardList size={28} color="#fca5a5"
                      style={{ margin: "0 auto 8px" }} />
                    <div>No requests yet</div>
                    <button
                      className="hosp-empty-btn"
                      onClick={() => navigate("/hospital/requests")}
                    >
                      Create first request →
                    </button>
                  </div>
                ) : (
                  requests.slice(0, 4).map(req => (
                    <RequestRow key={req.id} req={req} />
                  ))
                )}
              </div>

              {/* Inventory */}
              <div className="hosp-card" style={{ animationDelay: "240ms" }}>
                <div className="hosp-card-header">
                  <div>
                    <div className="hosp-card-title">Blood Inventory</div>
                    <div className="hosp-card-sub">Current stock levels</div>
                  </div>
                  <button
                    className="hosp-card-more"
                    onClick={() => navigate("/hospital/inventory")}
                  >
                    Manage <ArrowRight size={13} />
                  </button>
                </div>

                {inventory.length === 0 ? (
                  <div className="hosp-empty">
                    <Package size={28} color="#86efac"
                      style={{ margin: "0 auto 8px" }} />
                    <div>No inventory added yet</div>
                    <button
                      className="hosp-empty-btn"
                      onClick={() => navigate("/hospital/inventory")}
                    >
                      Add inventory →
                    </button>
                  </div>
                ) : (
                  inventory.slice(0, 5).map(inv => (
                    <InventoryRow key={inv.id} inv={inv} />
                  ))
                )}
              </div>

              {/* Appointments */}
              <div className="hosp-card" style={{ animationDelay: "280ms" }}>
                <div className="hosp-card-header">
                  <div>
                    <div className="hosp-card-title">Appointments</div>
                    <div className="hosp-card-sub">Donors scheduled at your hospital</div>
                  </div>
                  <button
                    className="hosp-card-more"
                    onClick={() => navigate("/hospital/appointments")}
                  >
                    View all <ArrowRight size={13} />
                  </button>
                </div>

                {appointments.length === 0 ? (
                  <div className="hosp-empty">
                    <CalendarCheck size={28} color="#93c5fd"
                      style={{ margin: "0 auto 8px" }} />
                    <div>No appointments scheduled</div>
                  </div>
                ) : (
                  appointments.slice(0, 4).map(appt => (
                    <ApptRow key={appt.id} appt={appt} />
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default HospitalDashboard;