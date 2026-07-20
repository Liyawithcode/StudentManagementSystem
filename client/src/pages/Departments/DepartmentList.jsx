import React, { useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Button from '../../components/common/Button.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus } from 'react-icons/fi';

export const DepartmentList = () => {
  const { role } = useAuth();
  const [search, setSearch] = useState('');

  const mockDeps = [
    { id: '1', name: 'Computer Science', code: 'CS', head: 'Dr. Alan Turing' },
    { id: '2', name: 'Electrical Engineering', code: 'EE', head: 'Dr. Nikola Tesla' },
    { id: '3', name: 'Mechanical Engineering', code: 'ME', head: 'Dr. James Watt' },
  ];

  const filteredDeps = mockDeps.filter((dep) => {
    const term = search.toLowerCase();
    const name = (dep.name || '').toLowerCase();
    const code = (dep.code || '').toLowerCase();
    const head = (dep.head || '').toLowerCase();
    return name.includes(term) || code.includes(term) || head.includes(term);
  });

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
        <div className="flex justify-between items-center mb-4 flex-responsive">
          <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, margin: 0 }}>Department Registries</h4>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, department name, or HOD..."
          />
        </div>
        <Table
          headers={['Code', 'Department Name', 'Head of Department']}
          data={filteredDeps}
          renderRow={(dep) => (
            <tr key={dep.id}>
              <td style={{ fontWeight: 600 }}>{dep.code}</td>
              <td>{dep.name}</td>
              <td>{dep.head}</td>
            </tr>
          )}
          emptyMessage="No departments matching search criteria found"
        />
      </div>
    </div>
  );
};

export default DepartmentList;
