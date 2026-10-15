import React, { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <nav>
        <a href="#top" className="brand" onClick={closeMenu}>
          <div style={{
            width: '40px',
            height: '40px',
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
              fontSize: '15px',
              color: 'var(--mint)'
            }}>K</span>
          </div>
          <span>
            <span className="word">KEY<span>STONE</span></span>
            <span className="sub">RENOVATIONS</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="nav-links">
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
          <a href="#areas">Service Area</a>
          <a href="#contact">Contact</a>
        </div>

        {/* Right Action */}
        <div className="nav-right">
          <a className="nav-phone" href="tel:4035054015">
            <Phone size={16} />
            <span>403 505 4015</span>
          </a>
          <a href="#contact" className="btn btn-primary" style={{ padding: '12px 22px' }}>
            Get a Quote
          </a>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', color: 'var(--bone)', padding: '6px' }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'rgba(6, 31, 25, 0.98)',
          borderBottom: '1px solid var(--forest-border)',
          padding: '24px 30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <a href="#services" onClick={closeMenu} style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', textTransform: 'uppercase', color: 'var(--mist)' }}>Services</a>
          <a href="#about" onClick={closeMenu} style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', textTransform: 'uppercase', color: 'var(--mist)' }}>About</a>
          <a href="#process" onClick={closeMenu} style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', textTransform: 'uppercase', color: 'var(--mist)' }}>Process</a>
          <a href="#areas" onClick={closeMenu} style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', textTransform: 'uppercase', color: 'var(--mist)' }}>Service Area</a>
          <a href="#contact" onClick={closeMenu} style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', textTransform: 'uppercase', color: 'var(--mint)' }}>Contact</a>
          <a href="tel:4035054015" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bone)', paddingTop: '10px', borderTop: '1px solid var(--forest-border)' }}>
            <Phone size={16} color="var(--mint)" />
            <span>403 505 4015</span>
          </a>
        </div>
      )}
    </header>
  );
};
