import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';
import { toast } from '../../utils/toast.js';
import { authService } from '../../services/authService.js';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineKey,
  HiOutlineHome,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineClipboardList
} from 'react-icons/hi';
import './auth.css';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error('Please enter your email address');
    }
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      if (res.success) {
        toast.success(res.message || 'Reset OTP sent to your email!');
        setStep(2);
      } else {
        toast.error(res.message || 'Failed to send recovery OTP');
      }
    } catch (err) {
      toast.error(err.message || 'Error requesting reset OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !password || !confirmPassword) {
      return toast.error('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }

    setLoading(true);
    try {
      const res = await authService.resetPassword(email, otp, password);
      if (res.success) {
        toast.success(res.message || 'Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(res.message || 'Failed to reset password');
      }
    } catch (err) {
      toast.error(err.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      {/* Left Branding Pane */}
      <div className="login-left">
        <div className="left-bg-glow"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="brand-content animate-fade-in">
          <div className="brand-logo-container">
            <div className="brand-logo">I</div>
            <span className="brand-logo-text">IntelliCampus Portal</span>
          </div>

          <div className="brand-tag">Account Security</div>
          <h1 className="brand-title">Recover Portal Access</h1>
          <p className="brand-subtitle">
            Reset your password securely. Enter your registered institutional email to receive a 6-digit verification passkey.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <HiOutlineShieldCheck />
              </div>
              <div className="feature-text">
                <h4>Secure Identity Verification</h4>
                <p>One-Time Passwords (OTP) are encrypted and delivered instantly to your registered inbox.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <HiOutlineBookOpen />
              </div>
              <div className="feature-text">
                <h4>Unified Portal Credentials</h4>
                <p>Use your updated password to sign in across Student, Faculty, and Admin modules.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="login-right">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="login-form-container">
          {/* Back to Homepage Button */}
          <div className="back-home-wrapper">
            <Link to="/" className="back-home-btn">
              <HiOutlineHome />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* Mobile Header Branding */}
          <div className="login-header-logo">
            <div className="brand-logo">I</div>
            <span>IntelliCampus Portal</span>
          </div>

          <div className="login-card animate-fade-in">
            <h2 className="auth-title text-center">
              {step === 1 ? 'Forgot Password' : 'Reset Password'}
            </h2>
            <p className="auth-subtitle text-center">
              {step === 1
                ? "Enter your email address and we'll send you a password recovery code."
                : "Enter the 6-digit OTP code sent to your email and your new password."}
            </p>

            {step === 1 ? (
              <form onSubmit={handleRequestOtp}>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <span className="input-icon-left">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@school.com"
                      className="input-custom"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" loading={loading} className="w-full mt-4">
                  Send Reset OTP
                </Button>

                <p className="auth-footer-text text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                  Remembered your password? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
                </p>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Email Address</label>
                  <div className="input-group-custom">
                    <span className="input-icon-left">
                      <HiOutlineMail />
                    </span>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="input-custom"
                      style={{ opacity: 0.75, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="otp">OTP Verification Code <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <span className="input-icon-left">
                      <HiOutlineKey />
                    </span>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="input-custom"
                      required
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="password">New Password <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <span className="input-icon-left">
                      <HiOutlineLockClosed />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-custom input-custom-has-right"
                      required
                    />
                    <button
                      type="button"
                      className="input-icon-right"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                    </button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="confirmPassword">Confirm New Password <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <span className="input-icon-left">
                      <HiOutlineLockClosed />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-custom input-custom-has-right"
                      required
                    />
                    <button
                      type="button"
                      className="input-icon-right"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(1)}
                    style={{ flex: '1' }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    style={{ flex: '2' }}
                  >
                    Reset Password
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

