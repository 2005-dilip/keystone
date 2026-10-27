import React from 'react';

interface ServiceAreaProps {
  onViewServiceArea?: (regionId?: string) => void;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ onViewServiceArea }) => {
  return (
    <section className="area" id="areas">
      <div className="wrap area-grid">
        <div className="area-copy rv">
          <p className="eyebrow">Where We Work</p>
          <h2>Based in Calgary.<br />Built across Alberta.</h2>
          <p>
            Keystone Renovations is headquartered in Calgary and regularly works throughout Edmonton, Red Deer, and communities across the province. If it's in Alberta, chances are we've already got a crew nearby.
          </p>
          <div className="area-list">
            <button
              type="button"
              className="area-pill hq"
              onClick={() => onViewServiceArea?.('calgary')}
              aria-label="View Calgary service area details"
            >
              Calgary — HQ
            </button>
            <button
              type="button"
              className="area-pill"
              onClick={() => onViewServiceArea?.('edmonton')}
              aria-label="View Edmonton service area details"
            >
              Edmonton
            </button>
            <button
              type="button"
              className="area-pill"
              onClick={() => onViewServiceArea?.('red-deer')}
              aria-label="View Red Deer service area details"
            >
              Red Deer
            </button>
            <button
              type="button"
              className="area-pill"
              onClick={() => onViewServiceArea?.('alberta-wide')}
              aria-label="View Alberta-wide service area details"
            >
              Alberta-Wide
            </button>
          </div>

          <div className="area-action">
            <button
              type="button"
              onClick={() => onViewServiceArea?.()}
              className="btn btn-primary area-view-more-btn"
            >
              See Full Service Area &amp; Regional FAQs <span className="arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div
          className="area-map rv clickable"
          onClick={() => onViewServiceArea?.()}
          role={onViewServiceArea ? 'button' : undefined}
          tabIndex={onViewServiceArea ? 0 : undefined}
          onKeyDown={(e) => {
            if (onViewServiceArea && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onViewServiceArea();
            }
          }}
          aria-label="View full Alberta service coverage and regional FAQs"
        >
          <svg viewBox="0 0 560 480" xmlns="http://www.w3.org/2000/svg">
            {/* Alberta Outline */}
            <polygon
              className="ab-outline"
              points="120,20 400,15 430,60 460,120 450,200 470,260 440,320 460,380 420,440 320,465 220,460 160,430 110,390 90,330 100,270 70,210 90,150 80,90"
            />
            {/* Grid Lines */}
            <g className="ab-grid-line">
              <line x1="90" y1="80" x2="470" y2="80" />
              <line x1="90" y1="150" x2="470" y2="150" />
              <line x1="90" y1="220" x2="470" y2="220" />
              <line x1="90" y1="290" x2="470" y2="290" />
              <line x1="90" y1="360" x2="470" y2="360" />
              <line x1="150" y1="30" x2="150" y2="450" />
              <line x1="250" y1="20" x2="250" y2="460" />
              <line x1="350" y1="20" x2="350" y2="460" />
              <line x1="420" y1="60" x2="420" y2="420" />
            </g>
            {/* Edmonton */}
            <circle className="city-ring" cx="260" cy="110" r="14" />
            <circle className="city-dot" cx="260" cy="110" r="4.5" />
            <text className="city-label" x="278" y="115">Edmonton</text>
            <text className="city-tag" x="278" y="130">2.5 HRS N</text>
            {/* Red Deer */}
            <circle className="city-ring" cx="245" cy="230" r="12" />
            <circle className="city-dot" cx="245" cy="230" r="4" />
            <text className="city-label" x="263" y="235">Red Deer</text>
            <text className="city-tag" x="263" y="250">1.5 HRS N</text>
            {/* Calgary HQ */}
            <circle className="city-ring" cx="225" cy="345" r="20" />
            <circle className="city-dot hq" cx="225" cy="345" r="6" />
            <text className="city-label hq" x="250" y="342">Calgary</text>
            <text className="city-tag" x="250" y="358">HEADQUARTERS</text>
          </svg>
        </div>
      </div>
    </section>
  );
};
