import { useState } from 'react';
import './Auth.css';

// ─────────────────────────────────────────────────
//  SHARED: Logo
// ─────────────────────────────────────────────────
function AuthLogo({ onNavigate }) {
  return (
    <div className="auth-logo" onClick={() => onNavigate('home')} id="auth-logo">
      <div className="auth-logo-icon">🛍️</div>
      <span className="auth-logo-text">
        Shop<span>Nova</span>
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  SHARED: Toast Notification
// ─────────────────────────────────────────────────
function Toast({ message, type }) {
  if (!message) return null;
  return (
    <div className={`auth-toast ${type}`} id="auth-toast">
      <span>{type === 'success' ? '✅' : '❌'}</span>
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────────
//  SHARED: Password Strength Meter
// ─────────────────────────────────────────────────
function PasswordStrength({ password }) {
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8)               score++;
    if (/[A-Z]/.test(pwd))             score++;
    if (/[0-9]/.test(pwd))             score++;
    if (/[^A-Za-z0-9]/.test(pwd))      score++;
    return score;
  };

  const score = getStrength(password);
  const levels = [
    { label: '',         color: 'transparent', width: '0%'   },
    { label: 'Weak',     color: '#EF4444',     width: '25%'  },
    { label: 'Fair',     color: '#F59E0B',     width: '50%'  },
    { label: 'Good',     color: '#10B981',     width: '75%'  },
    { label: 'Strong',   color: '#6C3CE1',     width: '100%' },
  ];
  const level = levels[score] || levels[0];

  if (!password) return null;
  return (
    <div>
      <div className="strength-bar">
        <div className="strength-fill" style={{ width: level.width, background: level.color }} />
      </div>
      <div className="strength-label" style={{ color: level.color }}>{level.label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  LOGIN PAGE
//  Props: onNavigate, onLogin
// ─────────────────────────────────────────────────
export function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [toast, setToast]       = useState(null);

  const validate = () => {
    const e = {};
    if (!email)                                  e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email))        e.email    = 'Enter a valid email';
    if (!password)                               e.password = 'Password is required';
    else if (password.length < 6)               e.password = 'Min 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setToast({ message: 'Login successful! Welcome back 👋', type: 'success' });
    setTimeout(() => { setToast(null); onLogin({ email, name: email.split('@')[0] }); }, 1500);
  };

  return (
    <div className="auth-page" id="login-page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <AuthLogo onNavigate={onNavigate} />

      <div className="auth-card">
        <h1 className="auth-card-title">Welcome back 👋</h1>
        <p className="auth-card-subtitle">Sign in to continue to ShopNova</p>

        {/* Social Login */}
        <div className="auth-social">
          <button className="social-btn" id="google-login-btn" type="button">
            <span className="social-icon">🔵</span> Google
          </button>
          <button className="social-btn" id="facebook-login-btn" type="button">
            <span className="social-icon">📘</span> Facebook
          </button>
        </div>

        <div className="auth-divider"><span>or sign in with email</span></div>

        <form className="auth-form" onSubmit={handleSubmit} id="login-form" noValidate>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">📧</span>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="field-error">⚠ {errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-toggle"
                id="toggle-login-pwd"
                onClick={() => setShowPwd(s => !s)}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="field-error">⚠ {errors.password}</span>}
          </div>

          {/* Options Row */}
          <div className="form-options">
            <label className="checkbox-wrap">
              <input type="checkbox" id="remember-me" />
              <span>Remember me</span>
            </label>
            <button
              type="button"
              className="forgot-link"
              id="forgot-pwd-link"
              onClick={() => onNavigate('forgot')}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className={`auth-submit ${loading ? 'loading' : ''}`}
            id="login-submit-btn"
            disabled={loading}
          >
            {loading
              ? <><div className="spinner" /> Signing in...</>
              : '🚀 Sign In'}
          </button>
        </form>

        <p className="auth-terms">
          By signing in, you agree to our{' '}
          <button type="button">Terms of Service</button> and{' '}
          <button type="button">Privacy Policy</button>.
        </p>
      </div>

      <p className="auth-switch">
        Don&apos;t have an account?
        <button id="go-register-btn" onClick={() => onNavigate('register')}>
          Create Account
        </button>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  REGISTER PAGE
//  Props: onNavigate, onLogin
// ─────────────────────────────────────────────────
export function RegisterPage({ onNavigate, onLogin }) {
  const [form, setForm]       = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState(false);
  const [toast, setToast]     = useState(null);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())                  e.firstName = 'Required';
    if (!form.lastName.trim())                   e.lastName  = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone || form.phone.length < 10)   e.phone     = 'Valid phone required';
    if (form.password.length < 6)                e.password  = 'Min 6 characters';
    if (form.confirm !== form.password)          e.confirm   = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    setSuccess(true);
    setToast({ message: 'Account created successfully! 🎉', type: 'success' });
    setTimeout(() => { setToast(null); onLogin({ email: form.email, name: form.firstName }); }, 2000);
  };

  if (success) {
    return (
      <div className="auth-page" id="register-success-page">
        <AuthLogo onNavigate={onNavigate} />
        <div className="auth-card">
          <div className="auth-success">
            <div className="success-icon-wrap">🎉</div>
            <h2>You&apos;re all set!</h2>
            <p>Account created for <strong style={{color:'#9B7FE8'}}>{form.email}</strong>. Redirecting…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page" id="register-page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <AuthLogo onNavigate={onNavigate} />

      <div className="auth-card">
        <h1 className="auth-card-title">Create Account ✨</h1>
        <p className="auth-card-subtitle">Join millions of ShopNova shoppers</p>

        {/* Social Signup */}
        <div className="auth-social">
          <button className="social-btn" id="google-register-btn" type="button">
            <span className="social-icon">🔵</span> Google
          </button>
          <button className="social-btn" id="facebook-register-btn" type="button">
            <span className="social-icon">📘</span> Facebook
          </button>
        </div>

        <div className="auth-divider"><span>or fill in your details</span></div>

        <form className="auth-form" onSubmit={handleSubmit} id="register-form" noValidate>
          {/* Name Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reg-firstname">First Name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input id="reg-firstname" type="text"
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="John" value={form.firstName} onChange={set('firstName')} />
              </div>
              {errors.firstName && <span className="field-error">⚠ {errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="reg-lastname">Last Name</label>
              <div className="input-wrap">
                <span className="input-icon">👤</span>
                <input id="reg-lastname" type="text"
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Doe" value={form.lastName} onChange={set('lastName')} />
              </div>
              {errors.lastName && <span className="field-error">⚠ {errors.lastName}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div className="input-wrap">
              <span className="input-icon">📧</span>
              <input id="reg-email" type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="you@example.com" value={form.email} onChange={set('email')} />
            </div>
            {errors.email && <span className="field-error">⚠ {errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="reg-phone">Phone Number</label>
            <div className="input-wrap">
              <span className="input-icon">📱</span>
              <input id="reg-phone" type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
            </div>
            {errors.phone && <span className="field-error">⚠ {errors.phone}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input id="reg-password" type={showPwd ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a strong password" value={form.password} onChange={set('password')} />
              <button type="button" className="input-toggle" id="toggle-reg-pwd"
                onClick={() => setShowPwd(s => !s)}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            <PasswordStrength password={form.password} />
            {errors.password && <span className="field-error">⚠ {errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔐</span>
              <input id="reg-confirm" type={showCfm ? 'text' : 'password'}
                className={`form-input ${errors.confirm ? 'error' : ''}`}
                placeholder="Repeat your password" value={form.confirm} onChange={set('confirm')} />
              <button type="button" className="input-toggle" id="toggle-reg-cfm"
                onClick={() => setShowCfm(s => !s)}>
                {showCfm ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirm && <span className="field-error">⚠ {errors.confirm}</span>}
          </div>

          {/* Terms */}
          <label className="checkbox-wrap">
            <input type="checkbox" id="agree-terms" required />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
              I agree to the <button type="button" style={{background:'none',border:'none',color:'#9B7FE8',cursor:'pointer',fontSize:13}}>Terms</button> &amp; <button type="button" style={{background:'none',border:'none',color:'#9B7FE8',cursor:'pointer',fontSize:13}}>Privacy Policy</button>
            </span>
          </label>

          <button type="submit"
            className={`auth-submit ${loading ? 'loading' : ''}`}
            id="register-submit-btn" disabled={loading}>
            {loading
              ? <><div className="spinner" /> Creating Account...</>
              : '🎉 Create My Account'}
          </button>
        </form>
      </div>

      <p className="auth-switch">
        Already have an account?
        <button id="go-login-btn" onClick={() => onNavigate('login')}>Sign In</button>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  FORGOT PASSWORD PAGE
//  Props: onNavigate
// ─────────────────────────────────────────────────
export function ForgotPasswordPage({ onNavigate }) {
  const [step, setStep]         = useState(1); // 1=email, 2=otp, 3=reset, 4=done
  const [email, setEmail]       = useState('');
  const [otp, setOtp]           = useState(['', '', '', '', '', '']);
  const [newPwd, setNewPwd]     = useState('');
  const [cfmPwd, setCfmPwd]     = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [toast, setToast]       = useState(null);

  /* ── OTP input handler ── */
  const handleOtp = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus();
    }
  };

  /* ── Step 1: Send OTP ── */
  const sendOtp = async (ev) => {
    ev.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setToast({ message: `OTP sent to ${email}`, type: 'success' });
    setTimeout(() => setToast(null), 2500);
    setStep(2);
  };

  /* ── Step 2: Verify OTP ── */
  const verifyOtp = async (ev) => {
    ev.preventDefault();
    const code = otp.join('');
    if (code.length < 6) { setError('Enter the full 6-digit OTP'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep(3);
  };

  /* ── Step 3: Reset Password ── */
  const resetPwd = async (ev) => {
    ev.preventDefault();
    if (newPwd.length < 6)        { setError('Min 6 characters'); return; }
    if (newPwd !== cfmPwd)        { setError('Passwords do not match'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setStep(4);
  };

  return (
    <div className="auth-page" id="forgot-page">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <AuthLogo onNavigate={onNavigate} />

      <div className="auth-card">
        {/* ── STEP 1: Email ── */}
        {step === 1 && (
          <>
            <button className="back-to-login" id="back-to-login-btn" onClick={() => onNavigate('login')}>
              ← Back to Login
            </button>
            <h1 className="auth-card-title">Forgot Password? 🔑</h1>
            <p className="auth-card-subtitle">Enter your email and we&apos;ll send you a reset OTP</p>
            <form className="auth-form" onSubmit={sendOtp} id="forgot-email-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Email Address</label>
                <div className="input-wrap">
                  <span className="input-icon">📧</span>
                  <input id="forgot-email" type="email"
                    className={`form-input ${error ? 'error' : ''}`}
                    placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {error && <span className="field-error">⚠ {error}</span>}
              </div>
              <button type="submit"
                className={`auth-submit ${loading ? 'loading' : ''}`}
                id="send-otp-btn" disabled={loading}>
                {loading ? <><div className="spinner" /> Sending...</> : '📨 Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 2: OTP Verify ── */}
        {step === 2 && (
          <>
            <button className="back-to-login" id="back-step1-btn" onClick={() => setStep(1)}>
              ← Change Email
            </button>
            <h1 className="auth-card-title">Verify OTP 🔐</h1>
            <p className="auth-card-subtitle">Enter the 6-digit code sent to <strong style={{color:'#9B7FE8'}}>{email}</strong></p>
            <form className="auth-form" onSubmit={verifyOtp} id="otp-form">
              <div className="otp-inputs">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtp(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              {error && <span className="field-error" style={{justifyContent:'center'}}>⚠ {error}</span>}
              <button type="submit"
                className={`auth-submit ${loading ? 'loading' : ''}`}
                id="verify-otp-btn" disabled={loading}>
                {loading ? <><div className="spinner" /> Verifying...</> : '✅ Verify OTP'}
              </button>
              <p style={{textAlign:'center', fontSize:13, color:'rgba(255,255,255,0.4)'}}>
                Didn&apos;t receive?{' '}
                <button type="button" style={{background:'none',border:'none',color:'#9B7FE8',cursor:'pointer',fontSize:13}} id="resend-otp-btn"
                  onClick={() => { setToast({message:'OTP resent!', type:'success'}); setTimeout(()=>setToast(null),2000); }}>
                  Resend OTP
                </button>
              </p>
            </form>
          </>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 3 && (
          <>
            <h1 className="auth-card-title">Set New Password 🔒</h1>
            <p className="auth-card-subtitle">Choose a strong new password for your account</p>
            <form className="auth-form" onSubmit={resetPwd} id="reset-form">
              <div className="form-group">
                <label htmlFor="new-pwd">New Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔒</span>
                  <input id="new-pwd" type={showPwd ? 'text' : 'password'}
                    className="form-input"
                    placeholder="New password"
                    value={newPwd} onChange={e => setNewPwd(e.target.value)} />
                  <button type="button" className="input-toggle" id="toggle-new-pwd"
                    onClick={() => setShowPwd(s => !s)}>{showPwd ? '🙈' : '👁️'}</button>
                </div>
                <PasswordStrength password={newPwd} />
              </div>
              <div className="form-group">
                <label htmlFor="cfm-pwd">Confirm New Password</label>
                <div className="input-wrap">
                  <span className="input-icon">🔐</span>
                  <input id="cfm-pwd" type="password"
                    className="form-input"
                    placeholder="Confirm new password"
                    value={cfmPwd} onChange={e => setCfmPwd(e.target.value)} />
                </div>
              </div>
              {error && <span className="field-error">⚠ {error}</span>}
              <button type="submit"
                className={`auth-submit ${loading ? 'loading' : ''}`}
                id="reset-submit-btn" disabled={loading}>
                {loading ? <><div className="spinner" /> Updating...</> : '🔄 Reset Password'}
              </button>
            </form>
          </>
        )}

        {/* ── STEP 4: Done ── */}
        {step === 4 && (
          <div className="auth-success">
            <div className="success-icon-wrap">✅</div>
            <h2>Password Reset!</h2>
            <p>Your password has been updated successfully.</p>
            <button className="auth-submit" id="go-login-after-reset"
              onClick={() => onNavigate('login')} style={{marginTop:0}}>
              🚀 Go to Login
            </button>
          </div>
        )}
      </div>

      {step !== 4 && (
        <p className="auth-switch">
          Remember your password?
          <button id="back-login-btn" onClick={() => onNavigate('login')}>Sign In</button>
        </p>
      )}
    </div>
  );
}
