import { useEffect, useState } from "react";
import {
  Droplets, Search, RefreshCw,
  MapPin, AlertCircle, Clock,
  CalendarCheck, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const BLOOD_TYPES = ["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"];

const urgencyVariant = { CRITICAL:"red", MEDIUM:"amber", LOW:"green" };

const urgencyIcon = {
  CRITICAL: <AlertCircle size={14} color="#dc2626" />,
  MEDIUM:   <Clock       size={14} color="#d97706" />,
  LOW:      <Clock       size={14} color="#16a34a" />,
};

const Skel = () => (
  <div style={{
    height:88, borderRadius:14,
    background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
    backgroundSize:"200% 100%", animation:"drSkelShim 1.4s infinite", marginBottom:10,
  }} />
);

const DonorBloodRequests = () => {
  const navigate = useNavigate();
  const [requests,    setRequests]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [bloodFilter, setBloodFilter] = useState("ALL");
  const [urgFilter,   setUrgFilter]   = useState("ALL");
  const [search,      setSearch]      = useState("");

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.OPEN_REQUESTS);
      setRequests(res.data.data || []);
    } catch { toast.error("Failed to load requests"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = requests.filter(r => {
    const matchBlood = bloodFilter === "ALL" || r.bloodType === bloodFilter;
    const matchUrg   = urgFilter   === "ALL" || r.urgency   === urgFilter;
    const matchSearch = !search.trim() ||
      r.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
      r.hospitalCity.toLowerCase().includes(search.toLowerCase());
    return matchBlood && matchUrg && matchSearch;
  });

  const critical = requests.filter(r => r.urgency === "CRITICAL").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes drSkelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp     { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }

        .dbr-page   { font-family:'Outfit',sans-serif; }
        .dbr-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .dbr-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .dbr-title span { color:#dc2626; }
        .dbr-sub    { font-size:12px; color:#9ca3af; margin-top:3px; }
        .dbr-refresh { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; font-family:'Outfit',sans-serif; border:none; background:#fff; color:#374151; border:1px solid #e5e7eb; }
        .dbr-refresh:hover { background:#fef2f2; border-color:#fecaca; color:#dc2626; }

        /* critical banner */
        .dbr-banner { display:flex; align-items:center; gap:12px; padding:14px 18px; background:#fef2f2; border:1px solid #fecaca; border-radius:12px; margin-bottom:20px; animation:fadeUp .32s ease both; }
        .dbr-banner-text { font-size:13px; font-weight:500; color:#dc2626; }
        .dbr-banner-sub  { font-size:11px; color:#9ca3af; margin-top:2px; }

        /* toolbar */
        .dbr-toolbar { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px; animation:fadeUp .34s ease both; }
        .dbr-search  { flex:1; min-width:200px; position:relative; }
        .dbr-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; pointer-events:none; }
        .dbr-search input { width:100%; padding:10px 12px 10px 38px; background:#fff; border:1px solid #e5e7eb; border-radius:10px; font-size:13px; font-family:'Outfit',sans-serif; color:#111; outline:none; transition:all .15s; box-sizing:border-box; }
        .dbr-search input::placeholder { color:#9ca3af; }
        .dbr-search input:focus { border-color:#dc2626; box-shadow:0 0 0 3px rgba(220,38,38,0.08); }

        /* filters */
        .dbr-filters { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; animation:fadeUp .36s ease both; }
        .dbr-filter-group { display:flex; gap:4px; background:#f3f4f6; padding:4px; border-radius:10px; flex-wrap:wrap; }
        .dbr-filter-label { font-size:10px; font-weight:500; letter-spacing:0.1em; text-transform:uppercase; color:#9ca3af; display:flex; align-items:center; padding:0 4px; }
        .dbr-filter-btn { padding:6px 12px; border-radius:7px; font-size:11px; font-weight:500; cursor:pointer; border:none; background:transparent; color:#6b7280; font-family:'Outfit',sans-serif; transition:all .15s; }
        .dbr-filter-btn.active { background:#fff; color:#dc2626; box-shadow:0 1px 4px rgba(0,0,0,0.08); font-weight:600; }

        /* request card */
        .dbr-list { display:flex; flex-direction:column; gap:10px; }
        .dbr-card {
          display:flex; align-items:flex-start; gap:14px;
          padding:18px 20px; background:#fff;
          border:1px solid #f3f4f6; border-radius:14px;
          transition:all .15s; animation:fadeUp .4s ease both;
        }
        .dbr-card:hover { border-color:#fecaca; box-shadow:0 2px 12px rgba(220,38,38,0.06); }
        .dbr-card.CRITICAL { border-left:3px solid #dc2626; }
        .dbr-card.MEDIUM   { border-left:3px solid #d97706; }
        .dbr-card.LOW      { border-left:3px solid #16a34a; }
        .dbr-card-icon { width:46px; height:46px; border-radius:12px; flex-shrink:0; background:#fee2e2; border:1px solid #fecaca; display:flex; align-items:center; justify-content:center; }
        .dbr-card-main { flex:1; min-width:0; }
        .dbr-card-hospital { font-size:14px; font-weight:500; color:#111; margin-bottom:5px; }
        .dbr-card-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .dbr-card-meta-item { display:flex; align-items:center; gap:4px; font-size:12px; color:#6b7280; }
        .dbr-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
        .dbr-book-btn {
          display:flex; align-items:center; gap:6px;
          padding:8px 16px; background:#dc2626; color:#fff;
          border:none; border-radius:9px; font-size:12px;
          font-weight:500; cursor:pointer;
          font-family:'Outfit',sans-serif; transition:all .15s;
          box-shadow:0 2px 8px rgba(220,38,38,0.2);
          white-space:nowrap;
        }
        .dbr-book-btn:hover { background:#b91c1c; transform:translateY(-1px); }
        .dbr-notes { font-size:11px; color:#9ca3af; margin-top:6px; font-style:italic; }

        /* blood type grid */
        .dbr-blood-grid { display:flex; gap:4px; flex-wrap:wrap; margin-bottom:16px; }
        .dbr-blood-btn { padding:6px 10px; border-radius:8px; border:1px solid #e5e7eb; background:#fff; font-size:12px; font-weight:500; color:#6b7280; cursor:pointer; transition:all .15s; font-family:'Outfit',sans-serif; }
        .dbr-blood-btn:hover   { border-color:#fca5a5; color:#dc2626; }
        .dbr-blood-btn.active  { border-color:#dc2626; background:#fee2e2; color:#dc2626; font-weight:600; }

        .dbr-empty { display:flex; flex-direction:column; align-items:center; padding:56px 32px; text-align:center; background:#fff; border:1px dashed #fecaca; border-radius:16px; animation:fadeUp .4s ease both; }
        .dbr-result-count { font-size:12px; color:#9ca3af; margin-bottom:12px; }
      `}</style>

      <DashboardLayout>
        <div className="dbr-page">

          {/* Header */}
          <div className="dbr-header">
            <div>
              <div className="dbr-title">Blood <span>Requests</span></div>
              <div className="dbr-sub">Open requests that need donors like you</div>
            </div>
            <button className="dbr-refresh" onClick={fetch}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Critical banner */}
          {!loading && critical > 0 && (
            <div className="dbr-banner">
              <AlertCircle size={18} color="#dc2626" />
              <div>
                <div className="dbr-banner-text">
                  {critical} critical request{critical > 1 ? "s" : ""} need urgent donors
                </div>
                <div className="dbr-banner-sub">
                  These patients need blood immediately — your donation can save a life today
                </div>
              </div>
              <button
                onClick={() => setUrgFilter("CRITICAL")}
                style={{ marginLeft:"auto", flexShrink:0, padding:"7px 14px", background:"#dc2626", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}
              >
                View Critical →
              </button>
            </div>
          )}

          {/* Search */}
          <div className="dbr-toolbar">
            <div className="dbr-search">
              <Search size={15} className="dbr-search-icon" />
              <input
                placeholder="Search by hospital or city…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Blood type filter */}
          <div className="dbr-blood-grid">
            <button
              className={`dbr-blood-btn ${bloodFilter === "ALL" ? "active" : ""}`}
              onClick={() => setBloodFilter("ALL")}
            >
              All Types
            </button>
            {BLOOD_TYPES.map(bt => (
              <button
                key={bt}
                className={`dbr-blood-btn ${bloodFilter === bt ? "active" : ""}`}
                onClick={() => setBloodFilter(bt)}
              >
                {bt.replace("_"," ")}
              </button>
            ))}
          </div>

          {/* Urgency filter */}
          <div className="dbr-filters">
            <div className="dbr-filter-group">
              <span className="dbr-filter-label"><Filter size={11} /></span>
              {["ALL","CRITICAL","MEDIUM","LOW"].map(u => (
                <button
                  key={u}
                  className={`dbr-filter-btn ${urgFilter === u ? "active" : ""}`}
                  onClick={() => setUrgFilter(u)}
                >
                  {u === "ALL" ? "All Urgency" : u}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          {!loading && (
            <div className="dbr-result-count">
              Showing {filtered.length} of {requests.length} open requests
            </div>
          )}

          {/* List */}
          {loading ? (
            <div>{[0,1,2,3].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="dbr-empty">
              <Droplets size={28} color="#fca5a5" style={{ marginBottom:12 }} />
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#111", marginBottom:6 }}>
                No requests found
              </div>
              <div style={{ fontSize:13, color:"#9ca3af" }}>
                {search ? `No results for "${search}"` : "No open requests match your filters"}
              </div>
              {(bloodFilter !== "ALL" || urgFilter !== "ALL" || search) && (
                <button
                  onClick={() => { setBloodFilter("ALL"); setUrgFilter("ALL"); setSearch(""); }}
                  style={{ marginTop:16, padding:"7px 16px", background:"#dc2626", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"'Outfit',sans-serif" }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="dbr-list">
              {filtered.map((req, i) => (
                <div
                  key={req.id}
                  className={`dbr-card ${req.urgency}`}
                  style={{ animationDelay:`${i*40}ms` }}
                >
                  <div className="dbr-card-icon">
                    <Droplets size={22} color="#dc2626" />
                  </div>

                  <div className="dbr-card-main">
                    <div className="dbr-card-hospital">{req.hospitalName}</div>
                    <div className="dbr-card-meta">
                      <div className="dbr-card-meta-item">
                        <MapPin size={12} /> {req.hospitalCity}
                      </div>
                      <div className="dbr-card-meta-item">
                        <Droplets size={12} /> {req.bloodType.replace("_"," ")}
                      </div>
                      <div className="dbr-card-meta-item">
                        {urgencyIcon[req.urgency]}
                        {req.unitsNeeded} unit{req.unitsNeeded !== 1 ? "s" : ""} needed
                      </div>
                      <div className="dbr-card-meta-item">
                        <Clock size={12} />
                        {new Date(req.requestedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </div>
                    </div>
                    {req.notes && (
                      <div className="dbr-notes">"{req.notes}"</div>
                    )}
                  </div>

                  <div className="dbr-card-right">
                    <Badge label={req.urgency}  variant={urgencyVariant[req.urgency]} />
                    <Badge label={req.bloodType.replace("_"," ")} variant="red" />
                    <button
                      className="dbr-book-btn"
                      onClick={() => navigate("/donor/appointments")}
                    >
                      <CalendarCheck size={13} /> Donate
                    </button>
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

export default DonorBloodRequests;