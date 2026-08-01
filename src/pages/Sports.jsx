import { useState } from 'react';
import { games as fallbackGames } from '../data.js';
import { api } from '../api.js';
import { useApi } from '../useApi.js';
import { adaptOddsGame } from '../adapters.js';
import ApiStatus from '../components/ApiStatus.jsx';
import TimeAgo from '../components/TimeAgo.jsx';

const REFRESH_MS = 15 * 60 * 1000;

// MLB-first focus for the current release. Other sports stay in the tab list
// as opt-in (a user can still click them) but MLB is the default and the
// "All" tab is just MLB for now — no fan-out, no wasted credits on out-of-season
// leagues. Restore the original list here once we broaden coverage.
const SPORT_TABS = [
  { key: 'baseball_mlb', label: '⚾ MLB' },
  { key: 'americanfootball_nfl', label: '🏈 NFL' },
  { key: 'basketball_nba', label: '🏀 NBA' },
  { key: 'icehockey_nhl', label: '🏒 NHL' },
  { key: 'soccer_epl', label: '⚽ Soccer' },
  { key: 'americanfootball_ncaaf', label: '🎓 NCAA FB' },
  { key: 'basketball_ncaab', label: '🏀 NCAA BB' },
  { key: 'mma_mixed_martial_arts', label: '🥊 MMA' },
  { key: 'tennis_atp_singles', label: '🎾 Tennis' }
];

export default function Sports() {
  const [active, setActive] = useState(0);
  const sportKey = SPORT_TABS[active].key;

  const { data, loading, error, isFallback, lastUpdated, refetch } = useApi(
    () => api.getOdds(sportKey).then(rows => rows.map(adaptOddsGame)),
    [sportKey],
    { fallback: fallbackGames, pollInterval: REFRESH_MS }
  );

  const games = data || [];
  const grouped = games.reduce((acc, g) => {
    (acc[g.sport] = acc[g.sport] || []).push(g);
    return acc;
  }, {});

  return (
    <div className="page active">
      <div className="inner">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="h1">Sports & Lines</h1>
          <div className="h-sub">Live odds and scores from every major sport. Updated in real time.</div>
        </div>

        <div className="sport-tabs">
          {SPORT_TABS.map((t, i) => (
            <button key={t.label} className={`sport-tab ${i === active ? 'active' : ''}`} onClick={() => setActive(i)}>{t.label}</button>
          ))}
        </div>

        <div className="date-bar">
          <div className="date-nav"><button className="date-btn">‹</button></div>
          <div className="date-display">Today, {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <div className="date-nav"><button className="date-btn">›</button></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 12px 4px' }}>
          <TimeAgo date={lastUpdated} prefix="Odds updated " />
          <button
            onClick={refetch}
            disabled={loading}
            style={{
              background: 'transparent', border: '1px solid var(--border-strong)',
              color: 'var(--text-2)', borderRadius: 6, padding: '4px 10px',
              fontSize: 11, cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? 'Refreshing…' : 'Refresh now'}
          </button>
        </div>

        <ApiStatus loading={loading} error={error} isFallback={isFallback} />

        <div className="games-list">
          {Object.keys(grouped).map(sport => (
            <div key={sport}>
              <div className="sport-section-title">{sport}</div>
              {grouped[sport].map((g, i) => <GameRow key={i} g={g} />)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GameRow({ g }) {
  return (
    <div className="game-row">
      <div className={`game-status-bar ${g.live ? 'live' : ''}`}>
        {g.live ? 'LIVE · ' : ''}{g.status}
      </div>
      <div className="game-body">
        <div className="game-teams">
          <div className="game-team">
            <div className="team-info">
              <div className="team-logo">{g.away}</div>
              <div>
                <span className="team-name">{g.awayFull}</span>
                <span className="team-record">{g.awayRec}</span>
              </div>
            </div>
            {g.live && <div className="team-score">{g.awayScore}</div>}
          </div>
          <div className="game-team">
            <div className="team-info">
              <div className="team-logo">{g.home}</div>
              <div>
                <span className="team-name">{g.homeFull}</span>
                <span className="team-record">{g.homeRec}</span>
              </div>
            </div>
            {g.live && <div className="team-score">{g.homeScore}</div>}
          </div>
        </div>
        <div className="game-col">
          <div className="game-col-header">Spread</div>
          <button className="line-btn"><span>{g.spread.a}</span><span className="line-odds">{g.spread.aOdds}</span></button>
          <button className="line-btn"><span>{g.spread.h}</span><span className="line-odds">{g.spread.hOdds}</span></button>
        </div>
        <div className="game-col">
          <div className="game-col-header">Total</div>
          <button className="line-btn"><span>O {g.total.l}</span><span className="line-odds">{g.total.o}</span></button>
          <button className="line-btn"><span>U {g.total.l}</span><span className="line-odds">{g.total.u}</span></button>
        </div>
        <div className="game-col">
          <div className="game-col-header">Moneyline</div>
          <button className="line-btn" style={{ justifyContent: 'center' }}>{g.ml.a}</button>
          <button className="line-btn" style={{ justifyContent: 'center' }}>{g.ml.h}</button>
        </div>
      </div>
    </div>
  );
}
