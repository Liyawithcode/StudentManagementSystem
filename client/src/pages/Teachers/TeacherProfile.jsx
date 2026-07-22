import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import { teacherService } from '../../services/teacherService.js';
import { toast } from '../../utils/toast.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { useAuth } from '../../hooks/useAuth.js';
import { FiArrowLeft, FiEdit, FiUser, FiTrash } from 'react-icons/fi';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const teacherRes = await teacherService.getTeacherById(id);
        const t = teacherRes.faculty || teacherRes;
        setTeacher(t);

        // Fetch schedules
        const scheduleRes = await teacherService.getSchedules(t._id || id);
        setSchedules(scheduleRes.schedules || scheduleRes || []);
      } catch (err) {
        toast.error('Failed to load faculty profile');
        navigate('/teachers');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await teacherService.deleteTeacher(teacher._id);
      toast.success('Faculty member deleted successfully');
      navigate('/teachers');
    } catch (err) {
      toast.error(err.message || 'Failed to delete faculty member');
    }
  };

  const getTeacherName = (t) => {
    if (!t) return 'N/A';
    if (t.facultyfullname) return t.facultyfullname;
    if (t.firstName || t.lastName) {
      return `${t.firstName || ''} ${t.lastName || ''}`.trim();
    }
    if (t.name) return t.name;
    if (t.fullName) return t.fullName;
    return 'N/A';
  };

  if (loading) return <Loader />;
  if (!teacher) return <div className="text-center mt-8">Teacher profile not found</div>;

  const teacherName = getTeacherName(teacher);

  return (
    <div>
      <Header
        title={teacherName}
        subtitle={`Faculty Profile - ID: ${teacher.facultyId || 'N/A'}`}
        actions={
          <div className="flex gap-2">
            <Link to="/teachers">
              <Button variant="secondary">
                <FiArrowLeft /> Back to List
              </Button>
            </Link>
            {role === 'admin' && (
              <>
                <Link to={`/teachers/edit/${teacher._id}`}>
                  <Button variant="primary">
                    <FiEdit /> Edit Profile
                  </Button>
                </Link>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  <FiTrash /> Delete Profile
                </Button>
              </>
            )}
          </div>
        }
      />


      <div className="grid gap-6 mt-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Left Avatar Card */}
        <div className="card text-center flex flex-column items-center justify-center">
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              marginBottom: '1rem',
            }}
          >
            <FiUser />
          </div>
          <h3 style={{ fontFamily: 'Outfit', fontWeight: 600 }}>
            {teacherName}
          </h3>

          <span className="badge badge-success mt-2">Active Instructor</span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
            Department: {teacher.department || 'General Academics'}
          </p>
        </div>

        {/* Right Details Card */}
        <div className="card">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Instructor Details
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
              <strong style={{ fontSize: '0.9rem' }}>{teacher.email}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone Number</span>
              <strong style={{ fontSize: '0.9rem' }}>{teacher.phone || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Faculty ID</span>
              <strong style={{ fontSize: '0.9rem' }}>{teacher.facultyId || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Date Registered</span>
              <strong style={{ fontSize: '0.9rem' }}>{formatDate(teacher.createdAt) || 'N/A'}</strong>
            </div>
          </div>

          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '2rem' }}>
            Assigned Schedule / Timetable
          </h4>

          <Table
            headers={['Day', 'Subject', 'Time Slot', 'Room']}
            data={schedules}
            renderRow={(sched, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 500 }}>{sched.day}</td>
                <td>{sched.subject || 'N/A'}</td>
                <td>{sched.startTime && sched.endTime ? `${sched.startTime} - ${sched.endTime}` : 'N/A'}</td>
                <td>{sched.roomNumber || 'N/A'}</td>
              </tr>
            )}
            emptyMessage="No schedules assigned to this faculty member"
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to remove this faculty record? This action cannot be undone."
      />
    </div>
  );
};

export default TeacherProfile;

