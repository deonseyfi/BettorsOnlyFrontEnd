export default function ApiStatus({ loading, error, isFallback }) {
  if (loading) {
    return <div style={{ fontSize: 12, color: 'var(--text-3)', padding: '8px 0' }}>Loading…</div>;
  }
  if (isFallback) {
    return (
      <div style={{
        fontSize: 12, color: 'var(--text-3)', padding: '8px 12px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)',
        borderRadius: 6, marginBottom: 12, display: 'inline-block'
      }}>
        ⚠ Showing sample data — backend not reachable {error?.message ? `(${error.message})` : ''}
      </div>
    );
  }
  return null;
}
