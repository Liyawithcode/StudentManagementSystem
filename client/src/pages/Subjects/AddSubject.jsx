import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import { courseService } from '../../services/courseService.js';
import { toast } from '../../utils/toast.js';

export const AddSubject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ subjectCode: '', subjectName: '', type: 'Theory' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await courseService.createSubject(formData);
      toast.success('Subject created successfully!');
      navigate('/subjects');
    } catch (err) {
      toast.error(err.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Add New Subject" subtitle="Define a new curriculum subject." />
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Subject Code"
            name="subjectCode"
            value={formData.subjectCode}
            onChange={handleChange}
            required
            placeholder="e.g. CS101A"
          />
          <Input
            label="Subject Name"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            required
            placeholder="e.g. Programming Lab"
          />
          <Dropdown
            label="Subject Type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={[
              { value: 'Theory', label: 'Theory Lecture' },
              { value: 'Practical', label: 'Practical Lab' },
            ]}
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>Save Subject</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/subjects')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
