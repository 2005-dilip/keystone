import React, { useState } from 'react';
import { Mail, X, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { QuoteRequest } from '../../types';

interface EmailModalProps {
  lead: QuoteRequest | null;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({ lead, onClose }) => {
  if (!lead) return null;
  return <EmailModalContent lead={lead} onClose={onClose} />;
};

interface EmailModalContentProps {
  lead: QuoteRequest;
  onClose: () => void;
}

const EmailModalContent: React.FC<EmailModalContentProps> = ({ lead, onClose }) => {
  const rawEmail = (lead.email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(rawEmail);

  const defaultSubject = `Following Up on Your Keystone Renovations Enquiry - ${lead.service}`;
  const defaultBody = `Hi ${lead.name},

Thank you for contacting Keystone Renovations regarding ${lead.service}. We would like to learn more about your project and discuss the next steps.

Please let us know a convenient time to connect.

Best regards,
Keystone Renovations
Phone: 403 505 4015
Email: gaurav.tyagi@keystonerenov.com
Calgary & Alberta Construction`;

  const [toEmail, setToEmail] = useState(rawEmail);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  const handleOpenEmailApp = () => {
    if (!toEmail || !emailRegex.test(toEmail)) {
      alert('Please provide a valid recipient email address.');
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-wrap">
            <div className="admin-modal-icon email">
              <Mail size={19} />
            </div>
            <div>
              <h3>Compose Follow-Up Email</h3>
              <p>Review or edit the message before launching your mail application</p>
            </div>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">
          {!isValidEmail && (
            <div className="admin-alert warning">
              <AlertTriangle size={18} className="alert-icon" />
              <span>The customer's email address appears missing or invalid. Please verify before sending.</span>
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="email-recipient">Recipient (To)</label>
            <input
              id="email-recipient"
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="customer@email.com"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="email-subject">Subject</label>
            <input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>

          <div className="admin-field">
            <label htmlFor="email-body">Email Message</label>
            <textarea
              id="email-body"
              rows={7}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your email response..."
            />
          </div>

          <div className="admin-note">
            <CheckCircle2 size={15} color="#10B981" />
            <span>
              Clicking below opens your default email client (Outlook, Apple Mail, Gmail) with the prefilled subject and message ready for you to send.
            </span>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={handleOpenEmailApp}
            disabled={!toEmail || !emailRegex.test(toEmail)}
          >
            <ExternalLink size={16} />
            <span>Open in Mail App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
