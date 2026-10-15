import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { submitQuoteForm } from '../lib/supabase';
import type { QuoteFormData } from '../types';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    phone: '',
    email: '',
    service: 'Renovations',
    project_details: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'duplicate';
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Basic client-side validation
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
            message: "We've already received this quote request recently! Our team will contact you shortly.",
          });
        } else {
          setFeedback({
            type: 'success',
            message: "Thanks! We've received your request. An estimator will review your details and contact you within 1 business day.",
          });
          // Reset form fields on new success
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
          message: response.error || 'Something went wrong submitting your request. Please try calling us at 403 505 4015.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'An unexpected error occurred. Please call us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <div className="contact-panel rv">
          {/* Contact Information */}
          <div className="contact-info">
            <p className="eyebrow">Get In Touch</p>
            <h2>Let's talk about your project.</h2>
            <p>
              Tell us what you're building, renovating, or tearing down — we'll get back to you with a straight answer, not a sales pitch.
            </p>

            <div className="c-row">
              <Phone size={19} color="var(--mint)" strokeWidth={1.5} />
              <div>
                <span className="k">Phone</span>
                <a className="v" href="tel:4035054015">403 505 4015</a>
              </div>
            </div>

            <div className="c-row">
              <Mail size={19} color="var(--mint)" strokeWidth={1.5} />
              <div>
                <span className="k">Email</span>
                <a className="v" href="mailto:gaurav.tyagi@keystonerenov.com">gaurav.tyagi@keystonerenov.com</a>
              </div>
            </div>

            <div className="c-row">
              <MapPin size={19} color="var(--mint)" strokeWidth={1.5} />
              <div>
                <span className="k">Based In</span>
                <span className="v">Calgary, Alberta</span>
              </div>
            </div>
          </div>

          {/* Contact Quote Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            {feedback && (
              <div className={`form-feedback ${feedback.type === 'error' ? 'error' : 'success'}`}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  {feedback.type === 'error' ? (
                    <AlertCircle size={20} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <CheckCircle2 size={20} color="var(--mint)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <span>{feedback.message}</span>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="field">
                <label htmlFor="fname">Name *</label>
                <input
                  id="fname"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="fphone">Phone *</label>
                <input
                  id="fphone"
                  name="phone"
                  type="tel"
                  placeholder="403 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label htmlFor="femail">Email *</label>
                <input
                  id="femail"
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="fservice">Service *</label>
                <select
                  id="fservice"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="Renovations">Renovations</option>
                  <option value="Concrete Work">Concrete Work</option>
                  <option value="Framing">Framing</option>
                  <option value="Demolitions">Demolitions</option>
                  <option value="Painting">Painting</option>
                  <option value="Fence Installation">Fence Installation</option>
                  <option value="Basement Development">Basement Development</option>
                  <option value="Garage Construction">Garage Construction</option>
                  <option value="Something else">Something else</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="field full">
                <label htmlFor="fmsg">Project Details</label>
                <textarea
                  id="fmsg"
                  name="project_details"
                  placeholder="Tell us a bit about the project, timeline, and location."
                  value={formData.project_details}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Submitting...</span>
                </>
              ) : (
                'Request a Quote'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
