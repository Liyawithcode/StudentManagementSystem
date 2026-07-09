import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSubjects } from '../../redux/slices/courseSlice.js';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
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

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

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

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Subject Code', 'Subject Name', 'Type', 'Actions']}
          data={subjectsList}
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
        />
      )}
    </div>
  );
};

export default SubjectList;
