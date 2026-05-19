import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, LoaderCircle, Droplets } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [focused, setFocused] = useState("");

  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim())    { setError("Email is required"); return; }
    if (!password.trim()) { setError("Password is required"); return; }
    setLoading(true);
    try {
      const res = await axiosInstance.post(ENDPOINTS.LOGIN, { email, password });
      const { token, refreshToken, user } = res.data.data;
      login(token, refreshToken, user);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]}!`);
      navigate(
        user.role === "SUPER_ADMIN"    ? "/super-admin/dashboard" :
        user.role === "ADMIN"          ? "/admin/dashboard"       :
        user.role === "HOSPITAL_STAFF" ? "/hospital/dashboard"    :
                                          "/donor/dashboard"
      );
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@400;500&family=Manrope:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bl-root {
          min-height: 100vh;
          width: 100%;
          background: #f5f2ed;
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-family: 'Manrope', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* ── LEFT — editorial poster style ── */
        .bl-poster {
          background: #0f1923;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          overflow: hidden;
        }

        /* halftone dot grid */
        .bl-dots {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
          z-index: 0;
        }

        /* big diagonal red slash */
        .bl-slash {
          position: absolute;
          width: 3px;
          height: 180%;
          background: linear-gradient(180deg, transparent 0%, #c0392b 30%, #e74c3c 60%, transparent 100%);
          top: -40%;
          left: 52%;
          transform: rotate(-18deg);
          z-index: 1;
          opacity: 0.35;
        }
        .bl-slash2 {
          position: absolute;
          width: 1px;
          height: 180%;
          background: linear-gradient(180deg, transparent 0%, #c0392b 40%, transparent 100%);
          top: -40%;
          left: 58%;
          transform: rotate(-18deg);
          z-index: 1;
          opacity: 0.18;
        }

        /* large BLOOD text watermark */
        .bl-watermark {
          position: absolute;
          bottom: -20px;
          left: -10px;
          font-family: 'Playfair Display', serif;
          font-size: 160px;
          font-weight: 700;
          color: rgba(255,255,255,0.025);
          letter-spacing: -8px;
          line-height: 1;
          z-index: 0;
          user-select: none;
          white-space: nowrap;
        }

        .bl-poster-inner {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* logo */
        .bl-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bl-logo-mark {
          width: 36px; height: 36px;
          border: 1.5px solid rgba(192,57,43,0.6);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bl-logo-text {
          font-family: 'DM Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* hero */
        .bl-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; }

        .bl-eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #c0392b;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .bl-eyebrow::before {
          content: '';
          display: block;
          width: 32px;
          height: 1px;
          background: #c0392b;
        }

        .bl-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(40px, 4.5vw, 68px);
          font-weight: 400;
          color: #ffffff;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
        }
        .bl-headline em {
          font-style: italic;
          color: #e74c3c;
        }

        .bl-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.38);
          line-height: 1.8;
          max-width: 300px;
          font-weight: 300;
        }

        /* stat row */
        .bl-stats {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 24px;
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 0;
        }
        .bl-stat {
          padding-right: 20px;
          border-right: 1px solid rgba(255,255,255,0.07);
        }
        .bl-stat:last-child { border-right: none; padding-left: 20px; padding-right: 0; }
        .bl-stat:nth-child(2) { padding-left: 20px; }
        .bl-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #e74c3c;
          line-height: 1;
          margin-bottom: 4px;
        }
        .bl-stat-lbl {
          font-size: 10px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ── RIGHT — form ── */
        .bl-form-side {
          background: #f5f2ed;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 64px;
          position: relative;
        }

        /* subtle paper texture lines */
        .bl-form-side::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 31px,
            rgba(0,0,0,0.04) 31px,
            rgba(0,0,0,0.04) 32px
          );
          pointer-events: none;
        }

        .bl-form-wrap {
          width: 100%;
          max-width: 380px;
          position: relative;
          z-index: 1;
        }

        /* top bar with issue/vol text */
        .bl-form-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          padding-bottom: 16px;
          border-bottom: 2px solid #0f1923;
        }
        .bl-form-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 13px;
          font-weight: 400;
          color: #0f1923;
          letter-spacing: 0.02em;
        }
        .bl-form-header-meta {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #999;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .bl-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 700;
          color: #0f1923;
          line-height: 1.0;
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }
        .bl-form-sub {
          font-size: 13px;
          color: #888;
          font-weight: 300;
          margin-bottom: 36px;
        }

        /* field */
        .bl-field { margin-bottom: 20px; }
        .bl-label {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #666;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .bl-input-wrap { position: relative; }
        .bl-input-icon {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          color: #bbb;
          pointer-events: none;
          transition: color .2s;
        }
        .bl-input-icon.active { color: #c0392b; }
        .bl-input {
          width: 100%;
          padding: 10px 0 10px 28px;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #ccc;
          font-size: 14px;
          font-family: 'Manrope', sans-serif;
          font-weight: 400;
          color: #0f1923;
          outline: none;
          transition: border-color .2s;
          border-radius: 0;
        }
        .bl-input::placeholder { color: #bbb; }
        .bl-input:focus { border-bottom-color: #c0392b; }
        .bl-input.active-border { border-bottom-color: #c0392b; }

        /* error */
        .bl-error {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #c0392b;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .bl-error::before { content: '⚠'; }

        /* submit */
        .bl-submit {
          width: 100%;
          padding: 14px 24px;
          background: #0f1923;
          color: #fff;
          border: none;
          border-radius: 0;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all .2s;
          position: relative;
          overflow: hidden;
          margin-top: 8px;
        }
        .bl-submit::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0;
          background: #c0392b;
          transition: width .3s ease;
          z-index: 0;
        }
        .bl-submit:hover::after { width: 100%; }
        .bl-submit:hover { color: #fff; }
        .bl-submit span { position: relative; z-index: 1; display: flex; align-items: center; gap: 12px; }
        .bl-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .bl-submit:disabled::after { display: none; }

        .bl-footer {
          margin-top: 24px;
          font-size: 12px;
          color: #999;
          font-weight: 300;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .bl-footer a {
          color: #c0392b;
          text-decoration: none;
          font-weight: 500;
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
        }
        .bl-footer a:hover { text-decoration: underline; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .bl-spin { animation: spin .8s linear infinite; }

        @media (max-width: 860px) {
          .bl-root { grid-template-columns: 1fr; }
          .bl-poster { display: none; }
          .bl-form-side { padding: 40px 32px; background: #f5f2ed; }
        }
      `}</style>

      <div className="bl-root">

        {/* ── LEFT POSTER ── */}
        <div className="bl-poster">
          <div className="bl-dots" />
          <div className="bl-slash" />
          <div className="bl-slash2" />
          <div className="bl-watermark">BLOOD</div>

          <div className="bl-poster-inner">
            <div className="bl-logo">
              <div className="bl-logo-mark">
                <Droplets size={16} color="#e74c3c" />
              </div>
              <span className="bl-logo-text">Blood Bridge</span>
            </div>

            <div className="bl-hero">
              <div className="bl-eyebrow">Blood Donation Network</div>
              <h1 className="bl-headline">
                Every drop<br />
                is a <em>life</em><br />
                saved.
              </h1>
              <p className="bl-desc">
                A real-time platform connecting donors,
                hospitals, and coordinators — built to save
                lives faster.
              </p>
            </div>

          
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="bl-form-side">
          <div className="bl-form-wrap">

            <div className="bl-form-header">
              <span className="bl-form-header-title">Member Access</span>
              <span className="bl-form-header-meta">Blood Bridge / Sign In</span>
            </div>

            <div className="bl-form-title">Sign in.</div>
            <div className="bl-form-sub">Enter your credentials to continue</div>

            <form onSubmit={handleSubmit}>
              <div className="bl-field">
                <label className="bl-label">Email address</label>
                <div className="bl-input-wrap">
                  <Mail size={14} className={`bl-input-icon ${focused==="email"?"active":""}`} />
                  <input
                    className={`bl-input ${focused==="email"?"active-border":""}`}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                  />
                </div>
              </div>

              <div className="bl-field">
                <label className="bl-label">Password</label>
                <div className="bl-input-wrap">
                  <Lock size={14} className={`bl-input-icon ${focused==="pass"?"active":""}`} />
                  <input
                    className={`bl-input ${focused==="pass"?"active-border":""}`}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused("")}
                  />
                </div>
              </div>

              {error && <div className="bl-error">{error}</div>}

              <button type="submit" className="bl-submit" disabled={loading}>
                <span>
                  {loading
                    ? <><LoaderCircle size={14} className="bl-spin" /> Signing in</>
                    : <>Sign In <ArrowRight size={14} /></>
                  }
                </span>
              </button>
            </form>

            <div className="bl-footer">
              No account?
              <Link to="/register">Create one →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;