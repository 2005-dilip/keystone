import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  Hammer,
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { DashboardOverview } from './DashboardOverview';
import { LeadManagement } from './LeadManagement';
import { LeadDetailModal } from './LeadDetailModal';
import { WhatsAppModal } from './WhatsAppModal';
import { EmailModal } from './EmailModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { updateLeadStatus, deleteLead } from '../../lib/supabase';
import type { QuoteRequest, LeadStatus } from '../../types';

interface AdminLayoutProps {
  onBackToHome: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToHome }) => {
  const { user, signOut } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'leads'>('overview');
  const [initialStatusFilter, setInitialStatusFilter] = useState<string>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [selectedLead, setSelectedLead] = useState<QuoteRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Navigation helper from KPI cards
  const handleNavigateToLeads = (statusFilter = 'all') => {
    setInitialStatusFilter(statusFilter);
    setActiveTab('leads');
    setMobileMenuOpen(false);
  };

  // Status changer from detail modal
  const handleStatusChange = async (id: string, status: LeadStatus) => {
    setUpdatingStatus(true);
    try {
      const updated = await updateLeadStatus(id, status);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(updated);
      }
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(`Could not update lead status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Delete lead handler
  const handleDeleteConfirm = async () => {
    if (!selectedLead) return;
    setDeleting(true);
    try {
      await deleteLead(selectedLead.id);
      setIsDeleteModalOpen(false);
      setIsDetailModalOpen(false);
      setSelectedLead(null);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      alert(`Error deleting lead: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // Keyboard Escape listener for admin mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="admin-app-root">
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-mobile-menu-btn"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="admin-mobile-drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="admin-brand">
            <div className="admin-brand-icon">
              <Hammer size={18} />
            </div>
            <div className="admin-brand-text">
              <span className="brand-title">
                KEY<span>STONE</span>
              </span>
              <span className="brand-subtitle">ADMIN CONSOLE</span>
            </div>
          </div>

          <nav className="admin-desktop-nav">
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              className={`admin-nav-item ${activeTab === 'leads' ? 'active' : ''}`}
              onClick={() => handleNavigateToLeads('all')}
            >
              <Users size={16} />
              <span>Leads</span>
            </button>
          </nav>
        </div>

        <div className="admin-topbar-right">
          <div className="admin-user-pill">
            <Shield size={14} className="text-mint" />
            <span className="admin-user-email">{user?.email || 'admin@keystonerenov.com'}</span>
            <span className="admin-role-badge">Admin</span>
          </div>

          <button
            type="button"
            className="admin-link-website"
            onClick={onBackToHome}
            title="Return to Public Site"
          >
            <ExternalLink size={15} />
            <span className="hide-mobile">Public Site</span>
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={() => signOut()}
            title="Log Out"
          >
            <LogOut size={15} />
            <span className="hide-mobile">Log Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="admin-mobile-drawer" className="admin-mobile-drawer" role="dialog" aria-modal="true" aria-label="Admin Navigation">
          <div className="admin-drawer-user-info">
            <div className="admin-drawer-user-avatar">
              <Shield size={18} className="text-mint" />
            </div>
            <div className="admin-drawer-user-details">
              <span className="admin-drawer-email">{user?.email || 'admin@keystonerenov.com'}</span>
              <span className="admin-drawer-badge">Authorized Admin</span>
            </div>
          </div>

          <button
            type="button"
            className={`admin-drawer-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('overview');
              setMobileMenuOpen(false);
            }}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Overview</span>
          </button>
          <button
            type="button"
            className={`admin-drawer-item ${activeTab === 'leads' ? 'active' : ''}`}
            onClick={() => handleNavigateToLeads('all')}
          >
            <Users size={18} />
            <span>Lead Management</span>
          </button>
          <button
            type="button"
            className="admin-drawer-item"
            onClick={onBackToHome}
          >
            <ExternalLink size={18} />
            <span>Return to Public Site</span>
          </button>
          <button
            type="button"
            className="admin-drawer-item logout"
            onClick={() => signOut()}
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      )}

      {/* Main Admin Content Container */}
      <main className="admin-main-wrap">
        <div className="admin-container">
          {activeTab === 'overview' ? (
            <DashboardOverview
              key={`dash-${refreshKey}`}
              onNavigateToLeads={handleNavigateToLeads}
              onOpenLeadDetail={(lead) => {
                setSelectedLead(lead);
                setIsDetailModalOpen(true);
              }}
              onOpenWhatsApp={(lead) => {
                setSelectedLead(lead);
                setIsWhatsAppModalOpen(true);
              }}
              onOpenEmail={(lead) => {
                setSelectedLead(lead);
                setIsEmailModalOpen(true);
              }}
            />
          ) : (
            <LeadManagement
              key={`${initialStatusFilter}-${refreshKey}`}
              initialStatusFilter={initialStatusFilter}
              onOpenLeadDetail={(lead) => {
                setSelectedLead(lead);
                setIsDetailModalOpen(true);
              }}
              onOpenWhatsApp={(lead) => {
                setSelectedLead(lead);
                setIsWhatsAppModalOpen(true);
              }}
              onOpenEmail={(lead) => {
                setSelectedLead(lead);
                setIsEmailModalOpen(true);
              }}
              onOpenDelete={(lead) => {
                setSelectedLead(lead);
                setIsDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      {isDetailModalOpen && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setIsDetailModalOpen(false)}
          onStatusChange={handleStatusChange}
          onOpenWhatsApp={(lead) => {
            setSelectedLead(lead);
            setIsWhatsAppModalOpen(true);
          }}
          onOpenEmail={(lead) => {
            setSelectedLead(lead);
            setIsEmailModalOpen(true);
          }}
          onDeleteRequest={(lead) => {
            setSelectedLead(lead);
            setIsDeleteModalOpen(true);
          }}
          updatingStatus={updatingStatus}
        />
      )}

      {isWhatsAppModalOpen && (
        <WhatsAppModal
          lead={selectedLead}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}

      {isEmailModalOpen && (
        <EmailModal
          lead={selectedLead}
          onClose={() => setIsEmailModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          lead={selectedLead}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}
    </div>
  );
};
