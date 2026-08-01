export const TIERS = [
  { min: 20, name: 'God Tier', cls: 'tier-god', icon: '⚡', color: '#a855f7' },
  { min: 15, max: 19.99, name: 'Gold Tier', cls: 'tier-gold', icon: '🥇', color: '#ffd700' },
  { min: 10, max: 14.99, name: 'Silver Tier', cls: 'tier-silver', icon: '🥈', color: '#c0c0c0' },
  { min: 5, max: 9.99, name: 'Bronze Tier', cls: 'tier-bronze', icon: '🥉', color: '#cd7f32' }
];

export function getTier(roi) {
  return TIERS.find(t => roi >= t.min && (t.max == null || roi <= t.max));
}

// Backend's CapperTier enum → frontend tier descriptor.
// 'platinum' is the backend's top tier; the UI shows it as God Tier.
const TIER_BY_NAME = {
  platinum: TIERS[0],
  gold:     TIERS[1],
  silver:   TIERS[2],
  bronze:   TIERS[3],
  none:     null,
};
export function getTierByName(name) {
  return TIER_BY_NAME[name] ?? null;
}

export const cappers = [
  { id: 1, user: 'SharpMike', ini: 'SM', av: 'av-1', wins: 71, roi: 22, picks: 148, sport: 'NBA', streak: '8W', profit: '+47.2', price: 75, subPrice: 299, followers: '2.1k', sales: 847 },
  { id: 2, user: 'CapperKing', ini: 'CK', av: 'av-2', wins: 67, roi: 12, picks: 203, sport: 'MLB', streak: '5W', profit: '+38.4', price: 50, subPrice: 199, followers: '1.8k', sales: 612 },
  { id: 3, user: 'EdgeFinder', ini: 'EF', av: 'av-3', wins: 73, roi: 18, picks: 97, sport: 'NFL', streak: '6W', profit: '+52.1', price: 100, subPrice: 349, followers: '3.2k', sales: 921 },
  { id: 4, user: 'WestCoastWins', ini: 'WW', av: 'av-4', wins: 77, roi: 24, picks: 122, sport: 'All', streak: '4W', profit: '+61.8', price: 80, subPrice: 299, followers: '2.5k', sales: 1043 },
  { id: 5, user: 'LockdownLinds', ini: 'LL', av: 'av-5', wins: 58, roi: 7, picks: 55, sport: 'NBA', streak: '3W', profit: '+12.4', price: 25, subPrice: 99, followers: '412', sales: 187 },
  { id: 6, user: 'PropKing', ini: 'PK', av: 'av-6', wins: 76, roi: 16, picks: 89, sport: 'NBA Props', streak: '7W', profit: '+44.8', price: 90, subPrice: 249, followers: '1.4k', sales: 534 },
  { id: 7, user: 'NHLNathan', ini: 'NN', av: 'av-7', wins: 62, roi: 9, picks: 74, sport: 'NHL', streak: '2W', profit: '+18.2', price: 40, subPrice: 149, followers: '628', sales: 298 },
  { id: 8, user: 'CollegeGuru', ini: 'CG', av: 'av-8', wins: 66, roi: 11, picks: 131, sport: 'NCAA', streak: '4W', profit: '+29.5', price: 60, subPrice: 179, followers: '1.1k', sales: 421 }
];

