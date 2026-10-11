import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn
} from 'lucide-react';
import { login, register } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setServerError('');
    setSuccessMessage('');
  };

  const validate = () => {
    const errs = {};
    if (mode === 'register') {
      if (!formData.name.trim()) errs.name = 'Full name is required';
      if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
      if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    } else {
      if (!formData.email.trim()) errs.email = 'Email is required';
      if (!formData.password) errs.password = 'Password is required';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        const res = await register(formData.name.trim(), formData.email.trim().toLowerCase(), formData.password);
        setSuccessMessage(`Account created successfully! Welcome, ${res.name}. Logging you in...`);
        
        setTimeout(() => {
          onLoginSuccess({
            id: res.id,
            name: res.name,
            email: res.email,
            joinedDate: res.joinedDate || 'Just now',
            avatar: (res.name ? res.name[0] : 'U').toUpperCase(),
          });
          onClose();
        }, 600);
      } else {
        const res = await login(formData.email.trim().toLowerCase(), formData.password);
        setSuccessMessage(`Welcome back, ${res.name}!`);

        setTimeout(() => {
          onLoginSuccess({
            id: res.id,
            name: res.name,
            email: res.email,
            joinedDate: res.joinedDate || 'Recently',
            avatar: (res.name ? res.name[0] : 'U').toUpperCase(),
          });
          onClose();
        }, 400);
      }
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setServerError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const res = await login('aditya.verma@college.edu', 'password123');
      setSuccessMessage('Logging in as demo user (Aditya Verma)...');
      setTimeout(() => {
        onLoginSuccess({
          id: res.id,
          name: res.name,
          email: res.email,
          joinedDate: res.joinedDate || 'October 2026',
          avatar: 'AV',
        });
        onClose();
      }, 400);
    } catch (err) {
      // Fallback
      onLoginSuccess({
        id: 1,
        name: "Aditya Verma",
        email: "aditya.verma@college.edu",
        joinedDate: "October 2026",
        avatar: "AV",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--slate-50)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--blue-600)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--slate-900)' }}>
                {mode === 'login' ? 'Sign In to WorthIt' : 'Create an Account'}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Live Spring Boot JWT Authentication Badge */}
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--success-bg)',
          borderBottom: '1px solid var(--success-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <CheckCircle2 size={16} color="var(--success-text)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.74rem', color: 'var(--success-text)', lineHeight: 1.4 }}>
            <strong>Live Spring Boot JWT &amp; MySQL:</strong> Passwords hashed with BCrypt; saved in <code>worthit_db.users</code> table.
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div style={{
            margin: '1rem 1.5rem 0 1.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--success-text)',
            fontSize: '0.76rem',
            fontWeight: 500
          }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Server Error Alert Banner */}
        {serverError && (
          <div style={{
            margin: '1rem 1.5rem 0 1.5rem',
            padding: '0.65rem 0.85rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--danger-text)',
            fontSize: '0.76rem',
            fontWeight: 500
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{serverError}</span>
          </div>
        )}

        {/* Mode Toggle Buttons */}
        <div style={{ padding: '1rem 1.5rem 0 1.5rem' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--slate-100)',
            padding: '0.25rem',
            borderRadius: 'var(--radius-md)'
          }}>
            <button
              type="button"
              id="modal-tab-login"
              onClick={() => switchMode('login')}
              style={{
                flex: 1,
                padding: '0.45rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? 'var(--blue-700)' : 'var(--slate-600)',
                fontWeight: mode === 'login' ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              id="modal-tab-register"
              onClick={() => switchMode('register')}
              style={{
                flex: 1,
                padding: '0.45rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? 'var(--blue-700)' : 'var(--slate-600)',
                fontWeight: mode === 'register' ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? 'var(--shadow-xs)' : 'none',
                transition: 'all 0.15s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <UserPlus size={14} />
              <span>Register / Sign Up</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.25rem 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Full Name *
              </label>
              <input
                type="text"
                id="modal-register-name"
                className="form-input"
                placeholder="e.g. Rohan Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
              {errors.name && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{errors.name}</div>}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              id="modal-auth-email"
              className="form-input"
              placeholder="e.g. rohan.sharma@college.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
            {errors.email && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{errors.email}</div>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
              Password * {mode === 'register' && <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', fontWeight: 400 }}>(min. 6 characters)</span>}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="modal-auth-password"
                className="form-input"
                placeholder="••••••••"
                style={{ paddingRight: '2.5rem' }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--slate-400)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{errors.password}</div>}
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
                Confirm Password *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="modal-register-confirm-password"
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={loading}
              />
              {errors.confirmPassword && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{errors.confirmPassword}</div>}
            </div>
          )}

          <button
            type="submit"
            id="modal-auth-submit-btn"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.35rem', padding: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            disabled={loading}
          >
            {loading ? <Loader2 size={16} className="spin" /> : null}
            <span>{mode === 'login' ? 'Sign In to Account' : 'Register Account & Sign In'}</span>
          </button>

          {/* Toggle between Sign In and Register button directly in form */}
          <div style={{
            textAlign: 'center',
            paddingTop: '0.4rem',
            borderTop: '1px solid var(--slate-100)',
            marginTop: '0.25rem'
          }}>
            {mode === 'login' ? (
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  id="modal-btn-switch-to-register"
                  onClick={() => switchMode('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--blue-600)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Register / Sign Up here
                </button>
              </div>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--slate-600)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  id="modal-btn-switch-to-login"
                  onClick={() => switchMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--blue-600)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Sign In instead
                </button>
              </div>
            )}
          </div>

          {/* Quick Demo Access Button */}
          <div style={{ textAlign: 'center', marginTop: '0.15rem' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--slate-400)' }}>or continue with</span>
          </div>

          <button
            type="button"
            id="modal-btn-demo-login"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn btn-outline"
            style={{
              width: '100%',
              borderColor: 'var(--blue-200)',
              backgroundColor: 'var(--blue-50)',
              color: 'var(--blue-700)',
              fontSize: '0.8rem',
              gap: '0.4rem'
            }}
          >
            <Sparkles size={15} color="var(--blue-600)" />
            <span>Pre-seeded Demo User (Aditya Verma)</span>
          </button>
        </form>
      </div>
    </div>
  );
}
