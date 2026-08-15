// Maps backend types → the shape the UI components already expect.

const AVATARS = ['av-1', 'av-2', 'av-3', 'av-4', 'av-5', 'av-6', 'av-7', 'av-8'];
const avForId = id => {
  // Stable bucket based on the id string so the same capper always lands on the same avatar.
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return AVATARS[Math.abs(h) % AVATARS.length];
};

const initialsFrom = name => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || parts[0]?.[1] || '')).toUpperCase();
};

const fmtUnits = n => {
  if (n == null) return '0';
  const v = Number(n);
  return (v >= 0 ? '+' : '') + v.toFixed(1);
};

// LeaderboardEntry → UI capper row
export function adaptLeaderboardEntry(e) {
  const name = e.display_name || e.username || 'Capper';
  const unitsProfit = Number(e.units_profit_30d ?? 0);
  const streakRaw = e.current_streak ?? 0;
  return {
    id: e.capper_id,
    user: name,
    ini: initialsFrom(name),
    av: avForId(e.capper_id),
    wins: Math.round((e.win_rate_30d ?? 0) * 100) / 100,
    roi: Math.round((e.roi_30d ?? 0) * 100) / 100,
    picks: e.total_picks ?? 0,
    sport: 'All',
    streak: streakRaw >= 0 ? `${streakRaw}W` : `${Math.abs(streakRaw)}L`,
    // Raw numeric versions kept alongside display strings for sorting.
    streakRaw,
    profit: fmtUnits(unitsProfit),
    profitRaw: unitsProfit,
    price: 0,
    subPrice: Math.round((e.monthly_price_cents ?? 0) / 100),
    followers: '—',
    sales: 0
  };
}

// CapperProfile (joined with profile fields) → UI capper
export function adaptCapper(c, profileName) {
  const name = profileName || c.username || c.display_name || 'Capper';
  return {
    id: c.id,
    user: name,
    ini: initialsFrom(name),
    av: avForId(c.id),
    wins: Math.round((c.win_rate_30d ?? 0) * 100) / 100,
    roi: Math.round((c.roi_30d ?? 0) * 100) / 100,
    picks: c.total_picks ?? 0,
    sport: 'All',
    streak: (c.current_streak ?? 0) >= 0 ? `${c.current_streak}W` : `${Math.abs(c.current_streak)}L`,
    profit: fmtUnits(c.units_profit_30d),
    price: Math.round((c.single_pick_price_cents ?? 0) / 100),
    subPrice: Math.round((c.monthly_price_cents ?? 0) / 100),
    followers: '—',
    sales: 0,
    bio: c.bio
  };
}

// BetPick → UI pick
export function adaptPick(p) {
  const details = p.pick_details || {};
  const pickText = details.text || details.pick || details.selection ||
    (p.bet_type ? p.bet_type.toUpperCase() : 'Pick');
  return {
    id: p.id,
    capperId: p.capper_id,
    sport: p.sport,
    game: details.game || details.matchup || p.league || p.sport,
    pick: pickText,
    odds: p.odds > 0 ? `+${p.odds}` : `${p.odds}`,
    time: p.game_start_at ? new Date(p.game_start_at).toLocaleString() : '—',
    posted: p.created_at ? timeAgo(new Date(p.created_at)) : '—',
    buyers: 0,
    isVipOnly: p.is_vip_only,
    result: p.result || 'pending',
    // A settled pick is readable by anyone — the API stops paywalling it once
    // it grades, so the UI must stop locking it too (see pickDao.isRevealed).
    settled: (p.result || 'pending') !== 'pending',
    units: p.units == null ? null : Number(p.units),
    unitsResult: p.units_result == null ? null : Number(p.units_result),
    analysis: details.analysis || ''
  };
}

function timeAgo(d) {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// OddsGame → UI game row (simplified mapping: takes first bookmaker)
export function adaptOddsGame(g) {
  const book = g.bookmakers?.[0];
  const market = key => book?.markets?.find(m => m.key === key);
  const spread = market('spreads');
  const total = market('totals');
  const ml = market('h2h') || market('moneyline');

  const findOutcome = (m, name) => m?.outcomes?.find(o => o.name === name);
  const fmtPrice = p => p == null ? '—' : (p > 0 ? `+${p}` : `${p}`);

  const homeSpread = findOutcome(spread, g.home_team);
  const awaySpread = findOutcome(spread, g.away_team);
  const over = total?.outcomes?.find(o => o.name === 'Over');
  const under = total?.outcomes?.find(o => o.name === 'Under');
  const homeMl = findOutcome(ml, g.home_team);
  const awayMl = findOutcome(ml, g.away_team);

  return {
    sport: g.sport_title || g.sport_key,
    status: g.commence_time ? new Date(g.commence_time).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' }) : '—',
    live: false,
    home: shortCode(g.home_team),
    homeFull: g.home_team,
    homeRec: '—',
    away: shortCode(g.away_team),
    awayFull: g.away_team,
    awayRec: '—',
    spread: {
      h: homeSpread?.point != null ? (homeSpread.point > 0 ? `+${homeSpread.point}` : `${homeSpread.point}`) : '—',
      hOdds: fmtPrice(homeSpread?.price),
      a: awaySpread?.point != null ? (awaySpread.point > 0 ? `+${awaySpread.point}` : `${awaySpread.point}`) : '—',
      aOdds: fmtPrice(awaySpread?.price)
    },
    total: {
      l: over?.point ?? '—',
      o: fmtPrice(over?.price),
      u: fmtPrice(under?.price)
    },
    ml: {
      h: fmtPrice(homeMl?.price),
      a: fmtPrice(awayMl?.price)
    }
  };
}

function shortCode(name) {
  if (!name) return '???';
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1];
  return last.slice(0, 3).toUpperCase();
}
