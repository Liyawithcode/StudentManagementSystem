import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../redux/slices/authSlice.js';
import Button from '../../components/common/Button.jsx';
import { authService } from '../../services/authService.js';
import { toast } from '../../utils/toast.js';
import { auth, googleProvider, signInWithPopup } from '../../firebase/firebase.js';
import { FcGoogle } from 'react-icons/fc';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiCheckCircle,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineHome
} from 'react-icons/hi';
import './auth.css';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    adminfullname: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    const selectedRole = formData.role || 'student';
    setLoading(true);
    try {
      toast.info('Authenticating with Google...');
      let idToken;
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        idToken = await user.getIdToken();
      } catch (popupErr) {
        console.warn('Google popup sign-in failed or closed:', popupErr);
        if (import.meta.env.DEV) {
          toast.info('Google Auth unconfigured or failed in Firebase. Using Developer Mock Login...');
          idToken = 'mock_google_id_token';
        } else {
          throw popupErr;
        }
      }

      const backendRes = await authService.googleLogin(idToken, selectedRole);
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
        toast.error(backendRes.message || 'Google signup failed');
      }
    } catch (err) {
      console.error('Google signup failed:', err);
      toast.error(err.message || 'Google Sign-In failed or was cancelled');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (formData.role === 'admin') {
        res = await authService.registerAdmin({
          email: formData.email,
          password: formData.password,
          adminfullname: formData.adminfullname,
          phone: formData.phone,
        });
      } else if (formData.role === 'faculty') {
        res = await authService.registerTeacher({
          email: formData.email,
          password: formData.password,
          facultyfullname: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
        });
      } else {
        res = await authService.registerStudent({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      }

      if (res.success) {
        toast.success(res.message || 'Verification OTP sent to your email.');
        // Redirect to verify OTP passing email & role
        navigate('/verify-otp', { state: { email: formData.email, role: formData.role } });
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
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
            <h2 className="auth-title text-center">IntelliCampus Registration</h2>
            <p className="auth-subtitle text-center">Create a portal account to join IntelliCampus.</p>

            <form onSubmit={handleSubmit}>

              {/* Role Selection Interactive Cards */}
              <div className="form-group">
                <label className="form-label">Registering As <span className="text-danger">*</span></label>
                <div className="role-cards-grid">
                  <div
                    className={`role-card ${formData.role === 'student' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                  >
                    <div className="role-card-icon">
                      <FaUserGraduate />
                    </div>
                    <span className="role-card-label">Student</span>
                    {formData.role === 'student' && (
                      <span className="role-card-check">
                        <HiCheckCircle />
                      </span>
                    )}
                  </div>

                  <div
                    className={`role-card ${formData.role === 'faculty' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'faculty' })}
                  >
                    <div className="role-card-icon">
                      <FaChalkboardTeacher />
                    </div>
                    <span className="role-card-label">Faculty</span>
                    {formData.role === 'faculty' && (
                      <span className="role-card-check">
                        <HiCheckCircle />
                      </span>
                    )}
                  </div>

                  <div
                    className={`role-card ${formData.role === 'admin' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                  >
                    <div className="role-card-icon">
                      <FaUserShield />
                    </div>
                    <span className="role-card-label">Admin</span>
                    {formData.role === 'admin' && (
                      <span className="role-card-check">
                        <HiCheckCircle />
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {formData.role === 'admin' ? (
                /* Full Name Input Group */
                <div className="form-group">
                  <label className="form-label" htmlFor="adminfullname">Full Name <span className="text-danger">*</span></label>
                  <div className="input-group-custom">
                    <span className="input-icon-left">
                      <HiOutlineUser />
                    </span>
                    <input
                      type="text"
                      id="adminfullname"
                      name="adminfullname"
                      value={formData.adminfullname}
                      onChange={handleChange}
                      placeholder="e.g. Administrator Fullname"
                      className="input-custom"
                      required
                    />
                  </div>
                </div>
              ) : (
                /* First & Last Name Input Group */
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label" htmlFor="firstName">First Name <span className="text-danger">*</span></label>
                    <div className="input-group-custom">
                      <span className="input-icon-left">
                        <HiOutlineUser />
                      </span>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="input-custom"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="lastName">Last Name <span className="text-danger">*</span></label>
                    <div className="input-group-custom">
                      <span className="input-icon-left">
                        <HiOutlineUser />
                      </span>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="input-custom"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

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
                    value={formData.email}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
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

              {/* Phone Number Input Group */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number</label>
                <div className="input-group-custom">
                  <span className="input-icon-left">
                    <HiOutlinePhone />
                  </span>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Optional telephone number"
                    className="input-custom"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full">
                Submit Registration
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.25rem 0', color: 'var(--text-muted)' }}>
                <span style={{ borderBottom: '1px solid var(--border-color)', flex: 1 }}></span>
                <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: 600 }}>OR</span>
                <span style={{ borderBottom: '1px solid var(--border-color)', flex: 1 }}></span>
              </div>

              <button
                type="button"
                className="btn btn-secondary w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
              >
                <FcGoogle style={{ fontSize: '1.25rem' }} /> Sign up with Google
              </button>

              <p className="auth-footer-text text-center mt-4" style={{ color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign In</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
