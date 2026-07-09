import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStudents } from '../../redux/slices/studentSlice.js';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus, FiEye, FiEdit, FiTrash } from 'react-icons/fi';
import { studentService } from '../../services/studentService.js';
import { toast } from '../../utils/toast.js';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const StudentList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.students);
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleDelete = async () => {
    try {
      await studentService.deleteStudent(deleteId);
      toast.success('Student deleted successfully');
      setDeleteId(null);
      dispatch(fetchStudents());
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
    }
  };

  const filtered = list.filter((student) => {
    const term = search.toLowerCase();
    const fullName = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
    return (
      fullName.includes(term) ||
      (student.email && student.email.toLowerCase().includes(term)) ||
      (student.studentId && student.studentId.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <Header
        title="Student Directory"
        subtitle="Manage student academic and contact records."
        actions={
          role === 'admin' && (
            <Link to="/students/add">
              <Button variant="primary">
                <FiPlus /> Add Student
              </Button>
            </Link>
          )
        }
      />

      <div className="flex justify-between items-center mb-4 flex-responsive">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, ID or email..."
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['ID', 'Name', 'Email', 'Class', 'Gender', 'Actions']}
          data={filtered}
          renderRow={(student) => (
            <tr key={student._id || student.studentId}>
              <td>{student.studentId || 'N/A'}</td>
              <td style={{ fontWeight: 500 }}>
                {student.firstName} {student.lastName}
              </td>
              <td>{student.email}</td>
              <td>{student.className || 'Unassigned'}</td>
              <td>{student.gender || 'N/A'}</td>
              <td className="flex gap-2">
                <Link to={`/students/profile/${student._id}`} title="Profile">
                  <Button variant="secondary" style={{ padding: '0.4rem' }}>
                    <FiEye />
                  </Button>
                </Link>
                {role === 'admin' && (
                  <>
                    <Link to={`/students/edit/${student._id}`} title="Edit">
                      <Button variant="secondary" style={{ padding: '0.4rem' }}>
                        <FiEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      style={{ padding: '0.4rem' }}
                      onClick={() => setDeleteId(student._id)}
                      title="Delete"
                    >
                      <FiTrash />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          )}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this student record? This cannot be undone."
      />
    </div>
  );
};

export default StudentList;
