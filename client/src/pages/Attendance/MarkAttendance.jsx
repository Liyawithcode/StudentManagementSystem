import React, { useEffect, useState } from 'react';
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
        setCourses(cRes.courses || cRes || []);
        
        const sRes = await studentService.getAllStudents();
        const stds = sRes.students || sRes || [];
        setStudents(stds);
        
        // Initialize records: everyone is Present by default
        const recs = {};
        stds.forEach((s) => {
          recs[s._id] = 'Present';
        });
        setRecords(recs);
      } catch (err) {
        toast.error('Failed to load courses or students');
      }
    };
    loadCoursesAndStudents();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setRecords({ ...records, [studentId]: status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      return toast.error('Please select a course');
    }
    setLoading(true);
    try {
      const attendanceData = students.map((s) => ({
        studentId: s._id,
        status: records[s._id] || 'Present',
      }));

      await attendanceService.recordAttendance({
        courseId: selectedCourse,
        date,
        records: attendanceData,
      });

      toast.success('Attendance recorded successfully!');
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
            options={courses.map((c) => ({ value: c._id, label: c.courseName || c.name }))}
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
            headers={['Student ID', 'Student Name', 'Attendance Status']}
            data={students}
            renderRow={(student) => (
              <tr key={student._id}>
                <td>{student.studentId || 'N/A'}</td>
                <td style={{ fontWeight: 500 }}>{student.firstName} {student.lastName}</td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={records[student._id] === 'Present' ? 'primary' : 'secondary'}
                      style={{ padding: '0.4rem 0.8rem' }}
                      onClick={() => handleStatusChange(student._id, 'Present')}
                    >
                      Present
                    </Button>
                    <Button
                      type="button"
                      variant={records[student._id] === 'Absent' ? 'danger' : 'secondary'}
                      style={{ padding: '0.4rem 0.8rem' }}
                      onClick={() => handleStatusChange(student._id, 'Absent')}
                    >
                      Absent
                    </Button>
                  </div>
                </td>
              </tr>
            )}
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
