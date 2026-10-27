import React from 'react';

interface FooterProps {
  onAdminClick?: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onNavigate }) => {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/');
                }
              }}
              className="brand"
              style={{ marginBottom: '18px' }}
            >
              <div style={{
                width: '38px',
                height: '38px',
                background: 'var(--forest-light)',
                border: '1px solid var(--mint)',
                clipPath: 'polygon(18% 0, 82% 0, 100% 100%, 0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: 'var(--mint)'
                }}>K</span>
              </div>
              <span>
                <span className="word">KEY<span>STONE</span></span>
                <span className="sub">RENOVATIONS</span>
              </span>
            </a>
            <p>
              Construction and renovation, built on twenty years of showing up and finishing the job — across Calgary and Alberta.
            </p>
          </div>

          <div className="foot-col">
            <h4>Sitemap</h4>
            <ul>
              <li><a href="#services">Services</a></li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/about');
                    }
                  }}
                >
                  About
                </a>
              </li>
              <li><a href="#process">Process</a></li>
              <li>
                <a
                  href="/service-area"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/service-area');
                    }
                  }}
                >
                  Service Area
                </a>
              </li>
              <li><a href="#contact">Contact</a></li>
              {onAdminClick && (
                <li>
                  <button
                    type="button"
                    onClick={onAdminClick}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--mist-dim)',
                      fontFamily: 'inherit',
                      fontSize: '14px',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'color .2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--mint)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--mist-dim)')}
                  >
                    Admin Portal
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className="foot-col">
            <h4>Service Area</h4>
            <ul>
              <li>
                <a
                  href="/service-area"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/service-area');
                    }
                  }}
                >
                  Calgary (HQ)
                </a>
              </li>
              <li>
                <a
                  href="/service-area"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/service-area');
                    }
                  }}
                >
                  Edmonton
                </a>
              </li>
              <li>
                <a
                  href="/service-area"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/service-area');
                    }
                  }}
                >
                  Red Deer
                </a>
              </li>
              <li>
                <a
                  href="/service-area"
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate('/service-area');
                    }
                  }}
                >
                  Alberta-Wide
                </a>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:4035054015">403 505 4015</a></li>
              <li><a href="mailto:gaurav.tyagi@keystonerenov.com">gaurav.tyagi@keystonerenov.com</a></li>
              <li><a href="https://www.keystonerenov.com" target="_blank" rel="noopener noreferrer">keystonerenov.com</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <p>© 2026 Keystone Renovations. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <p>Licensed &amp; Insured — Calgary, Alberta</p>
            {onAdminClick && (
              <button
                type="button"
                onClick={onAdminClick}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--mist-dim)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Staff Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
