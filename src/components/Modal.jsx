import { useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Modal({ modal, onClose }) {
  if (!modal) return null;
  const { type } = modal;

  return (
    <div className="overlay open" onClick={e => { if (e.target.classList.contains('overlay')) onClose(); }}>
      <div className="modal">
        {type === 'login' && <LoginModal onClose={onClose} />}
        {type === 'signup' && <SignupModal onClose={onClose} />}
        {type === 'buy' && <BuyModal modal={modal} onClose={onClose} />}
        {type === 'subscribe' && <SubscribeModal modal={modal} onClose={onClose} />}
      </div>
    </div>
  );
}

function ConfigWarning() {
  const { configured } = useAuth();
  if (configured) return null;
  return (
    <div style={{
      fontSize: 11, color: 'var(--text-3)', padding: '10px 12px',
      background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 6, marginBottom: 12, lineHeight: 1.5
    }}>
      ⚠ Supabase not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> and restart.
    </div>
  );
}

function LoginModal({ onClose }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ state: 'idle' });

  const submit = async e => {
    e?.preventDefault?.();
    setStatus({ state: 'loading' });
    const { error } = await signIn(email, password);
    if (error) { setStatus({ state: 'error', msg: error.message }); return; }
    setStatus({ state: 'success', msg: 'Logged in.' });
    setTimeout(onClose, 400);
  };

  return (
    <form onSubmit={submit}>
      <h2>Log in to BettorsOnly</h2>
      <ConfigWarning />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <StatusLine status={status} />
      <div className="modal-foot">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-white btn-sm" disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Logging in…' : 'Log in'}
        </button>
      </div>
    </form>
  );
}

function SignupModal({ onClose }) {
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ state: 'idle' });

  const submit = async e => {
    e?.preventDefault?.();
    if (password !== confirm) { setStatus({ state: 'error', msg: 'Passwords do not match' }); return; }
    if (password.length < 6) { setStatus({ state: 'error', msg: 'Password must be at least 6 characters' }); return; }

    setStatus({ state: 'loading' });
    const { data, error } = await signUp(email, password, username);
    if (error) { setStatus({ state: 'error', msg: error.message }); return; }

    if (data.session) {
      setStatus({ state: 'success', msg: 'Account created.' });
      setTimeout(onClose, 400);
    } else {
      setStatus({ state: 'success', msg: 'Account created. Check your email to confirm.' });
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Create your free account</h2>
      <ConfigWarning />
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password (6+ chars)" value={password} onChange={e => setPassword(e.target.value)} required />
      <input type="password" placeholder="Confirm password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
      <StatusLine status={status} />
      <div className="modal-foot">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-white btn-sm" disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Creating…' : 'Create account'}
        </button>
      </div>
    </form>
  );
}

function BuyModal({ modal, onClose }) {
  const { user } = useAuth();
  const { pickId, capper } = modal;
  const [status, setStatus] = useState({ state: 'idle' });
  const price = capper?.price ?? 75;
  const name = capper?.user ?? 'this capper';

  const buy = async () => {
    if (!user) { setStatus({ state: 'error', msg: 'Log in first.' }); return; }
    if (!pickId) { setStatus({ state: 'error', msg: 'No pick selected.' }); return; }
    setStatus({ state: 'loading' });
    try {
      const r = await api.createPurchase(pickId);
      setStatus({ state: 'success', msg: `Purchase intent created (id: ${r.purchaseId}). Stripe payment flow is the next step.` });
    } catch (e) {
      setStatus({ state: 'error', msg: e.message });
    }
  };

  return (
    <>
      <h2>Confirm purchase</h2>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: 14, borderRadius: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>You're buying</div>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{name}'s pick</div>
        <div style={{ fontSize: 15, color: 'var(--b)', fontWeight: 700 }}>${price}.00</div>
      </div>
      {!user && (
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 10 }}>You'll need to log in first.</div>
      )}
      <input type="text" placeholder="Card number (Stripe Elements goes here)" disabled />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        <input type="text" placeholder="MM/YY" style={{ margin: 0 }} disabled />
        <input type="text" placeholder="CVV" style={{ margin: 0 }} disabled />
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.6, marginTop: 8 }}>
        Picks are watermarked to your account. Sharing violates Terms of Service and results in permanent ban.
      </p>
      <StatusLine status={status} />
      <div className="modal-foot">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-white btn-sm" onClick={buy} disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Processing…' : `Pay $${price}`}
        </button>
      </div>
    </>
  );
}

function SubscribeModal({ modal, onClose }) {
  const { user } = useAuth();
  const { capper } = modal;
  const [status, setStatus] = useState({ state: 'idle' });
  const subPrice = capper?.subPrice ?? 299;

  const subscribe = async () => {
    if (!user) { setStatus({ state: 'error', msg: 'Log in first.' }); return; }
    setStatus({ state: 'loading' });
    try {
      const r = await api.createSubscription(capper.id);
      setStatus({ state: 'success', msg: `Subscription created (id: ${r.subscriptionId}). Stripe payment flow is the next step.` });
    } catch (e) {
      setStatus({ state: 'error', msg: e.message });
    }
  };

  return (
    <>
      <h2>Subscribe to {capper?.user || 'capper'}</h2>
      <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', padding: 14, borderRadius: 8, marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Monthly subscription</div>
        <div style={{ fontSize: 15, color: 'var(--b)', fontWeight: 700 }}>${subPrice}.00 /month</div>
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 8 }}>
        Unlimited picks, early access, private Discord, cancel anytime.
      </p>
      <StatusLine status={status} />
      <div className="modal-foot">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary btn-sm" onClick={subscribe} disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Processing…' : 'Subscribe'}
        </button>
      </div>
    </>
  );
}

function StatusLine({ status }) {
  if (status.state === 'idle' || status.state === 'loading') return null;
  const color = status.state === 'success' ? 'var(--green)' : 'var(--red)';
  return (
    <div style={{ fontSize: 12, color, padding: '10px 0', lineHeight: 1.5 }}>
      {status.msg}
    </div>
  );
}
