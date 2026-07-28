import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { authService } from '../../services/authService.js';
import { loadProfile, setAuth } from '../../redux/slices/authSlice.js';
import { toast } from '../../utils/toast.js';
import {
  FiLock,
  FiUser,
  FiEdit3,
  FiMail,
  FiShield,
  FiCheckCircle,
  FiBriefcase,
  FiMapPin
} from 'react-icons/fi';

export const Profile = () => {
  const { user, role } = useAuth();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile Edit Form State
  const [formData, setFormData] = useState({
    adminfullname: '',
    firstName: '',
    lastName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    department: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        adminfullname: user.adminfullname || 'Liya Patel',
        firstName: user.firstName || 'Liya',
        lastName: user.lastName || 'Patel',
        phone: user.phone || '+1 (555) 349-8201',
        gender: user.gender || 'Female',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '1998-08-24',
        department: user.department || 'Academic Administration',
        street: user.address?.street || '450 Institutional Way, Bldg A',
        city: user.address?.city || 'Boston',
        state: user.address?.state || 'MA',
        zipCode: user.address?.zipCode || '02215',
        country: user.address?.country || 'United States',
      });
    }
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      payload.address = {
        street: payload.street,
        city: payload.city,
        state: payload.state,
        zipCode: payload.zipCode,
        country: payload.country,
      };
      delete payload.street;
      delete payload.city;
      delete payload.state;
      delete payload.zipCode;
      delete payload.country;

      const response = await authService.updateProfile(payload);
      if (response?.profile) {
        const token = localStorage.getItem('accessToken');
        dispatch(setAuth({ user: response.profile, accessToken: token }));
      } else {
        dispatch(loadProfile());
      }

      toast.success('Profile updated successfully!');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    setLoading(true);
    try {
      await authService.updateProfile({ newPassword: passwordData.newPassword });
      toast.success('Password updated successfully!');
      setIsPasswordModalOpen(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const displayName = user?.adminfullname
    || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    || formData.adminfullname
    || 'Liya Patel';

  const userEmail = user?.email || 'patelliya04@gmail.com';
  const userPhone = user?.phone || formData.phone || '+1 (555) 349-8201';
  const userGender = user?.gender || formData.gender || 'Female';
  const userDob = user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Aug 24, 1998';
  const userDept = user?.department || formData.department || 'Academic Administration';
  const userIdentifier = user?.adminid || user?.studentId || user?.facultyId || 'ADM83019';

  const currentAddress = {
    street: user?.address?.street || formData.street || '450 Institutional Way, Bldg A',
    city: user?.address?.city || formData.city || 'Boston',
    state: user?.address?.state || formData.state || 'MA',
    zipCode: user?.address?.zipCode || formData.zipCode || '02215',
    country: user?.address?.country || formData.country || 'United States',
  };

  const getInitials = () => {
    if (!displayName) return 'LP';
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      <Header
        title="My Account Settings"
        subtitle="Manage your personal contact details, account profile, and security credentials."
      />

      {/* Hero Banner Card */}
      <div 
        className="mt-6 animate-fade-in"
        style={{
          background: 'linear-gradient(135deg, var(--bg-sidebar, #1e1b4b) 0%, var(--accent, #4c1d95) 100%)',
          borderRadius: '18px',
          padding: '2.25rem 2.5rem',
          color: '#ffffff',
          boxShadow: 'var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.15))',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="flex items-center justify-between flex-responsive gap-6" style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex items-center gap-7 flex-responsive">
            
            {/* Clean Inset Avatar Circle */}
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary, #6366f1) 0%, var(--accent, #8b5cf6) 100%)',
                color: '#ffffff',
                border: '2px solid rgba(255, 255, 255, 0.35)',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: '700',
                flexShrink: 0,
                letterSpacing: '1px'
              }}
            >
              {getInitials()}
            </div>

            {/* User Metadata */}
            <div style={{ paddingLeft: '0.25rem' }}>
              <div className="flex items-center gap-3.5 flex-wrap">
                <h1 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1.7rem', color: '#ffffff', letterSpacing: '-0.3px', margin: 0 }}>
                  {displayName}
                </h1>
                <span 
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.25)',
                    color: '#6ee7b7',
                    border: '1px solid rgba(52, 211, 153, 0.4)',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textTransform: 'capitalize'
                  }}
                >
                  <FiCheckCircle size={13} /> {role || 'Admin'} Portal
                </span>
              </div>

              {/* Metadata Pill Chips */}
              <div className="flex items-center gap-3 mt-3.5 flex-wrap" style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.18)'
                }}>
                  <FiMail size={14} style={{ color: '#93c5fd' }} /> {userEmail}
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.18)'
                }}>
                  <FiShield size={14} style={{ color: '#c4b5fd' }} /> ID: <strong style={{ color: '#ffffff' }}>{userIdentifier}</strong>
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.18)'
                }}>
                  <FiBriefcase size={14} style={{ color: '#fda4af' }} /> {userDept}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 flex-wrap" style={{ flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '1px solid #ffffff',
                padding: '0.75rem 1.45rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <FiEdit3 size={16} /> Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(true)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.75rem 1.45rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <FiLock size={16} /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-3 mt-9 border-b" style={{ borderColor: 'var(--border-color, #e2e8f0)', paddingBottom: '2px', marginBottom: '1.75rem' }}>
        {[
          { id: 'overview', label: 'Personal Information', icon: <FiUser /> },
          { id: 'account', label: 'Institutional Account', icon: <FiBriefcase /> },
          { id: 'address', label: 'Address & Location', icon: <FiMapPin /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.75rem 1.25rem',
              fontWeight: 600,
              fontSize: '0.92rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: activeTab === tab.id ? 'var(--primary, #3b82f6)' : 'var(--text-muted, #64748b)',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary, #3b82f6)' : '3px solid transparent',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className="mt-6">

        {/* TAB 1: Personal Information */}
        {activeTab === 'overview' && (
          <div className="card p-8 animate-fade-in" style={{ borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-color, #e2e8f0)' }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '1.25rem' }}>Personal Information</h3>
              <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.88rem' }}>Your personal contact and demographic information</p>
            </div>

            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Full Name</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{displayName}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Email Address</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{userEmail}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Telephone / Mobile</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{userPhone}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Gender</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{userGender}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Date of Birth</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{userDob}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Institutional Account */}
        {activeTab === 'account' && (
          <div className="card p-8 animate-fade-in" style={{ borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-color, #e2e8f0)' }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '1.25rem' }}>Institutional Account & Role</h3>
              <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.88rem' }}>System authority, identifier code, and status</p>
            </div>

            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Portal Role</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, textTransform: 'capitalize', color: 'var(--text-main, #0f172a)' }}>{role || 'Admin'} Administrator</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Official System ID</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{userIdentifier}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Department Unit</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{userDept}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Account Status</span>
                <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>Active & Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Address & Location */}
        {activeTab === 'address' && (
          <div className="card p-8 animate-fade-in" style={{ borderRadius: '16px', border: '1px solid var(--border-color, #e2e8f0)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div className="mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-color, #e2e8f0)' }}>
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '1.25rem' }}>Address & Location Details</h3>
              <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.88rem' }}>Residential and official postal address</p>
            </div>

            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div style={{ gridColumn: '1 / -1', background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Street Address</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{currentAddress.street}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>City</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{currentAddress.city}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>State / Province</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{currentAddress.state}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Zip / Postal Code</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{currentAddress.zipCode}</p>
              </div>

              <div style={{ background: 'var(--bg-hover, #f8fafc)', padding: '1.25rem', borderRadius: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Country</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main, #0f172a)' }}>{currentAddress.country}</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Account Details"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {role === 'admin' ? (
            <Input
              label="Full Name"
              value={formData.adminfullname}
              onChange={(e) => setFormData({ ...formData, adminfullname: e.target.value })}
              placeholder="Enter full name"
              required
            />
          ) : (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="First name"
                required
              />
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Last name"
                required
              />
            </div>
          )}

          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Input
              label="Telephone / Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 349-8201"
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Department Name"
            />
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, marginBottom: '6px', display: 'block' }}>Gender</label>
              <select
                className="input"
                style={{ width: '100%', padding: '0.65rem' }}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Input
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>

          <hr style={{ borderColor: 'var(--border-color, #e2e8f0)', margin: '1.2rem 0' }} />
          <h5 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Address Details</h5>

          <Input
            label="Street Address"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            placeholder="450 Institutional Way, Bldg A"
          />

          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Boston"
            />
            <Input
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="MA"
            />
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <Input
              label="Zip Code"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              placeholder="02215"
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="United States"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Security Password"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            placeholder="Minimum 6 characters"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
            placeholder="Re-enter new password"
            required
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Profile;
