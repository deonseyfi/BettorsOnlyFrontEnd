export default function Terms() {
  const effective = 'July 8, 2026';

  return (
    <div className="page active">
      <div className="inner" style={{ maxWidth: 820 }}>
        <h1 className="h1">Terms of Service</h1>
        <div className="h-sub" style={{ marginBottom: 32 }}>Effective {effective}</div>

        <Section title="1. Acceptance">
          By creating an account or using BettorsOnly (the "Service"), you agree to be bound by these Terms. If you do not agree, do not use the Service.
        </Section>

        <Section title="2. Not a Sportsbook">
          BettorsOnly is not a gambling operator, sportsbook, casino, or licensed bookmaker. We do not accept wagers, hold funds intended for wagering, or process bets. The Service is a marketplace where independent handicappers ("cappers") share their picks and analysis for informational purposes.
        </Section>

        <Section title="3. Age & Eligibility">
          You must be at least 18 years old (or the legal age of majority in your jurisdiction) to use the Service. Sports wagering is illegal in some jurisdictions. It is your responsibility to know and follow the laws that apply to you.
        </Section>

        <Section title="4. No Guarantees; No Financial Advice">
          Picks, analysis, and content on the Service reflect the opinions of individual cappers. Past performance is not indicative of future results. Nothing on the Service is financial, legal, or investment advice. You are solely responsible for any wagers you place based on content from the Service.
        </Section>

        <Section title="5. Payments & Refunds">
          Cappers set their own prices for single picks and monthly subscriptions. BettorsOnly acts as a payment facilitator via our payment processor and retains a platform fee of 20% of gross sales. All sales are final unless otherwise required by law. If your subscription payment fails, your access ends at the current billing period.
        </Section>

        <Section title="6. Verified Records">
          Capper stats (win rate, ROI, units) are computed from picks submitted to the Service and graded against the game's actual outcome. We do our best to grade accurately using publicly available data. Grading disputes may be raised via support and are resolved at our discretion.
        </Section>

        <Section title="7. Watermarks & Sharing">
          Purchased picks are watermarked with your Member ID. Re-sharing, reposting, screenshotting to third parties, or distributing purchased picks is a material breach of these Terms and grounds for permanent account suspension without refund.
        </Section>

        <Section title="8. Prohibited Conduct">
          You will not: submit backdated picks, manipulate game IDs, use bots to submit picks, misrepresent your identity, harass other users, or use the Service for any illegal purpose.
        </Section>

        <Section title="9. Account Termination">
          We may suspend or terminate your account at any time for violations of these Terms. You may delete your account at any time by contacting support.
        </Section>

        <Section title="10. Disclaimers">
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, BETTORSONLY DISCLAIMS ALL LIABILITY FOR LOSSES ARISING FROM YOUR USE OF THE SERVICE, INCLUDING LOSSES FROM WAGERS BASED ON PICKS PURCHASED THROUGH THE SERVICE.
        </Section>

        <Section title="11. Limitation of Liability">
          To the fullest extent permitted by law, BettorsOnly's aggregate liability arising out of or related to these Terms will not exceed the greater of $100 or the amount you paid to the Service in the 12 months prior to the event giving rise to the claim.
        </Section>

        <Section title="12. Changes">
          We may update these Terms from time to time. Material changes will be notified via email or in-app notice at least 7 days before taking effect.
        </Section>

        <Section title="13. Contact">
          Questions? Email <a href="mailto:legal@bettorsonly.example" style={{ color: 'var(--b)' }}>legal@bettorsonly.example</a>.
        </Section>

        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 40, padding: '16px 0', borderTop: '1px solid var(--border)', lineHeight: 1.6 }}>
          ⚠️ <strong>Boilerplate placeholder.</strong> These Terms are a starting template, not legal advice. Have a lawyer review before launching to real users.
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{title}</h2>
      <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.75 }}>{children}</div>
    </div>
  );
}
