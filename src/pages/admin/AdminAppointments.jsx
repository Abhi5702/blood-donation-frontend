import { useEffect, useState } from "react";
import { CalendarCheck, RefreshCw, Clock, CheckCircle2, XCircle, AlertCircle, Droplets } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const statusVariant = { SCHEDULED:"blue", COMPLETED:"green", CANCELLED:"red", NO_SHOW:"gray" };
const statusIcon = {
  SCHEDULED:  <Clock size={16} color="#2563eb" />,
  COMPLETED:  <CheckCircle2 size={16} color="#16a34a" />,
  CANCELLED:  <XCircle size={16} color="#dc2626" />,
  NO_SHOW:    <AlertCircle size={16} color="#6b7280" />,
};

const Skel = () => (
  <div style={{ height:80, borderRadius:12, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200% 100%", animation:"aaSkel 1.4s infinite", marginBottom:8 }} />
);

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [updating,     setUpdating]     = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.ALL_APPOINTMENTS);
      setAppointments(res.data.data || []);
    } catch { toast.error("Failed to load appointments"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await axiosInstance.patch(`${ENDPOINTS.UPDATE_APPT_STATUS(id)}?status=${status}`);
      toast.success(`Marked as ${status.replace("_"," ")}`);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally { setUpdating(null); }
  };

  const filtered = filterStatus === "ALL" ? appointments : appointments.filter(a => a.status === filterStatus);
  const counts = ["SCHEDULED","COMPLETED","CANCELLED","NO_SHOW"].reduce((acc,s) => {
    acc[s] = appointments.filter(a => a.status === s).length; return acc;
  }, {});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@400;500&display=swap');
        @keyframes aaSkel { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .aa-page   { font-family:'Outfit',sans-serif; }
        .aa-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;animation:fadeUp .3s ease both; }
        .aa-title  { font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#111;letter-spacing:-0.02em; }
        .aa-title span { color:#2563eb; }
        .aa-sub    { font-size:12px;color:#9ca3af;margin-top:3px; }
        .aa-refresh { display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;font-family:'Outfit',sans-serif;border:1px solid #e5e7eb;background:#fff;color:#374151; }
        .aa-refresh:hover { background:#eff6ff;border-color:#bfdbfe;color:#2563eb; }
        .aa-chips { display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .32s ease both; }
        .aa-chip  { display:flex;align-items:center;gap:8px;padding:10px 14px;background:#fff;border:1px solid #f3f4f6;border-radius:12px; }
        .aa-chip-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .aa-chip-num { font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#111;line-height:1; }
        .aa-chip-lbl { font-size:11px;color:#9ca3af;margin-top:2px; }
        .aa-tabs { display:flex;gap:4px;background:#f3f4f6;padding:4px;border-radius:10px;margin-bottom:16px;flex-wrap:wrap;animation:fadeUp .34s ease both; }
        .aa-tab  { padding:7px 14px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;border:none;background:transparent;color:#6b7280;font-family:'Outfit',sans-serif;transition:all .15s; }
        .aa-tab.active { background:#fff;color:#2563eb;box-shadow:0 1px 4px rgba(0,0,0,0.08);font-weight:600; }
        .aa-list { display:flex;flex-direction:column;gap:8px; }
        .aa-card { display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:#fff;border:1px solid #f3f4f6;border-radius:12px;transition:all .15s;animation:fadeUp .4s ease both; }
        .aa-card:hover { border-color:#e5e7eb;box-shadow:0 2px 10px rgba(0,0,0,0.05); }
        .aa-card.SCHEDULED { border-left:3px solid #2563eb; }
        .aa-card.COMPLETED { border-left:3px solid #16a34a; }
        .aa-card.CANCELLED { border-left:3px solid #dc2626; }
        .aa-card.NO_SHOW   { border-left:3px solid #9ca3af; }
        .aa-card-icon { width:42px;height:42px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center; }
        .aa-card-main { flex:1;min-width:0; }
        .aa-card-donor { font-size:14px;font-weight:500;color:#111;margin-bottom:4px; }
        .aa-card-meta  { display:flex;flex-wrap:wrap;gap:8px; }
        .aa-card-meta-item { display:flex;align-items:center;gap:4px;font-size:11px;color:#6b7280; }
        .aa-card-right { display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0; }
        .aa-action-btn { display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;border:none;font-size:11px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s;white-space:nowrap; }
        .aa-complete-btn { background:#dcfce7;color:#15803d; }
        .aa-complete-btn:hover { background:#bbf7d0; }
        .aa-noshow-btn { background:#f3f4f6;color:#6b7280; }
        .aa-noshow-btn:hover { background:#e5e7eb; }
        .aa-empty { display:flex;flex-direction:column;align-items:center;padding:56px 32px;text-align:center;background:#fff;border:1px dashed #bfdbfe;border-radius:16px;animation:fadeUp .4s ease both; }
      `}</style>

      <DashboardLayout>
        <div className="aa-page">
          <div className="aa-header">
            <div>
              <div className="aa-title">All <span>Appointments</span></div>
              <div className="aa-sub">View and manage all platform appointments</div>
            </div>
            <button className="aa-refresh" onClick={fetch}><RefreshCw size={13} /> Refresh</button>
          </div>

          {/* Chips */}
          {!loading && (
            <div className="aa-chips">
              {[
                { icon:<Clock size={15} color="#2563eb" />,        bg:"#eff6ff", num:counts.SCHEDULED||0,  lbl:"Scheduled"  },
                { icon:<CheckCircle2 size={15} color="#16a34a" />, bg:"#f0fdf4", num:counts.COMPLETED||0,  lbl:"Completed"  },
                { icon:<AlertCircle size={15} color="#6b7280" />,  bg:"#f3f4f6", num:counts.NO_SHOW||0,    lbl:"No Show"    },
                { icon:<CalendarCheck size={15} color="#dc2626" />,bg:"#fee2e2", num:appointments.length,  lbl:"Total"      },
              ].map(({ icon, bg, num, lbl }) => (
                <div className="aa-chip" key={lbl}>
                  <div className="aa-chip-icon" style={{ background:bg }}>{icon}</div>
                  <div><div className="aa-chip-num">{num}</div><div className="aa-chip-lbl">{lbl}</div></div>
                </div>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          <div className="aa-tabs">
            {["ALL","SCHEDULED","COMPLETED","CANCELLED","NO_SHOW"].map(s => (
              <button key={s} className={`aa-tab ${filterStatus===s?"active":""}`} onClick={() => setFilterStatus(s)}>
                {s === "ALL" ? "All" : s.replace("_"," ")}
                {s !== "ALL" && (
                  <span style={{ marginLeft:5,fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:999,background:filterStatus===s?"#dbeafe":"#e5e7eb",color:filterStatus===s?"#2563eb":"#6b7280" }}>
                    {counts[s]||0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div>{[0,1,2,3].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="aa-empty">
              <CalendarCheck size={28} color="#93c5fd" style={{ marginBottom:12 }} />
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#111",marginBottom:6 }}>
                {filterStatus === "ALL" ? "No appointments yet" : `No ${filterStatus.replace("_"," ")} appointments`}
              </div>
              <div style={{ fontSize:13,color:"#9ca3af" }}>Donor appointments will appear here</div>
            </div>
          ) : (
            <div className="aa-list">
              {filtered.map((appt, i) => (
                <div key={appt.id} className={`aa-card ${appt.status}`} style={{ animationDelay:`${i*30}ms` }}>
                  <div className="aa-card-icon" style={{
                    background: appt.status==="SCHEDULED"?"#eff6ff":appt.status==="COMPLETED"?"#f0fdf4":appt.status==="NO_SHOW"?"#f3f4f6":"#fef2f2",
                    border:`1px solid ${appt.status==="SCHEDULED"?"#bfdbfe":appt.status==="COMPLETED"?"#bbf7d0":appt.status==="NO_SHOW"?"#e5e7eb":"#fecaca"}`
                  }}>
                    {statusIcon[appt.status]}
                  </div>
                  <div className="aa-card-main">
                    <div className="aa-card-donor">{appt.donorName}</div>
                    <div className="aa-card-meta">
                      <div className="aa-card-meta-item"><Droplets size={11} />{appt.donorBloodType?.replace("_"," ")}</div>
                      <div className="aa-card-meta-item">@ {appt.hospitalName}</div>
                      <div className="aa-card-meta-item"><Clock size={11} />
                        {new Date(appt.scheduledAt).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                      </div>
                    </div>
                  </div>
                  <div className="aa-card-right">
                    <Badge label={appt.status.replace("_"," ")} variant={statusVariant[appt.status]} />
                    {appt.status === "SCHEDULED" && (
                      <div style={{ display:"flex", gap:5 }}>
                        <button className="aa-action-btn aa-complete-btn" disabled={updating===appt.id}
                          onClick={() => handleUpdate(appt.id, "COMPLETED")}>
                          {updating===appt.id ? <div style={{ width:10,height:10,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite" }} /> : "✓ Complete"}
                        </button>
                        <button className="aa-action-btn aa-noshow-btn" disabled={updating===appt.id}
                          onClick={() => handleUpdate(appt.id, "NO_SHOW")}>
                          No Show
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminAppointments;