export default function Privacy() {
  const effective = 'July 8, 2026';

  return (
    <div className="page active">
      <div className="inner" style={{ maxWidth: 820 }}>
        <h1 className="h1">Privacy Policy</h1>
        <div className="h-sub" style={{ marginBottom: 32 }}>Effective {effective}</div>

        <Section title="1. What we collect">
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li><strong>Account info</strong> — email, username, display name, password (stored hashed by our auth provider).</li>
            <li><strong>Profile content</strong> — bio, avatar, pricing.</li>
            <li><strong>Picks & activity</strong> — picks you submit, purchases, subscriptions, comments, upvotes.</li>
            <li><strong>Payment info</strong> — processed by our payment processor (Stripe). We store the last 4 digits and expiration for display; the full card number never touches our servers.</li>
            <li><strong>Device & usage</strong> — IP address, browser type, pages visited. Used for security and rate limiting.</li>
          </ul>
        </Section>

        <Section title="2. How we use it">
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li>To operate the Service — showing you picks, processing payments, delivering notifications.</li>
            <li>To grade picks and compute capper stats.</li>
            <li>To prevent fraud and abuse.</li>
            <li>To send you transactional emails (receipts, subscription updates). We will not send marketing emails without your explicit consent.</li>
          </ul>
        </Section>

        <Section title="3. Third parties">
          <ul style={{ paddingLeft: 20, margin: 0 }}>
            <li><strong>Supabase</strong> — hosts our database and authentication.</li>
            <li><strong>Stripe</strong> — processes payments.</li>
            <li><strong>The Odds API</strong> — provides game lines and scores. We do not share personal info with them.</li>
          </ul>
        </Section>

        <Section title="4. Cookies">
          We use only essential cookies required to keep you signed in and remember your preferences. We do not use advertising cookies.
        </Section>

        <Section title="5. Your rights">
          Depending on your location, you may have the right to access, correct, delete, or export your data. Email us at <a href="mailto:privacy@bettorsonly.example" style={{ color: 'var(--b)' }}>privacy@bettorsonly.example</a> and we will respond within 30 days.
        </Section>

        <Section title="6. Data retention">
          We keep your account data as long as your account is active. When you delete your account, we remove personal data within 60 days, except records we're legally required to retain (e.g. transaction records for tax purposes).
        </Section>

        <Section title="7. Security">
          Passwords are hashed. Data in transit is encrypted with TLS. We never sell your personal data. No system is perfectly secure — if a breach occurs, we will notify affected users within 72 hours.
        </Section>

        <Section title="8. Children">
          The Service is not intended for anyone under 18. We do not knowingly collect data from minors. If you believe a minor has created an account, email us and we will remove it.
        </Section>

        <Section title="9. Changes">
          We may update this Policy. Material changes will be notified via email at least 7 days before taking effect.
        </Section>

        <Section title="10. Contact">
          Questions? Email <a href="mailto:privacy@bettorsonly.example" style={{ color: 'var(--b)' }}>privacy@bettorsonly.example</a>.
        </Section>

        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 40, padding: '16px 0', borderTop: '1px solid var(--border)', lineHeight: 1.6 }}>
          ⚠️ <strong>Boilerplate placeholder.</strong> This Policy is a starting template, not legal advice. Have a lawyer review before launching to real users. GDPR / CCPA compliance may require additional disclosures depending on where your users are.
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
