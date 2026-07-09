import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { toast } from '../../utils/toast.js';
import { authService } from '../../services/authService.js';
import './auth.css';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    <div className="auth-container flex items-center justify-center">
      <div className="auth-card card animate-fade-in">
        <h2 className="auth-title text-center">Forgot Password</h2>
        <p className="auth-subtitle text-center font-medium opacity-80 mt-1">
          {step === 1
            ? "Enter your email address and we'll send you a password recovery code."
            : "Enter the 6-digit OTP code sent to your email and your new password."}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="mt-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="example@school.com"
            />

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-4">
              Send Reset OTP
            </Button>

            <p className="auth-footer-text text-center mt-4">
              Remembered password? <Link to="/login">Sign In</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-4 flex flex-col gap-3">
            <Input
              label="Email Address"
              type="email"
              value={email}
              disabled
              required
            />

            <Input
              label="OTP Verification Code"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="123456"
            />

            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />

            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-1/3"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-2/3"
              >
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
