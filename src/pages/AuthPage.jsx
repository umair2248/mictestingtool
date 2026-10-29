import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setFormData(initialForm);
    setErrors({});
    setStatusMessage('');
  }, [initialMode]);

  const validateForm = (values, currentMode) => {
    const nextErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!values.password) {
      nextErrors.password = 'Password is required.';
    } else if (values.password.length < 8) {
      nextErrors.password = 'Use at least 8 characters.';
    } else if (!/[A-Z]/.test(values.password) || !/[0-9]/.test(values.password) || !/[!@#$%^&*]/.test(values.password)) {
      nextErrors.password = 'Include an uppercase letter, a number, and a symbol.';
    }

    if (currentMode === 'register') {
      if (!values.name.trim()) {
        nextErrors.name = 'Full name is required.';
      } else if (values.name.trim().length < 2) {
        nextErrors.name = 'Please enter your full name.';
      }

      if (!values.confirmPassword) {
        nextErrors.confirmPassword = 'Please confirm your password.';
      } else if (values.confirmPassword !== values.password) {
        nextErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValues = { ...formData, [name]: value };
    setFormData(nextValues);
    setErrors(validateForm(nextValues, mode));
    setStatusMessage('');
  };

  const onLoginSuccess = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      setStatusMessage('Logged in successfully!');
      console.info('Login success', data);
      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSuccess = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (error) throw error;

      setStatusMessage('Registration successful! Check your email if confirmation is required.');
      console.info('Register success', data);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Social Login Handler
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      setStatusMessage(error.message);
      setLoading(false);
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm(formData, mode);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatusMessage('Please resolve the highlighted issues first.');
      return;
    }

    if (mode === 'login') {
      onLoginSuccess();
    } else {
      onRegisterSuccess();
    }
  };

  const toggleMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setStatusMessage('');
    navigate(nextMode === 'login' ? '/login' : '/signup');
  };

  const isRegister = mode === 'register';

  const summaryText = useMemo(() => (
    isRegister
      ? 'Create your secure workspace and begin testing with calm precision.'
      : 'Welcome back. Continue your testing workflow in a private, distraction-free space.'
  ), [isRegister]);

  if (!supabase) return <section className="content-page"><h1>{isRegister ? 'Account registration unavailable' : 'Account sign-in unavailable'}</h1><p>Accounts are currently disabled. You can use the microphone tester and read all guides without signing in.</p><a href="/">Open the microphone tester</a></section>;

  return (
    <div style={styles.page}>
      <style>{`
        * { box-sizing: border-box; }
        body { background: #04070C !important; }
        .auth-shell { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 24px; align-items: center; }
        .auth-panel { background: linear-gradient(145deg, rgba(13,19,33,0.85), rgba(7,10,18,0.95)); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 30px 80px rgba(0,0,0,0.5); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-radius: 28px; overflow: hidden; }
        .auth-input { width: 100%; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #f4f7fb; border-radius: 14px; padding: 14px 16px 14px 46px; outline: none; transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); font-size: 14px; }
        .auth-input:focus { border-color: #2563EB; background: rgba(37,99,235,0.03); box-shadow: 0 0 0 3px rgba(37,99,235,0.2); }
        .auth-tab-btn { flex: 1; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #8fa2bf; border-radius: 999px; padding: 10px 14px; cursor: pointer; transition: all 0.25s ease; font-weight: 500; font-size: 14px; }
        .auth-tab-btn.active { background: rgba(37,99,235,0.2); color: #fff; border-color: rgba(37,99,235,0.4); box-shadow: 0 4px 16px rgba(37,99,235,0.2); }
        
        .social-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); color: #f3f4f6; padding: 13px; border-radius: 14px; font-weight: 500; font-size: 14px; cursor: pointer; transition: all 0.25s ease; width: 100%; }
        .social-btn:hover { background: rgba(255, 255, 255, 0.07); border-color: rgba(255, 255, 255, 0.18); transform: translateY(-1.5px); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }

        .auth-divider { display: flex; align-items: center; text-align: center; color: #6b7280; font-size: 12.5px; margin: 4px 0; text-transform: uppercase; letter-spacing: 0.05em; }
        .auth-divider::before, .auth-divider::after { content: ''; flex: 1; border-bottom: 1px solid rgba(255, 255, 255, 0.07); }
        .auth-divider span { padding: 0 12px; }

        @media (max-width: 900px) { .auth-shell { grid-template-columns: 1fr; } }
      `}</style>

      <div className="auth-shell" style={styles.shell}>
        {/* Left Hero Brand Panel */}
        <section className="auth-panel" style={styles.heroPanel}>
          <div style={styles.badge}><ShieldCheck size={14} style={{ marginRight: '6px' }} /> Secure Access</div>
          <h1 style={styles.heroTitle}>Private workspace for your microphone testing.</h1>
          <p style={styles.heroText}>{summaryText}</p>

          <div style={styles.benefitBox}>
            <div style={styles.benefitIcon}><ShieldCheck size={18} /></div>
            <div>
              <h3 style={styles.benefitTitle}>Protected by design</h3>
              <p style={styles.benefitText}>Modern, quiet UI patterns built for absolute focus and reliability.</p>
            </div>
          </div>
        </section>

        {/* Right Form Interactive Panel */}
        <section className="auth-panel" style={styles.formPanel}>
          <div style={styles.tabs}>
            <button type="button" className={`auth-tab-btn ${!isRegister ? 'active' : ''}`} onClick={() => toggleMode('login')}>
              Login
            </button>
            <button type="button" className={`auth-tab-btn ${isRegister ? 'active' : ''}`} onClick={() => toggleMode('register')}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formHeading}>
              <h2 style={styles.formTitle}>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
              <p style={styles.formSubtitle}>{isRegister ? 'Start your high-performance testing experience.' : 'Sign in securely to continue your session.'}</p>
            </div>

            {/* Google Quick Social Auth Button */}
            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              className="social-btn"
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.8-2.5 1.3-4.3 1.3-3.1 0-5.8-2.3-6.7-5.3L1.6 15.6C3.5 19.4 7.4 23 12 23z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="auth-divider">
              <span>or email</span>
            </div>

            {isRegister && (
              <div style={styles.fieldWrap}>
                <User size={16} style={styles.icon} />
                <input
                  className="auth-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                />
                {errors.name && <span style={styles.errorText}>{errors.name}</span>}
              </div>
            )}

            <div style={styles.fieldWrap}>
              <Mail size={16} style={styles.icon} />
              <input
                className="auth-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.fieldWrap}>
              <Lock size={16} style={styles.icon} />
              <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              <button type="button" style={styles.eyeButton} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            {isRegister && (
              <div style={styles.fieldWrap}>
                <Lock size={16} style={styles.icon} />
                <input
                  className="auth-input"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                <button type="button" style={styles.eyeButton} onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
              </div>
            )}

            {statusMessage && (
              <div style={styles.statusBox}>{statusMessage}</div>
            )}

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Processing...' : (isRegister ? 'Create account' : 'Sign in')}
              {!loading && <ArrowRight size={16} style={{ marginLeft: '8px' }} />}
            </button>

            <p style={styles.footnote}>
              {isRegister ? 'Already have an account?' : 'Need a new account?'}{' '}
              <button type="button" style={styles.inlineLink} onClick={() => toggleMode(isRegister ? 'login' : 'register')}>
                {isRegister ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 15% 15%, rgba(37,99,235,0.18), transparent 35%), #04070C',
    padding: '32px 20px',
    color: '#f5f7fb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shell: {
    width: '100%',
    maxWidth: '1140px',
  },
  heroPanel: {
    padding: '48px',
    minHeight: '580px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    width: 'fit-content',
    padding: '8px 14px',
    borderRadius: '999px',
    background: 'rgba(37,99,235,0.12)',
    color: '#93c5fd',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '20px',
    border: '1px solid rgba(37,99,235,0.25)',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 2.8vw, 2.6rem)',
    lineHeight: 1.18,
    fontWeight: 700,
    marginBottom: '14px',
    color: '#fff',
  },
  heroText: {
    color: '#9ca3af',
    maxWidth: '480px',
    lineHeight: 1.7,
    fontSize: '1rem',
    marginBottom: '28px',
  },
  benefitBox: {
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    padding: '18px 20px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  benefitIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(37,99,235,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#93c5fd',
    flexShrink: 0,
  },
  benefitTitle: {
    color: '#fff',
    marginBottom: '4px',
    fontSize: '15px',
    fontWeight: 600,
  },
  benefitText: {
    color: '#9ca3af',
    fontSize: '13.5px',
    lineHeight: 1.5,
  },
  formPanel: {
    padding: '36px',
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formHeading: {
    marginBottom: '2px',
  },
  formTitle: {
    fontSize: '1.45rem',
    color: '#fff',
    fontWeight: 700,
    marginBottom: '4px',
  },
  formSubtitle: {
    fontSize: '0.9rem',
    color: '#9ca3af',
  },
  fieldWrap: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  icon: {
    position: 'absolute',
    left: '16px',
    top: '15px',
    color: '#6b7280',
    pointerEvents: 'none',
  },
  eyeButton: {
    position: 'absolute',
    right: '14px',
    top: '13px',
    background: 'transparent',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px',
  },
  errorText: {
    color: '#f87171',
    fontSize: '12px',
    marginLeft: '4px',
    fontWeight: 500,
  },
  statusBox: {
    padding: '12px 14px',
    borderRadius: '12px',
    background: 'rgba(37,99,235,0.12)',
    border: '1px solid rgba(37,99,235,0.3)',
    color: '#93c5fd',
    fontSize: '13px',
    fontWeight: 500,
  },
  submitButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 16px',
    borderRadius: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '14.5px',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(37,99,235,0.3)',
    transition: 'all 0.25s ease',
  },
  footnote: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.9rem',
    marginTop: '4px',
  },
  inlineLink: {
    background: 'transparent',
    border: 'none',
    color: '#93c5fd',
    cursor: 'pointer',
    padding: 0,
    fontWeight: 600,
  },
};
