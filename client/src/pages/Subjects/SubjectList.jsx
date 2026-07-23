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
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const SubjectList = () => {
  const dispatch = useDispatch();
  const { subjectsList, loading } = useSelector((state) => state.courses);
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteSubjectId, setDeleteSubjectId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteSubjectId) return;
    setDeleting(true);
    try {
      await courseService.deleteSubject(deleteSubjectId);
      toast.success('Subject deleted');
      setDeleteSubjectId(null);
      dispatch(fetchSubjects());
    } catch (err) {
      toast.error(err.message || 'Failed to delete subject');
    } finally {
      setDeleting(false);
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
          renderRow={(subject) => {
            const subId = subject._id || subject.id || subject.subjectCode || subject.code;
            return (
              <tr key={subId}>
                <td style={{ fontWeight: 600 }}>{subject.subjectCode || subject.code || 'SUBJ'}</td>
                <td>{subject.subjectName || subject.name}</td>
                <td>{subject.type || 'Theory'}</td>
                <td>
                  {role === 'admin' && (
                    <Button variant="danger" style={{ padding: '0.4rem' }} onClick={() => setDeleteSubjectId(subId)}><FiTrash /></Button>
                  )}
                </td>
              </tr>
            );
          }}

          emptyMessage="No subjects matching criteria found"
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteSubjectId}
        onClose={() => setDeleteSubjectId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to delete this subject? This action cannot be undone."
      />
    </div>
  );
};

export default SubjectList;

