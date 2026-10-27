import React from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import type { QuoteRequest } from '../../types';

interface DeleteConfirmModalProps {
  lead: QuoteRequest | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  lead,
  onClose,
  onConfirm,
  deleting,
}) => {
  if (!lead) return null;

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card danger" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div className="admin-modal-title-wrap">
            <div className="admin-modal-icon danger">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3>Delete Quote Request?</h3>
              <p>This action cannot be undone.</p>
            </div>
          </div>
          <button className="admin-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="admin-modal-body">
          <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#CBD5E1', lineHeight: 1.5 }}>
            Are you sure you want to permanently delete the quote inquiry from{' '}
            <strong style={{ color: '#F8FAFC' }}>{lead.name}</strong> for{' '}
            <span style={{ color: '#10B981' }}>{lead.service}</span>?
          </p>
          <div className="admin-modal-val mono" style={{ fontSize: '12px', padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px' }}>
            Lead ID: {lead.id}
          </div>
        </div>

        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Permanently Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
