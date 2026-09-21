import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import Button from '../../components/common/Button.jsx';
import { studentService } from '../../services/studentService.js';
import { authService } from '../../services/authService.js';
import { toast } from '../../utils/toast.js';

export const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: 'Male',
    phone: '',
    className: '',
    dob: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Students sign up endpoint is public/register with student details
      const res = await authService.registerStudent(formData);
      if (res.success) {
        toast.success('Student account registered successfully!');
        navigate('/students');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create student account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Add Student Account" subtitle="Enroll a new student profile in the system." />

      <div className="card mt-4" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="e.g. John"
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              placeholder="e.g. Doe"
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
              placeholder="student@school.com"
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
            <Dropdown
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input
              label="Class / Section"
              name="className"
              value={formData.className}
              onChange={handleChange}
              placeholder="e.g. Grade 10-A"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +123456789"
            />
            <Input
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>
              Create Profile
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/students')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
