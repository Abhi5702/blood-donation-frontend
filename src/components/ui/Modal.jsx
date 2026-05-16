import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const maxW = { sm: 400, md: 520, lg: 680 }[size] || 520;

  return (
    <>
      <style>{`
        .bdms-modal-backdrop {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.28); backdrop-filter: blur(4px);
          padding: 16px; animation: bdIn .18s ease;
        }
        @keyframes bdIn { from{opacity:0} to{opacity:1} }
        .bdms-modal-box {
          background: #fff; border-radius: 20px;
          border: 1px solid #fee2e2;
          box-shadow: 0 24px 64px rgba(0,0,0,0.1), 0 4px 16px rgba(220,38,38,0.06);
          width: 100%; max-height: 90vh;
          display: flex; flex-direction: column;
          animation: mdIn .22s cubic-bezier(0.34,1.56,0.64,1);
          font-family: 'Outfit', sans-serif; overflow: hidden;
        }
        @keyframes mdIn {
          from { opacity:0; transform:scale(0.94) translateY(10px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .bdms-modal-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 24px; border-bottom: 1px solid #fef2f2; flex-shrink: 0;
        }
        .bdms-modal-title {
          font-family: 'Syne', sans-serif; font-size: 16px;
          font-weight: 700; color: #111; letter-spacing: -0.01em;
        }
        .bdms-modal-close {
          width: 30px; height: 30px; border-radius: 8px;
          background: #f9fafb; border: 1px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .15s; color: #6b7280;
        }
        .bdms-modal-close:hover { background: #fef2f2; border-color: #fecaca; color: #dc2626; }
        .bdms-modal-body {
          padding: 24px; overflow-y: auto; flex: 1;
        }
        .bdms-modal-body::-webkit-scrollbar { width: 4px; }
        .bdms-modal-body::-webkit-scrollbar-thumb { background: #fecaca; border-radius: 4px; }
      `}</style>

      <div className="bdms-modal-backdrop" onClick={onClose}>
        <div
          className="bdms-modal-box"
          style={{ maxWidth: maxW }}
          onClick={e => e.stopPropagation()}
        >
          <div className="bdms-modal-header">
            <span className="bdms-modal-title">{title}</span>
            <button className="bdms-modal-close" onClick={onClose}>
              <X size={14} />
            </button>
          </div>
          <div className="bdms-modal-body">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;