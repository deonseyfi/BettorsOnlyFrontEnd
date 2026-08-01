import { useState } from 'react';
import { cappers as fallbackCappers, livePicks as fallbackPicks, getTier } from '../data.js';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { adaptPick, adaptLeaderboardEntry } from '../adapters.js';
import PickCard from '../components/PickCard.jsx';
import ApiStatus from '../components/ApiStatus.jsx';

// Each chip has a display label and the sport value it matches against `pick.sport`.
// Values match what the Submit Pick form saves (NBA, NFL, MLB, NHL, Soccer (EPL), …).
// MLB-first ordering matches the current release focus. 'All' still works —
// it just means "any sport". The rest are kept so old picks (NBA, NFL, etc.)
// remain filterable.
const SPORT_CHIPS = [
  { label: 'All', value: null },
  { label: '⚾ MLB', value: 'MLB' },
  { label: '🏈 NFL', value: 'NFL' },
  { label: '🏀 NBA', value: 'NBA' },
  { label: '🏒 NHL', value: 'NHL' },
  { label: '⚽ Soccer', value: 'Soccer (EPL)' }
];
// Backend tier enum → chip label. 'All' matches everything.
const TIER_CHIPS = [
  { label: 'All', value: null },
  { label: '🥉', value: 'bronze' },
  { label: '🥈', value: 'silver' },
  { label: '🥇', value: 'gold' },
  { label: '⚡', value: 'platinum' }
];

export default function Picks({ onNavigate, onOpenModal }) {
  const [sport, setSport] = useState(null);
  const [tier, setTier] = useState(null);

  const picksRes = useApi(
    () => api.listPicks().then(rows => rows.map(adaptPick)),
    [],
    { fallback: fallbackPicks }
  );

  const cappersRes = useApi(
    () => api.getLeaderboard().then(rows => rows.map(adaptLeaderboardEntry)),
    [],
    { fallback: fallbackCappers }
  );

  const allPicks = picksRes.data || [];
  const cappers = cappersRes.data || [];

  // Apply filters. `sport` is matched case-insensitively against pick.sport;
  // `tier` matches the pick's capper's inferred tier (from ROI thresholds).
  const picks = allPicks.filter(p => {
    if (sport && p.sport?.toLowerCase() !== sport.toLowerCase()) return false;
    if (tier) {
      const capper = cappers.find(c => c.id === p.capperId);
      if (!capper) return false;
      const t = getTier(capper.roi);
      if (!t || !t.cls.endsWith(tier === 'platinum' ? 'god' : tier)) return false;
    }
    return true;
  });

  return (
    <div className="page active">
      <div className="inner">
        <div className="picks-header">
          <div>
            <h1 className="h1">Pick Marketplace</h1>
            <div className="h-sub">Browse picks from verified cappers. Buy single picks or subscribe to your favorites.</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('parlay')}>Parlay calculator →</button>
        </div>

        <ApiStatus
          loading={picksRes.loading || cappersRes.loading}
          error={picksRes.error || cappersRes.error}
          isFallback={picksRes.isFallback || cappersRes.isFallback}
        />

        <div className="filter-bar">
          <span className="filter-label">Sport</span>
          {SPORT_CHIPS.map(c => (
            <button key={c.label} className={`chip ${sport === c.value ? 'active' : ''}`} onClick={() => setSport(c.value)}>{c.label}</button>
          ))}
          <div style={{ flex: 1, minWidth: 20 }}></div>
          <span className="filter-label">Tier</span>
          {TIER_CHIPS.map(c => (
            <button key={c.label} className={`chip ${tier === c.value ? 'active' : ''}`} onClick={() => setTier(c.value)}>{c.label}</button>
          ))}
        </div>

        <div className="picks-grid">
          {picks.map((p, idx) => {
            const capper = cappers.find(c => c.id === p.capperId) || cappers[0];
            if (!capper) return null;
            const promoted = idx === 0 || idx === 4;
            return (
              <PickCard
                key={p.id}
                pick={p}
                capper={capper}
                promoted={promoted}
                onCapperClick={() => onNavigate('capper', capper.id)}
                onBuy={() => onOpenModal({ type: 'buy', pickId: p.id, capper })}
              />
            );
          })}
        </div>

        {picks.length === 0 && !picksRes.loading && (
          <div style={{
            padding: '32px 20px', textAlign: 'center', color: 'var(--text-2)',
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12
          }}>
            {allPicks.length === 0
              ? 'No picks in the marketplace yet. Cappers will start showing up here soon.'
              : `No picks match those filters. ${sport || tier ? 'Try clearing them.' : ''}`}
          </div>
        )}
      </div>
    </div>
  );
}
