import { useState } from 'react';

export default function WelcomeBanner({ onNavigate }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <div className="welcome-banner">
      <span>👋 New to BettorsOnly?</span>
      <a onClick={() => {
        onNavigate('landing');
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }}>See how the marketplace works →</a>
      <button onClick={() => setHidden(true)}>×</button>
    </div>
  );
}
