import { supabase } from './auth/supabase.js';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function getAuthToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}

async function request(path, { method = 'GET', body, auth = false, query } = {}) {
  const url = new URL(BASE_URL + path);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    }
  }

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = await getAuthToken();
    if (!token) throw new ApiError(401, 'Not authenticated');
    headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch (e) {
    throw new ApiError(0, 'Network error — is the backend running?');
  }

  if (!res.ok) {
    let msg = res.statusText;
    try { const j = await res.json(); msg = j.error || msg; } catch {}
    throw new ApiError(res.status, msg);
  }

  if (res.status === 204) return null;
  return res.json();
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const api = {
  // Cappers
  listCappers: (q = {}) => request('/cappers', { query: q }),
  getLeaderboard: () => request('/cappers/leaderboard'),
  getCapper: id => request(`/cappers/${id}`),
  getCapperPicks: (id, q = {}) => request(`/cappers/${id}/picks`, { query: q }),
  getCapperTierHistory: id => request(`/cappers/${id}/tier-history`),

  // Picks
  listPicks: (q = {}) => request('/picks', { query: q }),
  getPick: id => request(`/picks/${id}`),

  // Odds — The Odds API market keys: h2h (moneyline), spreads, totals. NOT 'moneyline'.
  listSports: () => request('/odds/sports'),
  getOdds: (sport, regions = 'us', markets = 'h2h,spreads,totals') =>
    request('/odds', { query: { sport, regions, markets } }),

  // Posts
  listPosts: (q = {}) => request('/posts', { query: q }),

  // Auth-required
  getMyProfile: () => request('/profiles/me', { auth: true }),
  updateMyProfile: body => request('/profiles/me', { method: 'PATCH', auth: true, body }),
  getMyCapper: () => request('/cappers/me', { auth: true }),
  getMyCapperPicks: (q = {}) => request('/cappers/me/picks', { auth: true, query: q }),
  becomeCapper: body => request('/cappers/become', { method: 'POST', auth: true, body }),
  updateMyCapper: body => request('/cappers/me', { method: 'PATCH', auth: true, body }),
  createPick: body => request('/picks', { method: 'POST', auth: true, body }),
  // Only send the fields that actually changed — the API rejects an empty patch,
  // and once a game has started it rejects any wager field at all.
  updatePick: (id, body) => request(`/picks/${id}`, { method: 'PATCH', auth: true, body }),
  listMySubscriptions: () => request('/subscriptions', { auth: true }),
  createSubscription: capperId => request('/subscriptions', { method: 'POST', auth: true, body: { capperId } }),
  cancelSubscription: id => request(`/subscriptions/${id}`, { method: 'DELETE', auth: true }),
  createPurchase: pickId => request('/purchases', { method: 'POST', auth: true, body: { pickId } }),
  listMyPurchases: () => request('/purchases', { auth: true }),
  listNotifications: (unreadOnly = false) =>
    request('/notifications', { auth: true, query: unreadOnly ? { unread: 'true' } : {} }),
  markNotificationRead: id => request(`/notifications/${id}/read`, { method: 'PATCH', auth: true }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH', auth: true })
};
