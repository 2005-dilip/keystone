import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { SERVICE_AREA_DATA } from '../data/serviceAreaData';
import { SERVICES_DATA } from '../data/servicesData';
import { submitQuoteForm } from '../lib/supabase';
import type { QuoteFormData } from '../types';
import { Footer } from './Footer';

interface ServiceAreaDetailProps {
  onNavigate: (path: string) => void;
  onAdminClick?: () => void;
}

export const ServiceAreaDetail: React.FC<ServiceAreaDetailProps> = ({
  onNavigate,
  onAdminClick,
}) => {
  // Synchronize document title and SEO meta description
  useEffect(() => {
    document.title = SERVICE_AREA_DATA.metaTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', SERVICE_AREA_DATA.metaDescription);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', SERVICE_AREA_DATA.metaTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', SERVICE_AREA_DATA.metaDescription);

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Accordion state (first FAQ item open by default)
  const [openFaqIndexes, setOpenFaqIndexes] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Quote Form State
  const [formData, setFormData] = useState<QuoteFormData>(() => ({
    name: '',
    phone: '',
    email: '',
    service: 'Renovations',
    project_details: '',
  }));

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'duplicate';
    message: string;
  } | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please complete all required fields (Name, Phone, and Email).',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await submitQuoteForm(formData);

      if (response.success) {
        if (response.is_duplicate) {
          setFeedback({
            type: 'duplicate',
            message: "We've already received this quote request recently! Gaurav will contact you shortly.",
          });
        } else {
          setFeedback({
            type: 'success',
            message: `Thanks ${formData.name}! Your request has been received. Gaurav will review your project details and contact you within 24 hours.`,
          });
          setFormData({
            name: '',
            phone: '',
            email: '',
            service: 'Renovations',
            project_details: '',
          });
        }
      } else {
        setFeedback({
          type: 'error',
          message:
            response.message || 'There was an issue submitting your request. Please call Gaurav directly at 403 505 4015.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'A network error occurred. Please call Gaurav at 403 505 4015.',
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToQuote = () => {
    const quoteEl = document.getElementById('area-quote-form');
    if (quoteEl) {
      quoteEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="service-page-wrapper service-area-page-wrapper">
      {/* Top Utility Navigation Header */}
      <header className="svc-page-header">
        <div className="wrap svc-page-header-inner">
          <div className="svc-brand-group">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="svc-back-btn"
              aria-label="Return to Keystone Renovations Home"
            >
              <ArrowLeft size={16} />
              <span className="svc-back-text-full">Back to Homepage</span>
              <span className="svc-back-text-mobile">Back</span>
            </button>
            <div className="svc-brand-divider" aria-hidden="true">|</div>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
              className="svc-brand-title"
            >
              KEY<span>STONE</span>
            </a>
          </div>

          <div className="svc-header-actions">
            <a href={`tel:${SERVICE_AREA_DATA.cta.phoneTel}`} className="svc-header-phone">
              <Phone size={14} />
              <span>{SERVICE_AREA_DATA.cta.phone}</span>
            </a>
            <button
              type="button"
              onClick={scrollToQuote}
              className="btn btn-primary svc-header-quote-btn"
            >
              <span className="quote-btn-full">Get a Free Quote</span>
              <span className="quote-btn-mobile">Free Quote</span>
            </button>
          </div>
        </div>
      </header>

      {/* Service Area Hero */}
      <section className="svc-detail-hero area-detail-hero">
        <div className="wrap">
          <div className="svc-breadcrumb">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
              }}
            >
              Home
            </a>
            <span className="sep">/</span>
            <span className="current">Service Area</span>
          </div>

          <div className="area-hero-grid">
            <div className="svc-hero-content">
              {/* Visible SEO Tag Badge */}
              <div className="svc-hero-badge">
                <span className="badge-num"><MapPin size={12} /> ALBERTA-WIDE</span>
                <span className="badge-tag">CALGARY HQ &bull; EDMONTON &bull; RED DEER</span>
              </div>

              <h1 className="svc-hero-title">{SERVICE_AREA_DATA.headline}</h1>

              <p className="svc-hero-desc">{SERVICE_AREA_DATA.metaDescription}</p>

              <div className="svc-trust-badges">
                <div className="trust-pill">
                  <ShieldCheck size={16} className="pill-icon" />
                  <span>3 to 5 Year Workmanship Warranty</span>
                </div>
                <div className="trust-pill">
                  <Award size={16} className="pill-icon" />
                  <span>Crews Based in Calgary &amp; Edmonton</span>
                </div>
                <div className="trust-pill">
                  <Clock size={16} className="pill-icon" />
                  <span>No Minimum Job Size &bull; Free Walkthrough</span>
                </div>
              </div>

              <div className="svc-hero-cta-group">
                <button
                  type="button"
                  onClick={scrollToQuote}
                  className="btn btn-primary svc-cta-large"
                >
                  Request a Free On-Site Quote
                </button>
                <a
                  href={`tel:${SERVICE_AREA_DATA.cta.phoneTel}`}
                  className="btn btn-outline svc-call-btn"
                >
                  <Phone size={16} />
                  <span>Call Gaurav: {SERVICE_AREA_DATA.cta.phone}</span>
                </a>
              </div>
            </div>

            {/* Alberta Map Visual */}
            <div className="area-hero-map-card">
              <svg viewBox="0 0 560 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <polygon
                  className="ab-outline"
                  points="120,20 400,15 430,60 460,120 450,200 470,260 440,320 460,380 420,440 320,465 220,460 160,430 110,390 90,330 100,270 70,210 90,150 80,90"
                />
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
                {/* Edmonton Pin */}
                <circle className="city-ring" cx="260" cy="110" r="14" />
                <circle className="city-dot" cx="260" cy="110" r="4.5" />
                <text className="city-label" x="278" y="115">Edmonton</text>
                <text className="city-tag" x="278" y="130">LOCAL CREW BASED</text>
                {/* Red Deer Pin */}
                <circle className="city-ring" cx="245" cy="230" r="12" />
                <circle className="city-dot" cx="245" cy="230" r="4" />
                <text className="city-label" x="263" y="235">Red Deer</text>
                <text className="city-tag" x="263" y="250">CENTRAL ALBERTA</text>
                {/* Calgary HQ Pin */}
                <circle className="city-ring" cx="225" cy="345" r="20" />
                <circle className="city-dot hq" cx="225" cy="345" r="6" />
                <text className="city-label hq" x="250" y="342">Calgary</text>
                <text className="city-tag" x="250" y="358">HEADQUARTERS</text>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Voussoir Joint Divider */}
      <div className="joint on-forest" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      {/* Regional Deep-Dives Section (Cream / Bone background) */}
      <section className="svc-deep-dives-section area-deep-dives-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Local Crews, Provincial Reach</p>
              <h2>Where we work across Alberta.</h2>
            </div>
            <p className="sub">
              No long distance surprises, no subcontracting out to strangers. We treat every community with the same dedication and direct accountability.
            </p>
          </div>

          <div className="regional-grid">
            {SERVICE_AREA_DATA.regions.map((reg, idx) => (
              <article key={reg.id} className="regional-card" id={reg.id}>
                <div className="regional-card-header">
                  <div className="regional-tag-row">
                    <span className="regional-num">0{idx + 1}</span>
                    <span className="regional-badge">{reg.tag}</span>
                  </div>
                  <h3 className="regional-question">{reg.question}</h3>
                </div>
                <div className="regional-card-body">
                  {reg.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Architectural Voussoir Joint Divider */}
      <div className="joint on-bone" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      {/* Interactive Regional FAQ Section */}
      <section className="svc-faqs-section area-faqs-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Regional Coverage Questions</p>
              <h2>Frequently asked questions about working with Keystone across Alberta.</h2>
            </div>
            <p className="sub">
              Honest answers regarding travel, permits, response times, and warranty coverage outside Calgary.
            </p>
          </div>

          <div className="faq-accordion-list">
            {SERVICE_AREA_DATA.faqs.map((faq, idx) => {
              const isOpen = openFaqIndexes.includes(idx);
              return (
                <div
                  key={idx}
                  className={`faq-item ${isOpen ? 'open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`area-faq-${idx}`}
                  >
                    <span className="faq-q-number">0{idx + 1}</span>
                    <span className="faq-q-text">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`faq-chevron ${isOpen ? 'rotated' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={`area-faq-${idx}`}
                      className="faq-answer-pane"
                      role="region"
                    >
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Direct Contact & Quote Form Section */}
      <section className="svc-contact-section" id="area-quote-form">
        <div className="wrap">
          <div className="svc-contact-grid">
            {/* Direct Contact Info Card */}
            <div className="svc-contact-info-card">
              <span className="eyebrow">Direct Accountability</span>
              <h2>Ready to talk about your project anywhere in Alberta?</h2>
              <p className="svc-contact-lead">
                Every project starts with a direct conversation and a thorough on-site visit. Whether you are in Calgary, Edmonton, Red Deer, or a rural county, we respond within 24 hours.
              </p>

              <div className="direct-builder-card">
                <div className="builder-header">
                  <div className="builder-avatar">GT</div>
                  <div>
                    <h4>Gaurav Tyagi</h4>
                    <p className="builder-role">Keystone Project Director</p>
                  </div>
                </div>

                <div className="builder-contact-details">
                  <a href={`tel:${SERVICE_AREA_DATA.cta.phoneTel}`} className="builder-row">
                    <Phone size={16} />
                    <span>{SERVICE_AREA_DATA.cta.phone}</span>
                  </a>
                  <a href={`mailto:${SERVICE_AREA_DATA.cta.email}`} className="builder-row">
                    <Mail size={16} />
                    <span>{SERVICE_AREA_DATA.cta.email}</span>
                  </a>
                </div>

                <div className="builder-pledge">
                  <p>{SERVICE_AREA_DATA.cta.note}</p>
                </div>
              </div>

              <div className="svc-highlights-list">
                <div className="highlight-item">
                  <CheckCircle2 size={16} className="hl-icon" />
                  <span>Free on-site walkthrough and clear written proposal</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={16} className="hl-icon" />
                  <span>3 to 5 year workmanship warranty on every project</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={16} className="hl-icon" />
                  <span>Local municipal permits pulled and inspections managed</span>
                </div>
              </div>
            </div>

            {/* Inline Quote Form */}
            <div className="svc-quote-card">
              <div className="quote-card-head">
                <h3>Request an Estimate in Your Area</h3>
                <p>Fill out the form below and we will contact you within 24 hours.</p>
              </div>

              {feedback && (
                <div
                  className={`feedback-banner ${feedback.type}`}
                  role="alert"
                >
                  {feedback.type === 'success' && <CheckCircle2 size={18} />}
                  {feedback.type === 'error' && <AlertCircle size={18} />}
                  {feedback.type === 'duplicate' && <CheckCircle2 size={18} />}
                  <p>{feedback.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmitQuote} className="svc-form">
                <div className="form-group">
                  <label htmlFor="area-name">Your Full Name *</label>
                  <input
                    type="text"
                    id="area-name"
                    name="name"
                    required
                    placeholder="e.g. David Campbell"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="area-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="area-phone"
                      name="phone"
                      required
                      placeholder="e.g. 403 505 4015"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="area-email">Email Address *</label>
                    <input
                      type="email"
                      id="area-email"
                      name="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="area-service-select">Trade Needed</label>
                  <select
                    id="area-service-select"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                  >
                    {SERVICES_DATA.map((s) => (
                      <option key={s.slug} value={s.quoteService}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="area-details">Project Location &amp; Scope Details</label>
                  <textarea
                    id="area-details"
                    name="project_details"
                    rows={4}
                    placeholder="Tell us your city/town in Alberta (e.g., Calgary SW, Edmonton, Red Deer, Airdrie, Cochrane), project type, and approximate timeline..."
                    value={formData.project_details}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary submit-btn-block"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="spinner" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <span>Submit Service Area Quote Request</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Explore All 8 Construction Trades Strip */}
      <section className="svc-other-trades-section">
        <div className="wrap">
          <div className="other-trades-header">
            <div>
              <p className="eyebrow">Eight Trades, One Crew</p>
              <h3>Explore Our Construction Services</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="view-all-link"
            >
              <span>View Homepage</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="other-trades-grid">
            {SERVICES_DATA.map((trade) => (
              <div
                key={trade.slug}
                className="other-trade-card"
                onClick={() => onNavigate(`/services/${trade.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(`/services/${trade.slug}`);
                  }
                }}
              >
                <div className="other-num">{trade.num}</div>
                <h4 className="other-title">{trade.title}</h4>
                <p className="other-desc">{trade.summary}</p>
                <span className="other-cta">
                  View Trade Details <ArrowRight size={13} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onAdminClick={onAdminClick} />
    </div>
  );
};
