import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail, Lock, User, ArrowRight,
  LoaderCircle, Droplets, ChevronDown
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
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError("");
  };

  const getStrength = (pw) => {
    if (!pw)        return null;
    if (pw.length < 6)  return { level: 1, label: "Weak",   color: "#ef4444" };
    if (pw.length < 10) return { level: 2, label: "Fair",   color: "#f59e0b" };
    return               { level: 3, label: "Strong", color: "#22c55e" };
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bdms-reg-root {
          min-height: 100vh; width: 100%; display: flex;
          font-family: 'Outfit', sans-serif; overflow: hidden;
        }

        /* ── LEFT ── */
        .bdms-reg-left {
          flex: 1; position: relative;
          display: flex; flex-direction: column;
          padding: 48px 52px; overflow: hidden; justify-content: space-between;
        }
        .bdms-reg-left-bg {
          position: absolute; inset: 0;
          background: linear-gradient(145deg, #1a0000 0%, #3d0000 40%, #7f1d1d 100%);
          z-index: 0;
        }
        .bdms-reg-grid {
          position: absolute; inset: 0; z-index: 1;
          background-image:
            linear-gradient(rgba(220,38,38,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bdms-reg-orb1 {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 65%);
          bottom: -150px; left: -100px; z-index: 1; filter: blur(20px);
          animation: regOrbF 8s ease-in-out infinite alternate;
        }
        @keyframes regOrbF { from{transform:translateY(0)} to{transform:translateY(-24px)} }

        .bdms-reg-inner {
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .bdms-reg-brand { display: flex; align-items: center; gap: 12px; }
        .bdms-reg-brand-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(220,38,38,0.2); border: 1px solid rgba(220,38,38,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .bdms-reg-brand-name {
          font-family: 'Syne', sans-serif; font-size: 22px;
          font-weight: 700; color: #fff; letter-spacing: -0.02em;
        }
        .bdms-reg-brand-name span { color: #fca5a5; }

        .bdms-reg-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .bdms-reg-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(34px, 4vw, 54px); font-weight: 800;
          color: #fff; line-height: 1.0; letter-spacing: -0.03em; margin-bottom: 20px;
        }
        .bdms-reg-headline .red { color: #f87171; }
        .bdms-reg-desc {
          font-size: 14px; color: rgba(255,255,255,0.45);
          line-height: 1.75; max-width: 360px; margin-bottom: 36px;
        }

        .bdms-reg-steps { display: flex; flex-direction: column; gap: 16px; }
        .bdms-reg-step { display: flex; align-items: flex-start; gap: 14px; }
        .bdms-reg-step-dot {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1px solid rgba(220,38,38,0.4);
          background: rgba(220,38,38,0.1);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: #f87171; font-weight: 500; flex-shrink: 0;
        }
        .bdms-reg-step-title { font-size: 13px; color: #fff; }
        .bdms-reg-step-desc  { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 2px; }

        /* ── RIGHT ── */
        .bdms-reg-right {
          width: 500px; flex-shrink: 0; background: #fafafa;
          border-left: 1px solid #fee2e2;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 40px 44px;
        }
        .bdms-reg-right-glow {
          position: absolute; bottom: -80px; right: -60px;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%);
          z-index: 0;
        }

        .bdms-reg-card { position: relative; z-index: 1; width: 100%; max-width: 400px; }
        .bdms-reg-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; color: #dc2626;
          background: #fee2e2; border: 1px solid #fecaca;
          padding: 4px 10px; border-radius: 4px; margin-bottom: 16px;
        }
        .bdms-reg-title {
          font-family: 'Syne', sans-serif; font-size: 30px;
          font-weight: 700; color: #111; line-height: 1.05;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .bdms-reg-sub { font-size: 13px; color: #9ca3af; margin-bottom: 24px; }

        /* Role selector */
        .bdms-reg-roles { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .bdms-reg-role-label {
          font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
          text-transform: uppercase; color: #374151; margin-bottom: 4px; display: block;
        }
        .bdms-reg-role-option {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 9px; cursor: pointer;
          border: 1.5px solid #e5e7eb; background: #fff; transition: all .15s;
        }
        .bdms-reg-role-option.selected {
          border-color: #dc2626; background: #fff5f5;
        }
        .bdms-reg-role-option:hover { border-color: #fca5a5; }
        .bdms-reg-role-radio {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid #d1d5db; flex-shrink: 0; transition: all .15s;
          display: flex; align-items: center; justify-content: center;
        }
        .bdms-reg-role-option.selected .bdms-reg-role-radio {
          border-color: #dc2626;
          background: #dc2626;
        }
        .bdms-reg-role-radio-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #fff;
        }
        .bdms-reg-role-name  { font-size: 13px; font-weight: 500; color: #111; }
        .bdms-reg-role-desc  { font-size: 11px; color: #9ca3af; margin-top: 1px; }

        /* Fields */
        .bdms-reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .bdms-reg-field { margin-bottom: 14px; }
        .bdms-reg-label {
          display: block; font-size: 10px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #374151; margin-bottom: 7px;
        }
        .bdms-reg-input-wrap { position: relative; }
        .bdms-reg-input-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #d1a0a0; pointer-events: none;
        }
        .bdms-reg-input {
          width: 100%; padding: 11px 12px 11px 40px;
          background: #fff; border: 1.5px solid #e5e7eb;
          border-radius: 9px; font-size: 13px;
          font-family: 'Outfit', sans-serif; color: #111;
          outline: none; transition: all .15s; box-sizing: border-box;
        }
        .bdms-reg-input::placeholder { color: #9ca3af; }
        .bdms-reg-input:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.08); }

        /* password strength */
        .bdms-reg-strength { display: flex; align-items: center; gap: 8px; margin-top: 7px; }
        .bdms-reg-bars { display: flex; gap: 4px; }
        .bdms-reg-bar { width: 28px; height: 3px; border-radius: 2px; background: #e5e7eb; transition: background .3s; }
        .bdms-reg-strength-lbl { font-size: 11px; }

        .bdms-reg-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #dc2626; margin-bottom: 14px;
        }

        .bdms-reg-btn {
          width: 100%; padding: 13px 24px; background: #dc2626;
          color: #fff; border: none; border-radius: 9px;
          font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
          font-family: 'Syne', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .15s; box-shadow: 0 2px 12px rgba(220,38,38,0.3);
        }
        .bdms-reg-btn:hover:not(:disabled) {
          background: #b91c1c;
          box-shadow: 0 4px 20px rgba(220,38,38,0.4);
          transform: translateY(-1px);
        }
        .bdms-reg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .bdms-reg-footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 16px; }
        .bdms-reg-footer a {
          color: #dc2626; font-weight: 500; text-decoration: none; margin-left: 4px;
        }
        .bdms-reg-footer a:hover { text-decoration: underline; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .bdms-reg-spin { animation: spin .8s linear infinite; }

        @media (max-width: 900px) {
          .bdms-reg-left { display: none; }
          .bdms-reg-right { width: 100%; border-left: none; }
        }
      `}</style>

      <div className="bdms-reg-root">

        {/* ── LEFT ── */}
        <div className="bdms-reg-left">
          <div className="bdms-reg-left-bg" />
          <div className="bdms-reg-grid" />
          <div className="bdms-reg-orb1" />
          <div className="bdms-reg-inner">
            <div className="bdms-reg-brand">
              <div className="bdms-reg-brand-icon">
                <Droplets size={22} color="#f87171" />
              </div>
              <div className="bdms-reg-brand-name">Blood<span>Link</span></div>
            </div>
            <div className="bdms-reg-hero">
              <h1 className="bdms-reg-headline">
                Join the<br /><span className="red">movement.</span>
              </h1>
              <p className="bdms-reg-desc">
                Become part of a network that saves lives every day.
                Connect donors, hospitals, and coordinators in one platform.
              </p>
              <div className="bdms-reg-steps">
                {[
                  { n: "01", title: "Create your profile",   desc: "Register as donor, hospital, or admin" },
                  { n: "02", title: "Get matched instantly", desc: "Find compatible donors nearby"          },
                  { n: "03", title: "Save lives",            desc: "Coordinate, donate, and track impact"  },
                ].map(s => (
                  <div className="bdms-reg-step" key={s.n}>
                    <div className="bdms-reg-step-dot">{s.n}</div>
                    <div>
                      <div className="bdms-reg-step-title">{s.title}</div>
                      <div className="bdms-reg-step-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="bdms-reg-right">
          <div className="bdms-reg-right-glow" />
          <div className="bdms-reg-card">

            <div className="bdms-reg-tag">✦ Get Started</div>
            <h2 className="bdms-reg-title">Create your<br />account.</h2>
            <p className="bdms-reg-sub">Fill in your details to join the network</p>

            <form onSubmit={handleSubmit}>

              {/* Role selector */}
              <span className="bdms-reg-role-label">I am joining as</span>
              <div className="bdms-reg-roles">
                {ROLES.map(r => (
                  <div
                    key={r.value}
                    className={`bdms-reg-role-option ${form.role === r.value ? "selected" : ""}`}
                    onClick={() => handleChange("role", r.value)}
                  >
                    <div className="bdms-reg-role-radio">
                      {form.role === r.value && <div className="bdms-reg-role-radio-dot" />}
                    </div>
                    <div>
                      <div className="bdms-reg-role-name">{r.label}</div>
                      <div className="bdms-reg-role-desc">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Name + Email */}
              <div className="bdms-reg-row">
                <div className="bdms-reg-field">
                  <label className="bdms-reg-label">Full Name</label>
                  <div className="bdms-reg-input-wrap">
                    <User size={14} className="bdms-reg-input-icon" />
                    <input
                      className="bdms-reg-input"
                      type="text" placeholder="John Doe"
                      value={form.fullName}
                      onChange={e => handleChange("fullName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="bdms-reg-field">
                  <label className="bdms-reg-label">Email</label>
                  <div className="bdms-reg-input-wrap">
                    <Mail size={14} className="bdms-reg-input-icon" />
                    <input
                      className="bdms-reg-input"
                      type="email" placeholder="you@example.com"
                      value={form.email}
                      onChange={e => handleChange("email", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="bdms-reg-field">
                <label className="bdms-reg-label">Password</label>
                <div className="bdms-reg-input-wrap">
                  <Lock size={14} className="bdms-reg-input-icon" />
                  <input
                    className="bdms-reg-input"
                    type="password" placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={e => handleChange("password", e.target.value)}
                  />
                </div>
                {strength && (
                  <div className="bdms-reg-strength">
                    <div className="bdms-reg-bars">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="bdms-reg-bar"
                          style={{ background: i <= strength.level ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span className="bdms-reg-strength-lbl" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {error && <div className="bdms-reg-error">⚠ {error}</div>}

              <button type="submit" className="bdms-reg-btn" disabled={loading}>
                {loading
                  ? <><LoaderCircle size={15} className="bdms-reg-spin" /> Creating Account...</>
                  : <>Create Account <ArrowRight size={14} /></>
                }
              </button>
            </form>

            <div className="bdms-reg-footer">
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