import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { noticeService } from '../../services/noticeService.js';
import { toast } from '../../utils/toast.js';

export const AddNotice = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Both title and content are required');
    setLoading(true);
    try {
      await noticeService.createNotice({ title, content, message: content });
      toast.success('Notice posted successfully!');
      navigate('/notice');
    } catch (err) {
      toast.error(err.message || 'Failed to post notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Create Notice Announcement" subtitle="Publish a new item to the student board." />
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Notice Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. End of Semester Break"
          />
          <div className="form-group">
            <label className="form-label">Announcement Content</label>
            <textarea
              className="form-input"
              style={{ minHeight: '150px', resize: 'vertical' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Provide detail here..."
            />
          </div>
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>Publish Notice</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/notice')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotice;
