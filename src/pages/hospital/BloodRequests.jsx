import { useEffect, useState } from "react";
import {
  Plus, Droplets, Trash2, RefreshCw,
  AlertCircle, Clock, CheckCircle2, XCircle, Filter
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const BLOOD_TYPES = ["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"];
const URGENCY     = ["LOW","MEDIUM","CRITICAL"];

const urgencyVariant = { CRITICAL:"red", MEDIUM:"amber", LOW:"green" };
const statusVariant  = { OPEN:"blue", IN_PROGRESS:"amber", FULFILLED:"green", CANCELLED:"gray" };

const statusIcon = {
  OPEN:        <Clock size={15} color="#2563eb" />,
  IN_PROGRESS: <AlertCircle size={15} color="#d97706" />,
  FULFILLED:   <CheckCircle2 size={15} color="#16a34a" />,
  CANCELLED:   <XCircle size={15} color="#6b7280" />,
};

const Skel = () => (
  <div style={{ height:72, borderRadius:12, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200% 100%", animation:"skelShim 1.4s infinite", marginBottom:8 }} />
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>{label}</label>
    <select
      value={value} onChange={onChange}
      style={{ padding:"11px 12px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", cursor:"pointer", transition:"border-color .15s" }}
      onFocus={e => e.target.style.borderColor="#dc2626"}
      onBlur={e  => e.target.style.borderColor="#e5e7eb"}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [filter,   setFilter]   = useState("ALL");
  const [form,     setForm]     = useState({ bloodType:"A_POS", urgency:"MEDIUM", unitsNeeded:1, notes:"" });
  const [creating, setCreating] = useState(false);
  const [cancelling, setCancelling] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.MY_REQUESTS);
      setRequests(res.data.data || []);
    } catch { toast.error("Failed to load requests"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    if (form.unitsNeeded < 1) { toast.error("Units must be at least 1"); return; }
    setCreating(true);
    try {
      await axiosInstance.post(ENDPOINTS.CREATE_REQUEST, {
        ...form, unitsNeeded: Number(form.unitsNeeded),
      });
      toast.success("Blood request created");
      setModal(false);
      setForm({ bloodType:"A_POS", urgency:"MEDIUM", unitsNeeded:1, notes:"" });
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create request");
    } finally { setCreating(false); }
  };

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await axiosInstance.patch(ENDPOINTS.CANCEL_REQUEST(id));
      toast.success("Request cancelled");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally { setCancelling(null); }
  };

  const filtered = filter === "ALL"
    ? requests
    : requests.filter(r => r.status === filter);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@300;400;500&display=swap');
        @keyframes skelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .br-page  { font-family:'Outfit',sans-serif; }
        .br-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .br-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .br-title span { color:#dc2626; }
        .br-sub    { font-size:12px; color:#9ca3af; margin-top:3px; }
        .br-actions { display:flex; gap:8px; }
        .br-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; font-family:'Outfit',sans-serif; border:none; }
        .br-btn.primary { background:#dc2626; color:#fff; box-shadow:0 2px 8px rgba(220,38,38,0.25); }
        .br-btn.primary:hover { background:#b91c1c; }
        .br-btn.secondary { background:#fff; color:#374151; border:1px solid #e5e7eb; }
        .br-btn.secondary:hover { background:#fef2f2; border-color:#fecaca; color:#dc2626; }

        /* filter tabs */
        .br-tabs { display:flex; gap:4px; background:#f3f4f6; padding:4px; border-radius:10px; margin-bottom:20px; flex-wrap:wrap; animation:fadeUp .34s ease both; }
        .br-tab { padding:7px 14px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; border:none; background:transparent; color:#6b7280; font-family:'Outfit',sans-serif; transition:all .15s; }
        .br-tab.active { background:#fff; color:#dc2626; box-shadow:0 1px 4px rgba(0,0,0,0.08); font-weight:600; }

        /* request card */
        .br-card-wrap { display:flex; flex-direction:column; gap:10px; }
        .br-card {
          display:flex; align-items:center; gap:14px;
          padding:16px 18px; background:#fff;
          border:1px solid #f3f4f6; border-radius:14px;
          transition:all .15s; animation:fadeUp .4s ease both;
        }
        .br-card:hover { border-color:#fecaca; box-shadow:0 2px 12px rgba(220,38,38,0.06); }
        .br-card-icon  { width:44px; height:44px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .br-card-main  { flex:1; min-width:0; }
        .br-card-title { font-size:14px; font-weight:500; color:#111; }
        .br-card-meta  { display:flex; align-items:center; gap:8px; margin-top:4px; flex-wrap:wrap; }
        .br-card-meta-text { font-size:11px; color:#9ca3af; }
        .br-card-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .br-cancel-btn {
          width:30px; height:30px; border-radius:8px;
          border:1px solid #e5e7eb; background:#f9fafb;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .15s; color:#9ca3af;
        }
        .br-cancel-btn:hover { background:#fef2f2; border-color:#fecaca; color:#dc2626; }
        .br-cancel-btn:disabled { opacity:0.4; cursor:not-allowed; }

        /* empty */
        .br-empty { display:flex; flex-direction:column; align-items:center; padding:56px 32px; text-align:center; background:#fff; border:1px dashed #fecaca; border-radius:16px; animation:fadeUp .4s ease both; }
        .br-empty-icon { width:60px; height:60px; border-radius:16px; background:#fee2e2; border:1px solid #fecaca; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }

        /* modal form */
        .br-form { display:flex; flex-direction:column; gap:16px; }
        .br-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
        .br-notes { width:100%; padding:11px 12px; background:#fff; border:1.5px solid #e5e7eb; border-radius:9px; font-size:13px; font-family:'Outfit',sans-serif; color:#111; outline:none; resize:vertical; box-sizing:border-box; }
        .br-notes:focus { border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,0.08); }
        .br-submit { width:100%; padding:12px; background:#dc2626; color:#fff; border:none; border-radius:9px; font-size:13px; font-weight:500; font-family:'Syne',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .15s; box-shadow:0 2px 10px rgba(220,38,38,0.25); }
        .br-submit:hover:not(:disabled) { background:#b91c1c; }
        .br-submit:disabled { opacity:0.6; cursor:not-allowed; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .br-spin { animation:spin .8s linear infinite; }
      `}</style>

      <DashboardLayout>
        <div className="br-page">

          {/* Header */}
          <div className="br-header">
            <div>
              <div className="br-title">Blood <span>Requests</span></div>
              <div className="br-sub">Manage your hospital's blood requests</div>
            </div>
            <div className="br-actions">
              <button className="br-btn secondary" onClick={fetch}>
                <RefreshCw size={13} /> Refresh
              </button>
              <button className="br-btn primary" onClick={() => setModal(true)}>
                <Plus size={13} /> New Request
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="br-tabs">
            {["ALL","OPEN","IN_PROGRESS","FULFILLED","CANCELLED"].map(s => (
              <button
                key={s}
                className={`br-tab ${filter === s ? "active" : ""}`}
                onClick={() => setFilter(s)}
              >
                {s === "ALL" ? "All" : s.replace("_"," ")}
                {s !== "ALL" && (
                  <span style={{ marginLeft:5, fontSize:10, fontWeight:700, padding:"1px 5px", borderRadius:999, background: filter===s ? "#fee2e2" : "#e5e7eb", color: filter===s ? "#dc2626" : "#6b7280" }}>
                    {requests.filter(r => r.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          {loading ? (
            <div>{[0,1,2,3].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="br-empty">
              <div className="br-empty-icon"><Droplets size={26} color="#dc2626" /></div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#111", marginBottom:6 }}>
                {filter === "ALL" ? "No requests yet" : `No ${filter.replace("_"," ")} requests`}
              </div>
              <div style={{ fontSize:13, color:"#9ca3af", marginBottom:20 }}>
                Create a blood request when your hospital needs specific blood types.
              </div>
              <button className="br-btn primary" onClick={() => setModal(true)}>
                <Plus size={13} /> Create First Request
              </button>
            </div>
          ) : (
            <div className="br-card-wrap">
              {filtered.map((req, i) => (
                <div
                  key={req.id}
                  className="br-card"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="br-card-icon" style={{ background:"#fee2e2", border:"1px solid #fecaca" }}>
                    <Droplets size={20} color="#dc2626" />
                  </div>
                  <div className="br-card-main">
                    <div className="br-card-title">
                      {req.bloodType.replace("_"," ")} — {req.unitsNeeded} unit{req.unitsNeeded !== 1 ? "s" : ""} needed
                    </div>
                    <div className="br-card-meta">
                      <span className="br-card-meta-text">
                        Fulfilled: {req.unitsFulfilled}/{req.unitsNeeded}
                      </span>
                      <span style={{ color:"#e5e7eb" }}>·</span>
                      <span className="br-card-meta-text">
                        {new Date(req.requestedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </span>
                      {req.notes && (
                        <>
                          <span style={{ color:"#e5e7eb" }}>·</span>
                          <span className="br-card-meta-text" style={{ maxWidth:200, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                            {req.notes}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="br-card-right">
                    <Badge label={req.urgency}              variant={urgencyVariant[req.urgency] || "gray"} />
                    <Badge label={req.status.replace("_"," ")} variant={statusVariant[req.status]  || "gray"} />
                    {(req.status === "OPEN" || req.status === "IN_PROGRESS") && (
                      <button
                        className="br-cancel-btn"
                        disabled={cancelling === req.id}
                        onClick={() => handleCancel(req.id)}
                        title="Cancel request"
                      >
                        {cancelling === req.id
                          ? <div style={{ width:12, height:12, border:"2px solid #fecaca", borderTop:"2px solid #dc2626", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
                          : <Trash2 size={13} />
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Modal */}
        <Modal isOpen={modal} onClose={() => setModal(false)} title="New Blood Request">
          <div className="br-form">
            <div className="br-form-grid">
              <Select
                label="Blood Type"
                value={form.bloodType}
                onChange={set("bloodType")}
                options={BLOOD_TYPES.map(b => ({ value:b, label: b.replace("_"," ") }))}
              />
              <Select
                label="Urgency Level"
                value={form.urgency}
                onChange={set("urgency")}
                options={URGENCY.map(u => ({ value:u, label: u }))}
              />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>
                Units Needed
              </label>
              <input
                type="number" min={1} value={form.unitsNeeded}
                onChange={set("unitsNeeded")}
                style={{ padding:"11px 12px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", boxSizing:"border-box", width:"100%" }}
                onFocus={e => e.target.style.borderColor="#dc2626"}
                onBlur={e  => e.target.style.borderColor="#e5e7eb"}
              />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>
                Notes (optional)
              </label>
              <textarea
                rows={3} value={form.notes}
                onChange={set("notes")}
                placeholder="Additional information about this request..."
                className="br-notes"
              />
            </div>

            {/* Urgency preview */}
            <div style={{ padding:"12px 14px", borderRadius:10, background: form.urgency === "CRITICAL" ? "#fef2f2" : form.urgency === "MEDIUM" ? "#fffbeb" : "#f0fdf4", border:`1px solid ${form.urgency === "CRITICAL" ? "#fecaca" : form.urgency === "MEDIUM" ? "#fde68a" : "#bbf7d0"}`, display:"flex", alignItems:"center", gap:10 }}>
              <AlertCircle size={16} color={form.urgency === "CRITICAL" ? "#dc2626" : form.urgency === "MEDIUM" ? "#d97706" : "#16a34a"} />
              <span style={{ fontSize:12, color: form.urgency === "CRITICAL" ? "#dc2626" : form.urgency === "MEDIUM" ? "#d97706" : "#16a34a", fontWeight:500 }}>
                {form.urgency === "CRITICAL" ? "Critical — Notify donors immediately" : form.urgency === "MEDIUM" ? "Medium priority request" : "Low priority — standard request"}
              </span>
            </div>

            <button className="br-submit" disabled={creating} onClick={handleCreate}>
              {creating
                ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Creating...</>
                : <><Plus size={14} /> Create Blood Request</>
              }
            </button>
          </div>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default BloodRequests;