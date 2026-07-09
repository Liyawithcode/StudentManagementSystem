import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { examService } from '../../services/examService.js';
import { toast } from '../../utils/toast.js';

export const AddExam = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ examName: '', examDate: '', time: '', room: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await examService.scheduleExam(formData);
      toast.success('Exam scheduled successfully!');
      navigate('/exams');
    } catch (err) {
      toast.error(err.message || 'Failed to schedule exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Schedule Examination" subtitle="Establish a new semester exam sheet." />
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Exam Name"
            name="examName"
            value={formData.examName}
            onChange={handleChange}
            required
            placeholder="e.g. CS101 Mid-Terms"
          />
          <Input
            label="Exam Date"
            type="date"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            required
          />
          <Input
            label="Time Slot"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="e.g. 10:00 AM - 01:00 PM"
          />
          <Input
            label="Exam Room/Location"
            name="room"
            value={formData.room}
            onChange={handleChange}
            placeholder="e.g. Hall A"
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>Save Schedule</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/exams')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExam;
