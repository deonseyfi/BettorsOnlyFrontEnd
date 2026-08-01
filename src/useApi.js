import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Data-fetching hook with optional background polling.
 *
 * Options:
 *   fallback     — value to show if the fetch fails (e.g. sample data)
 *   pollInterval — ms between background refreshes. Automatically pauses while
 *                  the browser tab is hidden and does one fresh fetch when the
 *                  tab becomes visible again, so idle users don't burn API quota.
 *                  Omit for one-shot fetches.
 */
export function useApi(fetcher, deps = [], { fallback = null, pollInterval } = {}) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const usingFallback = useRef(false);
  const [bumper, setBumper] = useState(0);

  const refetch = useCallback(() => setBumper(n => n + 1), []);

  // Main fetch effect — runs on deps change and every time `refetch` bumps the counter.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then(d => {
        if (cancelled) return;
        setData(d);
        setLastUpdated(new Date());
        usingFallback.current = false;
      })
      .catch(e => {
        if (cancelled) return;
        setError(e);
        if (fallback != null) {
          setData(fallback);
          usingFallback.current = true;
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, bumper]);

  // Polling effect — only active when pollInterval is set.
  useEffect(() => {
    if (!pollInterval) return;

    let intervalId = null;
    const start = () => {
      if (intervalId != null) return;
      intervalId = setInterval(() => {
        if (!document.hidden) refetch();
      }, pollInterval);
    };
    const stop = () => {
      if (intervalId != null) { clearInterval(intervalId); intervalId = null; }
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        // Coming back from background — refresh immediately, then resume polling.
        refetch();
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pollInterval, refetch]);

  return { data, loading, error, isFallback: usingFallback.current, refetch, lastUpdated };
}
