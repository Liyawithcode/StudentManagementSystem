import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/slices/authSlice.js';
import Button from '../../components/common/Button.jsx';
import { authService } from '../../services/authService.js';
import { toast } from '../../utils/toast.js';
import {
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineClipboardList
} from 'react-icons/hi';
import './auth.css';

export const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const initialEmail = location.state?.email || '';
  const initialRole = location.state?.role || 'student';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !role) {
      return toast.error('Email, OTP, and Role are required');
    }
    setLoading(true);
    try {
      const res = await authService.verifyOtp(email, otp, role);
      if (res.success) {
        if (res.accessToken && res.user) {
          dispatch(setAuth({ user: res.user, accessToken: res.accessToken }));
          toast.success('Email verified and logged in successfully!');
          navigate('/dashboard');
        } else {
          toast.success('Email verified successfully! You can now log in.');
          navigate('/login');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || !role) {
      return toast.error('Email and Role are required to resend OTP');
    }
    setResending(true);
    try {
      const res = await authService.resendOtp(email, role);
      if (res.success) {
        toast.success(res.message || 'OTP resent successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
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
            <div className="brand-logo">S</div>
            <span className="brand-logo-text">SMS Portal</span>
          </div>
          
          <div className="brand-tag">Academic System</div>
          <h1 className="brand-title">Empowering Smart Education</h1>
          <p className="brand-subtitle">
            Welcome to the Student Management System. Access attendance records, grading history, academic performance metrics, and instant announcements in one unified portal.
          </p>
          
          <div className="features-list">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <HiOutlineChartBar />
              </div>
              <div className="feature-text">
                <h4>Analytics & Insights</h4>
                <p>Track grade curves, overall performance reports, and class attendance stats dynamically.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <HiOutlineBookOpen />
              </div>
              <div className="feature-text">
                <h4>Course Material & Exams</h4>
                <p>Manage curriculum, register subjects, and publish exam marks seamlessly.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <HiOutlineClipboardList />
              </div>
              <div className="feature-text">
                <h4>Notice & Communications</h4>
                <p>Receive live administrative circulars, fee statuses, and department announcements.</p>
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
          {/* Header branding visible only on Mobile/Tablet */}
          <div className="login-header-logo">
            <div className="brand-logo">S</div>
            <span>SMS Portal</span>
          </div>

          <div className="login-card animate-fade-in">
            <h2 className="auth-title text-center">Verify Email</h2>
            <p className="auth-subtitle text-center">Please enter the OTP verification code sent to your email.</p>

            <form onSubmit={handleSubmit}>
              {/* Email Input Group */}
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

              {/* OTP Code Input Group */}
              <div className="form-group">
                <label className="form-label" htmlFor="otp">OTP Code <span className="text-danger">*</span></label>
                <div className="input-group-custom">
                  <span className="input-icon-left">
                    <HiOutlineShieldCheck />
                  </span>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="input-custom"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Verify OTP
              </Button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-secondary w-full"
                  disabled={resending}
                  onClick={handleResend}
                >
                  {resending ? 'Resending...' : 'Resend OTP Code'}
                </button>
              </div>

              <p className="auth-footer-text text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                Want to try signing in again? <Link to="/login" style={{ fontWeight: 600 }}>Back to Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
