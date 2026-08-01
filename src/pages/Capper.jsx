import { livePicks as fallbackPicks, cappers as fallbackCappers } from '../data.js';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { adaptCapper, adaptPick } from '../adapters.js';
import TierBadge from '../components/TierBadge.jsx';
import Avatar from '../components/Avatar.jsx';
import ApiStatus from '../components/ApiStatus.jsx';

export default function Capper({ capperId, onOpenModal }) {
  const fallbackCap = fallbackCappers.find(c => String(c.id) === String(capperId)) || fallbackCappers[0];

  const capperRes = useApi(
    () => capperId ? api.getCapper(capperId).then(adaptCapper) : Promise.reject(new Error('No id')),
    [capperId],
    { fallback: fallbackCap }
  );

  const picksRes = useApi(
    () => capperId ? api.getCapperPicks(capperId).then(rows => rows.map(adaptPick)) : Promise.reject(new Error('No id')),
    [capperId],
    { fallback: fallbackPicks.filter(p => p.capperId === fallbackCap.id) }
  );

  const cap = capperRes.data || fallbackCap;
  const picks = picksRes.data || [];

  return (
    <div className="page active">
      <div className="inner">
        <ApiStatus loading={capperRes.loading || picksRes.loading} error={capperRes.error || picksRes.error} isFallback={capperRes.isFallback || picksRes.isFallback} />

        <div className="capper-cover">
          <Avatar ini={cap.ini} av={cap.av} className="capper-avatar-xl" />
          <div className="capper-name-xl">{cap.user} <TierBadge roi={cap.roi} /></div>
          <div className="capper-handle-xl">@{cap.user.toLowerCase()} · {cap.sport || 'Sports'} Specialist</div>
          <div className="capper-bio-xl">{cap.bio || `${cap.picks} picks tracked. +${cap.roi}% ROI with ${cap.profit} units of profit.`}</div>
          <div className="capper-actions-xl">
            <button className="btn btn-white btn-lg">Follow</button>
            <button className="btn btn-ghost btn-lg" onClick={() => alert('Direct message coming soon')}>Message</button>
          </div>
        </div>

        <div className="capper-stats-row">
          <div className="stat-card"><div className="stat-card-val" style={{ color: 'var(--god)' }}>+{cap.roi}%</div><div className="stat-card-lbl">ROI<span className="tip" data-tip="Return on Investment — how much profit you make per dollar risked. The pro standard.">?</span></div></div>
          <div className="stat-card"><div className="stat-card-val">{cap.wins}%</div><div className="stat-card-lbl">Win rate</div></div>
          <div className="stat-card"><div className="stat-card-val">{cap.picks}</div><div className="stat-card-lbl">Total picks</div></div>
          <div className="stat-card"><div className="stat-card-val" style={{ color: 'var(--green)' }}>{cap.profit}U</div><div className="stat-card-lbl">Profit</div></div>
          <div className="stat-card"><div className="stat-card-val" style={{ color: 'var(--gold)' }}>{cap.streak}</div><div className="stat-card-lbl">Streak</div></div>
        </div>

        <div className="section-label">Choose your access</div>
        <div className="pricing-options">
          <div className="pricing-card">
            <div className="p-tier">Single Pick</div>
            <div className="p-name">One-time purchase</div>
            <div className="p-price">${cap.price || 75}</div>
            <div className="p-features">
              <div className="p-feature">One verified pick delivered instantly</div>
              <div className="p-feature">Full analysis and reasoning</div>
              <div className="p-feature">Watermarked to your account</div>
              <div className="p-feature">No commitment</div>
            </div>
            <button className="btn btn-white btn-lg" style={{ width: '100%' }} onClick={() => onOpenModal({ type: 'buy', capper: cap })}>Buy single pick</button>
          </div>
          <div className="pricing-card featured">
            <div className="pricing-badge">Best Value</div>
            <div className="p-tier">Monthly Subscription</div>
            <div className="p-name">All Picks Pass</div>
            <div className="p-price">${cap.subPrice || 299} <span>/month</span></div>
            <div className="p-features">
              <div className="p-feature">Unlimited picks for 30 days</div>
              <div className="p-feature">Early access (30 min before public)</div>
              <div className="p-feature">Private Discord channel</div>
              <div className="p-feature">Cancel anytime</div>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => onOpenModal({ type: 'subscribe', capper: cap })}>Subscribe</button>
          </div>
        </div>

        <div className="section-label">Available picks now</div>
        <div className="picks-grid">
          {picks.map(p => (
            <div key={p.id} className="pick-card">
              <div className="pc-header">
                <div>
                  <div className="pc-game-tag">{p.sport}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginTop: 4 }}>{p.game}</div>
                </div>
                <div className="pc-pricing">
                  <div className="pc-price">${cap.price || 75}</div>
                  <div className="pc-price-sub">{p.time}</div>
                </div>
              </div>
              <div className="pc-content">
                <div className="pc-blur">
                  <div className="pc-pick-text">{p.pick} ({p.odds})</div>
                  <div className="pc-analysis">Detailed analysis with key stats, line movement, and confidence level...</div>
                </div>
                <div className="pc-lock">
                  <div className="pc-lock-content">
                    <div className="pc-lock-icon">🔒</div>
                    <div className="pc-lock-text">Locked</div>
                  </div>
                </div>
              </div>
              <div className="pc-footer">
                <div className="pc-stats">
                  <span>👥 {p.buyers}</span>
                  <span>⏰ Posted {p.posted}</span>
                </div>
                <button className="btn btn-white btn-sm" onClick={() => onOpenModal({ type: 'buy', pickId: p.id, capper: cap })}>Buy ${cap.price || 75}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