export const livePicks = [
  { id: 1, capperId: 1, sport: 'NBA', game: 'Lakers vs Warriors', pick: 'Lakers +2.5', odds: '-110', time: 'Tonight 10:30 PM ET', posted: '8 min ago', buyers: 12 },
  { id: 2, capperId: 3, sport: 'NFL', game: 'Chiefs vs Bills', pick: 'Chiefs -3', odds: '-110', time: 'Sunday 4:25 PM ET', posted: '23 min ago', buyers: 8 },
  { id: 3, capperId: 2, sport: 'MLB', game: 'Yankees vs Red Sox', pick: 'Yankees ML', odds: '-145', time: 'Tonight 7:05 PM ET', posted: '41 min ago', buyers: 19 },
  { id: 4, capperId: 6, sport: 'NBA', game: 'LeBron Over 25.5 PTS', pick: 'LeBron James Over 25.5 PTS', odds: '-115', time: 'Tonight 10:30 PM', posted: '1h ago', buyers: 7 },
  { id: 5, capperId: 4, sport: 'NBA', game: 'Celtics vs Heat', pick: 'Under 214.5', odds: '-110', time: 'Tonight 8:00 PM ET', posted: '1h ago', buyers: 31 },
  { id: 6, capperId: 5, sport: 'NBA', game: 'Nuggets vs Suns', pick: 'Nuggets -4.5', odds: '-112', time: 'Tonight 9:00 PM ET', posted: '2h ago', buyers: 5 }
];

export const games = [
  { sport: 'NBA', status: 'LIVE Q3', live: true, home: 'LAL', homeFull: 'Lakers', homeRec: '42-30', homeScore: 87, away: 'GSW', awayFull: 'Warriors', awayRec: '40-32', awayScore: 81, spread: { h: '-2', hOdds: '-110', a: '+2', aOdds: '-110' }, total: { l: '224.5', o: '-112', u: '-108' }, ml: { h: '-138', a: '+118' } },
  { sport: 'NBA', status: '7:30 PM ET', home: 'MIA', homeFull: 'Heat', homeRec: '38-34', away: 'BOS', awayFull: 'Celtics', awayRec: '52-20', spread: { h: '-3.5', hOdds: '-112', a: '+3.5', aOdds: '-108' }, total: { l: '214.5', o: '-110', u: '-110' }, ml: { h: '-165', a: '+145' } },
  { sport: 'NBA', status: '9:00 PM ET', home: 'PHX', homeFull: 'Suns', homeRec: '45-27', away: 'DEN', awayFull: 'Nuggets', awayRec: '48-24', spread: { h: '+4.5', hOdds: '-110', a: '-4.5', aOdds: '-110' }, total: { l: '226.5', o: '-110', u: '-110' }, ml: { h: '+165', a: '-185' } },
  { sport: 'NFL', status: 'Sun 4:25 PM ET', home: 'BUF', homeFull: 'Bills', homeRec: '13-4', away: 'KC', awayFull: 'Chiefs', awayRec: '14-3', spread: { h: '+3', hOdds: '-110', a: '-3', aOdds: '-110' }, total: { l: '48.5', o: '-110', u: '-110' }, ml: { h: '+140', a: '-165' } },
  { sport: 'NFL', status: 'Sun 1:00 PM ET', home: 'DAL', homeFull: 'Cowboys', homeRec: '10-7', away: 'GB', awayFull: 'Packers', awayRec: '9-8', spread: { h: '-3.5', hOdds: '-110', a: '+3.5', aOdds: '-110' }, total: { l: '45.5', o: '-110', u: '-110' }, ml: { h: '-180', a: '+155' } },
  { sport: 'MLB', status: '7:05 PM ET', home: 'BOS', homeFull: 'Red Sox', homeRec: '6-6', away: 'NYY', awayFull: 'Yankees', awayRec: '8-4', spread: { h: '+1.5', hOdds: '-150', a: '-1.5', aOdds: '+130' }, total: { l: '8.5', o: '-110', u: '-110' }, ml: { h: '+122', a: '-145' } },
  { sport: 'MLB', status: '10:10 PM ET', home: 'SF', homeFull: 'Giants', homeRec: '7-5', away: 'LAD', awayFull: 'Dodgers', awayRec: '10-2', spread: { h: '+1.5', hOdds: '-140', a: '-1.5', aOdds: '+120' }, total: { l: '7.5', o: '-105', u: '-115' }, ml: { h: '+155', a: '-180' } },
  { sport: 'NHL', status: '7:00 PM ET', home: 'BOS', homeFull: 'Bruins', homeRec: '42-15', away: 'NYR', awayFull: 'Rangers', awayRec: '40-18', spread: { h: '-1.5', hOdds: '+155', a: '+1.5', aOdds: '-175' }, total: { l: '6.5', o: '+105', u: '-125' }, ml: { h: '-130', a: '+110' } },
  { sport: 'NHL', status: '10:00 PM ET', home: 'VGK', homeFull: 'Golden Knights', homeRec: '38-22', away: 'EDM', awayFull: 'Oilers', awayRec: '40-20', spread: { h: '+1.5', hOdds: '-180', a: '-1.5', aOdds: '+160' }, total: { l: '6.5', o: '-115', u: '-105' }, ml: { h: '+115', a: '-135' } },
  { sport: 'Soccer', status: '3:00 PM ET', home: 'CHE', homeFull: 'Chelsea', homeRec: '—', away: 'ARS', awayFull: 'Arsenal', awayRec: '—', spread: { h: '+0.5', hOdds: '+100', a: '-0.5', aOdds: '-120' }, total: { l: '2.5', o: '-110', u: '-110' }, ml: { h: '+320', a: '-145' } }
];

