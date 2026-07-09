import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { toast } from '../../utils/toast.js';

export const AddDepartment = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [head, setHead] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Department created successfully!');
      navigate('/departments');
    }, 1000);
  };

  return (
    <div>
      <Header title="Add Department" subtitle="Create a new academic division." />
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Input
            label="Department Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            placeholder="e.g. CS"
          />
          <Input
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. Computer Science"
          />
          <Input
            label="Head of Department (HOD)"
            value={head}
            onChange={(e) => setHead(e.target.value)}
            placeholder="e.g. Dr. Alan Turing"
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>Save Department</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/departments')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
