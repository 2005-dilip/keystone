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
  UserCheck,
} from 'lucide-react';
import { ABOUT_DATA } from '../data/aboutData';
import { SERVICES_DATA } from '../data/servicesData';
import { submitQuoteForm } from '../lib/supabase';
import type { QuoteFormData } from '../types';
import { Footer } from './Footer';

interface AboutDetailProps {
  onNavigate: (path: string) => void;
  onAdminClick?: () => void;
}

export const AboutDetail: React.FC<AboutDetailProps> = ({
  onNavigate,
  onAdminClick,
}) => {
  // Synchronize document title and SEO meta description
  useEffect(() => {
    document.title = ABOUT_DATA.metaTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', ABOUT_DATA.metaDescription);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', ABOUT_DATA.metaTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', ABOUT_DATA.metaDescription);

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
            message: `Thanks ${formData.name}! Your request has been received. Gaurav will review your details and contact you within 24 hours.`,
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
    const quoteEl = document.getElementById('about-quote-form');
    if (quoteEl) {
      quoteEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="service-page-wrapper about-page-wrapper">
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
            <a href={`tel:${ABOUT_DATA.cta.phoneTel}`} className="svc-header-phone">
              <Phone size={14} />
              <span>{ABOUT_DATA.cta.phone}</span>
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

      {/* About Us Hero Section */}
      <section className="svc-detail-hero about-detail-hero">
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
            <span className="current">About Keystone Renovations</span>
          </div>

          <div className="about-hero-grid">
            <div className="svc-hero-content">
              {/* Visible SEO Tag Badge */}
              <div className="svc-hero-badge">
                <span className="badge-num"><UserCheck size={12} /> GAURAV TYAGI</span>
                <span className="badge-tag">FOUNDER &bull; CALGARY CONTRACTOR</span>
              </div>

              <h1 className="svc-hero-title">{ABOUT_DATA.headline}</h1>

              <p className="svc-hero-desc">{ABOUT_DATA.metaDescription}</p>

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
                  <span>20+ Years Construction Experience</span>
                </div>
              </div>

              <div className="svc-hero-cta-group">
                <button
                  type="button"
                  onClick={scrollToQuote}
                  className="btn btn-primary svc-cta-large"
                >
                  Schedule a Free On-Site Walkthrough
                </button>
                <a
                  href={`tel:${ABOUT_DATA.cta.phoneTel}`}
                  className="btn btn-outline svc-call-btn"
                >
                  <Phone size={16} />
                  <span>Call Gaurav: {ABOUT_DATA.cta.phone}</span>
                </a>
              </div>
            </div>

            {/* Founder Quote Card */}
            <div className="about-hero-card">
              <div className="founder-quote-box">
                <div className="founder-avatar-lg">GT</div>
                <div className="founder-meta">
                  <h3>Gaurav Tyagi</h3>
                  <p className="founder-sub">Founder &amp; Project Director</p>
                </div>
              </div>
              <blockquote className="founder-statement">
                &ldquo;{ABOUT_DATA.founder.quote}&rdquo;
              </blockquote>
              <div className="founder-key-metrics">
                <div>
                  <span className="metric-val">20+</span>
                  <span className="metric-lbl">Years in Construction</span>
                </div>
                <div>
                  <span className="metric-val">200+</span>
                  <span className="metric-lbl">Projects Handled</span>
                </div>
                <div>
                  <span className="metric-val">100%</span>
                  <span className="metric-lbl">Permitted &amp; Warrantied</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architectural Voussoir Joint Divider */}
      <div className="joint on-forest" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      {/* Story Deep-Dives Section (Cream / Bone background) */}
      <section className="svc-deep-dives-section about-deep-dives-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Our Story &amp; Standards</p>
              <h2>The values and experience behind every build.</h2>
            </div>
            <p className="sub">
              No disappearing after final payment, no hidden costs. A Calgary contracting company built on honest communication and direct accountability.
            </p>
          </div>

          <div className="story-grid">
            {ABOUT_DATA.stories.map((story, idx) => (
              <article key={story.id} className="story-card" id={story.id}>
                <div className="story-card-header">
                  <div className="story-tag-row">
                    <span className="story-num">0{idx + 1}</span>
                    <span className="story-badge">{story.badge}</span>
                  </div>
                  <h3 className="story-title">{story.title}</h3>
                </div>
                <div className="story-card-body">
                  {story.paragraphs.map((p, pIdx) => (
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
      <section className="svc-faqs-section about-faqs-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="eyebrow">Got Questions?</p>
              <h2>Frequently asked questions about Keystone Renovations.</h2>
            </div>
            <p className="sub">
              Straightforward answers about our company, founder experience, licensing, and how to get started.
            </p>
          </div>

          <div className="faq-accordion-list">
            {ABOUT_DATA.faqs.map((faq, idx) => {
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
                    aria-controls={`about-faq-${idx}`}
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
                      id={`about-faq-${idx}`}
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
      <section className="svc-contact-section" id="about-quote-form">
        <div className="wrap">
          <div className="svc-contact-grid">
            {/* Direct Contact Info Card */}
            <div className="svc-contact-info-card">
              <span className="eyebrow">Direct Accountability</span>
              <h2>Ready to talk about your project?</h2>
              <p className="svc-contact-lead">
                Every project starts with a direct walkthrough where we listen first. No high pressure sales reps — you deal directly with Gaurav and the build crew.
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
                  <a href={`tel:${ABOUT_DATA.cta.phoneTel}`} className="builder-row">
                    <Phone size={16} />
                    <span>{ABOUT_DATA.cta.phone}</span>
                  </a>
                  <a href={`mailto:${ABOUT_DATA.cta.email}`} className="builder-row">
                    <Mail size={16} />
                    <span>{ABOUT_DATA.cta.email}</span>
                  </a>
                </div>

                <div className="builder-pledge">
                  <p>{ABOUT_DATA.cta.note}</p>
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
                  <span>Calgary business licence, WCB Alberta, and liability insured</span>
                </div>
              </div>
            </div>

            {/* Inline Quote Form */}
            <div className="svc-quote-card">
              <div className="quote-card-head">
                <h3>Request a Free Project Estimate</h3>
                <p>Fill out the form below and Gaurav will contact you within 24 hours.</p>
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
                  <label htmlFor="about-name">Your Full Name *</label>
                  <input
                    type="text"
                    id="about-name"
                    name="name"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="about-phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="about-phone"
                      name="phone"
                      required
                      placeholder="e.g. 403 505 4015"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="about-email">Email Address *</label>
                    <input
                      type="email"
                      id="about-email"
                      name="email"
                      required
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="about-service-select">Trade or Project Type</label>
                  <select
                    id="about-service-select"
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
                  <label htmlFor="about-details">Project Details &amp; Location</label>
                  <textarea
                    id="about-details"
                    name="project_details"
                    rows={4}
                    placeholder="Tell us about your home or commercial project, property location in Alberta, and desired timeline..."
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
                    <span>Submit Free Quote Request</span>
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
              <h3>Explore Our Construction Capabilities</h3>
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
