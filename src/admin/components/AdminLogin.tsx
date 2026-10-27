import React, { useState } from 'react';
import { Lock, Mail, AlertCircle, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

interface AdminLoginProps {
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToHome }) => {
  const { signIn, error: authError, clearError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both your email address and password.');
      return;
    }

    setSubmitting(true);
    const res = await signIn(email, password);
    setSubmitting(false);

    if (!res.success && res.error) {
      setLocalError(res.error);
    }
  };

  const displayError = localError || authError;

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand Header */}
        <div className="admin-login-header">
          <div className="admin-badge">
            <ShieldCheck size={16} />
            <span>Authorized Access Only</span>
          </div>
          <div className="admin-brand-title">
            KEY<span>STONE</span> RENOVATIONS
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-sub">
            Log in with your administrator credentials to manage quote requests and customer inquiries.
          </p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="admin-alert error" role="alert">
            <AlertCircle size={18} className="alert-icon" />
            <span>{displayError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="admin-input-wrapper">
              <Mail size={17} className="input-icon" />
              <input
                id="admin-email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@keystonerenov.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <div className="admin-input-wrapper">
              <Lock size={17} className="input-icon" />
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn-primary admin-btn-block"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="admin-login-footer">
          <button
            type="button"
            className="admin-back-btn"
            onClick={onBackToHome}
          >
            <ArrowLeft size={15} />
            <span>Return to Keystone Renovations</span>
          </button>
        </div>
      </div>
    </div>
  );
};
