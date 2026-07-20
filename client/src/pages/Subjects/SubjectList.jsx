import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSubjects } from '../../redux/slices/courseSlice.js';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { courseService } from '../../services/courseService.js';
import { toast } from '../../utils/toast.js';

export const SubjectList = () => {
  const dispatch = useDispatch();
  const { subjectsList, loading } = useSelector((state) => state.courses);
  const { role } = useAuth();
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  const filteredSubjects = subjectsList.filter((subject) => {
    const term = search.toLowerCase();
    const code = (subject.subjectCode || subject.code || '').toLowerCase();
    const name = (subject.subjectName || subject.name || '').toLowerCase();
    const type = (subject.type || '').toLowerCase();
    return code.includes(term) || name.includes(term) || type.includes(term);
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return;
    try {
      await courseService.deleteSubject(id);
      toast.success('Subject deleted');
      dispatch(fetchSubjects());
    } catch (err) {
      toast.error('Failed to delete subject');
    }
  };

  return (
    <div>
      <Header
        title="Subjects Directory"
        subtitle="Manage courses curriculum subjects."
        actions={
          role === 'admin' && (
            <Link to="/subjects/add">
              <Button variant="primary"><FiPlus /> Add Subject</Button>
            </Link>
          )
        }
      />


      <div className="flex justify-between items-center mb-4 flex-responsive">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by subject name, code, or type..."
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Subject Code', 'Subject Name', 'Type', 'Actions']}
          data={filteredSubjects}
          renderRow={(subject) => (
            <tr key={subject._id}>
              <td style={{ fontWeight: 600 }}>{subject.subjectCode || subject.code || 'SUBJ'}</td>
              <td>{subject.subjectName || subject.name}</td>
              <td>{subject.type || 'Theory'}</td>
              <td>
                {role === 'admin' && (
                  <Button variant="danger" style={{ padding: '0.4rem' }} onClick={() => handleDelete(subject._id)}><FiTrash /></Button>
                )}
              </td>
            </tr>
          )}
          emptyMessage="No subjects matching criteria found"
        />
      )}
    </div>
  );
};

export default SubjectList;
