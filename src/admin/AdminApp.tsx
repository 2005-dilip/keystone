import React from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLogin } from './components/AdminLogin';
import { AdminLayout } from './components/AdminLayout';
import { Loader2 } from 'lucide-react';
import './admin.css';

interface AdminAppProps {
  onBackToHome: () => void;
}

const AdminAppInner: React.FC<AdminAppProps> = ({ onBackToHome }) => {
  const { user, isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <Loader2 size={40} className="animate-spin text-mint" />
        <p style={{ marginTop: '16px', color: '#CBD5E1', fontSize: '15px' }}>
          Verifying administrator authorization...
        </p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin onBackToHome={onBackToHome} />;
  }

  return <AdminLayout onBackToHome={onBackToHome} />;
};

export const AdminApp: React.FC<AdminAppProps> = ({ onBackToHome }) => {
  return (
    <AdminAuthProvider>
      <AdminAppInner onBackToHome={onBackToHome} />
    </AdminAuthProvider>
  );
};
