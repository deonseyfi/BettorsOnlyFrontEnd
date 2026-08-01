import { useState, useMemo } from 'react';
import { initialParlayLegs } from '../data.js';

export default function Parlay() {
  const [legs, setLegs] = useState(initialParlayLegs);
  const [wager, setWager] = useState(100);

  const { americanOdds, payout } = useMemo(() => {
    let mult = 1;
    legs.forEach(l => {
      const o = parseInt(l.odds);
      if (isNaN(o)) return;
      if (o > 0) mult *= (1 + o / 100);
      else mult *= (1 + 100 / Math.abs(o));
    });
    const odds = mult >= 2 ? '+' + Math.round((mult - 1) * 100) : '-' + Math.round(100 / (mult - 1));
    const w = parseFloat(wager) || 100;
    return { americanOdds: odds, payout: '$' + (w * mult).toFixed(0) };
  }, [legs, wager]);

  const updateLeg = (i, field, value) => {
    setLegs(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  const addLeg = () => {
    if (legs.length >= 6) { alert('Maximum 6 legs for parlay qualification rules.'); return; }
    setLegs([...legs, { team: '', odds: '-110' }]);
  };

  const removeLeg = i => {
    if (legs.length <= 2) { alert('Minimum 2 legs required for a parlay.'); return; }
    setLegs(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="page active">
      <div className="inner">
        <div className="parlay-wrap">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="h1">Parlay Calculator</h1>
            <div className="h-sub">Build your parlay. See your combined odds and payout in real time.</div>
          </div>

          <div>
            {legs.map((leg, i) => (
              <div key={i} className="parlay-leg">
                <div className="leg-num">{i + 1}</div>
                <div>
                  <label className="field-label">Pick</label>
                  <input type="text" className="field-input" value={leg.team} onChange={e => updateLeg(i, 'team', e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Odds</label>
                  <input type="text" className="field-input" value={leg.odds} onChange={e => updateLeg(i, 'odds', e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Sport</label>
                  <select className="field-input">
                    <option>NBA</option><option>NFL</option><option>MLB</option><option>NHL</option><option>Soccer</option>
                  </select>
                </div>
                <button className="remove-btn" onClick={() => removeLeg(i)}>×</button>
              </div>
            ))}
          </div>

          <button className="add-leg-btn" onClick={addLeg}>+ Add another leg</button>

          <div className="parlay-summary">
            <div className="summary-row">
              <div className="summary-label">Number of legs</div>
              <div className="summary-value">{legs.length}</div>
            </div>
            <div className="summary-row">
              <div className="summary-label">Combined odds</div>
              <div className="summary-value">{americanOdds}</div>
            </div>
            <div className="summary-row wager-row">
              <div className="summary-label">Wager amount</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--text-3)' }}>$</span>
                <input type="number" className="wager-input" value={wager} onChange={e => setWager(e.target.value)} />
              </div>
            </div>
            <div className="summary-row" style={{ paddingTop: 14, marginTop: 6, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>Potential payout</div>
              <div className="summary-value huge">{payout}</div>
            </div>
          </div>

          <div className="parlay-rules">
            <strong>Qualification rules for BettorsOnly cappers:</strong><br />
            Parlays must contain <strong>2 to 6 legs</strong> to count toward your tier. Tiers are based on <strong>ROI</strong> — the math automatically accounts for odds, so any pick is allowed as long as it's submitted <strong>before the game starts</strong>.
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: '1.5rem' }}>
            <button className="btn btn-white btn-lg" style={{ flex: 1 }} onClick={() => alert('Parlay saved!')}>Save Parlay</button>
            <button className="btn btn-ghost btn-lg" style={{ flex: 1 }} onClick={() => alert('Link copied!')}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}
