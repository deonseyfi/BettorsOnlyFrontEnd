import { useState } from 'react';
import { cappers as fallbackCappers, getTier } from '../data.js';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { adaptLeaderboardEntry } from '../adapters.js';
import Avatar from '../components/Avatar.jsx';
import TierBadge from '../components/TierBadge.jsx';
import ApiStatus from '../components/ApiStatus.jsx';

const SPORTS = ['All Sports', 'NFL', 'NBA', 'MLB', 'NHL', 'Soccer'];

// Each metric has a label and the accessor used to sort the leaderboard.
// The default (Units Won) puts the biggest winners at the top.
const METRICS = [
  { label: 'Units Won',  key: 'profitRaw' },
  { label: 'ROI',        key: 'roi' },
  { label: 'Win Rate',   key: 'wins' },
  { label: 'Hot Streak', key: 'streakRaw' },
  { label: 'Most Sold',  key: 'sales' }
];

const RANGES = ['30 Days', '7 Days', 'All Time'];

export default function Leaderboard({ onNavigate }) {
  const [metric, setMetric] = useState(METRICS[0]);

  const { data, loading, error, isFallback } = useApi(
    () => api.getLeaderboard().then(rows => rows.map(adaptLeaderboardEntry)),
    [],
    { fallback: fallbackCappers }
  );

  // Sort descending by the selected metric. Missing values push to the bottom.
  const sorted = [...(data || [])].sort((a, b) => {
    const av = Number(a[metric.key] ?? -Infinity);
    const bv = Number(b[metric.key] ?? -Infinity);
    return bv - av;
  });

  return (
    <div className="page active">
      <div className="inner">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="h1">Leaderboard</h1>
          <div className="h-sub">Top cappers on BettorsOnly — ranked by {metric.label.toLowerCase()}.</div>
        </div>

        <ApiStatus loading={loading} error={error} isFallback={isFallback} />

        <div className="lb-filters">
          <FilterGroup options={SPORTS.map(s => ({ label: s }))} active={SPORTS[0]} onChange={() => {}} />
          <FilterGroup
            options={METRICS}
            active={metric.label}
            onChange={m => setMetric(METRICS.find(x => x.label === m))}
          />
          <FilterGroup options={RANGES.map(r => ({ label: r }))} active={RANGES[0]} onChange={() => {}} />
        </div>

        <div className="lb-table">
          <div className="lb-header">
            <div>Rank</div>
            <div>Capper</div>
            <div>ROI<span className="tip" data-tip="Return on Investment — profit per dollar risked.">?</span></div>
            <div>Win Rate</div>
            <div>Units<span className="tip" data-tip="Total profit in betting units over the last 30 days.">?</span></div>
            <div>Sales</div>
          </div>
          {sorted.map((cap, i) => {
            const rankCls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            const tier = getTier(cap.roi);
            const profitCls = cap.profitRaw >= 0 ? 'pos' : 'neg';
            return (
              <div key={cap.id} className="lb-row" onClick={() => onNavigate('capper', cap.id)} style={{ cursor: 'pointer' }}>
                <div className={`lb-rank ${rankCls}`}>{i + 1}</div>
                <div className="lb-user">
                  <Avatar ini={cap.ini} av={cap.av} />
                  <div className="lb-user-info">
                    <div className="lb-user-name">{cap.user} <TierBadge roi={cap.roi} /></div>
                    <div className="lb-user-meta">{cap.sport} · {cap.followers}</div>
                  </div>
                </div>
                <div className="lb-cell" style={{ color: tier ? tier.color : '#fff' }}>{cap.roi >= 0 ? '+' : ''}{cap.roi}%</div>
                <div className="lb-cell">{cap.wins}%</div>
                <div className={`lb-cell ${profitCls}`}>{cap.profit}U</div>
                <div className="lb-cell">{cap.sales}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ options, active, onChange }) {
  return (
    <div className="lb-filter-group">
      {options.map(o => (
        <button
          key={o.label}
          className={`lb-filter ${active === o.label ? 'active' : ''}`}
          onClick={() => onChange?.(o.label)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
