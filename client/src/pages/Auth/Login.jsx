import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser, setAuth } from '../../redux/slices/authSlice.js';
import Button from '../../components/common/Button.jsx';
import { toast } from '../../utils/toast.js';
import { FcGoogle } from 'react-icons/fc';
import { authService } from '../../services/authService.js';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import { auth, googleProvider, signInWithPopup, db } from '../../firebase/firebase.js';
import { getAdditionalUserInfo } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiCheckCircle,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineHome
} from 'react-icons/hi';
import './auth.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please enter both email and password');
    }
    setLoading(true);
    try {
      const resultAction = await dispatch(loginUser({ email, password, role }));
      if (loginUser.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;
        if (payload?.requiresOtp) {
          toast.success(payload.message || 'Verification OTP sent to your email.');
          navigate('/verify-otp', { state: { email: payload.email, role: payload.role || role } });
        } else {
          toast.success('Logged in successfully!');
          navigate('/dashboard');
        }
      } else {
        toast.error(resultAction.payload || 'Login failed');
      }
    } catch (err) {
      toast.error(err.message || 'Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  const completeBackendLogin = async (user, isNewUser) => {
    setLoading(true);
    setLoadingText('Syncing profile details…');

    if (!user.isMock) {
      // Save/Update user profile in Firestore (non-blocking)
      const userRef = doc(db, 'users', user.uid);
      const profileData = {
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email,
        profilePhoto: user.photoURL || '',
        loginProvider: 'google',
        lastLogin: serverTimestamp()
      };

      if (isNewUser) {
        profileData.createdAt = serverTimestamp();
      }

      setDoc(userRef, profileData, { merge: true })
        .then(() => {
          console.log('Firestore profile sync successful');
        })
        .catch((firestoreErr) => {
          console.error('Firestore profile sync failed:', firestoreErr);
        });
    } else {
      console.log('Skipping Firestore sync for mock developer login.');
    }

    setLoadingText('Authenticating securely...');
    try {
      const idToken = await user.getIdToken();
      const backendRes = await authService.googleLogin(idToken, role || 'student');

      if (backendRes.success) {
        if (backendRes.requiresOtp) {
          toast.success(backendRes.message || 'Verification OTP sent to your email.');
          navigate('/verify-otp', { state: { email: backendRes.email, role: backendRes.role } });
        } else {
          dispatch(setAuth({ user: backendRes.user, accessToken: backendRes.accessToken }));
          toast.success('Logged in with Google successfully!');
          navigate('/dashboard');
        }
      } else {
        toast.error(backendRes.message || 'Google login failed');
      }
    } catch (backendErr) {
      toast.error(backendErr.message || 'Backend authentication failed.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setLoadingText('Verifying your identity…');

    // Display helper text if login takes time
    const phonePromptTimer = setTimeout(() => {
      setLoadingText("Check your phone to confirm it's you.");
    }, 4000);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      clearTimeout(phonePromptTimer);

      const user = result.user;
      const additionalInfo = getAdditionalUserInfo(result);
      const isNewUser = additionalInfo?.isNewUser;

      await completeBackendLogin(user, isNewUser);
    } catch (err) {
      clearTimeout(phonePromptTimer);
      console.warn('Firebase Google Sign-In failed or popup was closed:', err);

      // In development mode, automatically fallback to mock login if Firebase Google Auth is unconfigured or fails
      if (import.meta.env.DEV) {
        toast.info('Google Auth unconfigured or failed in Firebase. Using Developer Mock Login...');
        const mockUser = {
          uid: 'mock_google_uid',
          displayName: `Mock Google ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          email: `google_${role}_test@example.com`,
          photoURL: '',
          getIdToken: async () => 'mock_google_id_token',
          isMock: true
        };
        await completeBackendLogin(mockUser, true);
        return;
      }

      // Detailed error handling for production
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        toast.error('Google Sign-In was cancelled or popup closed.');
      } else if (err.code === 'auth/network-request-failed') {
        toast.error('Network error: Please check your internet connection.');
      } else if (err.code === 'auth/unauthorized-domain') {
        toast.error('Unauthorized domain: This domain is not configured in Firebase Console.');
      } else if (err.code === 'auth/invalid-oauth-client-id') {
        toast.error('OAuth Client ID error: Please enable Google Provider in Firebase Console.');
      } else {
        toast.error(err.message || 'Firebase authentication error.');
      }
    } finally {
      setLoading(false);
      setLoadingText('');
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

          <div className="brand-tag">Academic System</div>
          <h1 className="brand-title">Empowering Smart Education</h1>
          <p className="brand-subtitle">
            Welcome to IntelliCampus. Access attendance records, grading history, academic performance metrics, and instant announcements in one unified portal.
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
          {/* Back to Homepage Button */}
          <div className="back-home-wrapper">
            <Link to="/" className="back-home-btn">
              <HiOutlineHome />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* Header branding visible only on Mobile/Tablet */}
          <div className="login-header-logo">
            <div className="brand-logo">I</div>
            <span>IntelliCampus Portal</span>
          </div>

          <div className="login-card animate-fade-in">
            <h2 className="auth-title text-center">IntelliCampus Login</h2>
            <p className="auth-subtitle text-center">Welcome back! Please access your portal credentials.</p>

            <form onSubmit={handleSubmit}>

              {/* Role Selection Interactive Cards */}
              <div className="form-group">
                <label className="form-label">Select Portal Role <span className="text-danger">*</span></label>
                <div className="role-cards-grid">
                  <div
                    className={`role-card ${role === 'student' ? 'active' : ''}`}
                    onClick={() => setRole('student')}
                  >
                    <div className="role-card-icon">
                      <FaUserGraduate />
                    </div>
                    <span className="role-card-label">Student</span>
                    {role === 'student' && (
                      <span className="role-card-check">
                        <HiCheckCircle />
                      </span>
                    )}
                  </div>

                  <div
                    className={`role-card ${role === 'faculty' ? 'active' : ''}`}
                    onClick={() => setRole('faculty')}
                  >
                    <div className="role-card-icon">
                      <FaChalkboardTeacher />
                    </div>
                    <span className="role-card-label">Faculty</span>
                    {role === 'faculty' && (
                      <span className="role-card-check">
                        <HiCheckCircle />
                      </span>
                    )}
                  </div>

                  <div
                    className={`role-card ${role === 'admin' ? 'active' : ''}`}
                    onClick={() => setRole('admin')}
                  >
                    <div className="role-card-icon">
                      <FaUserShield />
                    </div>
                    <span className="role-card-label">Admin</span>
                    {role === 'admin' && (
                      <span className="role-card-check">
                        <HiCheckCircle />
                      </span>
                    )}
                  </div>
                </div>
              </div>

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
                    placeholder="Enter your email"
                    className="input-custom"
                    required
                  />
                </div>
              </div>

              {/* Password Input Group */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password <span className="text-danger">*</span></label>
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

              <div className="flex justify-between items-center mb-4" style={{ fontSize: '0.875rem' }}>
                <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
                  <input type="checkbox" style={{ cursor: 'pointer' }} /> Remember me
                </label>
                <Link to="/forgot-password" style={{ fontWeight: 500 }}>Forgot password?</Link>
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Sign In
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.25rem 0', color: 'var(--text-muted)' }}>
                <span style={{ borderBottom: '1px solid var(--border-color)', flex: 1 }}></span>
                <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: 600 }}>OR</span>
                <span style={{ borderBottom: '1px solid var(--border-color)', flex: 1 }}></span>
              </div>

              <Button
                variant="secondary"
                loading={loading}
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
              >
                {!loading && <FcGoogle style={{ fontSize: '1.25rem' }} />} Continue with Google
              </Button>
              <p className="auth-footer-text text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                New user? <Link to="/register" style={{ fontWeight: 600 }}>Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Styled Inline Keyframes for Overlay Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
      `}</style>

      {/* Modern, Securing & Loading Glassmorphic Overlay Screen */}
      {loading && loadingText && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            transition: 'all 0.3s ease',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '3rem 2.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Pulsing Ring Container */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: '#f8fafc',
                boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                marginBottom: '1.5rem',
                position: 'relative'
              }}
            >
              <FcGoogle style={{ fontSize: '2.5rem' }} />
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '2px solid #4f46e5',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  opacity: 0.75
                }}
              />
            </div>

            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '0.75rem',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              {loadingText}
            </h3>

            <p
              style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '2rem'
              }}
            >
              {loadingText === "Check your phone to confirm it's you."
                ? "Google has sent a notification to your registered Android device. Tap 'Yes, it's me' to continue."
                : "Please wait a moment while we process your request securely."}
            </p>

            {/* Spinner */}
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid #e2e8f0',
                borderTopColor: '#4f46e5',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
