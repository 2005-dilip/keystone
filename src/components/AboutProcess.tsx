import React from 'react';

interface AboutProcessProps {
  onViewAbout?: () => void;
}

export const AboutProcess: React.FC<AboutProcessProps> = ({ onViewAbout }) => {
  return (
    <section className="paper" id="about">
      {/* About Section */}
      <div className="wrap about">
        <div className="about-figure rv">
          <p className="quote">"The crew that shows up should be the crew that finishes the job."</p>
          <p className="attrib">— Keystone Renovations, founding principle</p>
          <div className="about-stats">
            <div>
              <span className="l">Years Operating in Alberta</span>
              <span className="n">20+</span>
            </div>
            <div>
              <span className="l">Licensed &amp; Insured Crew</span>
              <span className="n">100%</span>
            </div>
            <div>
              <span className="l">Quotes</span>
              <span className="n">Free, No Pressure</span>
            </div>
          </div>
        </div>

        <div className="about-copy rv">
          <p className="eyebrow on-bone">Why Keystone</p>
          <h2>Twenty years of building it right the first time.</h2>
          <p>
            Keystone Renovations was built on a simple idea: the people who quote your project are the people who finish it. Over two decades, we've carried that through everything from HVAC upgrades and roof replacements to full residential renovations and ground-up commercial builds across Calgary and the rest of Alberta.
          </p>
          <p>
            No subcontracting the hard parts. No disappearing after the deposit clears. Every project — whether it's a new basement suite or a full commercial fit-out — gets the same crew from the first walkthrough to the final inspection.
          </p>

          <div className="about-action">
            <button
              type="button"
              onClick={onViewAbout}
              className="btn btn-primary about-view-more-btn"
              aria-label="Read our full story and founder FAQs"
            >
              Read Our Story &amp; Founder FAQs <span className="arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Process */}
      <div className="wrap process" id="process">
        <div className="section-head rv">
          <div>
            <p className="eyebrow on-bone">How We Work</p>
            <h2 style={{ color: 'var(--ink)' }}>From first call to final walkthrough.</h2>
          </div>
          <p className="sub" style={{ color: '#5C7268' }}>
            Four stages, same as building an arch: every step has to hold before the next one goes on.
          </p>
        </div>

        <div className="process-grid">
          <div className="p-step rv">
            <span className="pn">01</span>
            <h3>Consult</h3>
            <p>We walk the site, listen to what you actually need, and give you a straight quote — no inflated number to negotiate down from.</p>
          </div>
          <div className="p-step rv">
            <span className="pn">02</span>
            <h3>Plan</h3>
            <p>Permits, materials and a realistic timeline, confirmed before a single tool touches your property.</p>
          </div>
          <div className="p-step rv">
            <span className="pn">03</span>
            <h3>Build</h3>
            <p>One crew sees it through, with regular updates so you're never left wondering what's happening behind the tarp.</p>
          </div>
          <div className="p-step rv">
            <span className="pn">04</span>
            <h3>Handover</h3>
            <p>A final walkthrough, a clean site, and a workmanship warranty — not just a wave goodbye.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
