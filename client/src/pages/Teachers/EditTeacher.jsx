import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { teacherService } from '../../services/teacherService.js';
import { toast } from '../../utils/toast.js';

export const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    facultyfullname: '',
    phone: '',
    department: '',
  });

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const res = await teacherService.getTeacherById(id);
        const t = res.faculty || res;
        const nameVal = t.facultyfullname || (t.firstName || t.lastName ? `${t.firstName || ''} ${t.lastName || ''}`.trim() : '') || t.name || '';
        setFormData({
          facultyfullname: nameVal,
          phone: t.phone || '',
          department: t.department || '',
        });

      } catch (err) {
        toast.error('Failed to load faculty details');
        navigate('/teachers');
      } finally {
        setLoading(false);
      }
    };
    loadTeacher();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teacherService.updateTeacher(id, formData);
      toast.success('Faculty profile updated successfully!');
      navigate('/teachers');
    } catch (err) {
      toast.error(err.message || 'Failed to update faculty profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Header title="Edit Faculty Profile" subtitle="Modify current faculty member records." />

      <div className="card mt-4" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="facultyfullname"
            value={formData.facultyfullname}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={saving}>
              Save Changes
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

export default EditTeacher;
