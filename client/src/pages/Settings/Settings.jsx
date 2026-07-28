import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import { settingsService } from '../../services/settingsService.js';
import { toast } from '../../utils/toast.js';
import {
  FiSliders, FiBookOpen, FiImage, FiShield, FiSave, FiRefreshCw, FiCheckCircle, FiGlobe, FiMail, FiPhone, FiMapPin
} from 'react-icons/fi';
import './Settings.css';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    schoolName: '',
    tagline: '',
    academicYear: '',
    contactEmail: '',
    phone: '',
    address: '',
    website: '',
    gradingSystem: 'Percentage',
    attendanceThreshold: 75,
    maxClassSize: 40,
    logoUrl: '',
    primaryColor: '#6366f1',
    enableEmailNotifications: true,
    enableSMSAlerts: false,
    maintenanceMode: false,
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSettings();
      if (res && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await settingsService.updateSettings(settings);
      if (res && res.settings) {
        setSettings((prev) => ({ ...prev, ...res.settings }));
      }
      toast.success(res?.message || 'System settings saved successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="settings-container page-entrance">
      <Header
        title="System Settings"
        subtitle="Manage institution profile, academic policies, branding, and system preferences."
      />

      {/* Navigation Tabs */}
      <div className="settings-nav-tabs">
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <FiSliders /> General Info
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'academic' ? 'active' : ''}`}
          onClick={() => setActiveTab('academic')}
        >
          <FiBookOpen /> Academic Rules
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
          onClick={() => setActiveTab('branding')}
        >
          <FiImage /> Branding & Styling
        </button>
        <button
          type="button"
          className={`settings-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          <FiShield /> System & Alerts
        </button>
      </div>

      <div className="settings-grid-layout">
        {/* Left Section: Tab Form */}
        <div className="settings-card animate-fade-in">
          <form onSubmit={handleSubmit}>
            {/* General Info Tab */}
            {activeTab === 'general' && (
              <div>
                <h3 className="settings-card-title">Institutional Overview</h3>
                <p className="settings-card-subtitle">
                  Configure basic school details, contact info, and current academic year.
                </p>
                <div className="form-group">
                  <Input
                    label="School Name"
                    name="schoolName"
                    value={settings.schoolName}
                    onChange={handleChange}
                    placeholder="Antigravity Academy of Sciences"
                    required
                  />
                </div>
                <div className="form-group">
                  <Input
                    label="Tagline / Motto"
                    name="tagline"
                    value={settings.tagline}
                    onChange={handleChange}
                    placeholder="Excellence in Innovation & Learning"
                  />
                </div>
                <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Input
                    label="Academic Year"
                    name="academicYear"
                    value={settings.academicYear}
                    onChange={handleChange}
                    placeholder="2026-2027"
                    required
                  />
                  <Input
                    label="Contact Email"
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    placeholder="admin@school.edu"
                    required
                  />
                </div>
                <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                    placeholder="+1 555-0199"
                  />
                  <Input
                    label="Website URL"
                    name="website"
                    value={settings.website}
                    onChange={handleChange}
                    placeholder="https://school.edu"
                  />
                </div>
                <div className="form-group mt-4">
                  <Input
                    label="Physical Address"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    placeholder="102 Education Lane, Academic City"
                  />
                </div>
              </div>
            )}

            {/* Academic Rules Tab */}
            {activeTab === 'academic' && (
              <div>
                <h3 className="settings-card-title">Academic & Evaluation Policies</h3>
                <p className="settings-card-subtitle">
                  Set up grading scale, attendance criteria, and maximum capacity limits.
                </p>
                <div className="form-group">
                  <label className="form-label" htmlFor="gradingSystem">
                    Grading System Standard <span className="text-danger">*</span>
                  </label>
                  <select
                    id="gradingSystem"
                    name="gradingSystem"
                    value={settings.gradingSystem}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Percentage">Percentage (0 - 100%)</option>
                    <option value="GPA 4.0">4.0 GPA Scale</option>
                    <option value="GPA 10.0">10.0 GPA Scale</option>
                    <option value="Letter Grade">Letter Grades (A+, A, B, C, D, F)</option>
                  </select>
                </div>
                <div className="grid gap-4 mt-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <Input
                    label="Minimum Attendance Threshold (%)"
                    type="number"
                    name="attendanceThreshold"
                    value={settings.attendanceThreshold}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                  <Input
                    label="Maximum Class Capacity"
                    type="number"
                    name="maxClassSize"
                    value={settings.maxClassSize}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            )}

            {/* Branding & Styling Tab */}
            {activeTab === 'branding' && (
              <div>
                <h3 className="settings-card-title">Branding & Theme Customization</h3>
                <p className="settings-card-subtitle">
                  Customize institutional logo, brand accent colors, and app visuals.
                </p>
                <div className="form-group">
                  <Input
                    label="Logo Image URL"
                    name="logoUrl"
                    value={settings.logoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="primaryColor">
                    Primary Brand Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      id="primaryColor"
                      name="primaryColor"
                      value={settings.primaryColor || '#6366f1'}
                      onChange={handleChange}
                      style={{ width: '48px', height: '42px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <input
                      type="text"
                      name="primaryColor"
                      value={settings.primaryColor || '#6366f1'}
                      onChange={handleChange}
                      className="form-input"
                      style={{ maxWidth: '180px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* System & Alerts Tab */}
            {activeTab === 'system' && (
              <div>
                <h3 className="settings-card-title">System & Communications</h3>
                <p className="settings-card-subtitle">
                  Toggle automated notifications, SMS integrations, and maintenance mode.
                </p>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-info-title">Email Notifications</div>
                    <div className="toggle-info-desc">Send automated email notifications for notices, fees, and exam results.</div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="enableEmailNotifications"
                      checked={settings.enableEmailNotifications}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-info-title">SMS Alerts</div>
                    <div className="toggle-info-desc">Send emergency SMS alerts for urgent broadcasts and attendance drops.</div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="enableSMSAlerts"
                      checked={settings.enableSMSAlerts}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="toggle-item" style={{ borderColor: settings.maintenanceMode ? 'var(--danger)' : 'var(--border-color)' }}>
                  <div>
                    <div className="toggle-info-title" style={{ color: settings.maintenanceMode ? 'var(--danger)' : 'var(--text-main)' }}>
                      Maintenance Mode
                    </div>
                    <div className="toggle-info-desc">Restricts non-admin user logins while performing database upgrades.</div>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            )}

            {/* Submit & Controls Bar */}
            <div className="flex items-center gap-4 mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Button type="submit" variant="primary" loading={saving}>
                <FiSave /> Save Config
              </Button>
              <Button type="button" variant="secondary" onClick={fetchSettings} disabled={saving}>
                <FiRefreshCw /> Reset Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Section: Live Summary & Preview Card */}
        <div className="flex-column gap-4">
          <div className="settings-preview-card animate-fade-in">
            <div className="preview-logo-box" style={{ backgroundColor: settings.primaryColor || '#6366f1' }}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="School Logo" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                (settings.schoolName ? settings.schoolName.charAt(0) : 'A').toUpperCase()
              )}
            </div>

            <div>
              <div className="preview-school-name">{settings.schoolName || 'Institution Name'}</div>
              <div className="preview-tagline">{settings.tagline || 'School Tagline & Motto'}</div>
            </div>

            <div className="preview-chip-group">
              <span className="badge badge-info">AY: {settings.academicYear || '2026-2027'}</span>
              <span className="badge badge-success">{settings.gradingSystem} System</span>
              <span className="badge badge-warning">{settings.attendanceThreshold}% Min Attendance</span>
            </div>

            {settings.maintenanceMode && (
              <span className="badge badge-danger mt-2 flex items-center gap-1">
                ⚠️ Maintenance Active
              </span>
            )}
          </div>

          <div className="settings-card">
            <h4 className="font-semibold mb-4 text-main flex items-center gap-2">
              <FiCheckCircle className="text-success" /> System Status
            </h4>
            <div className="flex-column gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-2">
                <FiMail /> <strong>Email:</strong> {settings.enableEmailNotifications ? 'Enabled' : 'Disabled'}
              </div>
              <div className="flex items-center gap-2">
                <FiPhone /> <strong>SMS:</strong> {settings.enableSMSAlerts ? 'Enabled' : 'Disabled'}
              </div>
              <div className="flex items-center gap-2">
                <FiGlobe /> <strong>Website:</strong> {settings.website || 'N/A'}
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin /> <strong>Campus:</strong> {settings.address || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
