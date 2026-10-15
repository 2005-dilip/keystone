import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Calgary, AB &nbsp;·&nbsp; Edmonton &nbsp;·&nbsp; Red Deer &nbsp;·&nbsp; Alberta-Wide</p>
          <h1 className="rv">
            Every structure<br />needs <em>a keystone.</em>
          </h1>
          <p className="lede rv">
            For 20 years, Keystone Renovations has been the load-bearing partner behind Alberta's best-built homes and commercial spaces — from foundation work to the final coat of paint.
          </p>
          <div className="cta-row rv">
            <a href="#contact" className="btn btn-primary">Request a Free Quote</a>
            <a href="#services" className="btn btn-ghost">See What We Build</a>
          </div>

          <div className="hero-stats rv">
            <div>
              <span className="num">20+</span>
              <span className="lbl">Years in the Trade</span>
            </div>
            <div>
              <span className="num">500+</span>
              <span className="lbl">Projects Completed</span>
            </div>
            <div>
              <span className="num">100%</span>
              <span className="lbl">Licensed &amp; Insured</span>
            </div>
          </div>
        </div>

        <div className="hero-art rv" aria-hidden="true">
          <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            {/* Skyline bars */}
            <g>
              <rect className="skyline-bar" x="30" y="330" width="26" height="60" />
              <rect className="skyline-bar hi" x="62" y="300" width="22" height="90" />
              <rect className="skyline-bar" x="90" y="345" width="18" height="45" />
              <rect className="skyline-bar hi" x="480" y="310" width="24" height="80" />
              <rect className="skyline-bar" x="510" y="335" width="20" height="55" />
              <rect className="skyline-bar" x="536" y="350" width="16" height="40" />
            </g>
            {/* Arch made of architectural voussoirs */}
            <g>
              <polygon className="voussoir" points="40.0,317.3 40.6,303.1 41.9,288.9 43.9,274.9 46.8,260.9 50.4,247.2 54.8,233.6 144.4,265.2 141.6,273.8 139.3,282.5 137.5,291.3 136.2,300.3 135.4,309.3 135.0,318.3" />
              <polygon className="voussoir" points="56.6,228.5 62.0,215.4 68.1,202.5 74.8,190.0 82.3,177.9 90.4,166.2 99.1,155.0 172.5,215.3 167.0,222.4 161.8,229.8 157.1,237.5 152.8,245.4 149.0,253.6 145.6,261.9" />
              <polygon className="voussoir" points="102.6,150.8 112.1,140.3 122.2,130.3 132.9,120.8 144.0,112.0 155.6,103.8 167.6,96.2 216.0,178.0 208.4,182.8 201.0,188.0 193.9,193.6 187.2,199.6 180.8,205.9 174.7,212.6" />
              <polygon className="voussoir" points="172.4,93.5 184.9,86.8 197.9,80.9 211.1,75.7 224.6,71.2 238.3,67.4 252.2,64.4 269.6,157.8 260.8,159.7 252.1,162.1 243.6,165.0 235.2,168.3 227.0,172.0 219.0,176.2" />
              <polygon className="key-stone" points="257.5,63.5 271.6,61.6 285.8,60.4 300.0,60.0 314.2,60.4 328.4,61.6 342.5,63.5 326.9,157.2 318.0,156.0 309.0,155.2 300.0,155.0 291.0,155.2 282.0,156.0 273.1,157.2" />
              <polygon className="voussoir" points="347.8,64.4 361.7,67.4 375.4,71.2 388.9,75.7 402.1,80.9 415.1,86.8 427.6,93.5 381.0,176.2 373.0,172.0 364.8,168.3 356.4,165.0 347.9,162.1 339.2,159.7 330.4,157.8" />
              <polygon className="voussoir" points="432.4,96.2 444.4,103.8 456.0,112.0 467.1,120.8 477.8,130.3 487.9,140.3 497.4,150.8 425.3,212.6 419.2,205.9 412.8,199.6 406.1,193.6 399.0,188.0 391.6,182.8 384.0,178.0" />
              <polygon className="voussoir" points="500.9,155.0 509.6,166.2 517.7,177.9 525.2,190.0 531.9,202.5 538.0,215.4 543.4,228.5 454.4,261.9 451.0,253.6 447.2,245.4 442.9,237.5 438.2,229.8 433.0,222.4 427.5,215.3" />
              <polygon className="voussoir" points="545.2,233.6 549.6,247.2 553.2,260.9 556.1,274.9 558.1,288.9 559.4,303.1 560.0,317.3 465.0,318.3 464.6,309.3 463.8,300.3 462.5,291.3 460.7,282.5 458.4,273.8 455.6,265.2" />
            </g>
            <line x1="20" y1="390" x2="580" y2="390" stroke="#1C5645" strokeWidth="1.5" />
            <text x="300" y="105" textAnchor="middle" className="arch-label hot">KEYSTONE</text>
          </svg>
        </div>
      </div>
    </section>
  );
};
