import { useState } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';
import { api, ApiError } from '../api.js';
import { useApi } from '../useApi.js';
import { getTierByName } from '../data.js';
import TimeAgo from '../components/TimeAgo.jsx';

const ODDS_REFRESH_MS = 15 * 60 * 1000;

// Every signed-in user gets the full tab set — the backend auto-provisions a
// capper_profile on first capper-only request, so there's no explicit "become" step.
const TABS = [
  { id: 'history',  label: 'Pick History' },
  { id: 'submit',   label: 'Submit Pick' },
  { id: 'pricing',  label: 'My Pricing' },
  { id: 'revenue',  label: 'Revenue' },
  { id: 'settings', label: 'Settings' }
];

export default function Profile({ onOpenModal }) {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return <div className="page active"><div className="inner"><div style={{ padding: 40, textAlign: 'center', color: 'var(--text-2)' }}>Loading…</div></div></div>;
  }

  if (!user) {
    return (
      <div className="page active">
        <div className="inner" style={{ maxWidth: 480, textAlign: 'center', paddingTop: 60 }}>
          <h1 className="h1">You're signed out</h1>
          <p className="h-sub" style={{ marginBottom: 24 }}>Log in or create an account to see your profile, picks, and stats.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="btn btn-white btn-lg" onClick={() => onOpenModal('signup')}>Create account</button>
            <button className="btn btn-ghost btn-lg" onClick={() => onOpenModal('login')}>Log in</button>
          </div>
        </div>
      </div>
    );
  }

  return <SignedInProfile user={user} />;
}

function SignedInProfile({ user }) {
  // GET /profiles/me — may 404 if no DB trigger has provisioned a profile row yet,
  // in which case we synthesize one from the auth user_metadata so the page still renders.
  const profileRes = useApi(
    () => api.getMyProfile().catch(e => {
      if (e instanceof ApiError && e.status === 404) return null;
      throw e;
    }),
    [user.id]
  );

  // GET /cappers/me — 403 (not a capper) is expected, treat as null.
  const capperRes = useApi(
    () => api.getMyCapper().catch(e => {
      if (e instanceof ApiError && (e.status === 403 || e.status === 404)) return null;
      throw e;
    }),
    [user.id]
  );

  const profile = profileRes.data || {
    username:     user.user_metadata?.username || user.email?.split('@')[0] || 'user',
    display_name: user.user_metadata?.display_name || null,
    avatar_url:   null,
    created_at:   user.created_at
  };
  // capperRes.data is null until the user first hits a capper-only endpoint
  // (the backend auto-provisions on miss). Synthesize a zero-state placeholder so
  // the stats row still renders something sensible on first visit.
  const capper = capperRes.data || {
    tier: 'none',
    roi_30d: 0,
    win_rate_30d: 0,
    units_profit_30d: 0,
    current_streak: 0,
    picks_last_30d: 0,
    monthly_price_cents: 0,
    single_pick_price_cents: 0,
    bio: null
  };

  const displayName = profile.display_name || profile.username;
  const initials = (profile.username || 'U').slice(0, 2).toUpperCase();
  const tier = getTierByName(capper.tier);
  const joined = profile.created_at ? new Date(profile.created_at) : null;
  const joinedStr = joined
    ? joined.toLocaleDateString([], { month: 'long', year: 'numeric' })
    : '—';

  const [tab, setTab] = useState(TABS[0].id);
  const refreshCapper = () => capperRes.refetch?.();

  return (
    <div className="page active">
      <div className="inner">
        <div className="profile-cover">
          <div className="avatar profile-avatar-lg av-1">{initials}</div>
          <div className="profile-info">
            <div className="profile-name">
              {displayName}
              {tier && <span className={`tier ${tier.cls}`}>{tier.icon} {tier.name}</span>}
            </div>
            <div className="profile-handle">@{profile.username} · Joined {joinedStr}</div>
            <div className="profile-bio">
              {capper?.bio || 'No bio yet — add one from My Pricing.'}
            </div>
          </div>
        </div>

        <CapperStatsRow capper={capper} tier={tier} />
        <TierProgress capper={capper} tier={tier} />

        <div className="profile-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`p-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'history' && <HistoryTab />}
        {tab === 'submit' && <SubmitTab onSubmitted={refreshCapper} />}
        {tab === 'pricing' && <PricingTab capper={capper} onSaved={refreshCapper} />}
        {tab === 'revenue' && <RevenueTab />}
        {tab === 'settings' && <SettingsTab profile={profile} onSaved={() => profileRes.refetch?.()} />}
      </div>
    </div>
  );
}

