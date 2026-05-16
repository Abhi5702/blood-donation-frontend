import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, LoaderCircle, Droplets } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axiosInstance from "../../api/axiosInstance";
import { ENDPOINTS } from "../../api/endpoints";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const { login, dashboardRoute } = useAuth();
  const navigate = useNavigate();

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .bdms-login-root {
          min-height: 100vh; width: 100%; display: flex;
          font-family: 'Outfit', sans-serif; overflow: hidden;
        }

        /* ── LEFT ── */
        .bdms-left {
          flex: 1; position: relative;
          display: flex; flex-direction: column;
          padding: 48px 52px; overflow: hidden;
          justify-content: space-between;
        }
        .bdms-left-bg {
          position: absolute; inset: 0;
          background: linear-gradient(145deg, #1a0000 0%, #3d0000 40%, #7f1d1d 100%);
          z-index: 0;
        }
        .bdms-grid {
          position: absolute; inset: 0; z-index: 1;
          background-image:
            linear-gradient(rgba(220,38,38,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(220,38,38,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .bdms-orb1 {
          position: absolute; width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.2) 0%, transparent 65%);
          bottom: -150px; left: -100px; z-index: 1; filter: blur(20px);
          animation: orbF 8s ease-in-out infinite alternate;
        }
        .bdms-orb2 {
          position: absolute; width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 65%);
          top: 60px; right: 80px; z-index: 1; filter: blur(15px);
          animation: orbF 10s ease-in-out infinite alternate-reverse;
        }
        @keyframes orbF { from{transform:translateY(0) scale(1)} to{transform:translateY(-24px) scale(1.06)} }

        .bdms-left-inner {
          position: relative; z-index: 2; height: 100%;
          display: flex; flex-direction: column; justify-content: space-between;
        }
        .bdms-brand { display: flex; align-items: center; gap: 12px; }
        .bdms-brand-icon {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(220,38,38,0.2); border: 1px solid rgba(220,38,38,0.3);
          display: flex; align-items: center; justify-content: center;
        }
        .bdms-brand-name {
          font-family: 'Syne', sans-serif; font-size: 22px;
          font-weight: 700; color: #fff; letter-spacing: -0.02em;
        }
        .bdms-brand-name span { color: #fca5a5; }

        .bdms-hero { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .bdms-kicker {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; color: #fca5a5; margin-bottom: 24px;
        }
        .bdms-kicker-dot {
          width: 6px; height: 6px; border-radius: 50%; background: #fca5a5;
          animation: blink 2s ease infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .bdms-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(36px, 4vw, 58px);
          font-weight: 800; color: #fff; line-height: 1.0;
          letter-spacing: -0.03em; margin-bottom: 20px;
        }
        .bdms-headline .red { color: #f87171; }
        .bdms-desc {
          font-size: 14px; color: rgba(255,255,255,0.45);
          font-weight: 300; line-height: 1.75; max-width: 380px; margin-bottom: 40px;
        }

        .bdms-stats {
          display: flex; gap: 32px; padding-top: 28px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .bdms-stat-num {
          font-family: 'Syne', sans-serif; font-size: 24px;
          font-weight: 700; color: #f87171;
        }
        .bdms-stat-lbl { font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 3px; }

        /* ── RIGHT ── */
        .bdms-right {
          width: 460px; flex-shrink: 0; background: #fafafa;
          border-left: 1px solid #fee2e2;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden; padding: 48px 44px;
        }
        .bdms-right-glow {
          position: absolute; bottom: -80px; right: -60px;
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 65%);
          z-index: 0;
        }

        .bdms-form-card { position: relative; z-index: 1; width: 100%; max-width: 360px; }

        .bdms-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 500; letter-spacing: 0.15em;
          text-transform: uppercase; color: #dc2626;
          background: #fee2e2; border: 1px solid #fecaca;
          padding: 4px 10px; border-radius: 4px; margin-bottom: 20px;
        }
        .bdms-form-title {
          font-family: 'Syne', sans-serif; font-size: 32px;
          font-weight: 700; color: #111; line-height: 1.05;
          letter-spacing: -0.02em; margin-bottom: 6px;
        }
        .bdms-form-sub { font-size: 13px; color: #9ca3af; margin-bottom: 32px; }

        .bdms-field { margin-bottom: 16px; }
        .bdms-label {
          display: block; font-size: 10px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #374151; margin-bottom: 7px;
        }
        .bdms-input-wrap { position: relative; }
        .bdms-input-icon {
          position: absolute; left: 13px; top: 50%;
          transform: translateY(-50%); color: #d1a0a0; pointer-events: none;
        }
        .bdms-input {
          width: 100%; padding: 12px 12px 12px 42px;
          background: #fff; border: 1.5px solid #e5e7eb;
          border-radius: 9px; font-size: 13px;
          font-family: 'Outfit', sans-serif; color: #111;
          outline: none; transition: all .15s; box-sizing: border-box;
        }
        .bdms-input::placeholder { color: #9ca3af; }
        .bdms-input:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.08); }

        .bdms-error {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px; background: #fef2f2;
          border: 1px solid #fecaca; border-radius: 8px;
          font-size: 13px; color: #dc2626; margin-bottom: 16px;
        }

        .bdms-btn {
          width: 100%; padding: 13px 24px; background: #dc2626;
          color: #fff; border: none; border-radius: 9px;
          font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
          font-family: 'Syne', sans-serif; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .15s; box-shadow: 0 2px 12px rgba(220,38,38,0.3);
          margin-top: 4px;
        }
        .bdms-btn:hover:not(:disabled) {
          background: #b91c1c;
          box-shadow: 0 4px 20px rgba(220,38,38,0.4);
          transform: translateY(-1px);
        }
        .bdms-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .bdms-divider {
          display: flex; align-items: center; gap: 12px; margin: 20px 0;
        }
        .bdms-divider::before, .bdms-divider::after {
          content: ''; flex: 1; height: 1px; background: #e5e7eb;
        }
        .bdms-divider span { font-size: 11px; color: #9ca3af; }

        .bdms-footer { text-align: center; font-size: 13px; color: #6b7280; }
        .bdms-footer a {
          color: #dc2626; font-weight: 500; text-decoration: none; margin-left: 4px;
        }
        .bdms-footer a:hover { text-decoration: underline; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .bdms-spin { animation: spin .8s linear infinite; }

        @media (max-width: 860px) {
          .bdms-left { display: none; }
          .bdms-right { width: 100%; border-left: none; }
        }
      `}</style>

      <div className="bdms-login-root">

        {/* ── LEFT ── */}
        <div className="bdms-left">
          <div className="bdms-left-bg" />
          <div className="bdms-grid" />
          <div className="bdms-orb1" />
          <div className="bdms-orb2" />
          <div className="bdms-left-inner">
            <div className="bdms-brand">
              <div className="bdms-brand-icon">
                <Droplets size={22} color="#f87171" />
              </div>
              <div className="bdms-brand-name">Blood<span>Link</span></div>
            </div>
            <div className="bdms-hero">
              <div className="bdms-kicker">
                <span className="bdms-kicker-dot" />
                Blood Donation Management
              </div>
              <h1 className="bdms-headline">
                Save lives,<br />
                one <span className="red">drop</span><br />
                at a time.
              </h1>
              <p className="bdms-desc">
                Connect donors with hospitals in real-time.
                Manage blood requests, track inventory, and
                coordinate life-saving appointments across your network.
              </p>
              <div className="bdms-stats">
                {[
                  { num: "12k+", lbl: "Active Donors" },
                  { num: "3.4k", lbl: "Lives Saved"   },
                  { num: "98%",  lbl: "Match Rate"    },
                ].map(s => (
                  <div key={s.lbl}>
                    <div className="bdms-stat-num">{s.num}</div>
                    <div className="bdms-stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="bdms-right">
          <div className="bdms-right-glow" />
          <div className="bdms-form-card">

            <div className="bdms-tag">✦ Secure Access</div>
            <h2 className="bdms-form-title">Welcome<br />back.</h2>
            <p className="bdms-form-sub">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit}>
              <div className="bdms-field">
                <label className="bdms-label">Email Address</label>
                <div className="bdms-input-wrap">
                  <Mail size={15} className="bdms-input-icon" />
                  <input
                    className="bdms-input"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="bdms-field">
                <label className="bdms-label">Password</label>
                <div className="bdms-input-wrap">
                  <Lock size={15} className="bdms-input-icon" />
                  <input
                    className="bdms-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="bdms-error">⚠ {error}</div>}

              <button type="submit" className="bdms-btn" disabled={loading}>
                {loading
                  ? <><LoaderCircle size={15} className="bdms-spin" /> Signing in...</>
                  : <>Sign In <ArrowRight size={14} /></>
                }
              </button>
            </form>

            <div className="bdms-divider"><span>New here?</span></div>
            <div className="bdms-footer">
              Don't have an account?
              <Link to="/register">Create one →</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;