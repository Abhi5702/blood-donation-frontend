import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color = "#dc2626", trend, delay = "0ms" }) => {
  const lightColor = color + "15";
  const borderColor = color + "25";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Outfit:wght@400;500&display=swap');
        @keyframes scFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bdms-sc {
          background: #fff; border: 1px solid #f3f4f6;
          border-radius: 16px; padding: 20px 22px;
          display: flex; flex-direction: column; gap: 14px;
          position: relative; overflow: hidden;
          transition: box-shadow .2s, transform .2s;
          animation: scFadeUp .4s ease both;
          font-family: 'Outfit', sans-serif;
        }
        .bdms-sc:hover {
          box-shadow: 0 8px 28px rgba(0,0,0,0.07);
          transform: translateY(-2px);
        }
        .bdms-sc-bg {
          position: absolute; top: -20px; right: -20px;
          width: 90px; height: 90px; border-radius: 50%; opacity: .08;
        }
        .bdms-sc-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .bdms-sc-icon-wrap {
          width: 42px; height: 42px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .bdms-sc-trend {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 500;
          padding: 3px 7px; border-radius: 999px;
        }
        .bdms-sc-label {
          font-size: 12px; color: #6b7280; font-weight: 400; margin-bottom: 4px;
        }
        .bdms-sc-value {
          font-family: 'Syne', sans-serif; font-size: 28px;
          font-weight: 700; color: #111; letter-spacing: -0.02em; line-height: 1;
        }
      `}</style>

      <div className="bdms-sc" style={{ animationDelay: delay }}>
        <div className="bdms-sc-bg" style={{ background: color }} />
        <div className="bdms-sc-top">
          <div
            className="bdms-sc-icon-wrap"
            style={{ background: lightColor, border: `1px solid ${borderColor}` }}
          >
            <Icon size={20} color={color} />
          </div>
          {trend && (
            <div
              className="bdms-sc-trend"
              style={{
                background: trend.up ? "#dcfce715" : "#fee2e215",
                color: trend.up ? "#16a34a" : "#dc2626",
              }}
            >
              {trend.up
                ? <ArrowUpRight size={11} />
                : <ArrowDownRight size={11} />
              }
              {trend.label}
            </div>
          )}
        </div>
        <div>
          <div className="bdms-sc-label">{label}</div>
          <div className="bdms-sc-value">{value}</div>
        </div>
      </div>
    </>
  );
};

export default StatCard;