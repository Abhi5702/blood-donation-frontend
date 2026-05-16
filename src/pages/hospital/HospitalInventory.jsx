import { useEffect, useState } from "react";
import {
  Package, Plus, Trash2, RefreshCw,
  AlertTriangle, CalendarClock, Edit3
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const BLOOD_TYPES = ["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"];

const Skel = () => (
  <div style={{ height:72, borderRadius:12, background:"linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)", backgroundSize:"200% 100%", animation:"invSkelShim 1.4s infinite", marginBottom:8 }} />
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>{label}</label>
    <select value={value} onChange={onChange}
      style={{ padding:"11px 12px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", cursor:"pointer" }}
      onFocus={e => e.target.style.borderColor="#dc2626"}
      onBlur={e  => e.target.style.borderColor="#e5e7eb"}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const HospitalInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modal,     setModal]     = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [deleting,  setDeleting]  = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [form,      setForm]      = useState({ bloodType:"A_POS", unitsAvailable:0, expiryDate:"" });

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(ENDPOINTS.MY_INVENTORY);
      setInventory(res.data.data || []);
    } catch { toast.error("Failed to load inventory"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ bloodType:"A_POS", unitsAvailable:0, expiryDate:"" });
    setModal(true);
  };

  const openEdit = (inv) => {
    setEditing(inv);
    setForm({
      bloodType:      inv.bloodType,
      unitsAvailable: inv.unitsAvailable,
      expiryDate:     inv.expiryDate ? inv.expiryDate.slice(0,10) : "",
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (form.unitsAvailable < 0) { toast.error("Units cannot be negative"); return; }
    setSaving(true);
    try {
      await axiosInstance.post(ENDPOINTS.INVENTORY, {
        ...form,
        unitsAvailable: Number(form.unitsAvailable),
        expiryDate:     form.expiryDate || null,
      });
      toast.success(editing ? "Inventory updated" : "Inventory added");
      setModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await axiosInstance.delete(ENDPOINTS.DELETE_INVENTORY(id));
      toast.success("Inventory entry deleted");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally { setDeleting(null); }
  };

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const isLow      = (u) => u <= 3;
  const isExpiring = (d) => d && new Date(d) < new Date(Date.now() + 7*24*60*60*1000);

  const totalUnits = inventory.reduce((s, i) => s + i.unitsAvailable, 0);
  const lowCount   = inventory.filter(i => isLow(i.unitsAvailable)).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@300;400;500&display=swap');
        @keyframes invSkelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .inv-page   { font-family:'Outfit',sans-serif; }
        .inv-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .inv-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .inv-title span { color:#16a34a; }
        .inv-sub    { font-size:12px; color:#9ca3af; margin-top:3px; }
        .inv-actions { display:flex; gap:8px; }
        .inv-btn { display:flex; align-items:center; gap:6px; padding:8px 14px; border-radius:9px; font-size:12px; font-weight:500; cursor:pointer; transition:all .15s; font-family:'Outfit',sans-serif; border:none; }
        .inv-btn.primary { background:#16a34a; color:#fff; box-shadow:0 2px 8px rgba(22,163,74,0.25); }
        .inv-btn.primary:hover { background:#15803d; }
        .inv-btn.secondary { background:#fff; color:#374151; border:1px solid #e5e7eb; }
        .inv-btn.secondary:hover { background:#f0fdf4; border-color:#bbf7d0; color:#16a34a; }

        /* summary chips */
        .inv-chips { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; animation:fadeUp .34s ease both; }
        .inv-chip { display:flex; align-items:center; gap:10px; padding:12px 16px; background:#fff; border:1px solid #f3f4f6; border-radius:12px; }
        .inv-chip-icon { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .inv-chip-num { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#111; line-height:1; }
        .inv-chip-lbl { font-size:11px; color:#9ca3af; margin-top:2px; }

        /* inventory cards */
        .inv-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px; }
        .inv-card { background:#fff; border:1px solid #f3f4f6; border-radius:14px; padding:16px 18px; transition:all .15s; animation:fadeUp .4s ease both; position:relative; overflow:hidden; }
        .inv-card:hover { border-color:#bbf7d0; box-shadow:0 2px 12px rgba(22,163,74,0.07); }
        .inv-card.low  { border-color:#fecaca; }
        .inv-card.low:hover { border-color:#fca5a5; box-shadow:0 2px 12px rgba(220,38,38,0.07); }
        .inv-card-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:14px; }
        .inv-card-icon { width:42px; height:42px; border-radius:11px; display:flex; align-items:center; justify-content:center; }
        .inv-card-actions { display:flex; gap:6px; }
        .inv-card-action { width:28px; height:28px; border-radius:7px; border:1px solid #e5e7eb; background:#f9fafb; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; color:#9ca3af; }
        .inv-card-action:hover.edit   { background:#eff6ff; border-color:#bfdbfe; color:#2563eb; }
        .inv-card-action:hover.delete { background:#fef2f2; border-color:#fecaca; color:#dc2626; }
        .inv-card-action:disabled     { opacity:0.4; cursor:not-allowed; }
        .inv-card-blood { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#111; margin-bottom:4px; }
        .inv-card-units { font-family:'Syne',sans-serif; font-size:32px; font-weight:800; line-height:1; }
        .inv-card-units-lbl { font-size:12px; font-weight:400; color:#9ca3af; margin-left:4px; }
        .inv-card-expiry { font-size:11px; color:#9ca3af; margin-top:8px; display:flex; align-items:center; gap:5px; }
        .inv-card-badges { display:flex; gap:5px; flex-wrap:wrap; margin-top:8px; }
        .inv-card-low-bar { position:absolute; bottom:0; left:0; right:0; height:3px; background:#dc2626; }

        /* modal form */
        .inv-form { display:flex; flex-direction:column; gap:16px; }
        .inv-submit { width:100%; padding:12px; background:#16a34a; color:#fff; border:none; border-radius:9px; font-size:13px; font-weight:500; font-family:'Syne',sans-serif; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; transition:all .15s; box-shadow:0 2px 10px rgba(22,163,74,0.25); }
        .inv-submit:hover:not(:disabled) { background:#15803d; }
        .inv-submit:disabled { opacity:0.6; cursor:not-allowed; }

        .inv-empty { display:flex; flex-direction:column; align-items:center; padding:56px 32px; text-align:center; background:#fff; border:1px dashed #bbf7d0; border-radius:16px; animation:fadeUp .4s ease both; }
        .inv-empty-icon { width:60px; height:60px; border-radius:16px; background:#f0fdf4; border:1px solid #bbf7d0; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
      `}</style>

      <DashboardLayout>
        <div className="inv-page">

          {/* Header */}
          <div className="inv-header">
            <div>
              <div className="inv-title">Blood <span>Inventory</span></div>
              <div className="inv-sub">Manage your hospital's blood stock</div>
            </div>
            <div className="inv-actions">
              <button className="inv-btn secondary" onClick={fetch}>
                <RefreshCw size={13} /> Refresh
              </button>
              <button className="inv-btn primary" onClick={openAdd}>
                <Plus size={13} /> Add / Update Stock
              </button>
            </div>
          </div>

          {/* Summary chips */}
          {!loading && inventory.length > 0 && (
            <div className="inv-chips">
              {[
                { icon:<Package size={16} color="#16a34a" />, bg:"#f0fdf4", num: inventory.length, lbl:"Blood Types"   },
                { icon:<Package size={16} color="#2563eb" />, bg:"#eff6ff", num: totalUnits,       lbl:"Total Units"   },
                { icon:<AlertTriangle size={16} color="#dc2626" />, bg:"#fee2e2", num: lowCount,   lbl:"Low Stock"     },
              ].map(({ icon, bg, num, lbl }) => (
                <div className="inv-chip" key={lbl}>
                  <div className="inv-chip-icon" style={{ background:bg }}>{icon}</div>
                  <div>
                    <div className="inv-chip-num">{num}</div>
                    <div className="inv-chip-lbl">{lbl}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inventory grid */}
          {loading ? (
            <div>{[0,1,2,3].map(i => <Skel key={i} />)}</div>
          ) : inventory.length === 0 ? (
            <div className="inv-empty">
              <div className="inv-empty-icon"><Package size={26} color="#16a34a" /></div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700, color:"#111", marginBottom:6 }}>No Inventory Yet</div>
              <div style={{ fontSize:13, color:"#9ca3af", marginBottom:20 }}>Start tracking your blood stock by adding inventory.</div>
              <button className="inv-btn primary" onClick={openAdd}><Plus size={13} /> Add First Entry</button>
            </div>
          ) : (
            <div className="inv-grid">
              {inventory.map((inv, i) => {
                const low      = isLow(inv.unitsAvailable);
                const expiring = isExpiring(inv.expiryDate);
                return (
                  <div
                    key={inv.id}
                    className={`inv-card ${low ? "low" : ""}`}
                    style={{ animationDelay:`${i*40}ms` }}
                  >
                    <div className="inv-card-top">
                      <div className="inv-card-icon" style={{ background: low ? "#fee2e2" : "#f0fdf4", border:`1px solid ${low ? "#fecaca" : "#bbf7d0"}` }}>
                        <Package size={20} color={low ? "#dc2626" : "#16a34a"} />
                      </div>
                      <div className="inv-card-actions">
                        <button className="inv-card-action edit" onClick={() => openEdit(inv)} title="Edit">
                          <Edit3 size={12} />
                        </button>
                        <button
                          className="inv-card-action delete"
                          disabled={deleting === inv.id}
                          onClick={() => handleDelete(inv.id)}
                          title="Delete"
                        >
                          {deleting === inv.id
                            ? <div style={{ width:10, height:10, border:"2px solid #fecaca", borderTop:"2px solid #dc2626", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
                            : <Trash2 size={12} />
                          }
                        </button>
                      </div>
                    </div>

                    <div className="inv-card-blood">{inv.bloodType.replace("_"," ")}</div>
                    <div>
                      <span className="inv-card-units" style={{ color: low ? "#dc2626" : "#16a34a" }}>
                        {inv.unitsAvailable}
                      </span>
                      <span className="inv-card-units-lbl">units available</span>
                    </div>

                    {inv.expiryDate && (
                      <div className="inv-card-expiry">
                        <CalendarClock size={12} />
                        Expires: {new Date(inv.expiryDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </div>
                    )}

                    <div className="inv-card-badges">
                      {low      && <Badge label="Low Stock"     variant="red"   />}
                      {expiring && <Badge label="Expiring Soon" variant="amber" />}
                      {!low && !expiring && <Badge label="In Stock" variant="green" />}
                    </div>

                    {low && <div className="inv-card-low-bar" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modal}
          onClose={() => setModal(false)}
          title={editing ? "Update Inventory" : "Add Blood Stock"}
        >
          <div className="inv-form">
            <Select
              label="Blood Type"
              value={form.bloodType}
              onChange={set("bloodType")}
              options={BLOOD_TYPES.map(b => ({ value:b, label: b.replace("_"," ") }))}
            />
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>
                Units Available
              </label>
              <input
                type="number" min={0} value={form.unitsAvailable}
                onChange={set("unitsAvailable")}
                style={{ padding:"11px 12px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", width:"100%", boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor="#16a34a"}
                onBlur={e  => e.target.style.borderColor="#e5e7eb"}
              />
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>
                Expiry Date (optional)
              </label>
              <input
                type="date" value={form.expiryDate}
                onChange={set("expiryDate")}
                style={{ padding:"11px 12px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", width:"100%", boxSizing:"border-box" }}
                onFocus={e => e.target.style.borderColor="#16a34a"}
                onBlur={e  => e.target.style.borderColor="#e5e7eb"}
              />
            </div>
            <button className="inv-submit" disabled={saving} onClick={handleSave}>
              {saving
                ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Saving...</>
                : <><Plus size={14} /> {editing ? "Update Stock" : "Add Stock"}</>
              }
            </button>
          </div>
        </Modal>
      </DashboardLayout>
    </>
  );
};

export default HospitalInventory;