const Spinner = () => (
  <div style={{
    display: "flex", alignItems: "center",
    justifyContent: "center", height: "100vh",
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: "50%",
      border: "3px solid #e5e7eb",
      borderTop: "3px solid #dc2626",
      animation: "spin 0.8s linear infinite",
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;