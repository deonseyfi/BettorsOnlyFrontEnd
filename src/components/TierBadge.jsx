import { getTier } from '../data.js';

export default function TierBadge({ roi }) {
  const t = getTier(roi);
  if (!t) return null;
  return <span className={`tier ${t.cls}`}>{t.icon} {t.name}</span>;
}
