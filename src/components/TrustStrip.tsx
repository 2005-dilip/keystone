import React from 'react';
import { ShieldCheck, Clock, CheckCircle, Building2 } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  return (
    <section className="trust">
      <div className="wrap" style={{ padding: 0 }}>
        <div className="trust-grid">
          <div className="trust-item rv">
            <ShieldCheck size={28} color="var(--mint)" strokeWidth={1.5} />
            <div>
              <div className="t">Licensed &amp; Insured</div>
              <div className="d">Every project, every time</div>
            </div>
          </div>
          <div className="trust-item rv">
            <Clock size={28} color="var(--mint)" strokeWidth={1.5} />
            <div>
              <div className="t">20+ Years Experience</div>
              <div className="d">In business since day one</div>
            </div>
          </div>
          <div className="trust-item rv">
            <CheckCircle size={28} color="var(--mint)" strokeWidth={1.5} />
            <div>
              <div className="t">Free, Honest Quotes</div>
              <div className="d">No pressure, no fine print</div>
            </div>
          </div>
          <div className="trust-item rv">
            <Building2 size={28} color="var(--mint)" strokeWidth={1.5} />
            <div>
              <div className="t">Residential + Commercial</div>
              <div className="d">One crew, every property type</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
