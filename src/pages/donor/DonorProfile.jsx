import { useEffect, useState } from "react";
import {
  Droplets, Phone, MapPin, Calendar,
  Save, Plus, ToggleLeft, ToggleRight, User
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/ui/Badge";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const BLOOD_TYPES = ["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"];

const Field = ({ label, value, onChange, placeholder, icon: Icon, type = "text" }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
    <label style={{ fontSize:10, fontWeight:500, letterSpacing:"0.12em", textTransform:"uppercase", color:"#374151" }}>
      {label}
    </label>
    <div style={{ position:"relative" }}>
      {Icon && (
        <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#d1a0a0", pointerEvents:"none" }}>
          <Icon size={14} />
        </div>
      )}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:"100%", padding:"11px 12px 11px 38px", background:"#fff", border:"1.5px solid #e5e7eb", borderRadius:9, fontSize:13, fontFamily:"'Outfit',sans-serif", color:"#111", outline:"none", boxSizing:"border-box", transition:"all .15s" }}
        onFocus={e => e.target.style.borderColor = "#dc2626"}
        onBlur={e  => e.target.style.borderColor = "#e5e7eb"}
      />
    </div>
  </div>
);

const DonorProfile = () => {
  const { user } = useAuth();
  const [form, setForm]         = useState({ bloodType:"A_POS", city:"", phone:"", lastDonationDate:"", isAvailable:true });
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [toggling,   setToggling]   = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    axiosInstance.get(ENDPOINTS.DONOR_PROFILE)
      .then(res => {
        const d = res.data.data;
        setForm({
          bloodType:        d.bloodType,
          city:             d.city,
          phone:            d.phone || "",
          lastDonationDate: d.lastDonationDate ? d.lastDonationDate.slice(0,10) : "",
          isAvailable:      d.isAvailable,
        });
        setHasProfile(true);
      })
      .catch(() => setHasProfile(false))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.city.trim()) { toast.error("City is required"); return; }
    setSaving(true);
    try {
      const payload = {
        bloodType:        form.bloodType,
        city:             form.city,
        phone:            form.phone,
        lastDonationDate: form.lastDonationDate || null,
        isAvailable:      form.isAvailable,
      };
      if (hasProfile) {
        await axiosInstance.put(ENDPOINTS.DONOR_PROFILE, payload);
        toast.success("Profile updated successfully");
      } else {
        await axiosInstance.post(ENDPOINTS.DONOR_PROFILE, payload);
        toast.success("Donor profile created");
        setHasProfile(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally { setSaving(false); }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await axiosInstance.patch(ENDPOINTS.DONOR_AVAILABILITY);
      const updated = res.data.data;
      setForm(prev => ({ ...prev, isAvailable: updated.isAvailable }));
      toast.success(updated.isAvailable ? "You are now available to donate" : "You are now marked as unavailable");
    } catch (err) {
      toast.error("Failed to toggle availability");
    } finally { setToggling(false); }
  };

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes skelShim { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        .dp-page  { font-family:'Outfit',sans-serif; max-width:780px; }
        .dp-header { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:24px; flex-wrap:wrap; gap:12px; animation:fadeUp .3s ease both; }
        .dp-title  { font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#111; letter-spacing:-0.02em; }
        .dp-title span { color:#dc2626; }
        .dp-sub    { font-size:12px; color:#9ca3af; margin-top:3px; }
        .dp-skel   { height:48px; border-radius:9px; background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%); background-size:200% 100%; animation:skelShim 1.4s infinite; }

        /* Profile header card */
        .dp-profile-header {
          background:linear-gradient(135deg,#1a0000 0%,#3d0000 100%);
          border-radius:16px; padding:24px 28px;
          display:flex; align-items:center; gap:20px;
          margin-bottom:20px; position:relative; overflow:hidden;
          animation:fadeUp .32s ease both;
        }
        .dp-profile-glow {
          position:absolute; right:-40px; top:-40px;
          width:160px; height:160px; border-radius:50%;
          background:radial-gradient(circle,rgba(220,38,38,0.3) 0%,transparent 70%);
        }
        .dp-avatar {
          width:64px; height:64px; border-radius:50%; flex-shrink:0;
          background:linear-gradient(135deg,#dc2626,#b91c1c);
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:#fff;
          border:2px solid rgba(255,255,255,0.15);
          overflow:hidden; z-index:1;
        }
        .dp-profile-name { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#fff; z-index:1; }
        .dp-profile-email { font-size:12px; color:rgba(255,255,255,0.5); margin-top:3px; z-index:1; }
        .dp-profile-badges { display:flex; gap:6px; margin-top:8px; z-index:1; }

        /* Availability toggle card */
        .dp-avail-card {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 20px; background:#fff; border:1px solid #f3f4f6;
          border-radius:14px; margin-bottom:20px;
          animation:fadeUp .34s ease both;
        }
        .dp-avail-left { display:flex; align-items:center; gap:12px; }
        .dp-avail-dot  { width:10px; height:10px; border-radius:50%; }
        .dp-avail-title { font-size:14px; font-weight:500; color:#111; }
        .dp-avail-sub   { font-size:11px; color:#9ca3af; margin-top:2px; }
        .dp-toggle-btn {
          display:flex; align-items:center; gap:7px;
          padding:8px 16px; border-radius:9px; border:none;
          font-size:12px; font-weight:500; cursor:pointer;
          font-family:'Outfit',sans-serif; transition:all .15s;
        }

        /* Form card */
        .dp-card { background:#fff; border:1px solid #f3f4f6; border-radius:16px; padding:24px 28px; animation:fadeUp .38s ease both; }
        .dp-card-title { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#111; margin-bottom:4px; }
        .dp-card-sub   { font-size:12px; color:#9ca3af; margin-bottom:22px; }
        .dp-form-grid  { display:grid; grid-template-columns:1fr 1fr; gap:18px; }

        /* Blood type selector */
        .dp-blood-label { font-size:10px; font-weight:500; letter-spacing:0.12em; text-transform:uppercase; color:#374151; margin-bottom:8px; display:block; }
        .dp-blood-grid  { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
        .dp-blood-option {
          padding:10px 6px; border-radius:9px; border:1.5px solid #e5e7eb;
          background:#fff; text-align:center; cursor:pointer;
          font-size:12px; font-weight:500; color:#6b7280;
          transition:all .15s; font-family:'Outfit',sans-serif;
        }
        .dp-blood-option:hover    { border-color:#fca5a5; color:#dc2626; background:#fff5f5; }
        .dp-blood-option.selected { border-color:#dc2626; background:#fee2e2; color:#dc2626; font-weight:600; }

        .dp-divider { height:1px; background:#f3f4f6; margin:20px 0; }
        .dp-save {
          display:flex; align-items:center; gap:7px;
          padding:11px 24px; background:#dc2626; color:#fff;
          border:none; border-radius:9px; font-size:13px; font-weight:500;
          font-family:'Syne',sans-serif; cursor:pointer;
          box-shadow:0 2px 10px rgba(220,38,38,0.25); transition:all .15s;
        }
        .dp-save:hover:not(:disabled) { background:#b91c1c; transform:translateY(-1px); }
        .dp-save:disabled { opacity:0.6; cursor:not-allowed; }

        .dp-no-profile {
          display:flex; flex-direction:column; align-items:center;
          padding:48px 32px; text-align:center;
          background:#fff; border:1px dashed #fecaca;
          border-radius:16px; animation:fadeUp .35s ease both; margin-bottom:20px;
        }
        .dp-no-profile-icon {
          width:64px; height:64px; border-radius:16px;
          background:#fee2e2; border:1px solid #fecaca;
          display:flex; align-items:center; justify-content:center; margin-bottom:16px;
        }
      `}</style>

      <DashboardLayout>
        <div className="dp-page">

          {/* Header */}
          <div className="dp-header">
            <div>
              <div className="dp-title">Donor <span>Profile</span></div>
              <div className="dp-sub">Manage your donor information and availability</div>
            </div>
          </div>

          {loading ? (
            <div style={{ display:"grid", gap:12 }}>
              {[0,1,2,3].map(i => <div key={i} className="dp-skel" />)}
            </div>
          ) : (
            <>
              {/* Profile header banner */}
              <div className="dp-profile-header">
                <div className="dp-profile-glow" />
                <div className="dp-avatar">
                  {user?.profileImageUrl
                    ? <img src={user.profileImageUrl} alt={user.fullName} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    : user?.fullName?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()
                  }
                </div>
                <div style={{ zIndex:1 }}>
                  <div className="dp-profile-name">{user?.fullName}</div>
                  <div className="dp-profile-email">{user?.email}</div>
                  {hasProfile && (
                    <div className="dp-profile-badges">
                      <Badge label={form.bloodType.replace("_"," ")} variant="red" />
                      <Badge label={form.isAvailable ? "Available" : "Unavailable"} variant={form.isAvailable ? "green" : "gray"} />
                      <Badge label="Donor" variant="red" />
                    </div>
                  )}
                </div>
              </div>

              {/* No profile state */}
              {!hasProfile && (
                <div className="dp-no-profile">
                  <div className="dp-no-profile-icon">
                    <User size={28} color="#dc2626" />
                  </div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:"#111", marginBottom:6 }}>
                    Complete Your Donor Profile
                  </div>
                  <div style={{ fontSize:13, color:"#9ca3af", maxWidth:300, lineHeight:1.6, marginBottom:4 }}>
                    Set your blood type and location so hospitals can find you when they need you most.
                  </div>
                </div>
              )}

              {/* Availability toggle */}
              {hasProfile && (
                <div className="dp-avail-card">
                  <div className="dp-avail-left">
                    <div className="dp-avail-dot" style={{ background: form.isAvailable ? "#16a34a" : "#9ca3af", animation: form.isAvailable ? "blink 2s ease infinite" : "none" }} />
                    <div>
                      <div className="dp-avail-title">
                        {form.isAvailable ? "Available to donate" : "Not available to donate"}
                      </div>
                      <div className="dp-avail-sub">
                        {form.isAvailable
                          ? "Hospitals can find and contact you for donations"
                          : "You won't appear in donor searches"
                        }
                      </div>
                    </div>
                  </div>
                  <button
                    className="dp-toggle-btn"
                    disabled={toggling}
                    onClick={handleToggle}
                    style={{
                      background: form.isAvailable ? "#fef2f2" : "#f0fdf4",
                      color:      form.isAvailable ? "#dc2626"  : "#16a34a",
                    }}
                  >
                    {toggling
                      ? <div style={{ width:14, height:14, border:"2px solid currentColor", borderTopColor:"transparent", borderRadius:"50%", animation:"spin .8s linear infinite" }} />
                      : form.isAvailable
                        ? <><ToggleRight size={16} /> Mark Unavailable</>
                        : <><ToggleLeft  size={16} /> Mark Available</>
                    }
                  </button>
                </div>
              )}

              {/* Form */}
              <div className="dp-card">
                <div className="dp-card-title">
                  {hasProfile ? "Update Profile" : "Create Profile"}
                </div>
                <div className="dp-card-sub">
                  {hasProfile ? "Keep your information up to date" : "Fill in your details to get started"}
                </div>

                {/* Blood type */}
                <div style={{ marginBottom:18 }}>
                  <span className="dp-blood-label">Blood Type</span>
                  <div className="dp-blood-grid">
                    {BLOOD_TYPES.map(bt => (
                      <div
                        key={bt}
                        className={`dp-blood-option ${form.bloodType === bt ? "selected" : ""}`}
                        onClick={() => setForm(prev => ({ ...prev, bloodType:bt }))}
                      >
                        {bt.replace("_"," ")}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dp-form-grid">
                  <Field
                    label="City" value={form.city} onChange={set("city")}
                    placeholder="Mumbai" icon={MapPin}
                  />
                  <Field
                    label="Phone" value={form.phone} onChange={set("phone")}
                    placeholder="9876543210" icon={Phone}
                  />
                  <div style={{ gridColumn:"1/-1" }}>
                    <Field
                      label="Last Donation Date" value={form.lastDonationDate}
                      onChange={set("lastDonationDate")}
                      placeholder="" icon={Calendar} type="date"
                    />
                  </div>
                </div>

                <div className="dp-divider" />
                <button onClick={handleSave} disabled={saving} className="dp-save">
                  {saving
                    ? <><div style={{ width:14, height:14, border:"2px solid rgba(255,255,255,0.4)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .8s linear infinite" }} /> Saving...</>
                    : <><Save size={14} /> {hasProfile ? "Update Profile" : "Create Profile"}</>
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default DonorProfile;