import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Loader from '../../components/common/Loader.jsx';
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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        let res;
        if (role === 'student') {
          const sid = user?.studentId || user?._id || user?.id;
          res = await attendanceService.getStudentAttendance(sid);
        } else {

          res = await attendanceService.getAllAttendance();
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

  const filteredAttendance = attendance.filter((item) => {
    const term = search.toLowerCase();
    const studentName = (item.studentName || '').toLowerCase();
    const studentId = (item.studentCustomId || item.studentId || '').toLowerCase();
    const course = (item.courseName || item.courseId || '').toLowerCase();
    const assignedClass = (item.assignedClass || '').toLowerCase();
    const status = (item.status || '').toLowerCase();

    const matchesSearch =
      studentName.includes(term) ||
      studentId.includes(term) ||
      course.includes(term) ||
      assignedClass.includes(term);

    const matchesStatus =
      statusFilter === 'All' || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

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

      <div className="flex justify-between items-center mb-4 mt-4 flex-responsive gap-4">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, ID, class, or course..."
        />
        <div className="flex gap-2">
          {['All', 'Present', 'Absent'].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`btn ${statusFilter === filter ? (filter === 'Absent' ? 'btn-danger' : 'btn-primary') : 'btn-secondary'}`}
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              onClick={() => setStatusFilter(filter)}
            >
              {filter === 'All' ? 'All Logs' : filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="card">
          <Table
            headers={['Date', 'Student ID', 'Student Name', 'Assigned Class', 'Course/Subject', 'Status']}
            data={filteredAttendance}
            renderRow={(att, idx) => {
              const rawDate = att.date || att.createdAt || att.attendanceDate || att.timestamp || att.markedAt;
              return (
                <tr key={att._id || idx}>
                  <td>{formatDate(rawDate) || formatDate(new Date())}</td>
                  <td>{att.studentCustomId || att.studentId || 'N/A'}</td>
                  <td style={{ fontWeight: 500 }}>{att.studentName || 'Student'}</td>
                  <td><span className="badge badge-secondary">{att.assignedClass || 'Class 10'}</span></td>
                  <td>{att.courseName || att.courseId || 'Computer Science 101'}</td>
                  <td>
                    <span className={`badge ${att.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                      {att.status || 'Present'}
                    </span>
                  </td>
                </tr>
              );
            }}
            emptyMessage="No attendance logs found matching search criteria"
          />
        </div>
      )}
    </div>
  );
};


export default AttendanceList;
