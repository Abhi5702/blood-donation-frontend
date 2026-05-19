import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail, Lock, User, ArrowRight,
  LoaderCircle, Droplets
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const ROLES = [
  { value: "DONOR",          label: "Donor",          desc: "I want to donate blood" },
  { value: "HOSPITAL_STAFF", label: "Hospital Staff",  desc: "I manage a hospital"    },
  { value: "ADMIN",          label: "Admin",           desc: "I coordinate operations" },
];

const Register = () => {
  const [form, setForm] = useState({
    fullName: "", email: "", password: "", role: "DONOR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError("");
  };

  const getStrength = (pw) => {
    if (!pw)           return null;
    if (pw.length < 6) return { level: 1, label: "Weak",   color: "#e74c3c" };
    if (pw.length < 10)return { level: 2, label: "Fair",   color: "#e67e22" };
    return                    { level: 3, label: "Strong", color: "#27ae60" };
  };
  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.fullName.trim()) { setError("Full name is required");  return; }
    if (!form.email.trim())    { setError("Email is required");       return; }
    if (!form.password.trim()) { setError("Password is required");    return; }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters"); return;
    }
    setLoading(true);
    try {
      await axiosInstance.post(ENDPOINTS.REGISTER, form);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=Manrope:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rg-root {
          min-height: 100vh;
          width: 100%;
          background: #f5f2ed;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Manrope', sans-serif;
          overflow: hidden;
        }

        /* ── LEFT — editorial poster ── */
        .rg-poster {
          background: #0f1923;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          overflow: hidden;
        }
        .rg-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 24px 24px; z-index: 0;
        }
        .rg-slash {
          position: absolute; width: 3px; height: 180%;
          background: linear-gradient(180deg, transparent 0%, #c0392b 30%, #e74c3c 60%, transparent 100%);
          top: -40%; left: 52%; transform: rotate(-18deg); z-index: 1; opacity: 0.35;
        }
        .rg-slash2 {
          position: absolute; width: 1px; height: 180%;
          background: linear-gradient(180deg, transparent 0%, #c0392b 40%, transparent 100%);
          top: -40%; left: 58%; transform: rotate(-18deg); z-index: 1; opacity: 0.18;
        }
        .rg-watermark {
          position: absolute; bottom: -20px; left: -10px;
          font-family: 'Playfair Display', serif;
          font-size: 160px; font-weight: 700;
          color: rgba(255,255,255,0.025); letter-spacing: -8px;
          line-height: 1; z-index: 0; user-select: none; white-space: nowrap;
        }
        .rg-poster-inner {
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .rg-logo { display: flex; align-items: center; gap: 10px; }
        .rg-logo-mark {
          width: 36px; height: 36px;
          border: 1.5px solid rgba(192,57,43,0.6); border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
        }
        .rg-logo-text {
          font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.7); letter-spacing: 0.08em; text-transform: uppercase;
        }
        .rg-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .rg-eyebrow {
          font-family: 'DM Mono', monospace; font-size: 10px; color: #c0392b;
          letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 20px;
          display: flex; align-items: center; gap: 10px;
        }
        .rg-eyebrow::before { content: ''; display: block; width: 32px; height: 1px; background: #c0392b; }
        .rg-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 4.5vw, 68px); font-weight: 400;
          color: #ffffff; line-height: 1.05; letter-spacing: -0.02em; margin-bottom: 28px;
        }
        .rg-headline em { font-style: italic; color: #e74c3c; }
        .rg-desc {
          font-size: 13px; color: rgba(255,255,255,0.38);
          line-height: 1.8; max-width: 300px; font-weight: 300;
        }
        .rg-steps { margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }
        .rg-step { display: flex; align-items: flex-start; gap: 14px; }
        .rg-step-num {
          font-family: 'DM Mono', monospace; font-size: 10px; color: #c0392b;
          letter-spacing: 0.1em; padding-top: 2px; flex-shrink: 0; min-width: 20px;
        }
        .rg-step-title { font-size: 12px; color: rgba(255,255,255,0.7); }
        .rg-step-desc  { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 2px; }

        /* ── RIGHT — form ── */
        .rg-form-side {
          background: #f5f2ed;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 64px; position: relative; overflow-y: auto;
        }
        .rg-form-side::before {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 31px,
            rgba(0,0,0,0.04) 31px, rgba(0,0,0,0.04) 32px
          );
          pointer-events: none;
        }
        .rg-form-wrap {
          width: 100%; max-width: 400px; position: relative; z-index: 1;
        }
        .rg-form-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 36px; padding-bottom: 16px; border-bottom: 2px solid #0f1923;
        }
        .rg-form-header-title {
          font-family: 'Playfair Display', serif; font-size: 13px;
          font-weight: 400; color: #0f1923; letter-spacing: 0.02em;
        }
        .rg-form-header-meta {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #999; letter-spacing: 0.1em; text-transform: uppercase;
        }
        .rg-form-title {
          font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700;
          color: #0f1923; line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .rg-form-sub { font-size: 13px; color: #888; font-weight: 300; margin-bottom: 28px; }

        /* role selector */
        .rg-role-section { margin-bottom: 24px; }
        .rg-role-section-label {
          font-family: 'DM Mono', monospace; font-size: 10px; color: #666;
          letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px; display: block;
        }
        .rg-roles { display: flex; gap: 0; border-bottom: 1.5px solid #ccc; }
        .rg-role-tab {
          flex: 1; padding: 8px 4px 10px; text-align: center; cursor: pointer;
          border-bottom: 2px solid transparent; margin-bottom: -1.5px;
          transition: all .15s;
        }
        .rg-role-tab.active { border-bottom-color: #c0392b; }
        .rg-role-tab-name {
          font-family: 'DM Mono', monospace; font-size: 10px;
          color: #bbb; letter-spacing: 0.1em; text-transform: uppercase;
          transition: color .15s;
        }
        .rg-role-tab.active .rg-role-tab-name { color: #c0392b; }
        .rg-role-tab-desc { font-size: 10px; color: #ccc; margin-top: 2px; }
        .rg-role-tab.active .rg-role-tab-desc { color: #888; }

        /* fields */
        .rg-field { margin-bottom: 20px; }
        .rg-label {
          display: block; font-family: 'DM Mono', monospace; font-size: 10px;
          color: #666; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px;
        }
        .rg-input-wrap { position: relative; }
        .rg-input-icon {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          color: #bbb; pointer-events: none; transition: color .2s;
        }
        .rg-input-icon.active { color: #c0392b; }
        .rg-input {
          width: 100%; padding: 10px 0 10px 28px; background: transparent;
          border: none; border-bottom: 1.5px solid #ccc;
          font-size: 14px; font-family: 'Manrope', sans-serif;
          font-weight: 400; color: #0f1923; outline: none; transition: border-color .2s; border-radius: 0;
        }
        .rg-input::placeholder { color: #bbb; }
        .rg-input:focus { border-bottom-color: #c0392b; }
        .rg-input.active-border { border-bottom-color: #c0392b; }

        /* strength */
        .rg-strength { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .rg-bars { display: flex; gap: 4px; }
        .rg-bar { width: 32px; height: 2px; background: #ddd; transition: background .3s; }
        .rg-strength-lbl { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 0.1em; }

        /* error */
        .rg-error {
          font-family: 'DM Mono', monospace; font-size: 11px; color: #c0392b;
          margin-bottom: 18px; display: flex; align-items: center; gap: 6px;
        }
        .rg-error::before { content: '⚠'; }

        /* submit */
        .rg-submit {
          width: 100%; padding: 14px 24px; background: #0f1923; color: #fff;
          border: none; border-radius: 0; font-family: 'DM Mono', monospace;
          font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 12px; transition: all .2s; position: relative; overflow: hidden; margin-top: 8px;
        }
        .rg-submit::after {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 0; background: #c0392b; transition: width .3s ease; z-index: 0;
        }
        .rg-submit:hover::after { width: 100%; }
        .rg-submit span { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }
        .rg-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .rg-submit:disabled::after { display: none; }

        .rg-footer {
          margin-top: 24px; font-size: 12px; color: #999;
          font-weight: 300; display: flex; align-items: center; gap: 6px;
        }
        .rg-footer a {
          color: #c0392b; text-decoration: none; font-weight: 500;
          font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.06em;
        }
        .rg-footer a:hover { text-decoration: underline; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .rg-spin { animation: spin .8s linear infinite; }

        @media (max-width: 860px) {
          .rg-root { grid-template-columns: 1fr; }
          .rg-poster { display: none; }
          .rg-form-side { padding: 40px 32px; }
        }
      `}</style>

      <div className="rg-root">

        {/* ── LEFT POSTER ── */}
        <div className="rg-poster">
          <div className="rg-dots" />
          <div className="rg-slash" />
          <div className="rg-slash2" />
          <div className="rg-watermark">BLOOD</div>

          <div className="rg-poster-inner">
            <div className="rg-logo">
              <div className="rg-logo-mark">
                <Droplets size={16} color="#e74c3c" />
              </div>
              <span className="rg-logo-text">Blood Bridge</span>
            </div>

            <div className="rg-hero">
              <div className="rg-eyebrow">Blood Donation Network</div>
              <h1 className="rg-headline">
                Join the<br />
                <em>movement.</em>
              </h1>
              <p className="rg-desc">
                Become part of a network that saves lives every day.
                Connect donors, hospitals, and coordinators in one platform.
              </p>
              <div className="rg-steps">
                {[
                  { n: "01", title: "Create your profile",   desc: "Register as donor, hospital, or admin" },
                  { n: "02", title: "Get matched instantly", desc: "Find compatible donors nearby"          },
                  { n: "03", title: "Save lives",            desc: "Coordinate, donate, and track impact"  },
                ].map(s => (
                  <div className="rg-step" key={s.n}>
                    <div className="rg-step-num">{s.n}</div>
                    <div>
                      <div className="rg-step-title">{s.title}</div>
                      <div className="rg-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

           
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="rg-form-side">
          <div className="rg-form-wrap">

            <div className="rg-form-header">
              <span className="rg-form-header-title">New Member</span>
              <span className="rg-form-header-meta">Blood Bridge / Register</span>
            </div>

            <div className="rg-form-title">Sign up.</div>
            <div className="rg-form-sub">Create your account to get started</div>

            <form onSubmit={handleSubmit}>

              {/* Role selector — tab style */}
              <div className="rg-role-section">
                <span className="rg-role-section-label">Joining as</span>
                <div className="rg-roles">
                  {ROLES.map(r => (
                    <div
                      key={r.value}
                      className={`rg-role-tab ${form.role === r.value ? "active" : ""}`}
                      onClick={() => handleChange("role", r.value)}
                    >
                      <div className="rg-role-tab-name">{r.label}</div>
                      <div className="rg-role-tab-desc">{r.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="rg-field">
                <label className="rg-label">Full Name</label>
                <div className="rg-input-wrap">
                  <User size={14} className={`rg-input-icon ${focused === "name" ? "active" : ""}`} />
                  <input
                    className={`rg-input ${focused === "name" ? "active-border" : ""}`}
                    type="text"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={e => handleChange("fullName", e.target.value)}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused("")}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="rg-field">
                <label className="rg-label">Email address</label>
                <div className="rg-input-wrap">
                  <Mail size={14} className={`rg-input-icon ${focused === "email" ? "active" : ""}`} />
                  <input
                    className={`rg-input ${focused === "email" ? "active-border" : ""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => handleChange("email", e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="rg-field">
                <label className="rg-label">Password</label>
                <div className="rg-input-wrap">
                  <Lock size={14} className={`rg-input-icon ${focused === "pass" ? "active" : ""}`} />
                  <input
                    className={`rg-input ${focused === "pass" ? "active-border" : ""}`}
                    type="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => handleChange("password", e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused("")}
                  />
                </div>
                {strength && (
                  <div className="rg-strength">
                    <div className="rg-bars">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="rg-bar"
                          style={{ background: i <= strength.level ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span className="rg-strength-lbl" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {error && <div className="rg-error">{error}</div>}

              <button type="submit" className="rg-submit" disabled={loading}>
                <span>
                  {loading
                    ? <><LoaderCircle size={14} className="rg-spin" /> Creating Account</>
                    : <>Create Account <ArrowRight size={14} /></>
                  }
                </span>
              </button>
            </form>

            <div className="rg-footer">
              Already have an account?
              <Link to="/login">Sign in →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;