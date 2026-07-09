import React from 'react';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { Link } from 'react-router-dom';
import { FiLock, FiUser } from 'react-icons/fi';

export const Profile = () => {
  const { user, role } = useAuth();

  return (
    <div>
      <Header
        title="My Account Settings"
        subtitle="Manage your personal contact details and password credentials."
      />

      <div className="card mt-4 flex items-center justify-between flex-responsive">
        <div className="flex items-center gap-4 flex-responsive">
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}
          >
            <FiUser />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 600 }}>
              {user?.adminfullname || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Portal User'}
            </h3>
            <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>{role} Portal</span>
          </div>
        </div>

        <Link to="/profile/change-password">
          <Button variant="secondary"><FiLock /> Change Password</Button>
        </Link>
      </div>

      <div className="card mt-6" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Personal Details
        </h4>
        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
            <p style={{ fontWeight: 500 }}>{user?.email || 'N/A'}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Telephone</span>
            <p style={{ fontWeight: 500 }}>{user?.phone || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
