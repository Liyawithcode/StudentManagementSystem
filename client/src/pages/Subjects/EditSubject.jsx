import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';

export const EditSubject = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Edit Subject" subtitle="Modify subject specifications." />
      <div className="card mt-4 text-center">
        <p className="mb-4">Subject editing is managed through the main Subjects Directory.</p>
        <Button variant="primary" onClick={() => navigate('/subjects')}>Back to Subjects</Button>
      </div>
    </div>
  );
};

export default EditSubject;
