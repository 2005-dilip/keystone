import React, { useEffect, useState, useCallback } from 'react';
import {
  Search,
  RefreshCw,
  Loader2,
  MessageSquare,
  Mail,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { fetchLeads, updateLeadStatus } from '../../lib/supabase';
import type { QuoteRequest, LeadStatus } from '../../types';

interface LeadManagementProps {
  initialStatusFilter?: string;
  onOpenLeadDetail: (lead: QuoteRequest) => void;
  onOpenWhatsApp: (lead: QuoteRequest) => void;
  onOpenEmail: (lead: QuoteRequest) => void;
  onOpenDelete: (lead: QuoteRequest) => void;
}

export const LeadManagement: React.FC<LeadManagementProps> = ({
  initialStatusFilter = 'all',
  onOpenLeadDetail,
  onOpenWhatsApp,
  onOpenEmail,
  onOpenDelete,
}) => {
  const [leads, setLeads] = useState<QuoteRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Status updating inline indicator
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const servicesList = [
    'Renovations',
    'Concrete Work',
    'Framing',
    'Demolitions',
    'Painting',
    'Fence Installation',
    'Basement Development',
    'Garage Construction',
    'Something else',
  ];

  const statusList: { value: string; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'converted', label: 'Converted' },
    { value: 'lost', label: 'Lost' },
  ];

  const loadLeads = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetchLeads({
        search: searchTerm,
        status: statusFilter,
        service: serviceFilter,
        sortOrder,
        page,
        pageSize,
      });

      setLeads(res.data);
      setTotalCount(res.count);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to retrieve quote requests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, statusFilter, serviceFilter, sortOrder, page, pageSize]);

  // Load when dependencies change
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Handle inline status change
  const handleInlineStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingId(leadId);
    try {
      const updated = await updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((item) => (item.id === leadId ? updated : item))
      );
    } catch (err: any) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const fromIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const toIndex = Math.min(page * pageSize, totalCount);

  return (
    <div className="lead-management">
      {/* Header Bar */}
      <div className="dashboard-header-bar">
        <div>
          <h1 className="dashboard-title">Lead Management</h1>
          <p className="dashboard-sub">
            Search, filter, update, and follow up with Keystone Renovations customer leads.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => loadLeads(true)}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert error" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Search Toolbar */}
      <div className="filter-toolbar">
        {/* Search Input */}
        <div className="filter-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset to page 1 on new search
            }}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchTerm('');
                setPage(1);
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="filter-controls-wrap">
          {/* Status Filter */}
          <div className="filter-item">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {statusList.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Filter */}
          <div className="filter-item">
            <label htmlFor="service-filter">Service:</label>
            <select
              id="service-filter"
              value={serviceFilter}
              onChange={(e) => {
                setServiceFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Services</option>
              {servicesList.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="filter-item">
            <label htmlFor="sort-filter">Sort:</label>
            <select
              id="sort-filter"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as 'newest' | 'oldest');
                setPage(1);
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table & Content Area */}
      {loading ? (
        <div className="admin-loading-state" style={{ minHeight: '300px' }}>
          <Loader2 size={36} className="animate-spin text-mint" />
          <p>Fetching quote requests...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="admin-empty-state" style={{ minHeight: '300px' }}>
          <FileSpreadsheet size={44} />
          <h3>No matching quote requests</h3>
          <p>Try clearing your search term or selecting a different status/service filter.</p>
          {(searchTerm || statusFilter !== 'all' || serviceFilter !== 'all') && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              style={{ marginTop: '14px' }}
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setServiceFilter('all');
                setPage(1);
              }}
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Contact</th>
                <th>Project Details</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="table-lead-name">{lead.name}</div>
                    <div className="table-lead-id">ID: {lead.id.substring(0, 8)}...</div>
                  </td>
                  <td>
                    <span className="table-service-pill">{lead.service}</span>
                  </td>
                  <td>
                    <div className="table-contact-link">
                      <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                    </div>
                    <div className="table-contact-link sub">
                      <a href={`mailto:${lead.email}`}>{lead.email}</a>
                    </div>
                  </td>
                  <td className="table-details-preview">
                    {lead.project_details ? (
                      <span title={lead.project_details}>
                        {lead.project_details.length > 55
                          ? `${lead.project_details.substring(0, 55)}...`
                          : lead.project_details}
                      </span>
                    ) : (
                      <span style={{ color: '#64748B', fontStyle: 'italic' }}>None provided</span>
                    )}
                  </td>
                  <td className="table-date">
                    <div>
                      {new Date(lead.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {new Date(lead.created_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <select
                        className={`status-select-inline ${lead.status}`}
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) =>
                          handleInlineStatusChange(lead.id, e.target.value as LeadStatus)
                        }
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                      {updatingId === lead.id && (
                        <Loader2 size={12} className="animate-spin text-mint" />
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="action-icon-btn wa"
                        title="Contact via WhatsApp"
                        onClick={() => onOpenWhatsApp(lead)}
                      >
                        <MessageSquare size={15} />
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn email"
                        title="Compose Email"
                        onClick={() => onOpenEmail(lead)}
                      >
                        <Mail size={15} />
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn view"
                        title="View Lead Details"
                        onClick={() => onOpenLeadDetail(lead)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        className="action-icon-btn danger"
                        title="Delete Lead"
                        onClick={() => onOpenDelete(lead)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && totalCount > 0 && (
        <div className="pagination-bar">
          <div className="pagination-info">
            Showing <strong>{fromIndex}</strong> to <strong>{toIndex}</strong> of{' '}
            <strong>{totalCount}</strong> leads
          </div>

          <div className="pagination-controls">
            <div className="page-size-selector">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="page-buttons">
              <button
                type="button"
                className="page-nav-btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="page-current">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="page-nav-btn"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
