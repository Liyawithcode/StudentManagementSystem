import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { studentService } from '../../services/studentService.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { toast } from '../../utils/toast.js';
import { FiEdit, FiArrowLeft, FiUser } from 'react-icons/fi';

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await studentService.getStudentById(id);
        setStudent(res.student || res);
      } catch (err) {
        toast.error('Failed to load student profile');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate]);

  if (loading) return <Loader />;
  if (!student) return <div className="text-center mt-8">Student not found</div>;

  return (
    <div>
      <Header
        title={`${student.firstName} ${student.lastName}`}
        subtitle={`Student Profile - ID: ${student.studentId || 'N/A'}`}
        actions={
          <div className="flex gap-2">
            <Link to="/students">
              <Button variant="secondary">
                <FiArrowLeft /> Back to List
              </Button>
            </Link>
            <Link to={`/students/edit/${student._id}`}>
              <Button variant="primary">
                <FiEdit /> Edit Profile
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 mt-4" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Left Side: Avatar Card */}
        <div className="card text-center flex flex-column items-center justify-center">
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-glow)',
              color: 'var(--primary)',
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
            {student.firstName} {student.lastName}
          </h3>
          <span className="badge badge-success mt-2">Active Student</span>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
            Class: {student.className || 'Unassigned'}
          </p>
        </div>

        {/* Right Side: Information Details */}
        <div className="card">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Personal Details
          </h4>

          <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email Address</span>
              <strong style={{ fontSize: '0.9rem' }}>{student.email || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone Number</span>
              <strong style={{ fontSize: '0.9rem' }}>{student.phone || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Gender</span>
              <strong style={{ fontSize: '0.9rem' }}>{student.gender || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Date of Birth</span>
              <strong style={{ fontSize: '0.9rem' }}>{formatDate(student.dob) || 'N/A'}</strong>
            </div>
          </div>

          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginTop: '2rem' }}>
            Academic Profile
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Student ID</span>
              <strong style={{ fontSize: '0.9rem' }}>{student.studentId || 'N/A'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Date Joined</span>
              <strong style={{ fontSize: '0.9rem' }}>{formatDate(student.createdAt) || 'N/A'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
