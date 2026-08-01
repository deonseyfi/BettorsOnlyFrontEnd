export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)', background: '#0a0a0c',
      padding: '2rem', marginTop: '3rem'
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
          © {new Date().getFullYear()} BettorsOnly. Not a sportsbook. 18+ only.
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
          <a onClick={() => onNavigate('terms')} style={{ color: 'var(--text-2)', cursor: 'pointer' }}>Terms</a>
          <a onClick={() => onNavigate('privacy')} style={{ color: 'var(--text-2)', cursor: 'pointer' }}>Privacy</a>
          <a onClick={() => onNavigate('roi')} style={{ color: 'var(--text-2)', cursor: 'pointer' }}>How ROI Works</a>
        </div>
      </div>
    </footer>
  );
}
