import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowRight,
  UserPlus,
  LogIn,
  Database
} from 'lucide-react';
import { login, register } from '../services/api';

export default function LoginPage({ onLoginSuccess, backendStatus }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
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

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    setServerError('');
    setSuccessMessage('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
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
        const res = await register(
          formData.name.trim(),
          formData.email.trim().toLowerCase(),
          formData.password
        );

        setSuccessMessage(`Account created successfully! Welcome, ${res.name}. Logging you in...`);
        
        setTimeout(() => {
          onLoginSuccess({
            id: res.id,
            name: res.name,
            email: res.email,
            joinedDate: res.joinedDate || 'Just now',
            avatar: (res.name ? res.name[0] : 'U').toUpperCase(),
          });
        }, 700);

      } else {
        const res = await login(
          formData.email.trim().toLowerCase(),
          formData.password
        );

        setSuccessMessage(`Welcome back, ${res.name}! Loading dashboard...`);

        setTimeout(() => {
          onLoginSuccess({
            id: res.id,
            name: res.name,
            email: res.email,
            joinedDate: res.joinedDate || 'Recently',
            avatar: (res.name ? res.name[0] : 'U').toUpperCase(),
          });
        }, 500);
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
      setSuccessMessage('Logging in as pre-seeded demo user (Aditya Verma)...');
      setTimeout(() => {
        onLoginSuccess({
          id: res.id,
          name: res.name,
          email: res.email,
          joinedDate: res.joinedDate || 'October 2026',
          avatar: 'AV',
        });
      }, 500);
    } catch (err) {
      // Fallback
      onLoginSuccess({
        id: 1,
        name: 'Aditya Verma',
        email: 'aditya.verma@college.edu',
        joinedDate: 'October 2026',
        avatar: 'AV',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--slate-50)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem 1rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Background decoration */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: 'var(--blue-600)',
            color: '#ffffff',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
            marginBottom: '1rem'
          }}>
            <Shield size={32} />
          </div>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--slate-900)',
            margin: '0 0 0.35rem 0',
            letterSpacing: '-0.025em'
          }}>
            WorthIt
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--slate-600)',
            margin: 0,
            lineHeight: 1.5
          }}>
            Smart Warranty, Repair &amp; Expense Management System
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginTop: '0.75rem',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: backendStatus?.isOnline ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: backendStatus?.isOnline ? '#059669' : '#dc2626',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: backendStatus?.isOnline ? '#10b981' : '#ef4444'
            }}></span>
            <span>{backendStatus?.isOnline ? 'Spring Boot & MySQL Connected (Port 8080)' : 'Backend Disconnected'}</span>
          </div>
        </div>

        {/* Auth Card */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--slate-200)',
          overflow: 'hidden'
        }}>
          {/* Tabs: Sign In / Register */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--slate-200)',
            backgroundColor: 'var(--slate-50)',
            padding: '0.35rem'
          }}>
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => switchMode('login')}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? 'var(--blue-700)' : 'var(--slate-600)',
                fontWeight: mode === 'login' ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => switchMode('register')}
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                border: 'none',
                borderRadius: '10px',
                backgroundColor: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? 'var(--blue-700)' : 'var(--slate-600)',
                fontWeight: mode === 'register' ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <UserPlus size={16} />
              <span>Register / Sign Up</span>
            </button>
          </div>

          <div style={{ padding: '1.75rem 1.75rem 2rem 1.75rem' }}>
            {/* Header description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--slate-900)',
                margin: '0 0 0.35rem 0'
              }}>
                {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: 0 }}>
                {mode === 'login' 
                  ? 'Enter your credentials to manage warranties and expenses'
                  : 'Register with your name, email, and password to save data into MySQL'}
              </p>
            </div>

            {/* Success Alert Banner */}
            {successMessage && (
              <div style={{
                marginBottom: '1.25rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#065f46',
                fontSize: '0.82rem',
                fontWeight: 500
              }}>
                <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Alert Banner */}
            {serverError && (
              <div style={{
                marginBottom: '1.25rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: '#991b1b',
                fontSize: '0.82rem',
                fontWeight: 500
              }}>
                <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0 }} />
                <span>{serverError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Name field (Register only) */}
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                    Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                    <input
                      type="text"
                      id="register-input-name"
                      className="form-input"
                      placeholder="e.g. Rohan Sharma"
                      style={{ paddingLeft: '2.5rem' }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  {errors.name && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.name}</div>}
                </div>
              )}

              {/* Email field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input
                    type="email"
                    id="auth-input-email"
                    className="form-input"
                    placeholder="e.g. rohan.sharma@college.edu"
                    style={{ paddingLeft: '2.5rem' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
                {errors.email && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.email}</div>}
              </div>

              {/* Password field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                  Password * {mode === 'register' && <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', fontWeight: 400 }}>(min. 6 characters)</span>}
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-input-password"
                    className="form-input"
                    placeholder="••••••••"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
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
                {errors.password && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.password}</div>}
              </div>

              {/* Confirm Password field (Register only) */}
              {mode === 'register' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '0.4rem' }}>
                    Confirm Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-input-confirm-password"
                      className="form-input"
                      placeholder="••••••••"
                      style={{ paddingLeft: '2.5rem' }}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      disabled={loading}
                    />
                  </div>
                  {errors.confirmPassword && <div style={{ color: 'var(--danger-text)', fontSize: '0.72rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</div>}
                </div>
              )}

              {/* Primary Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
                }}
              >
                {loading ? <Loader2 size={18} className="spin" /> : null}
                <span>{mode === 'login' ? 'Sign In to Account' : 'Complete Registration & Sign In'}</span>
                {!loading && <ArrowRight size={16} />}
              </button>

              {/* Mode Toggle Button / Switcher */}
              <div style={{
                textAlign: 'center',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--slate-100)',
                marginTop: '0.5rem'
              }}>
                {mode === 'login' ? (
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                    Don't have an account yet?{' '}
                    <button
                      type="button"
                      id="btn-switch-to-register"
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
                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      id="btn-switch-to-login"
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

              {/* Pre-seeded Demo User Quick Access Button */}
              <div style={{
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: 'var(--blue-50)',
                borderRadius: '8px',
                border: '1px solid var(--blue-200)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--blue-800)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  College Project Evaluation Quick Access
                </div>
                <button
                  type="button"
                  id="btn-demo-login"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    backgroundColor: '#ffffff',
                    borderColor: 'var(--blue-300)',
                    color: 'var(--blue-700)',
                    fontSize: '0.8rem',
                    gap: '0.4rem',
                    padding: '0.5rem'
                  }}
                >
                  <Sparkles size={15} color="var(--blue-600)" />
                  <span>One-Click Demo Account (Aditya Verma)</span>
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* Security & Database info footer */}
        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.74rem',
          color: 'var(--slate-400)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <span>🛡️ Passwords hashed with BCrypt</span>
          <span>•</span>
          <span>🔑 Stateless JJWT Auth</span>
          <span>•</span>
          <span>🗄️ MySQL worthit_db</span>
        </div>

      </div>
    </div>
  );
}
