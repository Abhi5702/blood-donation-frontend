const Input = ({
  label, value, onChange, placeholder,
  type = "text", error, icon: Icon,
  disabled = false, required = false,
}) => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap');
      .bdms-input-field { display: flex; flex-direction: column; gap: 6px; font-family: 'Outfit', sans-serif; }
      .bdms-input-lbl {
        font-size: 10px; font-weight: 500; letter-spacing: 0.12em;
        text-transform: uppercase; color: #374151;
      }
      .bdms-input-wrap { position: relative; }
      .bdms-input-icon-wrap {
        position: absolute; left: 12px; top: 50%;
        transform: translateY(-50%); color: #9ca3af; pointer-events: none;
      }
      .bdms-input-el {
        width: 100%; background: #fff; border: 1.5px solid #e5e7eb;
        border-radius: 9px; font-size: 13px;
        font-family: 'Outfit', sans-serif; color: #111;
        outline: none; transition: all .15s; box-sizing: border-box;
      }
      .bdms-input-el:focus { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.08); }
      .bdms-input-el:disabled { background: #f9fafb; cursor: not-allowed; color: #9ca3af; }
      .bdms-input-el::placeholder { color: #9ca3af; }
      .bdms-input-err { font-size: 11px; color: #dc2626; }
    `}</style>

    <div className="bdms-input-field">
      {label && (
        <label className="bdms-input-lbl">
          {label}{required && <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div className="bdms-input-wrap">
        {Icon && (
          <div className="bdms-input-icon-wrap">
            <Icon size={14} />
          </div>
        )}
        <input
          type={type} value={value} onChange={onChange}
          placeholder={placeholder} disabled={disabled}
          className="bdms-input-el"
          style={{
            padding: Icon ? "11px 12px 11px 38px" : "11px 12px",
            borderColor: error ? "#dc2626" : undefined,
          }}
        />
      </div>
      {error && <span className="bdms-input-err">{error}</span>}
    </div>
  </>
);

export default Input;