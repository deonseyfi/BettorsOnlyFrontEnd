import { useState } from 'react';
import { initialThreads } from '../data.js';
import Avatar from '../components/Avatar.jsx';
import TierBadge from '../components/TierBadge.jsx';

export default function Inbox() {
  const [threads, setThreads] = useState(initialThreads);

  const selectThread = id => {
    setThreads(prev => prev.map(t => ({ ...t, active: t.id === id, unread: t.id === id ? false : t.unread })));
  };

  const active = threads.find(t => t.active) || threads[0];

  return (
    <div className="page active">
      <div className="inner">
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 className="h1">Inbox</h1>
          <div className="h-sub">Your purchased picks — watermarked and delivered privately.</div>
        </div>
        <div className="inbox-shell">
          <div className="inbox-list">
            <div className="inbox-list-head">Messages</div>
            {threads.map(t => (
              <div key={t.id} className={`thread ${t.active ? 'active' : ''}`} onClick={() => selectThread(t.id)}>
                <Avatar ini={t.ini} av={t.av} />
                <div className="thread-info">
                  <div className="thread-name">
                    {t.name} <TierBadge roi={t.roi} /> {t.unread && <span className="unread-dot"></span>}
                  </div>
                  <div className="thread-preview">{t.preview}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="inbox-conv">
            <div className="conv-head">
              <Avatar ini={active.ini} av={active.av} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                  {active.name} <TierBadge roi={active.roi} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Active subscription · Auto-delivery enabled</div>
              </div>
            </div>
            <div className="conv-messages">
              <div className="msg">
                <div className="msg-bubble">Good morning! New pick is live for tonight.</div>
                <div className="msg-time">8:12 AM</div>
              </div>
              <div className="msg">
                <div className="msg-bubble">
                  <div className="msg-pick">
                    <div className="msg-pick-sport">🏀 NBA · Private Pick</div>
                    <div className="msg-pick-text">
                      Lakers +2.5 <span style={{ color: 'var(--text-3)', fontSize: 14, fontWeight: 400 }}>(-110)</span>
                    </div>
                    <div className="msg-pick-game">Lakers vs Warriors · Tonight 10:30 PM ET</div>
                    <div className="msg-pick-analysis">
                      Lakers always make Q4 runs at home. Line moved from +1 to +2.5 in the last 3 hours — public is hammering Warriors but sharp money is on Lakers. This line should close closer to +1.5.
                    </div>
                    <div className="msg-watermark">For: @you · BettorsOnly Member ID: #83920 · Sharing violates Terms of Service</div>
                  </div>
                </div>
                <div className="msg-time">8:14 AM</div>
              </div>
              <div className="msg">
                <div className="msg-bubble">Let me know if you have any questions! 🏆</div>
                <div className="msg-time">8:15 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
