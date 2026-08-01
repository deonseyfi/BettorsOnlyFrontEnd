import Avatar from './Avatar.jsx';
import TierBadge from './TierBadge.jsx';

export default function PickCard({ pick, capper, promoted = false, onCapperClick, onBuy }) {
  return (
    <div className="pick-card" style={promoted ? { borderColor: 'rgba(245,158,11,0.4)' } : undefined}>
      {promoted && (
        <div style={{ marginBottom: 10 }}>
          <span className="promoted-badge">⭐ Promoted</span>
        </div>
      )}
      <div className="pc-header">
        <div className="pc-capper" onClick={onCapperClick}>
          <Avatar ini={capper.ini} av={capper.av} />
          <div className="pc-capper-info">
            <div className="pc-capper-name">{capper.user} <TierBadge roi={capper.roi} /></div>
            <div className="pc-capper-meta">+{capper.roi}% ROI · {capper.wins}% win · {capper.profit}U · {pick.posted}</div>
          </div>
        </div>
        <div className="pc-pricing">
          <div className="pc-price">${capper.price}</div>
          <div className="pc-price-sub">or ${capper.subPrice}/mo</div>
        </div>
      </div>
      <div className="pc-content">
        <div className="pc-game-tag">{pick.sport} · {pick.game}</div>
        <div className="pc-blur">
          <div className="pc-pick-text">{pick.pick} ({pick.odds})</div>
          <div className="pc-analysis">Full analysis explaining why this pick has value, key stats, line movement, and confidence level...</div>
        </div>
        <div className="pc-lock">
          <div className="pc-lock-content">
            <div className="pc-lock-icon">🔒</div>
            <div className="pc-lock-text">Purchase to unlock</div>
          </div>
        </div>
      </div>
      <div className="pc-footer">
        <div className="pc-stats">
          <span>👥 {pick.buyers}</span>
          <span>⏰ {pick.time}</span>
        </div>
        <button className="btn btn-white btn-sm" onClick={onBuy}>Buy ${capper.price}</button>
      </div>
    </div>
  );
}
