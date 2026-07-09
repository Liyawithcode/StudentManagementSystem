import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { studentService } from '../../services/studentService.js';
import { toast } from '../../utils/toast.js';

export const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    phone: '',
    className: '',
    dob: '',
  });

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const res = await studentService.getStudentById(id);
        const st = res.student || res;
        setFormData({
          firstName: st.firstName || '',
          lastName: st.lastName || '',
          gender: st.gender || 'Male',
          phone: st.phone || '',
          className: st.className || '',
          dob: st.dob ? new Date(st.dob).toISOString().split('T')[0] : '',
        });
      } catch (err) {
        toast.error('Failed to load student details');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };
    loadStudent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await studentService.updateStudent(id, formData);
      toast.success('Student profile updated successfully!');
      navigate('/students');
    } catch (err) {
      toast.error(err.message || 'Failed to update student profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Header title="Edit Student Profile" subtitle="Modify current student account records." />

      <div className="card mt-4" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
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
            <Button type="submit" variant="primary" loading={saving}>
              Save Changes
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

export default EditStudent;