function CapperStatsRow({ capper, tier }) {
  const roiColor = tier?.color || 'var(--green)';
  const profitColor = capper.units_profit_30d >= 0 ? 'var(--green)' : 'var(--red)';
  const streakLabel = capper.current_streak >= 0
    ? `${capper.current_streak}W`
    : `${Math.abs(capper.current_streak)}L`;
  return (
    <div className="profile-stats">
      <div className="stat-card">
        <div className="stat-card-val" style={{ color: roiColor }}>{fmtPct(capper.roi_30d)}</div>
        <div className="stat-card-lbl">ROI<span className="tip" data-tip="Return on Investment — profit per dollar risked. The pro standard.">?</span></div>
      </div>
      <div className="stat-card">
        <div className="stat-card-val">{fmtPct(capper.win_rate_30d, false)}</div>
        <div className="stat-card-lbl">Win rate</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-val" style={{ color: profitColor }}>{fmtUnits(capper.units_profit_30d)}</div>
        <div className="stat-card-lbl">Units profit</div>
      </div>
      <div className="stat-card">
        <div className="stat-card-val" style={{ color: tier?.color || 'var(--text-2)' }}>{streakLabel}</div>
        <div className="stat-card-lbl">Streak</div>
      </div>
    </div>
  );
}

function TierProgress({ capper, tier }) {
  const roi = capper.roi_30d ?? 0;
  // Map ROI to a 0-100% bar position (0% = 0 ROI, 100% = +20 ROI or above).
  const pct = Math.max(0, Math.min(100, (roi / 20) * 100));
  const color = tier?.color || 'var(--text-3)';
  const tierLabel = tier ? `${tier.name} ${tier.icon}` : 'Not ranked yet';
  return (
    <div className="tier-progress-card">
      <div className="tp-header">
        <div>
          <div className="tp-current">Current tier · <span style={{ color }}>{tierLabel}</span></div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
            Based on ROI<span className="tip" data-tip="Return on Investment — profit per dollar risked. We use this instead of win rate.">?</span>
            {capper.picks_last_30d < 20 && <> · Submit {20 - capper.picks_last_30d} more picks in 30 days to unlock a tier</>}
          </div>
        </div>
        <div className="tp-rate" style={{ color }}>{fmtPct(roi)}</div>
      </div>
      <div className="tp-bar"><div className="tp-fill" style={{ width: `${pct}%` }}></div></div>
      <div className="tp-markers">
        <span>0%</span>
        <span className="tp-marker" style={{ color: 'var(--bronze)' }}>+5%</span>
        <span className="tp-marker" style={{ color: 'var(--silver)' }}>+10%</span>
        <span className="tp-marker" style={{ color: 'var(--gold)' }}>+15%</span>
        <span className="tp-marker" style={{ color: 'var(--god)' }}>+20%</span>
      </div>
    </div>
  );
}

function HistoryTab() {
  const { data, loading, error, refetch } = useApi(() => api.getMyCapperPicks({ limit: 50 }), []);
  const [editingId, setEditingId] = useState(null);

  if (loading) return <Loading />;
  if (error) return <ErrorBox error={error} />;
  const picks = data || [];
  if (picks.length === 0) {
    return <EmptyBox>No picks yet. Submit your first one from the Submit Pick tab.</EmptyBox>;
  }
  return (
    <div className="p-content active">
      <div className="pick-history">
        {picks.map(p => (
          editingId === p.id
            ? <EditPickForm
                key={p.id}
                pick={p}
                onCancel={() => setEditingId(null)}
                onSaved={() => { setEditingId(null); refetch?.(); }}
              />
            : <PickHistoryRow key={p.id} pick={p} onEdit={() => setEditingId(p.id)} />
        ))}
      </div>
    </div>
  );
}

// What a capper is still allowed to change, mirroring the PATCH /picks/:id rules.
// 'full'   — unsettled and the game hasn't started: everything is editable
// 'vip'    — unsettled but the game is under way: VIP visibility only
// 'locked' — settled: immutable
//
// Settled means a result OR a grading timestamp, matching the server's check —
// this tab only ever lists the signed-in capper's own picks, so ownership (the
// server's other rule) is already implicit here.
function editScope(pick) {
  const settled = (pick.result || 'pending') !== 'pending' || pick.graded_at != null;
  if (settled) return 'locked';
  return new Date(pick.game_start_at).getTime() <= Date.now() ? 'vip' : 'full';
}

function pickLabel(pick) {
  const d = pick.pick_details || {};
  return d.text || d.pick || d.selection || pick.bet_type.toUpperCase();
}

