import { useEffect, useState } from "react";
import {
  CalendarCheck, Plus, MapPin, Clock,
  CheckCircle2, XCircle, AlertCircle,
  RefreshCw, Building2, Droplets
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
  SCHEDULED:  <Clock size={16} color="#2563eb" />,
  COMPLETED:  <CheckCircle2 size={16} color="#16a34a" />,
  CANCELLED:  <XCircle size={16} color="#dc2626" />,
  NO_SHOW:    <AlertCircle size={16} color="#6b7280" />,
};

const Skel = () => (
  <div style={{ height:88, borderRadius:14, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200% 100%", animation:"apptSkelShim 1.4s infinite", marginBottom:10 }} />
);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [hospitals,    setHospitals]    = useState([]);
  const [openReqs,     setOpenReqs]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [modal,        setModal]        = useState(false);
  const [cancelling,   setCancelling]   = useState(null);
  const [booking,      setBooking]      = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [form, setForm] = useState({
    hospitalId:"", requestId:"", scheduledAt:"", notes:"",
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, hospRes, reqRes] = await Promise.all([
        axiosInstance.get(ENDPOINTS.MY_APPOINTMENTS),
        axiosInstance.get(ENDPOINTS.ALL_HOSPITALS),
        axiosInstance.get(ENDPOINTS.OPEN_REQUESTS),
      ]);
      setAppointments(apptRes.data.data || []);
      setHospitals(hospRes.data.data    || []);
      setOpenReqs(reqRes.data.data      || []);
    } catch { toast.error("Failed to load appointments"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleBook = async () => {
    if (!form.hospitalId)  { toast.error("Please select a hospital"); return; }
    if (!form.scheduledAt) { toast.error("Please select a date and time"); return; }
    if (new Date(form.scheduledAt) <= new Date()) {
      toast.error("Appointment must be in the future"); return;
    }
    setBooking(true);
    try {
      await axiosInstance.post(ENDPOINTS.BOOK_APPOINTMENT, {
        hospitalId:  Number(form.hospitalId),
        requestId:   form.requestId ? Number(form.requestId) : null,
        scheduledAt: form.scheduledAt,
        notes:       form.notes || null,
      });
      toast.success("Appointment booked successfully");
      setModal(false);
      setForm({ hospitalId:"", requestId:"", scheduledAt:"", notes:"" });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment");
    } finally { setBooking(false); }
  };

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await axiosInstance.patch(ENDPOINTS.CANCEL_APPOINTMENT(id));
      toast.success("Appointment cancelled");
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally { setCancelling(null); }
  };

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const filtered = filterStatus === "ALL"
    ? appointments
    : appointments.filter(a => a.status === filterStatus);

  const upcoming   = appointments.filter(a => a.status === "SCHEDULED").length;
  const completed  = appointments.filter(a => a.status === "COMPLETED").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes apptSkelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes blink        { 0%,100%{opacity:1} 50%{opacity:.4} }

        .appt-page  { font-family:'Outfit',sans-serif; }
        .appt-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .appt-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .appt-title span { color:#2563eb; }
        .appt-sub    { font-size:12px; color:#9ca3af; margin-top:3px; }
        .appt-actions { display:flex; gap:8px; }
        .appt-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; font-family:'Outfit',sans-serif; border:none; }
        .appt-btn.primary   { background:#dc2626; color:#fff; box-shadow:0 2px 8px rgba(220,38,38,0.25); }
        .appt-btn.primary:hover   { background:#b91c1c; }
        .appt-btn.secondary { background:#fff; color:#374151; border:1px solid #e5e7eb; }
        .appt-btn.secondary:hover { background:#fef2f2; border-color:#fecaca; color:#dc2626; }

        /* summary chips */
        .appt-chips { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; animation:fadeUp .34s ease both; }
        .appt-chip { display:flex; align-items:center; gap:10px; padding:12px 16px; background:#fff; border:1px solid #f3f4f6; border-radius:12px; }
        .appt-chip-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .appt-chip-num  { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#111; line-height:1; }
        .appt-chip-lbl  { font-size:11px; color:#9ca3af; margin-top:2px; }

        /* filter tabs */
        .appt-tabs { display:flex; gap:4px; background:#f3f4f6; padding:4px; border-radius:10px; margin-bottom:20px; flex-wrap:wrap; animation:fadeUp .36s ease both; }
        .appt-tab  { padding:7px 14px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; border:none; background:transparent; color:#6b7280; font-family:'Outfit',sans-serif; transition:all .15s; }
        .appt-tab.active { background:#fff; color:#dc2626; box-shadow:0 1px 4px rgba(0,0,0,0.08); font-weight:600; }

        /* appointment cards */
        .appt-list { display:flex; flex-direction:column; gap:10px; }
        .appt-card {
          display:flex; align-items:flex-start; gap:14px;
          padding:18px 20px; background:#fff;
          border:1px solid #f3f4f6; border-radius:14px;
          transition:all .15s; animation:fadeUp .4s ease both;
          position:relative;
        }
        .appt-card:hover { border-color:#e5e7eb; box-shadow:0 2px 12px rgba(0,0,0,0.05); }
        .appt-card.SCHEDULED { border-left:3px solid #2563eb; }
        .appt-card.COMPLETED { border-left:3px solid #16a34a; }
        .appt-card.CANCELLED { border-left:3px solid #dc2626; }
        .appt-card.NO_SHOW   { border-left:3px solid #9ca3af; }
        .appt-card-icon { width:44px; height:44px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; margin-top:2px; }
        .appt-card-main { flex:1; min-width:0; }
        .appt-card-hospital { font-size:14px; font-weight:500; color:#111; margin-bottom:5px; }
        .appt-card-meta { display:flex; flex-wrap:wrap; gap:10px; }
        .appt-card-meta-item { display:flex; align-items:center; gap:5px; font-size:12px; color:#6b7280; }
        .appt-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
        .appt-cancel-btn {
          display:flex; align-items:center; gap:5px;
          padding:6px 12px; border-radius:8px; border:1px solid #fecaca;
          background:#fef2f2; color:#dc2626; font-size:11px; font-weight:500;
          cursor:pointer; font-family:'Outfit',sans-serif; transition:all .15s;
        }
        .appt-cancel-btn:hover   { background:#fee2e2; }
        .appt-cancel-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .appt-notes { font-size:11px; color:#9ca3af; margin-top:6px; font-style:italic; }

        /* empty */
        .appt-empty { display:flex; flex-direction:column; align-items:center; padding:56px 32px; text-align:center; background:#fff; border:1px dashed #bfdbfe; border-radius:16px; animation:fadeUp .4s ease both; }
        .appt-empty-icon { width:60px; height:60px; border-radius:16px; background:#eff6ff; border:1px solid #bfdbfe; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }

        /* modal form */
        .appt-form { display:flex; flex-direction:column; gap:16px; }
        .appt-select {
          width:100%; padding:11px 12px; background:#fff; border:1.5px solid #e5e7eb;
          border-radius:9px; font-size:13px; font-family:'Outfit',sans-serif;
          color:#111; outline:none; cursor:pointer; box-sizing:border-box;
          appearance:none; transition:border-color .15s;
        }
        .appt-select:focus { border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,0.08); }
        .appt-input {
          width:100%; padding:11px 12px; background:#fff; border:1.5px solid #e5e7eb;
          border-radius:9px; font-size:13px; font-family:'Outfit',sans-serif;
          color:#111; outline:none; box-sizing:border-box; transition:border-color .15s;
        }
        .appt-input:focus { border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,0.08); }
        .appt-label { font-size:10px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:#374151; margin-bottom:6px; display:block; }
        .appt-submit { width:100%; padding:12px; background:#dc2626; color:#fff; border:none; border-radius:9px; font-size:13px; font-weight:500; font-family:'Syne',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .15s; box-shadow:0 2px 10px rgba(220,38,38,0.25); }
        .appt-submit:hover:not(:disabled) { background:#b91c1c; }
        .appt-submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>

      <DashboardLayout>
        <div className="appt-page">

          {/* Header */}
          <div className="appt-header">
            <div>
              <div className="appt-title">My <span>Appointments</span></div>
              <div className="appt-sub">Track and manage your donation appointments</div>
            </div>
            <div className="appt-actions">
              <button className="appt-btn secondary" onClick={fetchAll}>
                <RefreshCw size={13} /> Refresh
              </button>
              <button className="appt-btn primary" onClick={() => setModal(true)}>
                <Plus size={13} /> Book Appointment
              </button>
            </div>
          </div>

          {/* Summary chips */}
          {!loading && (
            <div className="appt-chips">
              {[
                { icon:<CalendarCheck size={16} color="#2563eb" />,  bg:"#eff6ff", num: upcoming,             lbl:"Upcoming"   },
                { icon:<CheckCircle2  size={16} color="#16a34a" />,  bg:"#f0fdf4", num: completed,            lbl:"Completed"  },
                { icon:<CalendarCheck size={16} color="#dc2626" />,  bg:"#fee2e2", num: appointments.length,  lbl:"Total"      },
              ].map(({ icon, bg, num, lbl }) => (
                <div className="appt-chip" key={lbl}>
                  <div className="appt-chip-icon" style={{ background:bg }}>{icon}</div>
                  <div>
                    <div className="appt-chip-num">{num}</div>
                    <div className="appt-chip-lbl">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="appt-tabs">
            {["ALL","SCHEDULED","COMPLETED","CANCELLED","NO_SHOW"].map(s => (
              <button
                key={s}
                className={`appt-tab ${filterStatus === s ? "active" : ""}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === "ALL" ? "All" : s.replace("_"," ")}
                {s !== "ALL" && (
                  <span style={{ marginLeft:5, fontSize:10, fontWeight:700, padding:"1px 5px", borderRadius:999, background: filterStatus===s ? "#fee2e2" : "#e5e7eb", color: filterStatus===s ? "#dc2626" : "#6b7280" }}>
                    {appointments.filter(a => a.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div>{[0,1,2].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="appt-empty">
              <div className="appt-empty-icon"><CalendarCheck size={26} color="#2563eb" /></div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#111", marginBottom:6 }}>
                {filterStatus === "ALL" ? "No appointments yet" : `No ${filterStatus.replace("_"," ")} appointments`}
              </div>
              <div style={{ fontSize:13, color:"#9ca3af", marginBottom:20 }}>
                Book an appointment at a hospital to start donating blood.
              </div>
              <button className="appt-btn primary" onClick={() => setModal(true)}>
                <Plus size={13} /> Book First Appointment
              </button>
            </div>
          ) : (
            <div className="appt-list">
              {filtered.map((appt, i) => (
                <div
                  key={appt.id}
                  className={`appt-card ${appt.status}`}
                  style={{ animationDelay:`${i*40}ms` }}
                >
                  <div
                    className="appt-card-icon"
                    style={{
                      background: appt.status === "SCHEDULED" ? "#eff6ff" : appt.status === "COMPLETED" ? "#f0fdf4" : "#fef2f2",
                      border:`1px solid ${appt.status === "SCHEDULED" ? "#bfdbfe" : appt.status === "COMPLETED" ? "#bbf7d0" : "#fecaca"}`,
                    }}
                  >
                    {statusIcon[appt.status]}
                  </div>

                  <div className="appt-card-main">
                    <div className="appt-card-hospital">{appt.hospitalName}</div>
                    <div className="appt-card-meta">
                      <div className="appt-card-meta-item">
                        <Clock size={12} />
                        {new Date(appt.scheduledAt).toLocaleDateString("en-IN", {
                          weekday:"short", day:"numeric", month:"short",
                          year:"numeric", hour:"2-digit", minute:"2-digit",
                        })}
                      </div>
                      {appt.donorBloodType && (
                        <div className="appt-card-meta-item">
                          <Droplets size={12} />
                          {appt.donorBloodType.replace("_"," ")}
                        </div>
                      )}
                      {appt.requestId && (
                        <div className="appt-card-meta-item">
                          <AlertCircle size={12} />
                          Linked to request #{appt.requestId}
                        </div>
                      )}
                    </div>
                    {appt.notes && (
                      <div className="appt-notes">"{appt.notes}"</div>
                    )}
                  </div>

                  <div className="appt-card-right">
                    <Badge label={appt.status.replace("_"," ")} variant={statusVariant[appt.status]} />
                    {appt.status === "SCHEDULED" && (
                      <button
                        className="appt-cancel-btn"
                        disabled={cancelling === appt.id}
                        onClick={() => handleCancel(appt.id)}
                      >
                        {cancelling === appt.id
                          ? <div style={{ width:10, height:10, border:"2px solid #fecaca", borderTop:"2px solid #dc2626", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
                          : <><XCircle size={11} /> Cancel</>
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Book Modal */}
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Book Appointment">
          <div className="appt-form">

            {/* Hospital select */}
            <div>
              <span className="appt-label">Select Hospital</span>
              <select className="appt-select" value={form.hospitalId} onChange={set("hospitalId")}>
                <option value="">— Choose a hospital —</option>
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.hospitalName} — {h.city}</option>
                ))}
              </select>
            </div>

            {/* Date + time */}
            <div>
              <span className="appt-label">Date & Time</span>
              <input
                type="datetime-local" className="appt-input"
                value={form.scheduledAt} onChange={set("scheduledAt")}
                min={new Date(Date.now() + 60*60*1000).toISOString().slice(0,16)}
              />
            </div>

            {/* Link to blood request (optional) */}
            <div>
              <span className="appt-label">Link to Blood Request (optional)</span>
              <select className="appt-select" value={form.requestId} onChange={set("requestId")}>
                <option value="">— Walk-in donation (no request) —</option>
                {openReqs.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.bloodType.replace("_"," ")} · {r.hospitalName} · {r.urgency}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <span className="appt-label">Notes (optional)</span>
              <textarea
                rows={2} value={form.notes} onChange={set("notes")}
                placeholder="Any additional notes..."
                className="appt-input" style={{ resize:"vertical" }}
              />
            </div>

            {/* Info box */}
            <div style={{ padding:"12px 14px", borderRadius:10, background:"#eff6ff", border:"1px solid #bfdbfe", display:"flex", alignItems:"center", gap:10 }}>
              <Building2 size={16} color="#2563eb" />
              <span style={{ fontSize:12, color:"#2563eb" }}>
                The hospital will confirm your appointment. Please arrive 10 minutes early.
              </span>
            </div>

            <button className="appt-submit" disabled={booking} onClick={handleBook}>
              {booking
                ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Booking...</>
                : <><CalendarCheck size={14} /> Confirm Appointment</>
              }
            </button>
          </div>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default Appointments;