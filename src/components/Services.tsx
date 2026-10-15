import React from 'react';
import type { ServiceItem } from '../types';

const SERVICES: ServiceItem[] = [
  {
    num: '01 / RENO',
    code: 'renovations',
    title: 'Renovations',
    description: 'Complete interior and exterior transformations, from single-room refreshes to full-property overhauls, planned around how you actually live or operate.',
    path: 'M3 21h18M5 21V9l7-6 7 6v12M9 21v-6h6v6',
  },
  {
    num: '02 / CONC',
    code: 'concrete',
    title: 'Concrete Work',
    description: "Foundations, driveways, walkways and decorative slabs poured to hold up through Alberta's freeze-thaw cycles, year after year.",
    path: 'M3 9l9-6 9 6M4 10v10h16V10M9 20v-6h6v6',
  },
  {
    num: '03 / FRAME',
    code: 'framing',
    title: 'Framing',
    description: 'The bones of every build. Precise, code-compliant framing for walls, floors and roof systems that everything else relies on.',
    path: 'M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18',
  },
  {
    num: '04 / DEMO',
    code: 'demolition',
    title: 'Demolitions',
    description: "Clean, permitted tear-downs and site clearing, with debris hauled out and the lot left ready for what's next.",
    path: 'M4 20l4-9 5 3 4-8 3 14M4 20h16',
  },
  {
    num: '05 / PAINT',
    code: 'painting',
    title: 'Painting',
    description: 'Interior and exterior finishes with proper prep work underneath, so the colour holds up past one Alberta summer.',
    path: 'M19 3l2 2-9 9-3 1 1-3 9-9zM4 21c0-3 1-5 4-5s3 2 3 4-1 3-3 3-4-1-4-2z',
  },
  {
    num: '06 / FENCE',
    code: 'fencing',
    title: 'Fence Installation',
    description: 'Boundary and privacy fencing built to stand up to chinooks and heavy snow load alike, without leaning by spring.',
    path: 'M4 21V9l3-3 3 3v12M11 21V9l3-3 3 3v12M18 21V9l3-3M4 14h6M11 14h10',
  },
  {
    num: '07 / BSMT',
    code: 'basement',
    title: 'Basement Development',
    description: 'Turn unused square footage into a legal suite, home office or family room — fully permitted, inspected and finished.',
    path: 'M3 21h18M4 21V11l8-6 8 6v10M9 21v-7h6v7',
  },
  {
    num: '08 / GARAGE',
    code: 'garage',
    title: 'Garage Construction',
    description: 'Single, double or detached — garages framed, roofed and finished to match the rest of the house.',
    path: 'M3 21V10l9-6 9 6v11M3 21h18M7 21v-8h10v8',
  },
];

export const Services: React.FC = () => {
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
          {SERVICES.map((svc) => (
            <div key={svc.num} className="svc-card rv">
              <div className="svc-num">{svc.num}</div>
              <svg className="svc-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d={svc.path} />
              </svg>
              <h3>{svc.title}</h3>
              <p>{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