function PickHistoryRow({ pick, onEdit }) {
  const result = pick.result || 'pending';
  const cls = result === 'win' ? 'result-w' : result === 'loss' ? 'result-l' : 'result-p';
  const txt = result === 'pending' ? 'Live' : result.charAt(0).toUpperCase() + result.slice(1);
  const unitCls = (pick.units_result ?? 0) > 0 ? 'pos' : (pick.units_result ?? 0) < 0 ? 'neg' : 'neu';
  const unitStr = pick.units_result == null
    ? `${pick.units}U risked`
    : (pick.units_result > 0 ? '+' : '') + pick.units_result.toFixed(2) + 'U';

  const odds = pick.odds > 0 ? `+${pick.odds}` : `${pick.odds}`;
  const created = pick.created_at ? new Date(pick.created_at).toLocaleString() : '—';
  const scope = editScope(pick);

  return (
    <div className="ph-item">
      <div className={`result-pill ${cls}`}>{txt}</div>
      <div>
        <div className="ph-pick">
          {pickLabel(pick)}
          {pick.is_vip_only && <span className="ph-vip-tag">VIP</span>}
        </div>
        <div className="ph-meta">{pick.sport} · {odds} · {created}</div>
      </div>
      <div className="ph-units">
        <div className={`ph-units-val ${unitCls}`}>{unitStr}</div>
      </div>
      <div className="ph-actions">
        {scope === 'locked'
          ? <span className="ph-lock-note" title="Graded picks can't be changed">Graded</span>
          : <button type="button" className="btn btn-ghost btn-sm" onClick={onEdit}>Edit</button>}
      </div>
    </div>
  );
}

const EDITABLE_SPORTS = ['NFL', 'NBA', 'MLB', 'NHL', 'Soccer', 'NCAAF', 'NCAAB', 'MMA'];

