export default function RoiGuide({ onOpenModal }) {
  return (
    <div className="page active">
      <div className="inner" style={{ maxWidth: 820 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,194,255,0.08)', border: '1px solid rgba(0,194,255,0.3)', color: 'var(--b)', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 100, marginBottom: '1rem', letterSpacing: '1px', textTransform: 'uppercase' }}>⚡ The complete guide</div>
          <h1 style={{ fontSize: 42, fontWeight: 300, color: '#fff', marginBottom: 14, letterSpacing: '-0.5px' }}>How ROI Works</h1>
          <p style={{ fontSize: 16, color: 'var(--text-2)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
            A simple, no-bullshit explanation of how we measure betting skill on BettorsOnly. We'll keep it real.
          </p>
        </div>

        <GuideStep n={1} title="First, what's a 'unit'?">
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 14 }}>
            A unit is just a fancy word for "your standard bet size." Instead of saying "I bet $100" we say "I bet 1 unit." This way bettors don't have to share exactly how much they're risking.
          </p>
          <div style={{ background: 'var(--bg-2)', borderLeft: '3px solid var(--b)', borderRadius: 6, padding: '14px 18px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
            <strong style={{ color: '#fff' }}>Example:</strong> If you bet $50 on every game, then for you, 1 unit = $50. A capper with a $100,000 bankroll might have 1 unit = $1,000. Same system, different sizes.
          </div>
        </GuideStep>

        <GuideStep n={2} title="What is ROI?">
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 14 }}>
            ROI stands for <strong style={{ color: '#fff' }}>Return on Investment</strong>. It's the professional standard for measuring betting skill.
          </p>
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 14 }}>
            It asks one simple question: <em style={{ color: '#fff' }}>"How much profit did you make compared to how much you risked?"</em>
          </p>
          <div style={{ background: 'linear-gradient(135deg,rgba(0,194,255,0.08),rgba(168,85,247,0.05))', border: '1px solid rgba(0,194,255,0.3)', borderRadius: 8, padding: '18px 22px', textAlign: 'center', margin: '1rem 0' }}>
            <div style={{ fontSize: 11, color: 'var(--b)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600, marginBottom: 8 }}>The Formula</div>
            <div style={{ fontSize: 20, color: '#fff', fontWeight: 500, lineHeight: 1.5, fontFamily: 'Georgia,serif' }}>ROI = (Profit ÷ Total Risked) × 100</div>
          </div>
          <div style={{ background: 'var(--bg-2)', borderLeft: '3px solid var(--green)', borderRadius: 6, padding: '14px 18px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
            <strong style={{ color: '#fff' }}>Example:</strong> You risk 100 units total over 50 bets. You end up +20 units in profit. Your ROI is <strong style={{ color: 'var(--god)' }}>+20% — God Tier territory.</strong>
          </div>
        </GuideStep>

        <GuideStep n={3} title="Why ROI beats win rate">
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Here's where most pick services get it wrong. They brag about win rate because <strong style={{ color: '#fff' }}>90% win rate sounds amazing</strong>. But it can hide a losing bettor. Let me show you.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--bg-2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '1.25rem' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>😬 Casual Carl</div>
              <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
                Carl bets 10 heavy favorites at <strong style={{ color: '#fff' }}>-500 odds</strong> (risking 5 units to win 1). He wins 8 of 10 games.
              </div>
              <table style={{ width: '100%', fontSize: 13, color: 'var(--text-2)', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ padding: '4px 0' }}>Win rate</td><td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>80% 🔥</td></tr>
                  <tr><td style={{ padding: '4px 0' }}>Wins (8 × 0.20 units)</td><td style={{ textAlign: 'right', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>+1.60 units</td></tr>
                  <tr><td style={{ padding: '4px 0' }}>Losses (2 × 1.00 units)</td><td style={{ textAlign: 'right', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>-2.00 units</td></tr>
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: '8px 0 4px 0', color: '#fff', fontWeight: 600 }}>Net result</td><td style={{ textAlign: 'right', color: 'var(--red)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>-0.40 units</td></tr>
                  <tr><td style={{ padding: '4px 0', color: '#fff', fontWeight: 600 }}>ROI</td><td style={{ textAlign: 'right', color: 'var(--red)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>-4%</td></tr>
                </tbody>
              </table>
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 6, fontSize: 12, color: 'var(--red)', fontWeight: 500, textAlign: 'center' }}>⚠️ Even at 80% win rate, Carl LOST money</div>
            </div>

            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--god)', borderRadius: 10, padding: '1.25rem', boxShadow: '0 0 24px rgba(168,85,247,0.1)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--god)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>⚡ Sharp Sarah</div>
              <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 12 }}>
                Sarah bets 10 underdogs at <strong style={{ color: '#fff' }}>+150 odds</strong> (risking 1 to win 1.5). She wins 5 of 10 games.
              </div>
              <table style={{ width: '100%', fontSize: 13, color: 'var(--text-2)', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ padding: '4px 0' }}>Win rate</td><td style={{ textAlign: 'right', color: 'var(--text-2)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>50% 😬</td></tr>
                  <tr><td style={{ padding: '4px 0' }}>Wins (5 × 1.50 units)</td><td style={{ textAlign: 'right', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>+7.50 units</td></tr>
                  <tr><td style={{ padding: '4px 0' }}>Losses (5 × 1.00 units)</td><td style={{ textAlign: 'right', color: '#fff', fontVariantNumeric: 'tabular-nums' }}>-5.00 units</td></tr>
                  <tr style={{ borderTop: '1px solid var(--border)' }}><td style={{ padding: '8px 0 4px 0', color: '#fff', fontWeight: 600 }}>Net result</td><td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>+2.50 units</td></tr>
                  <tr><td style={{ padding: '4px 0', color: '#fff', fontWeight: 600 }}>ROI</td><td style={{ textAlign: 'right', color: 'var(--god)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>+25%</td></tr>
                </tbody>
              </table>
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(168,85,247,0.1)', borderRadius: 6, fontSize: 12, color: 'var(--god)', fontWeight: 500, textAlign: 'center' }}>⚡ At just 50% win rate, Sarah is in God Tier</div>
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg,rgba(0,194,255,0.08),rgba(168,85,247,0.05))', border: '1px solid rgba(0,194,255,0.3)', borderRadius: 8, padding: '18px 22px', textAlign: 'center' }}>
            <div style={{ fontSize: 15, color: '#fff', fontWeight: 500, lineHeight: 1.7 }}>
              Carl looks better on paper. <strong>Sarah made 6x more money.</strong><br />
              This is why BettorsOnly measures <strong style={{ color: 'var(--b)' }}>ROI, not win rate.</strong>
            </div>
          </div>
        </GuideStep>

        <GuideStep n={4} title="Your ROI determines your tier">
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1.25rem' }}>
            Once you submit 20+ qualifying picks, your ROI puts you in one of four tiers:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <TierRow emoji="🥉" name="Bronze Tier" desc="Genuinely profitable bettor" range="+5% to +9%" colorVar="--bronze" />
            <TierRow emoji="🥈" name="Silver Tier" desc="Strong long-term winner" range="+10% to +14%" colorVar="--silver" />
            <TierRow emoji="🥇" name="Gold Tier" desc="Elite-level performance" range="+15% to +19%" colorVar="--gold" />
            <TierRow emoji="⚡" name="God Tier" desc="World-class. Nearly unicorn-level." range="+20% and above" colorVar="--god" />
          </div>

          <div style={{ marginTop: '1.5rem', background: 'var(--bg-2)', borderLeft: '3px solid var(--gold)', borderRadius: 6, padding: '14px 18px', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7 }}>
            <strong style={{ color: '#fff' }}>For context:</strong> Professional sports bettors are <em>thrilled</em> with +5% to +8% ROI on high volume. Anything above +15% sustained is legendary. +20% sustained over a long sample puts you in elite syndicate territory.
          </div>
        </GuideStep>

        <GuideStep n={5} title="The rules that keep it honest">
          <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: '1rem' }}>
            ROI does most of the heavy lifting. But there are a few simple rules that keep the system honest:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RuleRow><strong style={{ color: '#fff' }}>✓ Submit picks before the game starts.</strong> No backdated picks. No cherry-picking results.</RuleRow>
            <RuleRow><strong style={{ color: '#fff' }}>✓ Parlays must have 2 to 6 legs.</strong> No 15-leg lottery tickets.</RuleRow>
            <RuleRow><strong style={{ color: '#fff' }}>✓ Pushes are excluded.</strong> A push isn't a win or a loss, so it doesn't count.</RuleRow>
            <RuleRow><strong style={{ color: '#fff' }}>✓ Minimum 20 picks to unlock a tier.</strong> No tiny sample sizes claiming God Tier.</RuleRow>
            <RuleRow><strong style={{ color: '#fff' }}>✓ Tier updates rolling 30 days.</strong> Old wins don't carry you forever. Stay sharp.</RuleRow>
          </div>
        </GuideStep>

        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <button className="btn btn-white btn-lg" onClick={() => onOpenModal('signup')}>Start tracking your ROI — free</button>
        </div>
      </div>
    </div>
  );
}

function GuideStep({ n, title, children }) {
  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '2rem', marginBottom: '1.25rem', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
      <div style={{ fontSize: 11, color: 'var(--b)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: 8 }}>Step {n}</div>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: '#fff', marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}

function TierRow({ emoji, name, desc, range, colorVar }) {
  return (
    <div style={{ background: 'var(--bg-2)', border: `1px solid var(${colorVar})`, borderRadius: 10, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 28 }}>{emoji}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: `var(${colorVar})` }}>{name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>{desc}</div>
        </div>
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: `var(${colorVar})`, fontVariantNumeric: 'tabular-nums' }}>{range}</div>
    </div>
  );
}

function RuleRow({ children }) {
  return (
    <div style={{ background: 'var(--bg-2)', borderRadius: 8, padding: '12px 16px', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>{children}</div>
  );
}
