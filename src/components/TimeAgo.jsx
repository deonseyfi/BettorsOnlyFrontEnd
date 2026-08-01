import { useState, useEffect } from 'react';

// Re-renders on a timer so the relative label ("3m ago") stays fresh
// without the parent having to know when to update.
export default function TimeAgo({ date, prefix = 'Updated ', style }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!date) return;
    const id = setInterval(() => setTick(n => n + 1), 30_000);
    return () => clearInterval(id);
  }, [date]);

  if (!date) return null;
  return (
    <span style={{ fontSize: 11, color: 'var(--text-3)', ...style }}>
      {prefix}{formatRelative(date)}
    </span>
  );
}

function formatRelative(date) {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 10)   return 'just now';
  if (s < 60)   return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}