function EditPickForm({ pick, onCancel, onSaved }) {
  const scope = editScope(pick);
  const wagerLocked = scope !== 'full';
  const details = pick.pick_details || {};

  const [form, setForm] = useState({
    sport:         pick.sport || '',
    bet_type:      pick.bet_type,
    game_id:       pick.game_id || '',
    pick_text:     pickLabel(pick),
    analysis:      details.analysis || '',
    odds:          String(pick.odds),
    units:         String(pick.units),
    is_vip_only:   !!pick.is_vip_only,
    game_start_at: toLocalInput(pick.game_start_at)
  });
  const [status, setStatus] = useState({ state: 'idle' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Build a patch of only what changed. The API rejects an empty body, and for a
  // started game it rejects any wager field — so diffing is what keeps a
  // "just flip VIP off" save from being refused for touching frozen fields.
  const buildPatch = () => {
    const patch = {};
    if (form.is_vip_only !== !!pick.is_vip_only) patch.is_vip_only = form.is_vip_only;
    if (wagerLocked) return patch;

    if (form.sport !== pick.sport) patch.sport = form.sport;
    if (form.bet_type !== pick.bet_type) patch.bet_type = form.bet_type;
    if (form.game_id !== (pick.game_id || '')) patch.game_id = form.game_id;

    const odds = parseInt(form.odds, 10);
    if (Number.isFinite(odds) && odds !== pick.odds) patch.odds = odds;

    const units = parseFloat(form.units);
    if (Number.isFinite(units) && units !== Number(pick.units)) patch.units = units;

    // pick_details is replaced wholesale by the API — merge so a live-odds pick
    // keeps its market/team/book metadata instead of being flattened to text.
    if (form.pick_text !== pickLabel(pick) || form.analysis !== (details.analysis || '')) {
      patch.pick_details = { ...details, text: form.pick_text, analysis: form.analysis };
    }

    const start = form.game_start_at ? new Date(form.game_start_at) : null;
    if (start && !Number.isNaN(start.getTime())
        && start.getTime() !== new Date(pick.game_start_at).getTime()) {
      patch.game_start_at = start.toISOString();
    }
    return patch;
  };

  const save = async e => {
    e.preventDefault();
    const patch = buildPatch();
    if (Object.keys(patch).length === 0) {
      setStatus({ state: 'error', msg: 'Nothing changed.' });
      return;
    }
    setStatus({ state: 'loading' });
    try {
      await api.updatePick(pick.id, patch);
      onSaved?.();
    } catch (e) {
      setStatus({ state: 'error', msg: e.message });
    }
  };

  return (
    <form className="ph-edit" onSubmit={save}>
      <div className="ph-edit-head">
        <span>Editing pick</span>
        <span className="ph-meta">Submitted {pick.created_at ? new Date(pick.created_at).toLocaleString() : '—'}</span>
      </div>

      {wagerLocked && (
        <div className="ph-edit-note">
          This game has already started, so the wager is locked in. You can still change
          who gets to see the pick.
        </div>
      )}

      {!wagerLocked && (
        <>
          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Sport</label>
              <select className="field-input" value={form.sport} onChange={e => set('sport', e.target.value)}>
                {(EDITABLE_SPORTS.includes(form.sport) ? EDITABLE_SPORTS : [form.sport, ...EDITABLE_SPORTS])
                  .map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label className="field-label">Bet type</label>
              <select className="field-input" value={form.bet_type} onChange={e => set('bet_type', e.target.value)}>
                <option value="prop">Player prop</option>
                <option value="parlay">Parlay</option>
                <option value="spread">Spread</option>
                <option value="moneyline">Moneyline</option>
                <option value="total">Total (O/U)</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Your pick</label>
            <input type="text" className="field-input" value={form.pick_text} onChange={e => set('pick_text', e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Odds (American)</label>
              <input type="number" className="field-input" value={form.odds} onChange={e => set('odds', e.target.value)} required />
            </div>
            <div className="form-field">
              <label className="field-label">Units (0.5 – 100)</label>
              <input type="number" step="0.5" min="0.5" max="100" className="field-input" value={form.units} onChange={e => set('units', e.target.value)} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="field-label">Game start time</label>
              <input type="datetime-local" className="field-input" value={form.game_start_at} onChange={e => set('game_start_at', e.target.value)} required />
            </div>
            <div className="form-field">
              <label className="field-label">Game ID / matchup tag</label>
              <input type="text" className="field-input" value={form.game_id} onChange={e => set('game_id', e.target.value)} />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Analysis (optional)</label>
            <textarea className="field-input" style={{ minHeight: 70, resize: 'vertical' }} value={form.analysis} onChange={e => set('analysis', e.target.value)} />
          </div>
        </>
      )}

      <div className="form-field">
        <label style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.is_vip_only} onChange={e => set('is_vip_only', e.target.checked)} />
          VIP only (paid)
        </label>
      </div>

      <StatusLine status={status} />
      <div className="ph-edit-foot">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-white btn-sm" disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  );
}

// datetime-local wants local wall-clock time, not the UTC an ISO string carries.
function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Frontend label → The Odds API sport key. MLB is first so it's the default
// selected option on the Submit Pick form. Other sports remain available but
// deprioritised for the current release.
const ODDS_SPORTS = [
  { label: 'MLB',           key: 'baseball_mlb' },
  { label: 'NFL',           key: 'americanfootball_nfl' },
  { label: 'NBA',           key: 'basketball_nba' },
  { label: 'NHL',           key: 'icehockey_nhl' },
  { label: 'NCAA Football', key: 'americanfootball_ncaaf' },
  { label: 'NCAA Basketball', key: 'basketball_ncaab' },
  { label: 'Soccer (EPL)',  key: 'soccer_epl' },
  { label: 'MMA',           key: 'mma_mixed_martial_arts' }
];

const MARKET_TO_BET_TYPE = { spreads: 'spread', h2h: 'moneyline', totals: 'total' };

// Parlay pricing. A parlay pays the product of its legs' decimal odds — there's
// no shortcut in American terms, so convert out and back.
const americanToDecimal = a => (a > 0 ? 1 + a / 100 : 1 + 100 / Math.abs(a));
const decimalToAmerican = d => (d >= 2 ? Math.round((d - 1) * 100) : Math.round(-100 / (d - 1)));
const parlayOdds = legs => decimalToAmerican(legs.reduce((acc, l) => acc * americanToDecimal(l.odds), 1));
const fmtAmerican = n => (n > 0 ? `+${n}` : `${n}`);

const MAX_PARLAY_LEGS = 6;    // "Parlays must contain 2 to 6 legs" — rules callout above
const MAX_ABS_ODDS    = 10000; // createPickBody caps odds at ±10000

function SubmitTab({ onSubmitted }) {
  const [mode, setMode] = useState('live');
  return (
    <div className="p-content active">
      <div className="rules-callout">
        <strong>📋 Pick qualification rules:</strong><br />
        • Tiers are based on <strong>ROI</strong> — the professional standard for measuring betting skill<br />
        • All picks must be <strong>submitted before the game starts</strong> (no backdated picks)<br />
        • Parlays must contain <strong>2 to 6 legs</strong> (no lottery-ticket parlays)<br />
        • Pushes are excluded from ROI calculation
      </div>
      {mode === 'live'
        ? <LivePickForm onSubmitted={onSubmitted} onSwitchManual={() => setMode('manual')} />
        : <ManualPickForm onSubmitted={onSubmitted} onSwitchLive={() => setMode('live')} />}
    </div>
  );
}

function LivePickForm({ onSubmitted, onSwitchManual }) {
  const [sportKey, setSportKey] = useState(ODDS_SPORTS[0].key);
  const gamesRes = useApi(
    () => api.getOdds(sportKey),
    [sportKey],
    { fallback: [], pollInterval: ODDS_REFRESH_MS }
  );

  const [gameId, setGameId] = useState('');
  const [market, setMarket] = useState('h2h');
  const [outcomeName, setOutcomeName] = useState('');
  const [legs, setLegs] = useState([]);
  const [units, setUnits] = useState('1');
  const [isVip, setIsVip] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [status, setStatus] = useState({ state: 'idle' });

  const games = gamesRes.data || [];
  const game = games.find(g => g.id === gameId) || null;
  // Use the first bookmaker for now — could let the user pick later if useful.
  const book = game?.bookmakers?.[0] || null;
  const marketData = book?.markets?.find(m => m.key === market) || null;
  const outcomes = marketData?.outcomes || [];
  const selectedOutcome = outcomes.find(o => o.name === outcomeName) || null;

  // When sport or game changes, reset deeper selections.
  const changeSport = k => { setSportKey(k); setGameId(''); setOutcomeName(''); };
  const changeGame  = id => { setGameId(id); setOutcomeName(''); };
  const changeMarket = m => { setMarket(m); setOutcomeName(''); };

  // The selection currently staged in the picker, in the shape a slip leg takes.
  const draftLeg = game && selectedOutcome && book ? {
    key:           `${game.id}:${market}:${selectedOutcome.name}`,
    game_id:       game.id,
    sport:         ODDS_SPORTS.find(s => s.key === sportKey)?.label || 'Other',
    market,
    bet_type:      MARKET_TO_BET_TYPE[market],
    text:          renderPickText(market, selectedOutcome),
    team:          selectedOutcome.name,
    point:         selectedOutcome.point ?? null,
    odds:          Math.round(selectedOutcome.price),
    book:          book.key,
    home_team:     game.home_team,
    away_team:     game.away_team,
    commence_time: game.commence_time
  } : null;

  const addLeg = () => {
    if (!draftLeg) { setStatus({ state: 'error', msg: 'Pick a game and an outcome first' }); return; }
    if (legs.length >= MAX_PARLAY_LEGS) {
      setStatus({ state: 'error', msg: `A parlay can hold at most ${MAX_PARLAY_LEGS} legs` });
      return;
    }
    // Legs from the same game are correlated, and multiplying their odds would
    // overprice the parlay. Same-game parlays need book-specific pricing we
    // don't have, so keep one leg per game.
    if (legs.some(l => l.game_id === draftLeg.game_id)) {
      setStatus({ state: 'error', msg: 'That game is already in the slip — parlay legs must come from different games.' });
      return;
    }
    setLegs(ls => [...ls, draftLeg]);
    setGameId('');
    setOutcomeName('');
    setStatus({ state: 'idle' });
  };

  const removeLeg = key => setLegs(ls => ls.filter(l => l.key !== key));

  // Anything staged in the picker counts as a leg, so a single pick still
  // submits in one click and a half-added leg is never silently dropped.
  const slip = draftLeg && !legs.some(l => l.game_id === draftLeg.game_id)
    ? [...legs, draftLeg]
    : legs;

  const submit = async e => {
    e.preventDefault();
    if (slip.length === 0) { setStatus({ state: 'error', msg: 'Pick a game and an outcome' }); return; }
    if (slip.length > MAX_PARLAY_LEGS) {
      setStatus({ state: 'error', msg: `A parlay can hold at most ${MAX_PARLAY_LEGS} legs` });
      return;
    }

    const isParlay = slip.length > 1;
    const odds = isParlay ? parlayOdds(slip) : slip[0].odds;
    if (Math.abs(odds) > MAX_ABS_ODDS) {
      setStatus({ state: 'error', msg: `That parlay prices at ${fmtAmerican(odds)}, past the ${fmtAmerican(MAX_ABS_ODDS)} limit. Drop a leg.` });
      return;
    }

    setStatus({ state: 'loading' });
    try {
      let body;
      if (isParlay) {
        const sports = [...new Set(slip.map(l => l.sport))];
        body = {
          sport:   sports.length === 1 ? sports[0] : 'Multi',
          // picks.game_id is a single not-null column and a parlay spans several
          // games — the real per-leg ids live in pick_details.legs.
          game_id: `parlay_${Date.now()}`,
          bet_type: 'parlay',
          odds,
          units: parseFloat(units),
          is_vip_only: isVip,
          pick_details: {
            text: `${slip.length}-leg parlay: ${slip.map(l => l.text).join(' + ')}`,
            legs: slip.map(({ key, ...leg }) => leg),
            analysis
          },
          // The slip is locked once the FIRST leg kicks off, not the last.
          game_start_at: slip.map(l => l.commence_time).sort()[0]
        };
      } else {
        const l = slip[0];
        body = {
          sport: l.sport,
          game_id: l.game_id,
          bet_type: l.bet_type,
          odds: l.odds,
          units: parseFloat(units),
          is_vip_only: isVip,
          pick_details: {
            text: l.text,
            market: l.market,
            team: l.team,
            point: l.point,
            book: l.book,
            home_team: l.home_team,
            away_team: l.away_team,
            analysis
          },
          game_start_at: l.commence_time
        };
      }
      await api.createPick(body);
      setStatus({ state: 'success', msg: isParlay ? `${slip.length}-leg parlay submitted.` : 'Pick submitted.' });
      setLegs([]);
      setGameId('');
      setOutcomeName('');
      setAnalysis('');
      onSubmitted?.();
    } catch (e) {
      setStatus({ state: 'error', msg: e.message });
    }
  };

  return (
    <form className="submit-form" onSubmit={submit}>
      <div className="form-row">
        <div className="form-field">
          <label className="field-label">Sport</label>
          <select className="field-input" value={sportKey} onChange={e => changeSport(e.target.value)}>
            {ODDS_SPORTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="field-label">Bet type</label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { k: 'spreads', label: 'Spread' },
              { k: 'h2h',     label: 'Moneyline' },
              { k: 'totals',  label: 'Total' }
            ].map(m => (
              <button key={m.k} type="button" className={`chip ${market === m.k ? 'active' : ''}`} onClick={() => changeMarket(m.k)} style={{ flex: 1 }}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {gamesRes.error && (
        <div style={{
          padding: '10px 12px', borderRadius: 8, marginBottom: 12,
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
          fontSize: 12, color: 'var(--red)', lineHeight: 1.5
        }}>
          <strong>Couldn't load games:</strong> {gamesRes.error.message}
          <br />
          <span style={{ color: 'var(--text-3)' }}>
            Status {gamesRes.error.status}. Try a different sport, or switch to Manual entry below.
          </span>
        </div>
      )}

      <div className="form-field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="field-label">
            Game {gamesRes.loading
              ? '(loading…)'
              : `(${games.length} upcoming)`}
          </label>
          <TimeAgo date={gamesRes.lastUpdated} prefix="Odds updated " />
        </div>
        <select className="field-input" value={gameId} onChange={e => changeGame(e.target.value)} required>
          <option value="">— select a game —</option>
          {games.map(g => (
            <option key={g.id} value={g.id}>
              {g.away_team} @ {g.home_team} · {formatGameTime(g.commence_time)}
            </option>
          ))}
        </select>
      </div>

      {game && (
        <div className="form-field">
          <label className="field-label">Your pick</label>
          {outcomes.length === 0 ? (
            <div style={{ fontSize: 12, color: 'var(--text-3)', padding: '10px 0' }}>
              No {market} market available for this game. Try a different bet type.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {outcomes.map(o => (
                <OutcomeRow
                  key={o.name}
                  outcome={o}
                  market={market}
                  selected={outcomeName === o.name}
                  onSelect={() => setOutcomeName(o.name)}
                />
              ))}
            </div>
          )}
          {book && outcomes.length > 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Odds from {book.title}</div>
          )}
          {outcomes.length > 0 && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ width: '100%', marginTop: 8 }}
              onClick={addLeg}
              disabled={!selectedOutcome || legs.length >= MAX_PARLAY_LEGS}
            >
              + Add leg{legs.length > 0 ? ` (${legs.length} in slip)` : ' — build a parlay'}
            </button>
          )}
        </div>
      )}

      {legs.length > 0 && (
        <div className="form-field">
          <label className="field-label">
            Parlay slip ({legs.length}/{MAX_PARLAY_LEGS})
            {legs.length > 1 && <> · pays <strong style={{ color: 'var(--b)' }}>{fmtAmerican(parlayOdds(legs))}</strong></>}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {legs.map((l, i) => (
              <div
                key={l.key}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 14px', borderRadius: 8,
                  background: 'var(--bg-2)', border: '1px solid var(--border)'
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--text-3)', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 14, color: '#fff', fontWeight: 500 }}>{l.text}</span>
                <span style={{ fontSize: 13, color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>{fmtAmerican(l.odds)}</span>
                <button
                  type="button"
                  onClick={() => removeLeg(l.key)}
                  title="Remove leg"
                  style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px' }}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          {legs.length === 1 && (
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
              One leg submits as a single pick. Add another to make it a parlay.
            </div>
          )}
        </div>
      )}

      <div className="form-row">
        <div className="form-field">
          <label className="field-label">Units (0.5 – 100)</label>
          <input type="number" step="0.5" min="0.5" max="100" className="field-input" value={units} onChange={e => setUnits(e.target.value)} required />
        </div>
        <div className="form-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={isVip} onChange={e => setIsVip(e.target.checked)} />
            VIP only (paid)
          </label>
        </div>
      </div>

      <div className="form-field">
        <label className="field-label">Analysis (optional)</label>
        <textarea className="field-input" placeholder="Why do you like this pick?" style={{ minHeight: 90, resize: 'vertical' }} value={analysis} onChange={e => setAnalysis(e.target.value)} />
      </div>

      <div style={{ marginBottom: 10, textAlign: 'right' }}>
        <a onClick={onSwitchManual} style={{ fontSize: 12, color: 'var(--b)', cursor: 'pointer' }}>
          Props / other game → enter manually
        </a>
      </div>

      <StatusLine status={status} />
      <button type="submit" className="btn btn-white btn-lg" style={{ width: '100%' }} disabled={status.state === 'loading' || slip.length === 0}>
        {status.state === 'loading'
          ? 'Submitting…'
          : slip.length > 1 ? `Submit ${slip.length}-leg parlay (${fmtAmerican(parlayOdds(slip))})` : 'Submit Pick'}
      </button>
    </form>
  );
}

function ManualPickForm({ onSubmitted, onSwitchLive }) {
  const [form, setForm] = useState({
    sport: 'NBA',
    bet_type: 'prop',
    game_id: '',
    pick_text: '',
    odds: '-110',
    units: '1',
    is_vip_only: false,
    game_start_at: '',
    analysis: ''
  });
  const [status, setStatus] = useState({ state: 'idle' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async e => {
    e.preventDefault();
    setStatus({ state: 'loading' });
    try {
      const iso = form.game_start_at ? new Date(form.game_start_at).toISOString() : null;
      if (!iso) { setStatus({ state: 'error', msg: 'Pick a game start time' }); return; }
      await api.createPick({
        sport: form.sport,
        game_id: form.game_id || `manual_${Date.now()}`,
        bet_type: form.bet_type,
        odds: parseInt(form.odds, 10),
        units: parseFloat(form.units),
        is_vip_only: form.is_vip_only,
        pick_details: { text: form.pick_text, analysis: form.analysis },
        game_start_at: iso
      });
      setStatus({ state: 'success', msg: 'Pick submitted.' });
      setForm(f => ({ ...f, game_id: '', pick_text: '', analysis: '' }));
      onSubmitted?.();
    } catch (e) {
      setStatus({ state: 'error', msg: e.message });
    }
  };

  return (
    <form className="submit-form" onSubmit={submit}>
      <div style={{ marginBottom: 14, textAlign: 'right' }}>
        <a onClick={onSwitchLive} style={{ fontSize: 12, color: 'var(--b)', cursor: 'pointer' }}>
          ← Back to live odds picker
        </a>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="field-label">Sport</label>
          <select className="field-input" value={form.sport} onChange={e => set('sport', e.target.value)}>
            <option>NFL</option><option>NBA</option><option>MLB</option><option>NHL</option><option>Soccer</option>
            <option>NCAAF</option><option>NCAAB</option><option>MMA</option>
          </select>
        </div>
        <div className="form-field">
          <label className="field-label">Bet type</label>
          <select className="field-input" value={form.bet_type} onChange={e => set('bet_type', e.target.value)}>
            <option value="prop">Player prop</option>
            <option value="parlay">Parlay</option>
            <option value="spread">Spread</option>
            <option value="moneyline">Moneyline</option>
            <option value="total">Total (O/U)</option>
          </select>
        </div>
      </div>
      <div className="form-field">
        <label className="field-label">Game ID / matchup tag</label>
        <input type="text" className="field-input" placeholder="e.g. lakers_warriors_2026_06_15" value={form.game_id} onChange={e => set('game_id', e.target.value)} />
      </div>
      <div className="form-field">
        <label className="field-label">Your pick</label>
        <input type="text" className="field-input" placeholder="e.g. LeBron Over 27.5 PTS" value={form.pick_text} onChange={e => set('pick_text', e.target.value)} required />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="field-label">Odds (American)</label>
          <input type="number" className="field-input" placeholder="-110, +150" value={form.odds} onChange={e => set('odds', e.target.value)} required />
        </div>
        <div className="form-field">
          <label className="field-label">Units (0.5 – 100)</label>
          <input type="number" step="0.5" min="0.5" max="100" className="field-input" value={form.units} onChange={e => set('units', e.target.value)} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label className="field-label">Game start time</label>
          <input type="datetime-local" className="field-input" value={form.game_start_at} onChange={e => set('game_start_at', e.target.value)} required />
        </div>
        <div className="form-field" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_vip_only} onChange={e => set('is_vip_only', e.target.checked)} />
            VIP only (paid)
          </label>
        </div>
      </div>
      <div className="form-field">
        <label className="field-label">Analysis (optional)</label>
        <textarea className="field-input" placeholder="Why do you like this pick?" style={{ minHeight: 90, resize: 'vertical' }} value={form.analysis} onChange={e => set('analysis', e.target.value)} />
      </div>
      <StatusLine status={status} />
      <button type="submit" className="btn btn-white btn-lg" style={{ width: '100%' }} disabled={status.state === 'loading'}>
        {status.state === 'loading' ? 'Submitting…' : 'Submit Pick'}
      </button>
    </form>
  );
}

function OutcomeRow({ outcome, market, selected, onSelect }) {
  const label = renderPickText(market, outcome);
  const odds = outcome.price > 0 ? `+${outcome.price}` : `${outcome.price}`;
  return (
    <div
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
        background: selected ? 'rgba(0,194,255,0.12)' : 'var(--bg-2)',
        border: `1px solid ${selected ? 'var(--b)' : 'var(--border)'}`,
        transition: 'all 0.15s'
      }}
    >
      <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, color: selected ? 'var(--b)' : 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>{odds}</span>
    </div>
  );
}

function renderPickText(market, outcome) {
  if (market === 'spreads' && outcome.point != null) {
    const pt = outcome.point > 0 ? `+${outcome.point}` : outcome.point;
    return `${outcome.name} ${pt}`;
  }
  if (market === 'totals') return `${outcome.name} ${outcome.point}`;
  return outcome.name;
}

function formatGameTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString([], {
    weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}

function PricingTab({ capper, onSaved }) {
  const [single, setSingle] = useState(((capper.single_pick_price_cents ?? 0) / 100).toString());
  const [monthly, setMonthly] = useState(((capper.monthly_price_cents ?? 0) / 100).toString());
  const [bio, setBio] = useState(capper.bio || '');
  const [status, setStatus] = useState({ state: 'idle' });

  const save = async e => {
    e.preventDefault();
    setStatus({ state: 'loading' });
    try {
      await api.updateMyCapper({
        single_pick_price_cents: Math.round(parseFloat(single || '0') * 100),
        monthly_price_cents: Math.round(parseFloat(monthly || '0') * 100),
        bio: bio || undefined
      });
      setStatus({ state: 'success', msg: 'Pricing saved.' });
      onSaved?.();
    } catch (e) {
      setStatus({ state: 'error', msg: e.message });
    }
  };

  return (
    <div className="p-content active">
      <form className="submit-form" onSubmit={save}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 14 }}>Set your pricing</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          BettorsOnly takes 20% — you keep 80% of every sale.
        </div>
        <div className="form-row">
          <div className="form-field">
            <label className="field-label">Single pick price ($)</label>
            <input type="number" min="0" step="1" className="field-input" value={single} onChange={e => setSingle(e.target.value)} />
          </div>
          <div className="form-field">
            <label className="field-label">Monthly subscription ($)</label>
            <input type="number" min="0" step="1" className="field-input" value={monthly} onChange={e => setMonthly(e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label className="field-label">Bio</label>
          <textarea className="field-input" placeholder="Tell buyers about your edge" style={{ minHeight: 90, resize: 'vertical' }} value={bio} onChange={e => setBio(e.target.value)} />
        </div>
        <StatusLine status={status} />
        <button type="submit" className="btn btn-white btn-lg" style={{ width: '100%' }} disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}

function RevenueTab() {
  // Revenue numbers depend on processed Stripe webhooks; until those events fire
  // there's nothing to display. Showing zeros is more honest than fake data.
  return (
    <div className="p-content active">
      <EmptyBox>
        Revenue tracking will appear here once you have completed sales.
        <br />
        <span style={{ fontSize: 11 }}>Powered by Stripe webhooks.</span>
      </EmptyBox>
    </div>
  );
}

function SettingsTab({ profile, onSaved }) {
  const [username, setUsername] = useState(profile.username || '');
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [status, setStatus] = useState({ state: 'idle' });

  const save = async e => {
    e.preventDefault();
    setStatus({ state: 'loading' });
    try {
      const body = {};
      if (username && username !== profile.username) body.username = username;
      if (displayName !== (profile.display_name || '')) body.display_name = displayName || null;
      if (Object.keys(body).length === 0) {
        setStatus({ state: 'success', msg: 'Nothing changed.' });
        return;
      }
      await api.updateMyProfile(body);
      setStatus({ state: 'success', msg: 'Saved.' });
      onSaved?.();
    } catch (e) {
      setStatus({ state: 'error', msg: e.message });
    }
  };

  return (
    <div className="p-content active">
      <form className="submit-form" onSubmit={save}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: '1rem' }}>Profile settings</div>
        <div className="form-field">
          <label className="field-label">Username</label>
          <input type="text" className="field-input" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="form-field">
          <label className="field-label">Display name</label>
          <input type="text" className="field-input" placeholder="Optional" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        </div>
        <StatusLine status={status} />
        <button type="submit" className="btn btn-white btn-lg" disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

// ── small reusable bits ──────────────────────────────────────────────────────
function StatusLine({ status }) {
  if (status.state === 'idle' || status.state === 'loading') return null;
  const color = status.state === 'success' ? 'var(--green)' : 'var(--red)';
  return <div style={{ fontSize: 12, color, padding: '10px 0', lineHeight: 1.5 }}>{status.msg}</div>;
}

function Loading() {
  return <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>Loading…</div>;
}
function ErrorBox({ error }) {
  return (
    <div style={{ padding: 16, fontSize: 13, color: 'var(--red)', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
      {error.message}
    </div>
  );
}
function EmptyBox({ children }) {
  return (
    <div style={{ padding: '32px 24px', textAlign: 'center', color: 'var(--text-2)', fontSize: 14, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, lineHeight: 1.6 }}>
      {children}
    </div>
  );
}

function fmtPct(n, sign = true) {
  if (n == null) return '—';
  const v = Number(n);
  const prefix = sign && v >= 0 ? '+' : '';
  return `${prefix}${v.toFixed(v % 1 === 0 ? 0 : 1)}%`;
}
function fmtUnits(n) {
  if (n == null) return '—';
  const v = Number(n);
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}`;
}
