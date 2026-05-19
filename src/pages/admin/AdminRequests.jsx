import { useEffect, useState } from "react";
import { Droplets, RefreshCw, MapPin, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const urgencyVariant = { CRITICAL:"red", MEDIUM:"amber", LOW:"green" };
const statusVariant  = { OPEN:"blue", IN_PROGRESS:"amber", FULFILLED:"green", CANCELLED:"gray" };

const Skel = () => (
  <div style={{ height:80, borderRadius:12, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200% 100%", animation:"arSkel 1.4s infinite", marginBottom:8 }} />
);

const AdminRequests = () => {
  const [requests,    setRequests]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [statusFilter,setStatusFilter]= useState("OPEN");
  const [urgFilter,   setUrgFilter]   = useState("ALL");
  const [updating,    setUpdating]    = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.OPEN_REQUESTS);
      setRequests(res.data.data || []);
    } catch { toast.error("Failed to load requests"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(id);
    try {
      await axiosInstance.patch(`${ENDPOINTS.UPDATE_REQ_STATUS(id)}?status=${newStatus}`);
      toast.success(`Request marked as ${newStatus.replace("_"," ")}`);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally { setUpdating(null); }
  };

  const filtered = requests.filter(r => {
    const matchUrg = urgFilter === "ALL" || r.urgency === urgFilter;
    return matchUrg;
  });

  const counts = {
    CRITICAL: requests.filter(r => r.urgency === "CRITICAL").length,
    MEDIUM:   requests.filter(r => r.urgency === "MEDIUM").length,
    LOW:      requests.filter(r => r.urgency === "LOW").length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@400;500&display=swap');
        @keyframes arSkel { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .ar-page   { font-family:'Outfit',sans-serif; }
        .ar-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;animation:fadeUp .3s ease both; }
        .ar-title  { font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#111;letter-spacing:-0.02em; }
        .ar-title span { color:#dc2626; }
        .ar-sub    { font-size:12px;color:#9ca3af;margin-top:3px; }
        .ar-refresh { display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;font-family:'Outfit',sans-serif;border:1px solid #e5e7eb;background:#fff;color:#374151; }
        .ar-refresh:hover { background:#fef2f2;border-color:#fecaca;color:#dc2626; }
        .ar-chips { display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .32s ease both; }
        .ar-chip  { display:flex;align-items:center;gap:8px;padding:10px 14px;background:#fff;border:1px solid #f3f4f6;border-radius:12px; }
        .ar-chip-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ar-chip-num { font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#111;line-height:1; }
        .ar-chip-lbl { font-size:11px;color:#9ca3af;margin-top:2px; }
        .ar-tabs { display:flex;gap:4px;background:#f3f4f6;padding:4px;border-radius:10px;margin-bottom:16px;flex-wrap:wrap;animation:fadeUp .34s ease both; }
        .ar-tab  { padding:7px 14px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;border:none;background:transparent;color:#6b7280;font-family:'Outfit',sans-serif;transition:all .15s; }
        .ar-tab.active { background:#fff;color:#dc2626;box-shadow:0 1px 4px rgba(0,0,0,0.08);font-weight:600; }
        .ar-list { display:flex;flex-direction:column;gap:8px; }
        .ar-card { display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:#fff;border:1px solid #f3f4f6;border-radius:12px;transition:all .15s;animation:fadeUp .4s ease both; }
        .ar-card:hover { border-color:#fecaca;box-shadow:0 2px 10px rgba(220,38,38,0.05); }
        .ar-card.CRITICAL { border-left:3px solid #dc2626; }
        .ar-card.MEDIUM   { border-left:3px solid #d97706; }
        .ar-card.LOW      { border-left:3px solid #16a34a; }
        .ar-card-icon { width:42px;height:42px;border-radius:11px;flex-shrink:0;background:#fee2e2;border:1px solid #fecaca;display:flex;align-items:center;justify-content:center; }
        .ar-card-main { flex:1;min-width:0; }
        .ar-card-title { font-size:14px;font-weight:500;color:#111;margin-bottom:5px; }
        .ar-card-meta  { display:flex;flex-wrap:wrap;gap:8px; }
        .ar-card-meta-item { display:flex;align-items:center;gap:4px;font-size:11px;color:#6b7280; }
        .ar-card-right { display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0; }
        .ar-action-btn { display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;border:none;font-size:11px;font-weight:500;cursor:pointer;font-family:'Outfit',sans-serif;transition:all .15s;white-space:nowrap; }
        .ar-fulfill-btn { background:#dcfce7;color:#15803d; }
        .ar-fulfill-btn:hover { background:#bbf7d0; }
        .ar-progress-btn { background:#fef3c7;color:#b45309; }
        .ar-progress-btn:hover { background:#fde68a; }
        .ar-empty { display:flex;flex-direction:column;align-items:center;padding:56px 32px;text-align:center;background:#fff;border:1px dashed #fecaca;border-radius:16px;animation:fadeUp .4s ease both; }
      `}</style>

      <DashboardLayout>
        <div className="ar-page">
          <div className="ar-header">
            <div>
              <div className="ar-title">Blood <span>Requests</span></div>
              <div className="ar-sub">Monitor and update all open blood requests</div>
            </div>
            <button className="ar-refresh" onClick={fetch}><RefreshCw size={13} /> Refresh</button>
          </div>

          {/* Chips */}
          {!loading && (
            <div className="ar-chips">
              {[
                { icon:<AlertCircle size={15} color="#dc2626" />, bg:"#fee2e2", num:counts.CRITICAL, lbl:"Critical" },
                { icon:<AlertCircle size={15} color="#d97706" />, bg:"#fef3c7", num:counts.MEDIUM,   lbl:"Medium"   },
                { icon:<CheckCircle2 size={15} color="#16a34a" />,bg:"#f0fdf4", num:counts.LOW,      lbl:"Low"      },
                { icon:<Droplets size={15} color="#2563eb" />,    bg:"#eff6ff", num:requests.length, lbl:"Total Open"},
              ].map(({ icon, bg, num, lbl }) => (
                <div className="ar-chip" key={lbl}>
                  <div className="ar-chip-icon" style={{ background:bg }}>{icon}</div>
                  <div><div className="ar-chip-num">{num}</div><div className="ar-chip-lbl">{lbl}</div></div>
                </div>
              ))}
            </div>
          )}

          {/* Urgency filter */}
          <div className="ar-tabs">
            {["ALL","CRITICAL","MEDIUM","LOW"].map(u => (
              <button key={u} className={`ar-tab ${urgFilter===u?"active":""}`} onClick={() => setUrgFilter(u)}>
                {u === "ALL" ? "All Urgency" : u}
                {u !== "ALL" && (
                  <span style={{ marginLeft:5,fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:999,background:urgFilter===u?"#fee2e2":"#e5e7eb",color:urgFilter===u?"#dc2626":"#6b7280" }}>
                    {counts[u] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div>{[0,1,2,3].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="ar-empty">
              <Droplets size={28} color="#fca5a5" style={{ marginBottom:12 }} />
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#111",marginBottom:6 }}>No open requests</div>
              <div style={{ fontSize:13,color:"#9ca3af" }}>All blood requests have been fulfilled or cancelled</div>
            </div>
          ) : (
            <div className="ar-list">
              {filtered.map((req, i) => (
                <div key={req.id} className={`ar-card ${req.urgency}`} style={{ animationDelay:`${i*30}ms` }}>
                  <div className="ar-card-icon"><Droplets size={20} color="#dc2626" /></div>
                  <div className="ar-card-main">
                    <div className="ar-card-title">{req.hospitalName} — {req.bloodType.replace("_"," ")}</div>
                    <div className="ar-card-meta">
                      <div className="ar-card-meta-item"><MapPin size={11} />{req.hospitalCity}</div>
                      <div className="ar-card-meta-item"><Droplets size={11} />{req.unitsNeeded} units needed</div>
                      <div className="ar-card-meta-item"><Clock size={11} />
                        {new Date(req.requestedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </div>
                      {req.notes && <div className="ar-card-meta-item" style={{ fontStyle:"italic" }}>"{req.notes}"</div>}
                    </div>
                  </div>
                  <div className="ar-card-right">
                    <Badge label={req.urgency} variant={urgencyVariant[req.urgency]} />
                    <Badge label={req.status.replace("_"," ")} variant={statusVariant[req.status]} />
                    <div style={{ display:"flex", gap:5 }}>
                      {req.status === "OPEN" && (
                        <button className="ar-action-btn ar-progress-btn" disabled={updating===req.id}
                          onClick={() => handleStatusUpdate(req.id, "IN_PROGRESS")}>
                          {updating===req.id ? <div style={{ width:10,height:10,border:"2px solid currentColor",borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite" }} /> : "→ In Progress"}
                        </button>
                      )}
                      {(req.status === "OPEN" || req.status === "IN_PROGRESS") && (
                        <button className="ar-action-btn ar-fulfill-btn" disabled={updating===req.id}
                          onClick={() => handleStatusUpdate(req.id, "FULFILLED")}>
                          ✓ Fulfill
                        </button>
                      )}
                    </div>
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

export default AdminRequests;