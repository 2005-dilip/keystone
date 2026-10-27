import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Phone, Menu, X, ArrowRight } from 'lucide-react';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Escape listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  interface NavItem {
    name: string;
    href: string;
    badge: string;
    title: string;
    bullets: string[];
    tagline: string;
  }

  const navItems: NavItem[] = [
    {
      name: 'Services',
      href: '#services',
      badge: 'Capabilities',
      title: '8 In-House Trades',
      bullets: [
        'Framing, Additions & Structural',
        'Kitchen & Bathroom Remodeling',
        'Commercial Fit-Outs & Tenants',
        'HVAC, Electrical & Mechanical',
      ],
      tagline: '100% in-house crew — zero subcontracting',
    },
    {
      name: 'About',
      href: '#about',
      badge: 'Heritage',
      title: '20+ Years in Alberta',
      bullets: [
        'Founded on craftsman accountability',
        '100% licensed, certified & insured',
        'Direct owner oversight on site',
      ],
      tagline: 'The crew that quotes is the crew that finishes',
    },
    {
      name: 'Process',
      href: '#process',
      badge: 'Arch Method',
      title: '4 Sequential Stages',
      bullets: [
        '01 Consult — Site assessment & clear quote',
        '02 Plan — Permits, timelines & materials',
        '03 Build — One dedicated crew on site',
        '04 Handover — Inspection & warranty',
      ],
      tagline: 'Every stage holds before the next goes on',
    },
    {
      name: 'Service Area',
      href: '#areas',
      badge: 'Coverage',
      title: 'Calgary & Alberta-Wide',
      bullets: [
        'Calgary HQ (Rapid dispatch & shop)',
        'Edmonton & Red Deer regional hubs',
        'Province-wide for major projects',
      ],
      tagline: 'Mobile service fleet across Alberta',
    },
    {
      name: 'Contact',
      href: '#contact',
      badge: 'Dispatch',
      title: 'Fast, Free Estimates',
      bullets: [
        'Direct Line: 403 505 4015',
        '24-Hour quote response time',
        'Free, no-pressure on-site consult',
      ],
      tagline: 'Click to scroll directly to contact form',
    },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    e.preventDefault();
    closeMenu();

    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        try {
          history.pushState(null, '', '#top');
        } catch (_) {}
      } else {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          try {
            history.pushState(null, '', href);
          } catch (_) {}

          // When redirecting to contact, automatically focus and select the name input field
          if (targetId === 'contact') {
            const selectNameField = () => {
              const nameInput = document.getElementById('fname') as HTMLInputElement | null;
              if (nameInput) {
                nameInput.focus();
                nameInput.select();
              }
            };
            // Trigger as smooth scroll approaches the contact section
            setTimeout(selectNameField, 350);
            setTimeout(selectNameField, 750);
          }
        }
      }
    }
  };

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <nav>
          <a href="#top" className="brand" onClick={(e) => handleNavClick(e, '#top')} aria-label="Keystone Renovations Home">
            <div className="brand-logo-mark">
              <span>K</span>
            </div>
            <span className="brand-text">
              <span className="word">KEY<span>STONE</span></span>
              <span className="sub">RENOVATIONS</span>
            </span>
          </a>

          {/* Desktop Links with Hover Popups & Glow */}
          <div className="nav-links">
            {navItems.map((item) => (
              <div key={item.name} className="nav-item-wrap">
                <a 
                  href={item.href} 
                  className="nav-link-btn"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span className="nav-link-text">{item.name}</span>
                  <span className="nav-glow-bar" aria-hidden="true" />
                </a>

                {/* PC/Desktop Hover Details Popup */}
                <div 
                  className="nav-dropdown-popup" 
                  role="tooltip"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <div className="popup-header">
                    <span className="popup-badge">{item.badge}</span>
                    <h4 className="popup-title">{item.title}</h4>
                  </div>
                  <ul className="popup-list">
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx}>
                        <span className="popup-bullet-dot" aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="popup-footer">
                    <span className="popup-tagline">{item.tagline}</span>
                    <ArrowRight size={13} className="popup-arrow" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Action */}
          <div className="nav-right">
            <a className="nav-phone" href="tel:4035054015">
              <Phone size={15} />
              <span>403 505 4015</span>
            </a>
            <a 
              href="#contact" 
              className="btn btn-primary nav-quote-btn"
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Get a Quote
            </a>

            {/* Mobile Menu Toggle Button */}
            <button 
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer rendered via Portal to avoid backdrop-filter containing block issues */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div id="mobile-navigation" className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <div className="mobile-drawer-topbar">
            <a href="#top" className="brand" onClick={(e) => handleNavClick(e, '#top')} aria-label="Keystone Renovations Home">
              <div className="brand-logo-mark">
                <span>K</span>
              </div>
              <span className="brand-text">
                <span className="word">KEY<span>STONE</span></span>
                <span className="sub">RENOVATIONS</span>
              </span>
            </a>
            <button
              type="button"
              onClick={closeMenu}
              className="mobile-drawer-close"
              aria-label="Close navigation menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="mobile-drawer-inner">
            <div className="mobile-drawer-links">
              <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="mobile-drawer-link">
                <span>Services</span>
                <ArrowRight size={16} className="drawer-arrow" />
              </a>
              <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="mobile-drawer-link">
                <span>About</span>
                <ArrowRight size={16} className="drawer-arrow" />
              </a>
              <a href="#process" onClick={(e) => handleNavClick(e, '#process')} className="mobile-drawer-link">
                <span>Process</span>
                <ArrowRight size={16} className="drawer-arrow" />
              </a>
              <a href="#areas" onClick={(e) => handleNavClick(e, '#areas')} className="mobile-drawer-link">
                <span>Service Area</span>
                <ArrowRight size={16} className="drawer-arrow" />
              </a>
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="mobile-drawer-link">
                <span>Contact</span>
                <ArrowRight size={16} className="drawer-arrow" />
              </a>
            </div>

            <div className="mobile-drawer-footer">
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="btn btn-primary mobile-drawer-cta">
                Request a Free Quote
              </a>
              <a href="tel:4035054015" className="mobile-drawer-phone">
                <Phone size={18} color="var(--mint)" />
                <span>Call Us: 403 505 4015</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
