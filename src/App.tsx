import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { AboutProcess } from './components/AboutProcess';
import { ServiceArea } from './components/ServiceArea';
import { TrustStrip } from './components/TrustStrip';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminApp } from './admin/AdminApp';
import { ServiceDetail } from './components/ServiceDetail';
import { ServiceAreaDetail } from './components/ServiceAreaDetail';
import { AboutDetail } from './components/AboutDetail';
import { getServiceBySlug } from './data/servicesData';

const DEFAULT_TITLE = 'Keystone Renovations — Calgary & Alberta Construction & Renovation';
const DEFAULT_DESC =
  "For 20 years, Keystone Renovations has been the load-bearing partner behind Alberta's best-built homes and commercial spaces — from foundation work to the final coat of paint.";

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Sync with browser navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Reset default SEO tags when returning to homepage
  useEffect(() => {
    if (
      !currentPath.startsWith('/services/') &&
      !currentPath.startsWith('/service-area') &&
      !currentPath.startsWith('/about')
    ) {
      document.title = DEFAULT_TITLE;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', DEFAULT_DESC);
      }
    }
  }, [currentPath]);

  // Scroll reveal animation observer for the public landing page
  useEffect(() => {
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/services/')) {
      return;
    }

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
  }, [currentPath]);

  // Route: Admin Dashboard (/admin, /admin/leads, etc.)
  if (currentPath.startsWith('/admin')) {
    return <AdminApp onBackToHome={() => navigateTo('/')} />;
  }

  // Route: Dedicated Service Page (/services/:slug)
  if (currentPath.startsWith('/services/')) {
    const serviceSlug = currentPath.replace(/^\/services\/?/, '').split('/')[0].split('?')[0].split('#')[0];
    const service = getServiceBySlug(serviceSlug);

    if (service) {
      return (
        <div className="app-container">
          <ServiceDetail
            key={service.slug}
            service={service}
            onNavigate={navigateTo}
            onAdminClick={() => navigateTo('/admin')}
          />
        </div>
      );
    }
  }

  // Route: Dedicated Service Area Page (/service-area)
  if (currentPath === '/service-area' || currentPath.startsWith('/service-area')) {
    return (
      <div className="app-container">
        <ServiceAreaDetail
          onNavigate={navigateTo}
          onAdminClick={() => navigateTo('/admin')}
        />
      </div>
    );
  }

  // Route: Dedicated About Us Page (/about)
  if (currentPath === '/about' || currentPath.startsWith('/about')) {
    return (
      <div className="app-container">
        <AboutDetail
          onNavigate={navigateTo}
          onAdminClick={() => navigateTo('/admin')}
        />
      </div>
    );
  }

  // Route: Public Landing Page
  return (
    <div className="app-container">
      <Header />
      <main>
        <Hero />

        {/* Voussoir architectural joint divider */}
        <div className="joint on-forest" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        <Services onSelectService={(slug) => navigateTo(`/services/${slug}`)} />

        <div className="joint on-bone" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        <AboutProcess onViewAbout={() => navigateTo('/about')} />

        <div className="joint on-obsidian" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>

        <ServiceArea
          onViewServiceArea={(regionId) =>
            navigateTo(regionId ? `/service-area#${regionId}` : '/service-area')
          }
        />

        <TrustStrip />

        <ContactSection />
      </main>
      <Footer onAdminClick={() => navigateTo('/admin')} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
