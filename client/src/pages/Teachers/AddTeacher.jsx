import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { authService } from '../../services/authService.js';
import { toast } from '../../utils/toast.js';

export const AddTeacher = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.registerTeacher({
        email: formData.email,
        password: formData.password,
        facultyfullname: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone,
        department: formData.department,
      });
      if (res.success) {
        toast.success('Faculty registered! Verification OTP sent to instructor.');
        navigate('/teachers');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to register faculty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Add Faculty Instructor" subtitle="Onboard a new faculty member." />

      <div className="card mt-4" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="e.g. Mary"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="e.g. Smith"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="teacher@school.com"
            />
            <Input
              label="Portal Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Min 6 characters"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department / Area"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +11223344"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>
              Create Faculty
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/teachers')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeacher;
