import React from 'react';
import {
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Trash2,
} from 'lucide-react';
import type { QuoteRequest, LeadStatus } from '../../types';

interface LeadDetailModalProps {
  lead: QuoteRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>;
  onOpenWhatsApp: (lead: QuoteRequest) => void;
  onOpenEmail: (lead: QuoteRequest) => void;
  onDeleteRequest: (lead: QuoteRequest) => void;
  updatingStatus: boolean;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onStatusChange,
  onOpenWhatsApp,
  onOpenEmail,
  onDeleteRequest,
  updatingStatus,
}) => {
  if (!lead) return null;

  const formattedDate = new Date(lead.created_at).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const updatedDate = new Date(lead.updated_at).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const statusOptions: { value: LeadStatus; label: string }[] = [
    { value: 'new', label: 'New Inquiry' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
  ];

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className={`status-badge ${lead.status}`}>
                {lead.status.toUpperCase()}
              </span>
              <span className="lead-id-pill">ID: {lead.id}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#F8FAFC', fontWeight: 700 }}>
              {lead.name}
            </h2>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="admin-modal-body">
          {/* Quick Action Bar */}
          <div className="lead-detail-actions">
            <button
              type="button"
              className="admin-btn admin-btn-whatsapp"
              onClick={() => onOpenWhatsApp(lead)}
            >
              <MessageSquare size={16} />
              <span>Contact WhatsApp</span>
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => onOpenEmail(lead)}
            >
              <Mail size={16} />
              <span>Compose Email</span>
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => (window.location.href = `tel:${lead.phone}`)}
            >
              <Phone size={16} />
              <span>Call ({lead.phone})</span>
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="detail-meta-grid">
            <div className="detail-item">
              <span className="detail-label">Service Requested</span>
              <div className="detail-val highlight">{lead.service}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Current Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <select
                  className="status-select"
                  value={lead.status}
                  disabled={updatingStatus}
                  onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {updatingStatus && <span style={{ fontSize: '12px', color: '#94A3B8' }}>Updating...</span>}
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <div className="detail-val">
                <a href={`tel:${lead.phone}`} style={{ color: '#10B981', textDecoration: 'none' }}>
                  {lead.phone}
                </a>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email</span>
              <div className="detail-val">
                <a href={`mailto:${lead.email}`} style={{ color: '#10B981', textDecoration: 'none' }}>
                  {lead.email}
                </a>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Submission Date
              </span>
              <div className="detail-val">{formattedDate}</div>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                Last Updated
              </span>
              <div className="detail-val">{updatedDate}</div>
            </div>
          </div>

          {/* Project Details */}
          <div style={{ marginTop: '20px' }}>
            <div className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <FileText size={14} />
              <span>Project Details &amp; Customer Notes</span>
            </div>
            <div className="detail-notes-box">
              {lead.project_details?.trim() || 'No additional project notes provided by customer.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="admin-modal-footer space-between">
          <button
            type="button"
            className="admin-btn admin-btn-danger-outline"
            onClick={() => onDeleteRequest(lead)}
          >
            <Trash2 size={15} />
            <span>Delete Lead</span>
          </button>
          <button type="button" className="admin-btn admin-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
