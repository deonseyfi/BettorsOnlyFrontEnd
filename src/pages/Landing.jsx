import { cappers, getTier } from '../data.js';
import Avatar from '../components/Avatar.jsx';
import TierBadge from '../components/TierBadge.jsx';

export default function Landing({ onNavigate, onOpenModal, onStartTour }) {
  const featured = [cappers[0], cappers[3], cappers[5], cappers[2]];

  return (
    <div className="page active">
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">⚡ THE VERIFIED PICK MARKETPLACE</div>
          <div className="hero-brand" style={{ marginBottom: '1.5rem' }}>BETTORS<span>Only</span></div>
          <h1 style={{ fontSize: 48, lineHeight: 1.15 }}>
            Your picks. Your price.<br />
            <span style={{ color: 'var(--b)', fontStyle: 'italic' }}>Your platform.</span>
          </h1>
          <p className="hero-tagline" style={{ fontSize: 18, color: '#fff', fontWeight: 500, marginBottom: '0.5rem' }}>
            Buy verified picks from proven cappers. Or become one yourself.
          </p>
          <p className="hero-tagline" style={{ marginTop: '0.75rem' }}>
            The verified pick marketplace built for sports bettors. We're not a sportsbook — we're where bettors get paid for being right.
          </p>
          <div className="hero-ctas">
            <button className="btn btn-white btn-lg" onClick={() => onOpenModal('signup')}>Start Free</button>
            <button className="btn btn-ghost btn-lg" onClick={() => onNavigate('picks')}>Browse Picks</button>
            <button className="btn btn-ghost btn-lg" onClick={onStartTour}>▶ Take the tour</button>
          </div>
          <div className="hero-stats">
            <div className="stat-cell"><strong>4,821</strong><span>Members</span></div>
            <div className="stat-cell"><strong>47</strong><span>Picks live</span></div>
            <div className="stat-cell"><strong>38</strong><span>VIP cappers</span></div>
            <div className="stat-cell"><strong>68%</strong><span>Avg win rate</span></div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">How It Works</div>
            <div className="section-title">From bettor to capper in 4 steps</div>
            <div className="section-subtitle">BettorsOnly is built on transparency. You don't claim a win rate — you earn it. Every pick is auto-graded against the closing line.</div>
          </div>
          <div className="steps-grid">
            <Step n={1} icon="📝" title="Create your profile" desc="Sign up free in seconds. Set up your handle, bio, and favorite sports." />
            <Step n={2} icon="📊" title="Submit picks publicly" desc="Post picks through your Profile. Every pick is auto-graded and tracked. No hiding losses." />
            <Step n={3} icon="🏆" title="Earn your tier" desc="Submit 20+ picks to unlock your initial tier. Your tier is based on ROI — the pro standard for measuring real betting skill." />
            <Step n={4} icon="💰" title="Sell on your terms" desc="Set your own prices. Offer subscriptions, single picks, or packages. Keep 80%. We take 20%." />
          </div>
        </div>
      </div>

      <div className="section tier-section">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">Capper Tiers</div>
            <div className="section-title">Earn your reputation</div>
            <div className="section-subtitle">
              Tiers are credibility badges based on your verified <strong style={{ color: '#fff' }}>ROI</strong> — the professional standard for measuring betting skill. Submit 20+ picks to unlock your initial tier — then your tier updates based on your rolling last 30 days of performance. Cappers set their own prices.
            </div>
          </div>
          <div className="tiers-grid">
            <TierCard cls="bronze" emoji="🥉" name="Bronze Tier" rate="+5% to +9% ROI" desc="Genuinely profitable bettor. You're beating the market consistently and showing real edge." colorVar="--bronze" />
            <TierCard cls="silver" emoji="🥈" name="Silver Tier" rate="+10% to +14% ROI" desc="Strong long-term winner. You're finding value others miss and your record proves it." colorVar="--silver" />
            <TierCard cls="gold" emoji="🥇" name="Gold Tier" rate="+15% to +19% ROI" desc="Elite-level performance. Top 5% of all bettors. Sharp money operates at this level." colorVar="--gold" />
            <TierCard cls="god" emoji="⚡" name="God Tier" rate="+20% ROI and above" desc="World-class bettor. Nearly unicorn-level. Only the sharpest minds in sports betting hit this." colorVar="--god" />
          </div>
        </div>
      </div>

      <div className="section" style={{ background: '#0a0a0c' }}>
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">Why ROI?</div>
            <div className="section-title">Win rate lies. ROI tells the truth.</div>
            <div className="section-subtitle">Most pick services brag about win rate because it sounds impressive on Twitter. But win rate alone can hide a losing bettor. We use ROI — the math doesn't lie.</div>
          </div>

          <div style={{ maxWidth: 880, margin: '2rem auto 0', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '2rem', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
            <div style={{ fontSize: 11, color: 'var(--b)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: 14, textAlign: 'center' }}>⚡ The Same 10 Bets · Two Different Strategies</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '1.25rem', position: 'relative' }}>
                <div style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: 8 }}>Casual Carl</div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.6 }}>Bets 10 heavy favorites at -500 odds. Wins 8 out of 10 games.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)', fontVariantNumeric: 'tabular-nums' }}>80%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>Win rate 🔥</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--red)', fontVariantNumeric: 'tabular-nums' }}>-4%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>ROI</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, padding: 10, fontSize: 12, color: 'var(--red)', textAlign: 'center', fontWeight: 500 }}>⚠️ Actually losing money</div>
              </div>

              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--god)', borderRadius: 10, padding: '1.25rem', position: 'relative', boxShadow: '0 0 28px rgba(168,85,247,0.12)' }}>
                <div style={{ fontSize: 12, color: 'var(--b)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: 8 }}>Sharp Sarah</div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 14, lineHeight: 1.6 }}>Bets 10 underdogs at +150 odds. Wins only 5 out of 10 games.</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-2)', fontVariantNumeric: 'tabular-nums' }}>50%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>Win rate 😬</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--god)', fontVariantNumeric: 'tabular-nums' }}>+25%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>ROI ⚡</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: 6, padding: 10, fontSize: 12, color: 'var(--god)', textAlign: 'center', fontWeight: 500 }}>⚡ God Tier · Crushing it</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              Carl has a higher win rate. <strong style={{ color: '#fff' }}>Sarah made way more money.</strong><br />
              That's why we measure ROI — it cuts through the noise and shows who's actually winning.
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-ghost btn-lg" onClick={() => onNavigate('roi')}>See full ROI guide →</button>
          </div>
        </div>
      </div>

      <div className="featured-section">
        <div className="featured-header">
          <div>
            <div className="featured-eyebrow">⭐ Featured Cappers</div>
            <div style={{ fontSize: 22, fontWeight: 300, color: '#fff', letterSpacing: '-0.3px' }}>Promoted picks from top sellers</div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('picks')}>View all picks →</button>
        </div>
        <div className="featured-carousel">
          {featured.map(cap => {
            const tier = getTier(cap.roi);
            return (
              <div key={cap.id} className="featured-card" onClick={() => onNavigate('capper')}>
                <div className="featured-card-promoted"><span className="promoted-badge">⭐ Promoted</span></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 18 }}>
                  <Avatar ini={cap.ini} av={cap.av} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{cap.user}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{cap.sport}</div>
                  </div>
                </div>
                <div style={{ marginBottom: 10 }}><TierBadge roi={cap.roi} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div style={{ background: 'var(--bg-2)', borderRadius: 6, padding: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: tier?.color || '#fff', fontVariantNumeric: 'tabular-nums' }}>+{cap.roi}%</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>ROI</div>
                  </div>
                  <div style={{ background: 'var(--bg-2)', borderRadius: 6, padding: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--green)', fontVariantNumeric: 'tabular-nums' }}>{cap.profit}U</div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>Profit</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 10 }}>
                  From <strong style={{ color: '#fff' }}>${cap.price}</strong>/pick · <strong style={{ color: '#fff' }}>${cap.subPrice}</strong>/mo
                </div>
                <button className="btn btn-white btn-sm" style={{ width: '100%' }}>View picks</button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="section">
        <div className="section-inner">
          <div className="section-head">
            <div className="eyebrow">Why BettorsOnly</div>
            <div className="section-title">Built different from every other pick service</div>
          </div>
          <div className="why-grid">
            <WhyCard icon="✅" title="Verified records" desc="Every pick auto-graded. No fake screenshots, no cherry-picking, no inflated stats. What you see is what's real." />
            <WhyCard icon="🔒" title="Pick protection" desc="Every purchased pick is watermarked with your Member ID. Sharing equals permanent ban. Cappers' work is protected." />
            <WhyCard icon="⚡" title="Capper-owned pricing" desc="Cappers set their own prices. Subscribe monthly or buy single picks. No lock-in — switch cappers freely." />
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <div className="section-title">Ready to start winning?</div>
          <div className="section-subtitle" style={{ marginBottom: '1.75rem' }}>Join free. Track your picks. Build your record. Become a capper.</div>
          <button className="btn btn-white btn-lg" onClick={() => onOpenModal('signup')}>Create your free account</button>
        </div>
      </div>
    </div>
  );
}

function Step({ n, icon, title, desc }) {
  return (
    <div className="step">
      <div className="step-num">{n}</div>
      <div className="step-icon">{icon}</div>
      <div className="step-title">{title}</div>
      <div className="step-desc">{desc}</div>
    </div>
  );
}

function TierCard({ cls, emoji, name, rate, desc, colorVar }) {
  return (
    <div className={`tier-card ${cls}`}>
      <div className="tier-emoji">{emoji}</div>
      <div className="tier-name" style={{ color: `var(${colorVar})` }}>{name}</div>
      <div className="tier-rate" style={{ color: `var(${colorVar})` }}>{rate}</div>
      <div className="tier-desc">{desc}</div>
    </div>
  );
}

function WhyCard({ icon, title, desc }) {
  return (
    <div className="why-card">
      <div className="why-icon">{icon}</div>
      <div className="why-title">{title}</div>
      <div className="why-desc">{desc}</div>
    </div>
  );
}
