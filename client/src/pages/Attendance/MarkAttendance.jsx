import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import Table from '../../components/common/Table.jsx';
import Loader from '../../components/common/Loader.jsx';
import { studentService } from '../../services/studentService.js';
import { attendanceService } from '../../services/attendanceService.js';
import { courseService } from '../../services/courseService.js';
import { toast } from '../../utils/toast.js';

export const MarkAttendance = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState({});

  useEffect(() => {
    const loadCoursesAndStudents = async () => {
      try {
        const cRes = await courseService.getAllCourses();
        const crs = cRes.courses || cRes || [];
        setCourses(crs);
        if (crs.length > 0) {
          setSelectedCourse(crs[0]._id || crs[0].id || crs[0].courseCode);
        }
        
        const sRes = await studentService.getAllStudents();
        const stds = sRes.students || sRes || [];
        setStudents(stds);
        
        // Initialize records: everyone is Present by default
        const recs = {};
        stds.forEach((s) => {
          const sid = s._id || s.id || s.studentId;
          recs[sid] = 'Present';
        });
        setRecords(recs);
      } catch (err) {
        toast.error('Failed to load courses or students');
      }
    };
    loadCoursesAndStudents();
  }, []);

  const handleStatusChange = (sid, status) => {
    setRecords((prev) => ({ ...prev, [sid]: status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      return toast.error('Please select a course');
    }
    setLoading(true);
    try {
      const attendanceData = students.map((s) => {
        const sid = s._id || s.id || s.studentId;
        return {
          studentId: s.studentId || sid,
          status: records[sid] || 'Present',
        };
      });

      await attendanceService.recordAttendance({
        courseId: selectedCourse,
        date,
        records: attendanceData,
      });

      toast.success('Attendance recorded successfully!');
      navigate('/attendance');
    } catch (err) {
      toast.error(err.message || 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Mark Attendance" subtitle="Submit today's student attendance rolls." />

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="card grid gap-4 flex-responsive" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1.5rem' }}>
          <Dropdown
            label="Course / Class"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            options={courses.map((c) => ({
              value: c._id || c.id || c.courseCode,
              label: `${c.courseCode || c.code || ''} ${c.courseName || c.name || ''}`.trim() || 'Course'
            }))}
            required
          />
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="card">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Students Roll Call</h4>
          <Table
            headers={['Student ID', 'Student Name', 'Assigned Class', 'Attendance Status']}
            data={students}
            renderRow={(student) => {
              const sid = student._id || student.id || student.studentId;
              const currentStatus = records[sid] || 'Present';
              const isPresent = currentStatus === 'Present';
              const isAbsent = currentStatus === 'Absent';
              const assignedClass = student.class || student.department || 'Class 10';

              return (
                <tr key={sid}>
                  <td>{student.studentId || 'N/A'}</td>
                  <td style={{ fontWeight: 500 }}>
                    {student.firstName || student.lastName
                      ? `${student.firstName || ''} ${student.lastName || ''}`.trim()
                      : student.name || 'Student'}
                  </td>
                  <td>
                    <span className="badge badge-secondary">{assignedClass}</span>
                  </td>
                  <td>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        style={{
                          padding: '0.4rem 1rem',
                          borderRadius: '6px',
                          border: '1px solid ' + (isPresent ? '#16a34a' : 'var(--border-color)'),
                          backgroundColor: isPresent ? '#22c55e' : 'var(--bg-card)',
                          color: isPresent ? '#ffffff' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isPresent ? '0 2px 6px rgba(34, 197, 94, 0.3)' : 'none',
                        }}
                        onClick={() => handleStatusChange(sid, 'Present')}
                      >
                        ✓ Present
                      </button>
                      <button
                        type="button"
                        style={{
                          padding: '0.4rem 1rem',
                          borderRadius: '6px',
                          border: '1px solid ' + (isAbsent ? '#dc2626' : 'var(--border-color)'),
                          backgroundColor: isAbsent ? '#ef4444' : 'var(--bg-card)',
                          color: isAbsent ? '#ffffff' : 'var(--text-main)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: isAbsent ? '0 2px 6px rgba(239, 68, 68, 0.3)' : 'none',
                        }}
                        onClick={() => handleStatusChange(sid, 'Absent')}
                      >
                        ✕ Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }}
          />

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>
              Submit Attendance
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};


export default MarkAttendance;
