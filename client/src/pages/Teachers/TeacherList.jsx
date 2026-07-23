import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTeachers } from '../../redux/slices/teacherSlice.js';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus, FiEye, FiEdit, FiTrash } from 'react-icons/fi';
import { teacherService } from '../../services/teacherService.js';
import { toast } from '../../utils/toast.js';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const TeacherList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.teachers);
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await teacherService.deleteTeacher(deleteId);
      toast.success('Teacher record removed successfully');
      setDeleteId(null);
      dispatch(fetchTeachers());
    } catch (err) {
      toast.error(err.message || 'Failed to remove teacher');
    } finally {
      setDeleting(false);
    }
  };

  const getTeacherName = (teacher) => {
    if (!teacher) return 'N/A';
    if (teacher.facultyfullname) return teacher.facultyfullname;
    if (teacher.firstName || teacher.lastName) {
      return `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim();
    }
    if (teacher.name) return teacher.name;
    if (teacher.fullName) return teacher.fullName;
    return 'N/A';
  };

  const filtered = list.filter((teacher) => {
    const term = search.toLowerCase();
    const name = getTeacherName(teacher).toLowerCase();
    const email = (teacher.email || '').toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div>
      <Header
        title="Faculty Directory"
        subtitle="Manage details of school instructors and department assignments."
        actions={
          role === 'admin' && (
            <Link to="/teachers/add">
              <Button variant="primary">
                <FiPlus /> Add Teacher
              </Button>
            </Link>
          )
        }
      />

      <div className="flex justify-between items-center mb-4 flex-responsive">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by instructor name..."
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Teacher ID', 'Name', 'Email', 'Phone', 'Department', 'Actions']}
          data={filtered}
          renderRow={(teacher) => {
            const tid = teacher._id || teacher.id || teacher.facultyId;
            return (
              <tr key={tid}>
                <td>{teacher.facultyId || 'N/A'}</td>
                <td style={{ fontWeight: 500 }}>{getTeacherName(teacher)}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone || 'N/A'}</td>
                <td>{teacher.department || 'General'}</td>
                <td className="flex gap-2">

                  <Link to={`/teachers/profile/${tid}`} title="Profile">
                    <Button variant="secondary" style={{ padding: '0.4rem' }}>
                      <FiEye />
                    </Button>
                  </Link>
                  {role === 'admin' && (
                    <>
                      <Link to={`/teachers/edit/${tid}`} title="Edit">
                        <Button variant="secondary" style={{ padding: '0.4rem' }}>
                          <FiEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="danger"
                        style={{ padding: '0.4rem' }}
                        onClick={() => setDeleteId(tid)}
                        title="Delete"
                      >
                        <FiTrash />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          }}
        />
      )}


      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        message="Are you sure you want to remove this faculty record?"
      />
    </div>
  );
};

export default TeacherList;
