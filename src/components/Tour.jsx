import { useState, useEffect } from 'react';
import { tourSteps } from '../data.js';

export default function Tour({ open, onClose }) {
  const [step, setStep] = useState(1);

  useEffect(() => { if (open) setStep(1); }, [open]);

  if (!open) return null;

  const s = tourSteps[step - 1];
  const isLast = step === tourSteps.length;

  const next = () => {
    if (isLast) onClose();
    else setStep(step + 1);
  };

  return (
    <div className="overlay open" onClick={e => { if (e.target.classList.contains('overlay')) onClose(); }}>
      <div className="tour">
        <div className="tour-icon">{s.icon}</div>
        <div className="tour-title">{s.title}</div>
        <div className="tour-desc">{s.desc}</div>
        <div className="tour-dots">
          {tourSteps.map((_, i) => (
            <div key={i} className={`tour-dot ${i < step ? 'active' : ''}`}></div>
          ))}
        </div>
        <div className="tour-actions">
          <button className="btn btn-ghost btn-sm" onClick={onClose}>Skip</button>
          <button className="btn btn-white" onClick={next}>{isLast ? 'Get started' : 'Next →'}</button>
        </div>
      </div>
    </div>
  );
}
