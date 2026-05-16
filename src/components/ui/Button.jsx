import { LoaderCircle } from "lucide-react";

const VARIANTS = {
  primary:   { bg: "#dc2626", hover: "#b91c1c", color: "#fff", border: "transparent"  },
  secondary: { bg: "#fff",    hover: "#fef2f2", color: "#374151", border: "#e5e7eb"   },
  success:   { bg: "#16a34a", hover: "#15803d", color: "#fff", border: "transparent"  },
  danger:    { bg: "#dc2626", hover: "#b91c1c", color: "#fff", border: "transparent"  },
  ghost:     { bg: "transparent", hover: "#fef2f2", color: "#dc2626", border: "transparent" },
};

const Button = ({
  children, onClick, type = "button",
  variant = "primary", size = "md",
  loading = false, disabled = false,
  icon: Icon, fullWidth = false,
}) => {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const pad = size === "sm" ? "7px 14px" : size === "lg" ? "13px 24px" : "10px 18px";
  const fs  = size === "sm" ? 12 : size === "lg" ? 14 : 13;

  return (
    <>
      <style>{`
        @keyframes btnSpin { to { transform: rotate(360deg); } }
        .bdms-btn-spin { animation: btnSpin .8s linear infinite; }
      `}</style>
      <button
        type={type} onClick={onClick}
        disabled={disabled || loading}
        style={{
          display: "inline-flex", alignItems: "center",
          justifyContent: "center", gap: 7,
          padding: pad, fontSize: fs, fontWeight: 500,
          fontFamily: "'Outfit', sans-serif",
          background: v.bg, color: v.color,
          border: `1px solid ${v.border}`,
          borderRadius: 9, cursor: disabled || loading ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          transition: "all .15s",
          width: fullWidth ? "100%" : "auto",
          boxShadow: variant === "primary" || variant === "danger"
            ? "0 2px 8px rgba(220,38,38,0.2)" : "none",
        }}
        onMouseEnter={e => {
          if (!disabled && !loading) e.currentTarget.style.background = v.hover;
        }}
        onMouseLeave={e => {
          if (!disabled && !loading) e.currentTarget.style.background = v.bg;
        }}
      >
        {loading
          ? <LoaderCircle size={14} className="bdms-btn-spin" />
          : Icon ? <Icon size={14} /> : null
        }
        {loading ? "Loading..." : children}
      </button>
    </>
  );
};

export default Button;