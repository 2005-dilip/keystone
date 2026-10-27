import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { submitQuoteForm } from '../lib/supabase';
import type { DetailedService, QuoteFormData } from '../types';
import { Footer } from './Footer';

interface ServiceDetailProps {
  service: DetailedService;
  onNavigate: (path: string) => void;
  onAdminClick?: () => void;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({
  service,
  onNavigate,
  onAdminClick,
}) => {
  // Synchronize document title and SEO meta description
  useEffect(() => {
    document.title = service.metaTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', service.metaDescription);

    // OpenGraph meta sync
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', service.metaTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', service.metaDescription);

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [service]);

  // Accordion state: track open FAQ indexes (first item open by default)
  const [openFaqIndexes, setOpenFaqIndexes] = useState<number[]>([0]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Dedicated Quote Form State
  const [formData, setFormData] = useState<QuoteFormData>(() => ({
    name: '',
    phone: '',
    email: '',
    service: service.quoteService,
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
            message: `Thanks ${formData.name}! Your request for ${service.title} has been received. Gaurav will review your details and contact you within 24 hours.`,
          });
          setFormData({
            name: '',
            phone: '',
            email: '',
            service: service.quoteService,
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
    const quoteEl = document.getElementById('service-quote-form');
    if (quoteEl) {
      quoteEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const otherServices = SERVICES_DATA.filter((s) => s.slug !== service.slug);

  return (
    <div className="service-page-wrapper">
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
              <span className="svc-back-text-full">Back to All Services</span>
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
            <a href={`tel:${service.cta.phoneTel}`} className="svc-header-phone">
              <Phone size={14} />
              <span>{service.cta.phone}</span>
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

      {/* Service Page Hero */}
      <section className="svc-detail-hero">
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
            <a
              href="/#services"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('/');
                setTimeout(() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              Services
            </a>
            <span className="sep">/</span>
            <span className="current">{service.title}</span>
          </div>

          <div className="svc-hero-content">
            <div className="svc-hero-badge">
              <span className="badge-num">{service.num}</span>
              <span className="badge-tag">KEYSTONE TRADE SPECIALTY</span>
            </div>

            <h1 className="svc-hero-title">{service.headline}</h1>

            <p className="svc-hero-desc">{service.summary}</p>

            <div className="svc-trust-badges">
              <div className="trust-pill">
                <ShieldCheck size={16} className="pill-icon" />
                <span>3 to 5 Year Workmanship Warranty</span>
              </div>
              <div className="trust-pill">
                <Award size={16} className="pill-icon" />
                <span>Calgary Licensed &amp; WCB Insured</span>
              </div>
              <div className="trust-pill">
                <Clock size={16} className="pill-icon" />
                <span>20 Years of Alberta Experience</span>
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
                href={`tel:${service.cta.phoneTel}`}
                className="btn btn-outline svc-call-btn"
              >
                <Phone size={16} />
                <span>Call Gaurav: {service.cta.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Voussoir Joint Divider */}
      <div className="joint on-forest" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      {/* Deep-Dive Technical Questions Section */}
      <section className="svc-deep-dives-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Expert Construction Standards</p>
              <h2>How Keystone delivers {service.title.toLowerCase()} right the first time.</h2>
            </div>
            <p className="sub">
              No cutting corners, no surprise change orders. Built for Alberta weather and inspected to provincial codes.
            </p>
          </div>

          <div className="deep-dive-grid">
            {service.sections.map((sec, idx) => (
              <article key={idx} className="deep-dive-card">
                <div className="deep-dive-header">
                  <span className="deep-dive-num">0{idx + 1}</span>
                  <h3 className="deep-dive-question">{sec.question}</h3>
                </div>
                <div className="deep-dive-body">
                  {sec.paragraphs.map((p, pIdx) => (
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

      {/* Interactive FAQ Section */}
      <section className="svc-faqs-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Got Questions?</p>
              <h2>Frequently asked questions about {service.title.toLowerCase()} in Alberta.</h2>
            </div>
            <p className="sub">
              Honest answers to the questions homeowners and property managers ask us most often before signing a contract.
            </p>
          </div>

          <div className="faq-accordion-list">
            {service.faqs.map((faq, idx) => {
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
                    aria-controls={`faq-answer-${idx}`}
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
                      id={`faq-answer-${idx}`}
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
      <section className="svc-contact-section" id="service-quote-form">
        <div className="wrap">
          <div className="svc-contact-grid">
            {/* Direct Contact Info Card */}
            <div className="svc-contact-info-card">
              <span className="eyebrow">Direct Accountability</span>
              <h2>Ready to talk about your {service.title.toLowerCase()} project?</h2>
              <p className="svc-contact-lead">
                Every project starts with a direct conversation and a thorough on-site walkthrough. No pressure, no commission sales reps — you speak directly with the builders.
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
                  <a href={`tel:${service.cta.phoneTel}`} className="builder-row">
                    <Phone size={16} />
                    <span>{service.cta.phone}</span>
                  </a>
                  <a href={`mailto:${service.cta.email}`} className="builder-row">
                    <Mail size={16} />
                    <span>{service.cta.email}</span>
                  </a>
                </div>

                <div className="builder-pledge">
                  <p>{service.cta.note}</p>
                </div>
              </div>

              <div className="svc-highlights-list">
                <div className="highlight-item">
                  <CheckCircle2 size={16} className="hl-icon" />
                  <span>Free on-site walkthrough and clear written proposal</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={16} className="hl-icon" />
                  <span>3 to 5 year workmanship warranty on every build</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle2 size={16} className="hl-icon" />
                  <span>City permits pulled and municipal inspections handled</span>
                </div>
              </div>
            </div>

            {/* Inline Quote Form with pre-selected service */}
            <div className="svc-quote-card">
              <div className="quote-card-head">
                <h3>Request an Estimate for {service.title}</h3>
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
                  <label htmlFor="svc-name">Your Full Name *</label>
                  <input
                    type="text"
                    id="svc-name"
                    name="name"
                    required
                    placeholder="e.g. Michael Miller"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="svc-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="svc-phone"
                      name="phone"
                      required
                      placeholder="e.g. 403 505 4015"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="svc-email">Email Address *</label>
                    <input
                      type="email"
                      id="svc-email"
                      name="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="svc-service-select">Selected Trade / Service</label>
                  <select
                    id="svc-service-select"
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
                  <label htmlFor="svc-details">Project Details &amp; Location (Optional)</label>
                  <textarea
                    id="svc-details"
                    name="project_details"
                    rows={4}
                    placeholder={`Tell us about your ${service.title.toLowerCase()} project, approximate square footage, timeline, or address in Calgary/Alberta...`}
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
                    <span>Submit {service.title} Quote Request</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Trades Grid */}
      <section className="svc-other-trades-section">
        <div className="wrap">
          <div className="other-trades-header">
            <div>
              <p className="eyebrow">Complete Capabilities</p>
              <h3>Explore Our Other Construction Trades</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="view-all-link"
            >
              <span>View All 8 Trades on Homepage</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="other-trades-grid">
            {otherServices.map((other) => (
              <div
                key={other.slug}
                className="other-trade-card"
                onClick={() => onNavigate(`/services/${other.slug}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(`/services/${other.slug}`);
                  }
                }}
              >
                <div className="other-num">{other.num}</div>
                <h4 className="other-title">{other.title}</h4>
                <p className="other-desc">{other.summary}</p>
                <span className="other-cta">
                  Learn More <ArrowRight size={13} />
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
