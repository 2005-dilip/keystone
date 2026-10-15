import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { AboutProcess } from './components/AboutProcess';
import { ServiceArea } from './components/ServiceArea';
import { TrustStrip } from './components/TrustStrip';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  useEffect(() => {
    // Scroll reveal animation observer
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if ('IntersectionObserver' in window && !reduceMotion) {
      const elements = document.querySelectorAll('.rv');
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight * 1.05) {
          el.classList.add('pre');
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.remove('pre');
              entry.target.classList.add('in');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      elements.forEach((el) => {
        if (el.classList.contains('pre')) {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />
        
        {/* Voussoir architectural joint divider */}
        <div className="joint on-forest" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        <Services />

        <div className="joint on-bone" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        <AboutProcess />

        <div className="joint on-obsidian" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        <ServiceArea />

        <TrustStrip />

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
