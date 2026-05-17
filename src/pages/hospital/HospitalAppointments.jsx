import { useEffect, useState } from "react";
import {
  CalendarCheck, RefreshCw, CheckCircle2,
  XCircle, AlertCircle, Clock, Droplets, User
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const statusVariant = {
  SCHEDULED:"blue", COMPLETED:"green",
  CANCELLED:"red",  NO_SHOW:"gray",
};

const statusIcon = {
  SCHEDULED:  <Clock        size={16} color="#2563eb" />,
  COMPLETED:  <CheckCircle2 size={16} color="#16a34a" />,
  CANCELLED:  <XCircle      size={16} color="#dc2626" />,
  NO_SHOW:    <AlertCircle  size={16} color="#6b7280" />,
};

const STATUS_OPTIONS = ["SCHEDULED","COMPLETED","CANCELLED","NO_SHOW"];

const Skel = () => (
  <div style={{
    height:88, borderRadius:14,
    background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
    backgroundSize:"200% 100%", animation:"haSkel 1.4s infinite", marginBottom:10,
  }} />
);

const HospitalAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [modal,        setModal]        = useState(null); // { appt }
  const [newStatus,    setNewStatus]    = useState("");
  const [updating,     setUpdating]     = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.HOSPITAL_APPTS);
      setAppointments(res.data.data || []);
    } catch { toast.error("Failed to load appointments"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === modal.appt.status) {
      setModal(null); return;
    }
    setUpdating(true);
    try {
      await axiosInstance.patch(
        `${ENDPOINTS.UPDATE_APPT_STATUS(modal.appt.id)}?status=${newStatus}`
      );
      toast.success(`Appointment marked as ${newStatus.replace("_"," ")}`);
      setModal(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally { setUpdating(false); }
  };

  const filtered = filterStatus === "ALL"
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = appointments.filter(a => a.status === s).length;
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes haSkel  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }

        .ha-page   { font-family:'Outfit',sans-serif; }
        .ha-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .ha-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .ha-title span { color:#2563eb; }
        .ha-sub    { font-size:12px; color:#9ca3af; margin-top:3px; }
        .ha-refresh { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; font-family:'Outfit',sans-serif; border:1px solid #e5e7eb; background:#fff; color:#374151; }
        .ha-refresh:hover { background:#fef2f2; border-color:#fecaca; color:#dc2626; }

        /* summary chips */
        .ha-chips { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; animation:fadeUp .32s ease both; }
        .ha-chip  { display:flex; align-items:center; gap:10px; padding:12px 16px; background:#fff; border:1px solid #f3f4f6; border-radius:12px; }
        .ha-chip-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ha-chip-num  { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#111; line-height:1; }
        .ha-chip-lbl  { font-size:11px; color:#9ca3af; margin-top:2px; }

        /* filter tabs */
        .ha-tabs { display:flex; gap:4px; background:#f3f4f6; padding:4px; border-radius:10px; margin-bottom:20px; flex-wrap:wrap; animation:fadeUp .34s ease both; }
        .ha-tab  { padding:7px 14px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; border:none; background:transparent; color:#6b7280; font-family:'Outfit',sans-serif; transition:all .15s; }
        .ha-tab.active { background:#fff; color:#dc2626; box-shadow:0 1px 4px rgba(0,0,0,0.08); font-weight:600; }

        /* appointment cards */
        .ha-list { display:flex; flex-direction:column; gap:10px; }
        .ha-card {
          display:flex; align-items:flex-start; gap:14px;
          padding:18px 20px; background:#fff;
          border:1px solid #f3f4f6; border-radius:14px;
          transition:all .15s; animation:fadeUp .4s ease both;
        }
        .ha-card:hover { border-color:#e5e7eb; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .ha-card.SCHEDULED { border-left:3px solid #2563eb; }
        .ha-card.COMPLETED { border-left:3px solid #16a34a; }
        .ha-card.CANCELLED { border-left:3px solid #dc2626; }
        .ha-card.NO_SHOW   { border-left:3px solid #9ca3af; }
        .ha-card-icon { width:44px; height:44px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; margin-top:2px; }
        .ha-card-main { flex:1; min-width:0; }
        .ha-card-donor { font-size:14px; font-weight:500; color:#111; margin-bottom:5px; }
        .ha-card-meta  { display:flex; flex-wrap:wrap; gap:10px; }
        .ha-card-meta-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#6b7280; }
        .ha-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
        .ha-update-btn {
          display:flex; align-items:center; gap:5px;
          padding:7px 12px; border-radius:8px;
          border:1px solid #e5e7eb; background:#f9fafb;
          color:#374151; font-size:12px; font-weight:500;
          cursor:pointer; font-family:'Outfit',sans-serif; transition:all .15s;
        }
        .ha-update-btn:hover { background:#eff6ff; border-color:#bfdbfe; color:#2563eb; }
        .ha-notes { font-size:11px; color:#9ca3af; margin-top:6px; font-style:italic; }

        /* empty */
        .ha-empty { display:flex; flex-direction:column; align-items:center; padding:56px 32px; text-align:center; background:#fff; border:1px dashed #bfdbfe; border-radius:16px; animation:fadeUp .4s ease both; }

        /* modal */
        .ha-modal-form { display:flex; flex-direction:column; gap:14px; }
        .ha-status-select { width:100%; padding:11px 12px; background:#fff; border:1.5px solid #e5e7eb; border-radius:9px; font-size:13px; font-family:'Outfit',sans-serif; color:#111; outline:none; cursor:pointer; box-sizing:border-box; transition:border-color .15s; }
        .ha-status-select:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .ha-modal-btn { width:100%; padding:12px; background:#2563eb; color:#fff; border:none; border-radius:9px; font-size:13px; font-weight:500; font-family:'Syne',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .15s; box-shadow:0 2px 10px rgba(37,99,235,0.25); }
        .ha-modal-btn:hover:not(:disabled) { background:#1d4ed8; }
        .ha-modal-btn:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>

      <DashboardLayout>
        <div className="ha-page">

          {/* Header */}
          <div className="ha-header">
            <div>
              <div className="ha-title">Hospital <span>Appointments</span></div>
              <div className="ha-sub">Manage donor appointments at your hospital</div>
            </div>
            <button className="ha-refresh" onClick={fetch}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Summary chips */}
          {!loading && (
            <div className="ha-chips">
              {[
                { icon:<CalendarCheck size={16} color="#2563eb" />, bg:"#eff6ff", num: counts.SCHEDULED || 0, lbl:"Scheduled"  },
                { icon:<CheckCircle2  size={16} color="#16a34a" />, bg:"#f0fdf4", num: counts.COMPLETED || 0, lbl:"Completed"  },
                { icon:<AlertCircle   size={16} color="#6b7280" />, bg:"#f3f4f6", num: counts.NO_SHOW  || 0, lbl:"No Show"    },
                { icon:<CalendarCheck size={16} color="#dc2626" />, bg:"#fee2e2", num: appointments.length,   lbl:"Total"      },
              ].map(({ icon, bg, num, lbl }) => (
                <div className="ha-chip" key={lbl}>
                  <div className="ha-chip-icon" style={{ background:bg }}>{icon}</div>
                  <div>
                    <div className="ha-chip-num">{num}</div>
                    <div className="ha-chip-lbl">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="ha-tabs">
            {["ALL", ...STATUS_OPTIONS].map(s => (
              <button
                key={s}
                className={`ha-tab ${filterStatus === s ? "active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === "ALL" ? "All" : s.replace("_"," ")}
                {s !== "ALL" && (
                  <span style={{
                    marginLeft:5, fontSize:10, fontWeight:700,
                    padding:"1px 5px", borderRadius:999,
                    background: filterStatus===s ? "#fee2e2" : "#e5e7eb",
                    color:      filterStatus===s ? "#dc2626" : "#6b7280",
                  }}>
                    {counts[s] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div>{[0,1,2,3].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="ha-empty">
              <div style={{ width:60, height:60, borderRadius:16, background:"#eff6ff", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                <CalendarCheck size={26} color="#2563eb" />
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#111", marginBottom:6 }}>
                {filterStatus === "ALL" ? "No appointments yet" : `No ${filterStatus.replace("_"," ")} appointments`}
              </div>
              <div style={{ fontSize:13, color:"#9ca3af" }}>
                Appointments booked by donors at your hospital will appear here.
              </div>
            </div>
          ) : (
            <div className="ha-list">
              {filtered.map((appt, i) => (
                <div
                  key={appt.id}
                  className={`ha-card ${appt.status}`}
                  style={{ animationDelay:`${i*40}ms` }}
                >
                  {/* Status icon */}
                  <div
                    className="ha-card-icon"
                    style={{
                      background:
                        appt.status === "SCHEDULED" ? "#eff6ff" :
                        appt.status === "COMPLETED" ? "#f0fdf4" :
                        appt.status === "NO_SHOW"   ? "#f3f4f6" : "#fef2f2",
                      border:`1px solid ${
                        appt.status === "SCHEDULED" ? "#bfdbfe" :
                        appt.status === "COMPLETED" ? "#bbf7d0" :
                        appt.status === "NO_SHOW"   ? "#e5e7eb" : "#fecaca"
                      }`,
                    }}
                  >
                    {statusIcon[appt.status]}
                  </div>

                  {/* Info */}
                  <div className="ha-card-main">
                    <div className="ha-card-donor">
                      {appt.donorName}
                    </div>
                    <div className="ha-card-meta">
                      <div className="ha-card-meta-item">
                        <Droplets size={12} />
                        {appt.donorBloodType?.replace("_"," ")}
                      </div>
                      <div className="ha-card-meta-item">
                        <Clock size={12} />
                        {new Date(appt.scheduledAt).toLocaleDateString("en-IN", {
                          weekday:"short", day:"numeric", month:"short",
                          year:"numeric", hour:"2-digit", minute:"2-digit",
                        })}
                      </div>
                      {appt.requestId && (
                        <div className="ha-card-meta-item">
                          <AlertCircle size={12} />
                          Linked to request #{appt.requestId}
                        </div>
                      )}
                    </div>
                    {appt.notes && (
                      <div className="ha-notes">"{appt.notes}"</div>
                    )}
                  </div>

                  {/* Right */}
                  <div className="ha-card-right">
                    <Badge
                      label={appt.status.replace("_"," ")}
                      variant={statusVariant[appt.status]}
                    />
                    {/* Only allow status update for SCHEDULED */}
                    {appt.status === "SCHEDULED" && (
                      <button
                        className="ha-update-btn"
                        onClick={() => {
                          setModal({ appt });
                          setNewStatus(appt.status);
                        }}
                      >
                        <CheckCircle2 size={13} /> Update Status
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Update Status Modal */}
        <Modal
          isOpen={!!modal}
          onClose={() => setModal(null)}
          title="Update Appointment Status"
        >
          <div className="ha-modal-form">

            {/* Donor info */}
            <div style={{ padding:"12px 14px", background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:"#dcfce7", border:"1px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <User size={16} color="#16a34a" />
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:"#111" }}>
                    {modal?.appt?.donorName}
                  </div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>
                    {modal?.appt?.donorBloodType?.replace("_"," ")} ·{" "}
                    {modal?.appt?.scheduledAt && new Date(modal.appt.scheduledAt).toLocaleDateString("en-IN", {
                      day:"numeric", month:"short", year:"numeric",
                      hour:"2-digit", minute:"2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Status selector */}
            <div>
              <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151", marginBottom:7, display:"block" }}>
                New Status
              </label>
              <select
                className="ha-status-select"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.replace("_"," ")}</option>
                ))}
              </select>
            </div>

            {/* Status explanation */}
            <div style={{
              padding:"10px 14px", borderRadius:9, fontSize:12,
              background:
                newStatus === "COMPLETED" ? "#f0fdf4" :
                newStatus === "NO_SHOW"   ? "#f3f4f6" :
                newStatus === "CANCELLED" ? "#fef2f2" : "#eff6ff",
              color:
                newStatus === "COMPLETED" ? "#16a34a" :
                newStatus === "NO_SHOW"   ? "#6b7280" :
                newStatus === "CANCELLED" ? "#dc2626" : "#2563eb",
              border:`1px solid ${
                newStatus === "COMPLETED" ? "#bbf7d0" :
                newStatus === "NO_SHOW"   ? "#e5e7eb" :
                newStatus === "CANCELLED" ? "#fecaca" : "#bfdbfe"
              }`,
            }}>
              {newStatus === "COMPLETED" && "✓ Mark donor as arrived and donation completed"}
              {newStatus === "NO_SHOW"   && "⚠ Donor did not show up for the appointment"}
              {newStatus === "CANCELLED" && "✕ Appointment has been cancelled"}
              {newStatus === "SCHEDULED" && "○ Keep appointment as scheduled"}
            </div>

            <button
              className="ha-modal-btn"
              disabled={updating}
              onClick={handleStatusUpdate}
              style={{
                background:
                  newStatus === "COMPLETED" ? "#16a34a" :
                  newStatus === "CANCELLED" ? "#dc2626" :
                  newStatus === "NO_SHOW"   ? "#6b7280" : "#2563eb",
                boxShadow: `0 2px 10px ${
                  newStatus === "COMPLETED" ? "rgba(22,163,74,0.25)" :
                  newStatus === "CANCELLED" ? "rgba(220,38,38,0.25)" : "rgba(37,99,235,0.25)"
                }`,
              }}
            >
              {updating
                ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Updating...</>
                : <><CheckCircle2 size={14} /> Confirm Status Update</>
              }
            </button>
          </div>
        </Modal>

      </DashboardLayout>
    </>
  );
};

export default HospitalAppointments;