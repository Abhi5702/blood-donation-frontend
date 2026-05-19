import { useEffect, useState } from "react";
import { Search, Droplets, MapPin, RefreshCw, Phone } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const BLOOD_TYPES = ["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"];

const Skel = () => (
  <div style={{ height:72, borderRadius:12, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200% 100%", animation:"adSkel 1.4s infinite", marginBottom:8 }} />
);

const AdminDonors = () => {
  const [donors,      setDonors]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [bloodFilter, setBloodFilter] = useState("ALL");
  const [availFilter, setAvailFilter] = useState("ALL");

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.ALL_DONORS);
      setDonors(res.data.data || []);
    } catch { toast.error("Failed to load donors"); }
    finally  { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const filtered = donors.filter(d => {
    const matchSearch = !search.trim() ||
      d.fullName.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase());
    const matchBlood = bloodFilter === "ALL" || d.bloodType === bloodFilter;
    const matchAvail = availFilter === "ALL" ||
      (availFilter === "AVAILABLE" && d.isAvailable) ||
      (availFilter === "UNAVAILABLE" && !d.isAvailable);
    return matchSearch && matchBlood && matchAvail;
  });

  const availCount   = donors.filter(d => d.isAvailable).length;
  const unavailCount = donors.filter(d => !d.isAvailable).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@400;500&display=swap');
        @keyframes adSkel  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .ad-page   { font-family:'Outfit',sans-serif; }
        .ad-header { display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;animation:fadeUp .3s ease both; }
        .ad-title  { font-family:'Syne',sans-serif;font-size:22px;font-weight:700;color:#111;letter-spacing:-0.02em; }
        .ad-title span { color:#2563eb; }
        .ad-sub    { font-size:12px;color:#9ca3af;margin-top:3px; }
        .ad-refresh { display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;font-family:'Outfit',sans-serif;border:1px solid #e5e7eb;background:#fff;color:#374151; }
        .ad-refresh:hover { background:#eff6ff;border-color:#bfdbfe;color:#2563eb; }
        .ad-chips { display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;animation:fadeUp .32s ease both; }
        .ad-chip  { display:flex;align-items:center;gap:8px;padding:10px 14px;background:#fff;border:1px solid #f3f4f6;border-radius:12px; }
        .ad-chip-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .ad-chip-num { font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#111;line-height:1; }
        .ad-chip-lbl { font-size:11px;color:#9ca3af;margin-top:2px; }
        .ad-toolbar { display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;animation:fadeUp .34s ease both; }
        .ad-search  { flex:1;min-width:200px;position:relative; }
        .ad-search-icon { position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none; }
        .ad-search input { width:100%;padding:10px 12px 10px 38px;background:#fff;border:1px solid #e5e7eb;border-radius:10px;font-size:13px;font-family:'Outfit',sans-serif;color:#111;outline:none;transition:all .15s;box-sizing:border-box; }
        .ad-search input::placeholder { color:#9ca3af; }
        .ad-search input:focus { border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .ad-tabs { display:flex;gap:4px;background:#f3f4f6;padding:4px;border-radius:10px;flex-wrap:wrap; }
        .ad-tab  { padding:6px 12px;border-radius:7px;font-size:11px;font-weight:500;cursor:pointer;border:none;background:transparent;color:#6b7280;font-family:'Outfit',sans-serif;transition:all .15s; }
        .ad-tab.active { background:#fff;color:#2563eb;box-shadow:0 1px 4px rgba(0,0,0,0.08);font-weight:600; }
        .ad-blood-grid { display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px; }
        .ad-blood-btn { padding:6px 10px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;font-size:11px;font-weight:500;color:#6b7280;cursor:pointer;transition:all .15s;font-family:'Outfit',sans-serif; }
        .ad-blood-btn:hover  { border-color:#bfdbfe;color:#2563eb; }
        .ad-blood-btn.active { border-color:#2563eb;background:#eff6ff;color:#2563eb;font-weight:600; }
        .ad-list { display:flex;flex-direction:column;gap:8px; }
        .ad-card { display:flex;align-items:center;gap:14px;padding:14px 18px;background:#fff;border:1px solid #f3f4f6;border-radius:12px;transition:all .15s;animation:fadeUp .4s ease both; }
        .ad-card:hover { border-color:#bfdbfe;box-shadow:0 2px 10px rgba(37,99,235,0.05); }
        .ad-avatar { width:42px;height:42px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#fff;overflow:hidden; }
        .ad-avatar img { width:100%;height:100%;object-fit:cover; }
        .ad-info { flex:1;min-width:0; }
        .ad-name  { font-size:13px;font-weight:500;color:#111; }
        .ad-meta  { display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:3px; }
        .ad-meta-item { display:flex;align-items:center;gap:4px;font-size:11px;color:#6b7280; }
        .ad-right { display:flex;align-items:center;gap:6px;flex-shrink:0; }
        .ad-empty { display:flex;flex-direction:column;align-items:center;padding:56px 32px;text-align:center;background:#fff;border:1px dashed #bfdbfe;border-radius:16px;animation:fadeUp .4s ease both; }
        .ad-count { font-size:12px;color:#9ca3af;margin-bottom:12px; }
      `}</style>

      <DashboardLayout>
        <div className="ad-page">
          <div className="ad-header">
            <div>
              <div className="ad-title">All <span>Donors</span></div>
              <div className="ad-sub">Search and manage registered donors</div>
            </div>
            <button className="ad-refresh" onClick={fetch}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Chips */}
          {!loading && (
            <div className="ad-chips">
              {[
                { icon:<Droplets size={15} color="#2563eb" />, bg:"#eff6ff", num:donors.length,  lbl:"Total Donors"      },
                { icon:<Droplets size={15} color="#16a34a" />, bg:"#f0fdf4", num:availCount,      lbl:"Available"        },
                { icon:<Droplets size={15} color="#9ca3af" />, bg:"#f3f4f6", num:unavailCount,    lbl:"Unavailable"      },
              ].map(({ icon, bg, num, lbl }) => (
                <div className="ad-chip" key={lbl}>
                  <div className="ad-chip-icon" style={{ background:bg }}>{icon}</div>
                  <div><div className="ad-chip-num">{num}</div><div className="ad-chip-lbl">{lbl}</div></div>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar */}
          <div className="ad-toolbar">
            <div className="ad-search">
              <Search size={15} className="ad-search-icon" />
              <input placeholder="Search by name, email or city…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="ad-tabs">
              {["ALL","AVAILABLE","UNAVAILABLE"].map(s => (
                <button key={s} className={`ad-tab ${availFilter===s?"active":""}`} onClick={() => setAvailFilter(s)}>
                  {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Blood type filter */}
          <div className="ad-blood-grid">
            <button className={`ad-blood-btn ${bloodFilter==="ALL"?"active":""}`} onClick={() => setBloodFilter("ALL")}>All Types</button>
            {BLOOD_TYPES.map(bt => (
              <button key={bt} className={`ad-blood-btn ${bloodFilter===bt?"active":""}`} onClick={() => setBloodFilter(bt)}>
                {bt.replace("_"," ")}
              </button>
            ))}
          </div>

          {!loading && <div className="ad-count">Showing {filtered.length} of {donors.length} donors</div>}

          {loading ? (
            <div>{[0,1,2,3,4].map(i => <Skel key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <div className="ad-empty">
              <Droplets size={28} color="#93c5fd" style={{ marginBottom:12 }} />
              <div style={{ fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:700,color:"#111",marginBottom:6 }}>No donors found</div>
              <div style={{ fontSize:13,color:"#9ca3af" }}>{search ? `No results for "${search}"` : "No donors match the selected filters"}</div>
            </div>
          ) : (
            <div className="ad-list">
              {filtered.map((donor, i) => (
                <div key={donor.id} className="ad-card" style={{ animationDelay:`${i*30}ms` }}>
                  <div className="ad-avatar">
                    {donor.profileImageUrl
                      ? <img src={donor.profileImageUrl} alt={donor.fullName} />
                      : donor.fullName?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()
                    }
                  </div>
                  <div className="ad-info">
                    <div className="ad-name">{donor.fullName}</div>
                    <div className="ad-meta">
                      <div className="ad-meta-item"><MapPin size={11} />{donor.city}</div>
                      {donor.phone && <div className="ad-meta-item"><Phone size={11} />{donor.phone}</div>}
                      <div className="ad-meta-item">{donor.email}</div>
                    </div>
                  </div>
                  <div className="ad-right">
                    <Badge label={donor.bloodType?.replace("_"," ")} variant="red" />
                    <Badge label={donor.isAvailable ? "Available" : "Unavailable"} variant={donor.isAvailable ? "green" : "gray"} />
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

export default AdminDonors;