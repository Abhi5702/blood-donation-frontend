const VARIANTS = {
  red:    { bg: "#fee2e2", color: "#dc2626" },
  green:  { bg: "#dcfce7", color: "#16a34a" },
  blue:   { bg: "#dbeafe", color: "#2563eb" },
  amber:  { bg: "#fef3c7", color: "#d97706" },
  purple: { bg: "#ede9fe", color: "#7c3aed" },
  gray:   { bg: "#f3f4f6", color: "#6b7280" },
};

const Badge = ({ label, variant = "gray", size = "sm" }) => {
  const { bg, color } = VARIANTS[variant] || VARIANTS.gray;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: size === "sm" ? "2px 8px" : "4px 12px",
      borderRadius: 999, fontSize: size === "sm" ? 11 : 12,
      fontWeight: 600, background: bg, color,
      fontFamily: "'Outfit', sans-serif", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
};

export default Badge;