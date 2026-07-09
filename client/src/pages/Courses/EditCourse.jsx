import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { courseService } from '../../services/courseService.js';
import { toast } from '../../utils/toast.js';

export const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ courseCode: '', courseName: '', department: '', credits: 3 });

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const list = await courseService.getAllCourses();
        const found = (list.courses || list || []).find((c) => c._id === id);
        if (found) {
          setFormData({
            courseCode: found.courseCode || found.code || '',
            courseName: found.courseName || found.name || '',
            department: found.department || '',
            credits: found.credits || 3,
          });
        } else {
          toast.error('Course not found');
          navigate('/courses');
        }
      } catch (err) {
        toast.error('Failed to load course details');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await courseService.updateCourse(id, formData);
      toast.success('Course updated successfully!');
      navigate('/courses');
    } catch (err) {
      toast.error(err.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <Header title="Edit Course" subtitle="Modify course registry details." />
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Course Code"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
          />
          <Input
            label="Course Name"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            placeholder="e.g. Computer Science"
          />
          <Input
            label="Credits"
            name="credits"
            type="number"
            value={formData.credits}
            onChange={handleChange}
            required
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={saving}>Save Changes</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/courses')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;
