import React from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus } from 'react-icons/fi';

export const DepartmentList = () => {
  const { role } = useAuth();

  const mockDeps = [
    { id: '1', name: 'Computer Science', code: 'CS', head: 'Dr. Alan Turing' },
    { id: '2', name: 'Electrical Engineering', code: 'EE', head: 'Dr. Nikola Tesla' },
    { id: '3', name: 'Mechanical Engineering', code: 'ME', head: 'Dr. James Watt' },
  ];

  return (
    <div>
      <Header
        title="Departments Directory"
        subtitle="View school divisions and administrative deans."
        actions={
          role === 'admin' && (
            <Link to="/departments/add">
              <Button variant="primary"><FiPlus /> Add Department</Button>
            </Link>
          )
        }
      />

      <div className="card mt-4">
        <Table
          headers={['Code', 'Department Name', 'Head of Department']}
          data={mockDeps}
          renderRow={(dep) => (
            <tr key={dep.id}>
              <td style={{ fontWeight: 600 }}>{dep.code}</td>
              <td>{dep.name}</td>
              <td>{dep.head}</td>
            </tr>
          )}
        />
      </div>
    </div>
  );
};

export default DepartmentList;
