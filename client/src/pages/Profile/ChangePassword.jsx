import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { toast } from '../../utils/toast.js';

import { authService } from '../../services/authService.js';

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters long');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }
    setLoading(true);
    try {
      await authService.updateProfile({ newPassword });
      toast.success('Password updated successfully!');
      navigate('/profile');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Change Password" subtitle="Update portal credentials." />

      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>Save Password</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/profile')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
