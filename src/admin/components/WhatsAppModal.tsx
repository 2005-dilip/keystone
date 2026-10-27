import React, { useState } from 'react';
import { MessageSquare, X, ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { QuoteRequest } from '../../types';

interface WhatsAppModalProps {
  lead: QuoteRequest | null;
  onClose: () => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ lead, onClose }) => {
  if (!lead) return null;
  return <WhatsAppModalContent lead={lead} onClose={onClose} />;
};

interface WhatsAppModalContentProps {
  lead: QuoteRequest;
  onClose: () => void;
}

const WhatsAppModalContent: React.FC<WhatsAppModalContentProps> = ({ lead, onClose }) => {
  // Normalize phone number
  const rawPhone = (lead.phone || '').trim();
  const digitsOnly = rawPhone.replace(/\D/g, '');
  
  let normalizedNumber = '';
  let phoneWarning: string | null = null;

  if (!digitsOnly) {
    phoneWarning = 'No phone number provided for this lead.';
  } else if (rawPhone.startsWith('+')) {
    normalizedNumber = digitsOnly;
  } else if (digitsOnly.length === 10) {
    // North American standard (Canada/US: +1 prefix)
    normalizedNumber = `1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    normalizedNumber = digitsOnly;
  } else if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    normalizedNumber = digitsOnly;
  } else {
    phoneWarning = `Phone number "${rawPhone}" might be missing a country code or formatted irregularly.`;
    normalizedNumber = digitsOnly;
  }

  const defaultMessage = `Hi ${lead.name}, this is Keystone Renovations. We received your enquiry regarding ${lead.service}. I'd like to discuss your project and understand your requirements. When would be a convenient time to connect?`;

  const [message, setMessage] = useState(defaultMessage);

  const handleOpenWhatsApp = () => {
    if (!normalizedNumber) return;
    const url = `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-wrap">
            <div className="admin-modal-icon wa">
              <MessageSquare size={19} />
            </div>
            <div>
              <h3>Contact via WhatsApp</h3>
              <p>Review and personalize the message before launching WhatsApp</p>
            </div>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">
          {phoneWarning && (
            <div className="admin-alert warning">
              <AlertTriangle size={18} className="alert-icon" />
              <span>{phoneWarning}</span>
            </div>
          )}

          <div className="admin-modal-grid">
            <div>
              <span className="admin-modal-label">Customer Name</span>
              <div className="admin-modal-val">{lead.name}</div>
            </div>
            <div>
              <span className="admin-modal-label">Requested Service</span>
              <div className="admin-modal-val highlight">{lead.service}</div>
            </div>
            <div>
              <span className="admin-modal-label">Raw Phone</span>
              <div className="admin-modal-val">{rawPhone || 'Not provided'}</div>
            </div>
            <div>
              <span className="admin-modal-label">WhatsApp Target Number</span>
              <div className="admin-modal-val mono">
                {normalizedNumber ? `+${normalizedNumber}` : 'Invalid Number'}
              </div>
            </div>
          </div>

          <div className="admin-field" style={{ marginTop: '16px' }}>
            <label htmlFor="wa-message">Personalized Message</label>
            <textarea
              id="wa-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message to prefill in WhatsApp..."
            />
          </div>

          <div className="admin-note">
            <CheckCircle2 size={15} color="#10B981" />
            <span>
              This will not send messages automatically. Clicking below opens WhatsApp Web or your WhatsApp app so you can review and hit send manually.
            </span>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-whatsapp"
            onClick={handleOpenWhatsApp}
            disabled={!normalizedNumber}
          >
            <ExternalLink size={16} />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
