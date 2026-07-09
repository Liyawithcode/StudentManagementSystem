import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { toast } from '../../utils/toast.js';
import './auth.css';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="auth-container flex items-center justify-center">
      <div className="auth-card card animate-fade-in">
        <h2 className="auth-title text-center">Reset Password</h2>
        <p className="auth-subtitle text-center">Please choose a strong new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-4">
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Min 6 characters"
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary" loading={loading} className="w-full">
            Save New Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
