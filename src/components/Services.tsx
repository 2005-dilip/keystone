import React from 'react';
import { SERVICES_DATA } from '../data/servicesData';

interface ServicesProps {
  onSelectService?: (slug: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="section-head rv">
          <div>
            <p className="eyebrow">What We Build</p>
            <h2>Eight trades. One crew you can trust.</h2>
          </div>
          <p className="sub">
            No subcontracting the hard parts out to strangers — the people who quote the job are the people who finish it.
          </p>
        </div>

        <div className="svc-grid">
          {SERVICES_DATA.map((svc) => (
            <div
              key={svc.slug}
              className="svc-card rv clickable"
              onClick={() => onSelectService?.(svc.slug)}
              role={onSelectService ? 'button' : undefined}
              tabIndex={onSelectService ? 0 : undefined}
              onKeyDown={(e) => {
                if (onSelectService && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onSelectService(svc.slug);
                }
              }}
              aria-label={`View details and FAQs for ${svc.title}`}
            >
              <div className="svc-num">{svc.num}</div>
              <svg className="svc-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d={svc.iconPath} />
              </svg>
              <h3>{svc.title}</h3>
              <p>{svc.summary}</p>
              <div className="svc-action">
                <span className="svc-link">
                  See Details &amp; FAQs <span className="arrow" aria-hidden="true">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