export const initialThreads = [
  { id: 1, name: 'SharpMike', ini: 'SM', av: 'av-1', roi: 22, unread: true, preview: 'NEW PICK: Lakers +2.5 · 8:14 AM', active: true },
  { id: 2, name: 'CapperKing', ini: 'CK', av: 'av-2', roi: 12, unread: true, preview: 'Yankees ML tonight — full analysis' },
  { id: 3, name: 'EdgeFinder', ini: 'EF', av: 'av-3', roi: 18, unread: false, preview: 'BOS/MIA Under 214.5 unlocked' },
  { id: 4, name: 'PropKing', ini: 'PK', av: 'av-6', roi: 16, unread: true, preview: 'LeBron Over 25.5 PTS — strong play' }
];

export const initialParlayLegs = [
  { team: 'Lakers -2.5', odds: '-110' },
  { team: 'Chiefs -3', odds: '-110' },
  { team: 'Yankees ML', odds: '-145' }
];

export const pickHistory = [
  { result: 'W', pick: 'Lakers +2.5 vs Warriors', meta: 'NBA · -110 · Posted 2h ago', units: '+0.91U', buyers: 12 },
  { result: 'W', pick: 'Celtics ML vs Heat', meta: 'NBA · -180 · Posted yesterday', units: '+0.56U', buyers: 28 },
  { result: 'L', pick: 'Nuggets -7 vs Suns', meta: 'NBA · -110 · Posted 2 days ago', units: '-1.00U', buyers: 15 },
  { result: 'W', pick: 'Over 224.5 Mavs/Clippers', meta: 'NBA · -105 · Posted 3 days ago', units: '+0.95U', buyers: 22 },
  { result: 'P', pick: 'Knicks -3 vs Sixers', meta: 'NBA · -110 · Posted 4 days ago', units: '0.00U', buyers: 19 },
  { result: 'W', pick: 'Thunder ML vs Wolves', meta: 'NBA · +110 · Posted 5 days ago', units: '+1.10U', buyers: 31 }
];

export const tourSteps = [
  { icon: '👋', title: 'Welcome to BettorsOnly!', desc: "The first community-driven sports pick marketplace where bettors earn their reputation and set their own prices." },
  { icon: '📊', title: 'Track every pick', desc: 'Submit your picks publicly through your Profile. Every result is auto-graded. Build a verified record over time — no faking, no hiding losses.' },
  { icon: '⚡', title: 'We measure ROI, not win rate', desc: "Win rate can lie — a capper picking heavy favorites can win 80% of bets and still LOSE money. ROI shows who is actually profitable. Don't worry, we'll teach you as you go." },
  { icon: '🏆', title: 'Earn your tier', desc: 'Submit 20+ picks to unlock your tier. Hit +5% ROI for Bronze, +20% for God Tier. Then set your own prices and keep 80% of every sale.' }
];
