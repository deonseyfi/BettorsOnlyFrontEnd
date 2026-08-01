import { cappers as fallbackCappers, getTier } from '../data.js';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { adaptLeaderboardEntry } from '../adapters.js';
import Avatar from '../components/Avatar.jsx';
import TierBadge from '../components/TierBadge.jsx';
import ApiStatus from '../components/ApiStatus.jsx';

const SPORTS = ['All Sports', 'NFL', 'NBA', 'MLB', 'NHL', 'Soccer'];
const METRICS = ['ROI', 'Win Rate', 'Units Won', 'Hot Streak', 'Most Sold'];
const RANGES = ['30 Days', '7 Days', 'All Time'];

export default function Leaderboard({ onNavigate }) {
  const { data, loading, error, isFallback } = useApi(
    () => api.getLeaderboard().then(rows => rows.map(adaptLeaderboardEntry)),
    [],
    { fallback: fallbackCappers }
  );

  const sorted = [...(data || [])].sort((a, b) => b.roi - a.roi);

  return (
    <div className="page active">
      <div className="inner">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="h1">Leaderboard</h1>
          <div className="h-sub">Top cappers on BettorsOnly — ranked by verified performance.</div>
        </div>

        <ApiStatus loading={loading} error={error} isFallback={isFallback} />

        <div className="lb-filters">
          <FilterGroup options={SPORTS} />
          <FilterGroup options={METRICS} />
          <FilterGroup options={RANGES} />
        </div>

        <div className="lb-table">
          <div className="lb-header">
            <div>Rank</div>
            <div>Capper</div>
            <div>ROI<span className="tip" data-tip="Return on Investment — profit per dollar risked. The pro standard.">?</span></div>
            <div>Win Rate</div>
            <div>Units</div>
            <div>Sales</div>
          </div>
          {sorted.map((cap, i) => {
            const rankCls = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
            const tier = getTier(cap.roi);
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
                <div className="lb-cell" style={{ color: tier ? tier.color : '#fff' }}>+{cap.roi}%</div>
                <div className="lb-cell">{cap.wins}%</div>
                <div className="lb-cell pos">{cap.profit}U</div>
                <div className="lb-cell">{cap.sales}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ options }) {
  return (
    <div className="lb-filter-group">
      {options.map((o, i) => (
        <button key={o} className={`lb-filter ${i === 0 ? 'active' : ''}`}>{o}</button>
      ))}
    </div>
  );
}
