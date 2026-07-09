import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';

export const EditDepartment = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Edit Department" subtitle="Modify division specifications." />
      <div className="card mt-4 text-center">
        <p className="mb-4">Department editing is managed through the main Department Directory.</p>
        <Button variant="primary" onClick={() => navigate('/departments')}>Back to Directory</Button>
      </div>
    </div>
  );
};

export default EditDepartment;
