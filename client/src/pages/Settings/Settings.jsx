import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import { toast } from '../../utils/toast.js';

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({ schoolName: '', academicYear: '', contactEmail: '' });

  useEffect(() => {
    setTimeout(() => {
      setSettings({
        schoolName: 'Antigravity Academy of Sciences',
        academicYear: '2026-2027',
        contactEmail: 'admin@antigravityacademy.edu',
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('System settings saved successfully!');
    }, 1000);
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Header title="System Settings" subtitle="Configure school settings." />

      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="School Name"
            name="schoolName"
            value={settings.schoolName}
            onChange={handleChange}
            required
          />
          <Input
            label="Academic Year"
            name="academicYear"
            value={settings.academicYear}
            onChange={handleChange}
            required
          />
          <Input
            label="Contact Email"
            name="contactEmail"
            value={settings.contactEmail}
            onChange={handleChange}
            required
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={saving}>Save Config</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
