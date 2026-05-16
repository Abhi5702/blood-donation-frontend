import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Droplets, CalendarCheck, ClipboardList,
  RefreshCw, ArrowRight, AlertCircle,
  CheckCircle2, Clock, MapPin
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

/* ── Blood request row ── */
const RequestRow = ({ req, onBook }) => {
  const urgencyVariant = {
    CRITICAL: "red", MEDIUM: "amber", LOW: "green",
  }[req.urgency] || "gray";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: "#fee2e2", border: "1px solid #fecaca",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Droplets size={18} color="#dc2626" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
          {req.hospitalName}
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginTop: 3,
        }}>
          <MapPin size={11} color="#9ca3af" />
          <span style={{ fontSize: 11, color: "#9ca3af" }}>{req.hospitalCity}</span>
          <span style={{ fontSize: 11, color: "#d1d5db" }}>·</span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            {req.unitsNeeded} unit{req.unitsNeeded !== 1 ? "s" : ""} needed
          </span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <Badge
          label={req.bloodType.replace("_", " ")}
          variant="red"
        />
        <Badge label={req.urgency} variant={urgencyVariant} />
        <button
          onClick={() => onBook(req)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 12px", background: "#dc2626", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 12,
            fontWeight: 500, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Book <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};

/* ── Appointment row ── */
const AppointmentRow = ({ appt }) => {
  const statusVariant = {
    SCHEDULED: "blue", COMPLETED: "green",
    CANCELLED: "red",  NO_SHOW: "gray",
  }[appt.status] || "gray";

  const statusIcon = {
    SCHEDULED: <Clock size={14} color="#2563eb" />,
    COMPLETED: <CheckCircle2 size={14} color="#16a34a" />,
    CANCELLED: <AlertCircle size={14} color="#dc2626" />,
    NO_SHOW:   <AlertCircle size={14} color="#6b7280" />,
  }[appt.status];

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid #f3f4f6",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {statusIcon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
          {appt.hospitalName}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 3 }}>
          {new Date(appt.scheduledAt).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </div>
      </div>
      <Badge label={appt.status} variant={statusVariant} />
    </div>
  );
};

