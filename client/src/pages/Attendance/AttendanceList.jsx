import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { attendanceService } from '../../services/attendanceService.js';
import { toast } from '../../utils/toast.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { FiCheckSquare } from 'react-icons/fi';

export const AttendanceList = () => {
  const { role, user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        let res;
        if (role === 'student') {
          res = await attendanceService.getStudentAttendance({ studentId: user?._id });
        } else {
          res = await attendanceService.getCourseAttendance({ courseId: 'CS101' });
        }
        setAttendance(res.attendance || res || []);
      } catch (err) {
        toast.error('Failed to load attendance logs');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [role, user]);

  return (
    <div>
      <Header
        title="Attendance Records"
        subtitle="Track historical academic classroom attendance."
        actions={
          ['admin', 'faculty'].includes(role) && (
            <Link to="/attendance/mark">
              <Button variant="primary"><FiCheckSquare /> Mark Attendance</Button>
            </Link>
          )
        }
      />

      <div className="card mt-4">
        <Table
          headers={['Date', 'Course/Subject', 'Status']}
          data={attendance}
          renderRow={(att, idx) => (
            <tr key={idx}>
              <td>{formatDate(att.date)}</td>
              <td>{att.courseName || 'Computer Science 101'}</td>
              <td>
                <span className={`badge ${att.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                  {att.status || 'Present'}
                </span>
              </td>
            </tr>
          )}
          emptyMessage="No attendance logs found"
        />
      </div>
    </div>
  );
};

export default AttendanceList;
