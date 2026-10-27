import React, { useEffect, useState } from 'react';
import {
  Inbox,
  UserCheck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  ArrowRight,
  RefreshCw,
  Loader2,
  MessageSquare,
  Mail,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { fetchLeadStats, fetchLeads } from '../../lib/supabase';
import type { LeadStats, QuoteRequest } from '../../types';

interface DashboardOverviewProps {
  onNavigateToLeads: (statusFilter?: string) => void;
  onOpenLeadDetail: (lead: QuoteRequest) => void;
  onOpenWhatsApp: (lead: QuoteRequest) => void;
  onOpenEmail: (lead: QuoteRequest) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateToLeads,
  onOpenLeadDetail,
  onOpenWhatsApp,
  onOpenEmail,
}) => {
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [statsData, recentData] = await Promise.all([
        fetchLeadStats(),
        fetchLeads({ page: 1, pageSize: 6, sortOrder: 'newest' }),
      ]);

      setStats(statsData);
      setRecentLeads(recentData.data);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Unable to load dashboard metrics.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-state">
        <Loader2 size={36} className="animate-spin text-mint" />
        <p>Loading Keystone metrics...</p>
      </div>
    );
  }

  const conversionRate = stats?.total
    ? Math.round((stats.converted / stats.total) * 100)
    : 0;

  return (
    <div className="dashboard-overview">
      {/* Top Welcome / Header */}
      <div className="dashboard-header-bar">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-sub">
            Real-time lead activity and conversion pipeline for Keystone Renovations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            className="admin-btn admin-btn-secondary"
            onClick={() => loadData(true)}
            disabled={refreshing}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={() => onNavigateToLeads()}
          >
            <span>Manage All Leads</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-alert error" style={{ marginBottom: '24px' }}>
          <AlertCircle size={18} className="alert-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* 6 KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Total Leads */}
        <div
          className="kpi-card total cursor-pointer"
          onClick={() => onNavigateToLeads('all')}
        >
          <div className="kpi-icon-wrap total">
            <Inbox size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Leads</span>
            <div className="kpi-value">{stats?.total ?? 0}</div>
            <span className="kpi-hint">All recorded inquiries</span>
          </div>
        </div>

        {/* New Leads */}
        <div
          className="kpi-card new cursor-pointer"
          onClick={() => onNavigateToLeads('new')}
        >
          <div className="kpi-icon-wrap new">
            <Inbox size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">New Inquiries</span>
            <div className="kpi-value">{stats?.new ?? 0}</div>
            <span className="kpi-hint">Awaiting initial review</span>
          </div>
        </div>

        {/* Contacted */}
        <div
          className="kpi-card contacted cursor-pointer"
          onClick={() => onNavigateToLeads('contacted')}
        >
          <div className="kpi-icon-wrap contacted">
            <PhoneCall size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Contacted</span>
            <div className="kpi-value">{stats?.contacted ?? 0}</div>
            <span className="kpi-hint">In conversation</span>
          </div>
        </div>

        {/* Qualified */}
        <div
          className="kpi-card qualified cursor-pointer"
          onClick={() => onNavigateToLeads('qualified')}
        >
          <div className="kpi-icon-wrap qualified">
            <UserCheck size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Qualified</span>
            <div className="kpi-value">{stats?.qualified ?? 0}</div>
            <span className="kpi-hint">Budget &amp; scope confirmed</span>
          </div>
        </div>

        {/* Converted */}
        <div
          className="kpi-card converted cursor-pointer"
          onClick={() => onNavigateToLeads('converted')}
        >
          <div className="kpi-icon-wrap converted">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Converted</span>
            <div className="kpi-value">{stats?.converted ?? 0}</div>
            <span className="kpi-hint">{conversionRate}% overall close rate</span>
          </div>
        </div>

        {/* Lost */}
        <div
          className="kpi-card lost cursor-pointer"
          onClick={() => onNavigateToLeads('lost')}
        >
          <div className="kpi-icon-wrap lost">
            <XCircle size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Lost</span>
            <div className="kpi-value">{stats?.lost ?? 0}</div>
            <span className="kpi-hint">Closed or non-responsive</span>
          </div>
        </div>
      </div>

      {/* Recent Leads Section */}
      <div className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Inquiries</h2>
            <p className="section-sub">Latest quote requests received from the website</p>
          </div>
          <button
            type="button"
            className="admin-link-btn"
            onClick={() => onNavigateToLeads()}
          >
            <span>View All Leads ({stats?.total ?? 0})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {recentLeads.length === 0 ? (
          <div className="admin-empty-state">
            <Inbox size={42} />
            <h3>No quote requests found</h3>
            <p>New inquiries submitted on keystonerenov.com will appear here automatically.</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Requested Service</th>
                  <th>Phone / Email</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
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
                    <td className="table-date">
                      {new Date(lead.created_at).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>
                      <span className={`status-badge ${lead.status}`}>
                        {lead.status.toUpperCase()}
                      </span>
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
                          title="View Details"
                          onClick={() => onOpenLeadDetail(lead)}
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
