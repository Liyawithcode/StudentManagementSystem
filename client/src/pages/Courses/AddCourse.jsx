import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { courseService } from '../../services/courseService.js';
import { toast } from '../../utils/toast.js';

export const AddCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ courseCode: '', courseName: '', department: '', credits: 3 });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await courseService.createCourse(formData);
      toast.success('Course created successfully!');
      navigate('/courses');
    } catch (err) {
      toast.error(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Add New Course" subtitle="Define a new academic course." />
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Course Code"
            name="courseCode"
            value={formData.courseCode}
            onChange={handleChange}
            required
            placeholder="e.g. CS101"
          />
          <Input
            label="Course Name"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
            placeholder="e.g. Introduction to Programming"
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
            <Button type="submit" variant="primary" loading={loading}>Save Course</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/courses')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
