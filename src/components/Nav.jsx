import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext.jsx';

const links = [
  { id: 'landing', label: 'Home' },
  { id: 'sports', label: 'Sports & Lines' },
  { id: 'picks', label: 'Picks' },
  { id: 'parlay', label: 'Parlay Calculator', stack: true },
  { id: 'leaderboard', label: 'Leaderboard' },
  { id: 'profile', label: 'Profile' }
];

export default function Nav({ currentPage, onNavigate, onOpenModal }) {
  const { user, signOut } = useAuth();

  return (
    <div className="nav">
      <div className="logo" onClick={() => onNavigate('landing')}>
        BETTORS<span>Only</span>
      </div>
      <div className="nav-links">
        {links.map(l => (
          <a
            key={l.id}
            className={currentPage === l.id ? 'active' : ''}
            onClick={() => onNavigate(l.id)}
            style={l.stack ? { lineHeight: 1.15, textAlign: 'center', padding: '5px 14px' } : undefined}
          >
            {l.stack ? (
              <>
                <span style={{ display: 'block', fontSize: 11 }}>Parlay</span>
                <span style={{ display: 'block', fontSize: 11 }}>Calculator</span>
              </>
            ) : (
              l.label
            )}
          </a>
        ))}
      </div>
      <div className="nav-right">
        {user ? (
          <UserMenu user={user} onSignOut={signOut} onNavigate={onNavigate} />
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => onOpenModal('login')}>Log in</button>
            <button className="btn btn-white btn-sm" onClick={() => onOpenModal('signup')}>Join Free</button>
          </>
        )}
      </div>
    </div>
  );
}

function UserMenu({ user, onSignOut, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  const username = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px 4px 4px',
          background: 'var(--card)', border: '1px solid var(--border-strong)', borderRadius: 100,
          color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500
        }}
      >
        <div className="avatar av-1" style={{ width: 28, height: 28, fontSize: 11 }}>{initials}</div>
        <span>{username}</span>
        <span style={{ fontSize: 9, color: 'var(--text-3)' }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0,
          background: 'var(--card)', border: '1px solid var(--border-strong)', borderRadius: 8,
          minWidth: 180, boxShadow: 'var(--shadow-lg)', zIndex: 200,
          padding: 6
        }}>
          <MenuItem onClick={() => { setOpen(false); onNavigate('profile'); }}>Profile</MenuItem>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
          <MenuItem onClick={() => { setOpen(false); onSignOut(); }}>Log out</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block', width: '100%', textAlign: 'left',
        padding: '8px 12px', background: 'transparent', border: 'none',
        color: '#fff', fontSize: 13, cursor: 'pointer', borderRadius: 4
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {children}
    </button>
  );
}