/* ── Main component ── */
const DonorDashboard = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [dashboard, setDashboard]       = useState(null);
  const [openRequests, setOpenRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);

  const fetchAll = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [dashRes, reqRes, apptRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.DASHBOARD),
        axiosInstance.get(ENDPOINTS.OPEN_REQUESTS),
        axiosInstance.get(ENDPOINTS.MY_APPOINTMENTS),
      ]);
      setDashboard(apptRes.data.data  ? dashRes.data.data  : null);
      setDashboard(dashRes.data.data);
      setOpenRequests(reqRes.data.data  || []);
      setAppointments(apptRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

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
        .donor-page { font-family: 'Outfit', sans-serif; }
        .donor-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
          animation: fadeUp .3s ease both;
        }
        .donor-greeting {
          font-family: 'Syne', sans-serif; font-size: 22px;
          font-weight: 700; color: #111; letter-spacing: -0.02em;
        }
        .donor-greeting span { color: #dc2626; }
        .donor-date { font-size: 12px; color: #9ca3af; margin-top: 3px; }
        .donor-actions { display: flex; gap: 8px; }
        .donor-action-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; border-radius: 9px;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all .15s; font-family: 'Outfit', sans-serif; border: none;
        }
        .donor-action-btn.primary {
          background: #dc2626; color: #fff;
          box-shadow: 0 2px 8px rgba(220,38,38,0.25);
        }
        .donor-action-btn.primary:hover { background: #b91c1c; }
        .donor-action-btn.secondary {
          background: #fff; color: #374151; border: 1px solid #e5e7eb;
        }
        .donor-action-btn.secondary:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }

        .donor-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px; margin-bottom: 24px;
        }

        .donor-main-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 20px;
        }

        .donor-card {
          background: #fff; border: 1px solid #f3f4f6;
          border-radius: 16px; padding: 20px 22px;
          animation: fadeUp .4s ease both;
        }
        .donor-card-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 16px;
        }
        .donor-card-title {
          font-family: 'Syne', sans-serif; font-size: 14px;
          font-weight: 700; color: #111; letter-spacing: -0.01em;
        }
        .donor-card-sub { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .donor-card-more {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 500; color: #dc2626;
          background: none; border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; padding: 5px 8px;
          border-radius: 7px; transition: background .15s;
        }
        .donor-card-more:hover { background: #fef2f2; }
        .donor-empty {
          padding: 32px; text-align: center;
          background: #fafafa; border-radius: 10px;
          font-size: 13px; color: #9ca3af;
        }

        /* Availability toggle */
        .donor-avail {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; border-radius: 12px;
          background: linear-gradient(135deg, #fff5f5, #fff);
          border: 1px solid #fee2e2; margin-bottom: 20px;
          animation: fadeUp .32s ease both;
        }
        .donor-avail-left { display: flex; align-items: center; gap: 12px; }
        .donor-avail-dot {
          width: 10px; height: 10px; border-radius: 50%;
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.6; transform:scale(1.2); }
        }
        .donor-avail-title { font-size: 13px; font-weight: 500; color: #111; }
        .donor-avail-sub   { font-size: 11px; color: #9ca3af; margin-top: 2px; }
        .donor-avail-toggle {
          padding: 7px 16px; border-radius: 8px; border: none;
          font-size: 12px; font-weight: 500; cursor: pointer;
          font-family: 'Outfit', sans-serif; transition: all .15s;
        }

        /* Insight banner */
        .donor-insight {
          background: linear-gradient(135deg, #1a0000 0%, #3d0000 100%);
          border-radius: 14px; padding: 18px 22px;
          display: flex; align-items: center; gap: 16px;
          margin-bottom: 24px; position: relative; overflow: hidden;
          animation: fadeUp .35s ease both;
        }
        .donor-insight-glow {
          position: absolute; right: -30px; top: -30px;
          width: 150px; height: 150px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.3) 0%, transparent 70%);
        }
        .donor-insight-icon {
          width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
          background: rgba(220,38,38,0.2); border: 1px solid rgba(220,38,38,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .donor-insight-title {
          font-family: 'Syne', sans-serif; font-size: 14px;
          font-weight: 700; color: #fff; margin-bottom: 3px;
        }
        .donor-insight-sub { font-size: 12px; color: rgba(255,255,255,0.5); }
      `}</style>

      <DashboardLayout>
        <div className="donor-page">

          {/* ── Header ── */}
          <div className="donor-header">
            <div>
              <div className="donor-greeting">
                {greeting()}, <span>{user?.fullName?.split(" ")[0]}</span> 👋
              </div>
              <div className="donor-date">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long", year: "numeric",
                  month: "long", day: "numeric",
                })}
              </div>
            </div>
            <div className="donor-actions">
              <button
                className="donor-action-btn secondary"
                onClick={() => fetchAll(true)}
              >
                <RefreshCw size={13} className={refreshing ? "bdms-spin" : ""} />
                Refresh
              </button>
              <button
                className="donor-action-btn primary"
                onClick={() => navigate("/donor/appointments")}
              >
                <CalendarCheck size={13} /> Book Appointment
              </button>
            </div>
          </div>

          {/* ── Availability banner ── */}
          <div className="donor-avail">
            <div className="donor-avail-left">
              <div
                className="donor-avail-dot"
                style={{ background: "#16a34a" }}
              />
              <div>
                <div className="donor-avail-title">You are available to donate</div>
                <div className="donor-avail-sub">
                  Toggle your availability anytime from your profile
                </div>
              </div>
            </div>
            <button
              className="donor-avail-toggle"
              style={{ background: "#fef2f2", color: "#dc2626" }}
              onClick={() => navigate("/donor/profile")}
            >
              Manage
            </button>
          </div>

          {/* ── Stat cards ── */}
          {loading ? (
            <div className="donor-stat-grid" style={{ marginBottom: 24 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  background: "#fff", border: "1px solid #f3f4f6",
                  borderRadius: 16, padding: "20px 22px", height: 110,
                }}>
                  <Skel h="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="donor-stat-grid">
              <StatCard
                icon={Droplets}
                label="Total Donations"
                value={dashboard?.myTotalDonations ?? 0}
                color="#dc2626"
                delay="0ms"
              />
              <StatCard
                icon={CalendarCheck}
                label="Upcoming Appointments"
                value={dashboard?.myUpcomingAppointmentsCount ?? 0}
                color="#2563eb"
                delay="60ms"
              />
              <StatCard
                icon={ClipboardList}
                label="Open Requests for My Type"
                value={dashboard?.openRequestsForMyBloodType ?? 0}
                color="#d97706"
                delay="120ms"
              />
            </div>
          )}

          {/* ── Insight banner ── */}
          {!loading && (
            <div className="donor-insight">
              <div className="donor-insight-glow" />
              <div className="donor-insight-icon">
                <AlertCircle size={20} color="#f87171" />
              </div>
              <div>
                <div className="donor-insight-title">
                  {(dashboard?.openRequestsForMyBloodType ?? 0) > 0
                    ? `${dashboard.openRequestsForMyBloodType} urgent request${dashboard.openRequestsForMyBloodType > 1 ? "s" : ""} need your blood type!`
                    : "No urgent requests for your blood type right now"
                  }
                </div>
                <div className="donor-insight-sub">
                  {(dashboard?.openRequestsForMyBloodType ?? 0) > 0
                    ? "Book an appointment today and help save a life."
                    : "We'll notify you when a matching request comes in."
                  }
                </div>
              </div>
              <button
                onClick={() => navigate("/donor/appointments")}
                style={{
                  marginLeft: "auto", flexShrink: 0,
                  padding: "8px 16px", background: "#dc2626",
                  border: "none", borderRadius: 8,
                  fontSize: 12, fontWeight: 600, color: "#fff",
                  cursor: "pointer", fontFamily: "'Syne', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                Book Now
              </button>
            </div>
          )}

          {/* ── Main content ── */}
          {loading ? (
            <div className="donor-main-grid">
              {[0, 1].map(i => (
                <div key={i} style={{
                  background: "#fff", border: "1px solid #f3f4f6",
                  borderRadius: 16, padding: "20px 22px", height: 300,
                }}>
                  <Skel h="100%" />
                </div>
              ))}
            </div>
          ) : (
            <div className="donor-main-grid">

              {/* Open blood requests */}
              <div className="donor-card" style={{ animationDelay: "180ms" }}>
                <div className="donor-card-header">
                  <div>
                    <div className="donor-card-title">Open Blood Requests</div>
                    <div className="donor-card-sub">
                      Requests matching your blood type
                    </div>
                  </div>
                  <button
                    className="donor-card-more"
                    onClick={() => navigate("/donor/requests")}
                  >
                    View all <ArrowRight size={13} />
                  </button>
                </div>

                {openRequests.length === 0 ? (
                  <div className="donor-empty">
                    <Droplets size={28} color="#fca5a5" style={{ margin: "0 auto 8px" }} />
                    <div>No open requests right now</div>
                  </div>
                ) : (
                  openRequests.slice(0, 4).map(req => (
                    <RequestRow
                      key={req.id}
                      req={req}
                      onBook={() => navigate("/donor/appointments")}
                    />
                  ))
                )}
              </div>

              {/* My appointments */}
              <div className="donor-card" style={{ animationDelay: "220ms" }}>
                <div className="donor-card-header">
                  <div>
                    <div className="donor-card-title">My Appointments</div>
                    <div className="donor-card-sub">Your upcoming & past donations</div>
                  </div>
                  <button
                    className="donor-card-more"
                    onClick={() => navigate("/donor/appointments")}
                  >
                    View all <ArrowRight size={13} />
                  </button>
                </div>

                {appointments.length === 0 ? (
                  <div className="donor-empty">
                    <CalendarCheck size={28} color="#93c5fd" style={{ margin: "0 auto 8px" }} />
                    <div>No appointments yet</div>
                    <button
                      onClick={() => navigate("/donor/appointments")}
                      style={{
                        marginTop: 12, padding: "7px 16px",
                        background: "#dc2626", color: "#fff",
                        border: "none", borderRadius: 8,
                        fontSize: 12, fontWeight: 500, cursor: "pointer",
                        fontFamily: "'Outfit', sans-serif",
                      }}
                    >
                      Book your first →
                    </button>
                  </div>
                ) : (
                  appointments.slice(0, 4).map(appt => (
                    <AppointmentRow key={appt.id} appt={appt} />
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

export default DonorDashboard;