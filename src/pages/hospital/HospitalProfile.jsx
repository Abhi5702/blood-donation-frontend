import { useEffect, useState } from "react";
import { Building2, Phone, MapPin, FileText, Save, Plus } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const Field = ({ label, value, onChange, placeholder, icon: Icon, type = "text", multiline = false }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>
      {label}
    </label>
    <div style={{ position:"relative" }}>
      {Icon && (
        <div style={{ position:"absolute", left:12, top: multiline ? 12 : "50%", transform: multiline ? "none" : "translateY(-50%)", color:"#d1a0a0", pointerEvents:"none" }}>
          <Icon size={14} />
        </div>
      )}
      {multiline ? (
        <textarea
          value={value} onChange={onChange} placeholder={placeholder} rows={3}
          style={{ width:"100%", padding:"11px 12px 11px 38px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", resize:"vertical", boxSizing:"border-box", transition:"border-color .15s" }}
          onFocus={e => e.target.style.borderColor = "#dc2626"}
          onBlur={e  => e.target.style.borderColor = "#e5e7eb"}
        />
      ) : (
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{ width:"100%", padding:"11px 12px 11px 38px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", boxSizing:"border-box", transition:"all .15s" }}
          onFocus={e => e.target.style.borderColor = "#dc2626"}
          onBlur={e  => e.target.style.borderColor = "#e5e7eb"}
        />
      )}
    </div>
  </div>
);

const HospitalProfile = () => {
  const [form, setForm] = useState({ hospitalName:"", city:"", phone:"", address:"" });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    axiosInstance.get(ENDPOINTS.HOSPITAL_PROFILE)
      .then(res => {
        const d = res.data.data;
        setForm({ hospitalName: d.hospitalName, city: d.city, phone: d.phone || "", address: d.address || "" });
        setHasProfile(true);
      })
      .catch(() => setHasProfile(false))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.hospitalName.trim()) { toast.error("Hospital name is required"); return; }
    if (!form.city.trim())         { toast.error("City is required"); return; }
    setSaving(true);
    try {
      if (hasProfile) {
        await axiosInstance.put(ENDPOINTS.HOSPITAL_PROFILE, form);
        toast.success("Profile updated successfully");
      } else {
        await axiosInstance.post(ENDPOINTS.HOSPITAL_PROFILE, form);
        toast.success("Profile created successfully");
        setHasProfile(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally { setSaving(false); }
  };

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes skelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .hp-page { font-family:'Outfit',sans-serif; max-width:720px; }
        .hp-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .hp-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .hp-title span { color:#dc2626; }
        .hp-sub    { font-size:12px; color:#9ca3af; margin-top:3px; }
        .hp-card   { background:#fff; border:1px solid #f3f4f6; border-radius:16px; padding:28px 32px; animation:fadeUp .35s ease both; }
        .hp-card-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#111; margin-bottom:4px; }
        .hp-card-sub   { font-size:12px; color:#9ca3af; margin-bottom:24px; }
        .hp-grid  { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
        .hp-full  { grid-column:1/-1; }
        .hp-divider { height:1px; background:#f3f4f6; margin:20px 0; }
        .hp-save {
          display:flex; align-items:center; gap:7px;
          padding:11px 24px; background:#dc2626; color:#fff;
          border:none; border-radius:9px; font-size:13px; font-weight:500;
          font-family:'Syne',sans-serif; cursor:pointer;
          box-shadow:0 2px 10px rgba(220,38,38,0.25); transition:all .15s;
        }
        .hp-save:hover:not(:disabled) { background:#b91c1c; transform:translateY(-1px); box-shadow:0 4px 16px rgba(220,38,38,0.3); }
        .hp-save:disabled { opacity:0.6; cursor:not-allowed; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .hp-spin { animation:spin .8s linear infinite; }
        .hp-no-profile {
          display:flex; flex-direction:column; align-items:center;
          padding:48px 32px; text-align:center;
          background:#fff; border:1px dashed #fecaca;
          border-radius:16px; animation:fadeUp .35s ease both;
        }
        .hp-no-profile-icon {
          width:64px; height:64px; border-radius:16px;
          background:#fee2e2; border:1px solid #fecaca;
          display:flex; align-items:center; justify-content:center; margin-bottom:16px;
        }
        .hp-skel { height:48px; border-radius:9px; background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%); background-size:200% 100%; animation:skelShim 1.4s infinite; }
      `}</style>

      <DashboardLayout>
        <div className="hp-page">

          <div className="hp-header">
            <div>
              <div className="hp-title">Hospital <span>Profile</span></div>
              <div className="hp-sub">Manage your hospital information</div>
            </div>
          </div>

          {loading ? (
            <div className="hp-card">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                {[0,1,2,3].map(i => <div key={i} className="hp-skel" />)}
                <div className="hp-skel" style={{ gridColumn:"1/-1", height:80 }} />
              </div>
            </div>
          ) : !hasProfile ? (
            <div className="hp-no-profile">
              <div className="hp-no-profile-icon">
                <Building2 size={28} color="#dc2626" />
              </div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:"#111", marginBottom:6 }}>
                No Hospital Profile Yet
              </div>
              <div style={{ fontSize:13, color:"#9ca3af", maxWidth:280, lineHeight:1.6, marginBottom:24 }}>
                Create your hospital profile to start posting blood requests and managing inventory.
              </div>
              <div className="hp-card" style={{ width:"100%", maxWidth:480 }}>
                <ProfileForm form={form} set={set} saving={saving} hasProfile={false} onSave={handleSave} />
              </div>
            </div>
          ) : (
            <div className="hp-card">
              <div className="hp-card-title">Hospital Information</div>
              <div className="hp-card-sub">Update your hospital's details</div>
              <ProfileForm form={form} set={set} saving={saving} hasProfile={true} onSave={handleSave} />
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

const ProfileForm = ({ form, set, saving, hasProfile, onSave }) => (
  <>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
      <div style={{ gridColumn:"1/-1" }}>
        <Field label="Hospital Name" value={form.hospitalName} onChange={set("hospitalName")}
          placeholder="City General Hospital" icon={Building2} />
      </div>
      <Field label="City"  value={form.city}  onChange={set("city")}  placeholder="Mumbai"         icon={MapPin}  />
      <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="022-12345678"   icon={Phone}   />
      <div style={{ gridColumn:"1/-1" }}>
        <Field label="Address" value={form.address} onChange={set("address")}
          placeholder="123 Main Road, Mumbai" icon={FileText} multiline />
      </div>
    </div>
    <div style={{ height:1, background:"#f3f4f6", margin:"24px 0" }} />
    <button onClick={onSave} disabled={saving} className="hp-save">
      {saving
        ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Saving...</>
        : <><Save size={14} /> {hasProfile ? "Update Profile" : "Create Profile"}</>
      }
    </button>
  </>
);

export default HospitalProfile;