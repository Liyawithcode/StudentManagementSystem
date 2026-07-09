import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import Input from '../../components/common/Input.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { courseService } from '../../services/courseService.js';
import { teacherService } from '../../services/teacherService.js';
import { toast } from '../../utils/toast.js';
import { FiPlus, FiTrash2, FiClock, FiCalendar, FiMapPin, FiUser, FiInfo, FiDownload } from 'react-icons/fi';

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const Timetable = () => {
  const { user, role } = useAuth();
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [teachers, setTeachers] = useState([]);

  // Filter state for Admin
  const [adminFilters, setAdminFilters] = useState({
    className: 'Grade 10-A',
    section: 'A',
    batch: '2026'
  });

  // Form state for creating a slot
  const [newSlot, setNewSlot] = useState({
    className: 'Grade 10-A',
    section: 'A',
    batch: '2026',
    subject: '',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    roomNumber: '',
    facultyId: ''
  });

  useEffect(() => {
    if (role === 'admin') {
      loadTeachers();
    }
  }, [role]);

  useEffect(() => {
    loadTimetable();
  }, [role, user, adminFilters]);

  const loadTeachers = async () => {
    try {
      const res = await teacherService.getAllTeachers();
      setTeachers(res.faculties || res || []);
    } catch (err) {
      toast.error('Failed to load teachers list');
    }
  };

  const loadTimetable = async () => {
    setLoading(true);
    try {
      if (role === 'student') {
        if (user?.className) {
          const res = await courseService.getTimetable({
            className: user.className
          });
          setTimetable(res.timetable || []);
        } else {
          setTimetable([]);
        }
      } else if (role === 'faculty') {
        const res = await teacherService.getSchedules(user?.facultyId || user?._id);
        setTimetable(res.schedules || []);
      } else if (role === 'admin') {
        const res = await courseService.getTimetable(adminFilters);
        setTimetable(res.timetable || []);
      }
    } catch (err) {
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFilterChange = (e) => {
    setAdminFilters({ ...adminFilters, [e.target.name]: e.target.value });
  };

  const handleNewSlotChange = (e) => {
    setNewSlot({ ...newSlot, [e.target.name]: e.target.value });
  };

  const handleAddSlotSubmit = async (e) => {
    e.preventDefault();
    if (!newSlot.subject || !newSlot.roomNumber || !newSlot.facultyId) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await courseService.createTimetable(newSlot);
      toast.success('Timetable slot added successfully');
      setShowAddModal(false);
      loadTimetable();
    } catch (err) {
      toast.error(err.message || 'Failed to add timetable slot');
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this class slot?')) return;
    try {
      await courseService.deleteTimetable(slotId);
      toast.success('Timetable slot deleted successfully');
      loadTimetable();
    } catch (err) {
      toast.error(err.message || 'Failed to delete timetable slot');
    }
  };

  // Group timetable slots by day
  const groupedTimetable = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = timetable.filter(slot => slot.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  const renderTimetableDay = (day, slots) => {
    if (slots.length === 0) {
      return (
        <div key={day} className="timetable-day-card card mb-4">
          <h4 className="timetable-day-title text-primary" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 600 }}>{day}</h4>
          <div className="text-center py-4 text-muted flex items-center justify-center gap-2">
            <FiInfo /> No classes scheduled for this day
          </div>
        </div>
      );
    }

    return (
      <div key={day} className="timetable-day-card card mb-4">
        <h4 className="timetable-day-title text-primary mb-4" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', fontWeight: 600 }}>{day}</h4>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => {
            // Find teacher name if admin or student
            const teacherObj = teachers.find(t => t.facultyId === slot.facultyId || t._id === slot.facultyId);
            const teacherName = teacherObj 
              ? (teacherObj.facultyfullname || teacherObj.name) 
              : `Instructor (${slot.facultyId})`;

            return (
              <div key={slot._id} className="card bg-glow p-4 flex flex-column justify-between position-relative" style={{ border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                {role === 'admin' && (
                  <button 
                    onClick={() => handleDeleteSlot(slot._id)}
                    className="position-absolute text-danger border-none cursor-pointer p-2 bg-transparent"
                    style={{ top: '10px', right: '10px', fontSize: '1.1rem' }}
                    title="Delete Slot"
                  >
                    <FiTrash2 />
                  </button>
                )}
                
                <div>
                  <div className="badge badge-success mb-2" style={{ display: 'inline-block' }}>{slot.subject}</div>
                  
                  <div className="flex items-center gap-2 mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
                    <FiClock />
                    <span>{slot.startTime} - {slot.endTime}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
                    <FiMapPin />
                    <span>Room {slot.roomNumber}</span>
                  </div>

                  {role !== 'faculty' ? (
                    <div className="flex items-center gap-2 mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
                      <FiUser />
                      <span>{teacherName}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
                      <FiUser />
                      <span>Class: {slot.className} - Sec {slot.section}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleDownloadTimetable = () => {
    if (timetable.length === 0) {
      toast.error('No timetable data available to download');
      return;
    }

    const title = role === 'student'
      ? `Weekly Timetable - Class ${user?.className || 'Schedule'}`
      : `Weekly Timetable - Faculty Schedule`;

    const headers = ["Day", "Subject", "Time", "Room", role === 'faculty' ? "Class/Section" : "Instructor"];

    // Sort timetable by day order
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const sortedTimetable = [...timetable].sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    const rows = sortedTimetable.map(slot => {
      const teacherObj = teachers.find(t => t.facultyId === slot.facultyId || t._id === slot.facultyId);
      const teacherName = teacherObj 
        ? (teacherObj.facultyfullname || teacherObj.name) 
        : `Instructor (${slot.facultyId})`;
      const detailInfo = role === 'faculty' 
        ? `Class: ${slot.className} - Sec ${slot.section}` 
        : teacherName;

      return [
        slot.day,
        slot.subject,
        `${slot.startTime} - ${slot.endTime}`,
        `Room ${slot.roomNumber}`,
        detailInfo
      ];
    });

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1e293b;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #4f46e5;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .header p {
              margin: 0;
              color: #64748b;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 12px 15px;
              text-align: left;
            }
            th {
              background-color: #f1f5f9;
              color: #4f46e5;
              font-weight: 600;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>Student Management System Portal</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Student Management System. All rights reserved.</p>
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
    toast.success('Timetable PDF generated successfully!');
  };

  return (
    <div>
      <Header
        title="Weekly Timetable"
        subtitle={
          role === 'student'
            ? `Class Schedules for ${user?.className || 'Unassigned Class'}`
            : role === 'faculty'
            ? 'Your Assigned Teaching Lectures & Schedules'
            : 'Define, modify, and monitor course timetable schedules.'
        }
        actions={
          <div className="flex gap-2">
            {(role === 'student' || role === 'faculty' || role === 'admin') && timetable.length > 0 && (
              <Button variant="download" onClick={handleDownloadTimetable} className="btn-download flex items-center gap-2">
                <FiDownload /> Download PDF
              </Button>
            )}
            {role === 'admin' && (
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FiPlus /> Add Slot
              </Button>
            )}
          </div>
        }
      />

      {/* Admin filter header */}
      {role === 'admin' && (
        <div className="card mb-6 grid md:grid-cols-3 gap-4" style={{ marginTop: '1.5rem' }}>
          <Input
            label="Class Name"
            name="className"
            value={adminFilters.className}
            onChange={handleAdminFilterChange}
            placeholder="e.g. Grade 10-A"
          />
          <Input
            label="Section"
            name="section"
            value={adminFilters.section}
            onChange={handleAdminFilterChange}
            placeholder="e.g. A"
          />
          <Input
            label="Batch Year"
            name="batch"
            value={adminFilters.batch}
            onChange={handleAdminFilterChange}
            placeholder="e.g. 2026"
          />
        </div>
      )}

      {/* Loading state / Main schedule rendering */}
      {loading ? (
        <Loader />
      ) : role === 'student' && !user?.className ? (
        <div className="card text-center py-8 mt-6">
          <FiCalendar style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h4 style={{ fontWeight: 600 }}>Class Not Assigned</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            You are currently not enrolled in any class. Please contact the academic administration department.
          </p>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem' }}>
          {DAYS_OF_WEEK.map(day => renderTimetableDay(day, groupedTimetable[day]))}
        </div>
      )}

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Add Timetable Slot
            </h3>
            
            <form onSubmit={handleAddSlotSubmit}>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <Input
                  label="Class Name"
                  name="className"
                  value={newSlot.className}
                  onChange={handleNewSlotChange}
                  required
                />
                <Input
                  label="Section"
                  name="section"
                  value={newSlot.section}
                  onChange={handleNewSlotChange}
                  required
                />
                <Input
                  label="Batch"
                  name="batch"
                  value={newSlot.batch}
                  onChange={handleNewSlotChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="Subject Name / Code"
                  name="subject"
                  value={newSlot.subject}
                  onChange={handleNewSlotChange}
                  required
                  placeholder="e.g. Mathematics"
                />
                <Dropdown
                  label="Day of the Week"
                  name="day"
                  value={newSlot.day}
                  onChange={handleNewSlotChange}
                  options={DAYS_OF_WEEK.map(d => ({ value: d, label: d }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input
                  label="Start Time"
                  name="startTime"
                  value={newSlot.startTime}
                  onChange={handleNewSlotChange}
                  required
                  placeholder="e.g. 09:00 AM"
                />
                <Input
                  label="End Time"
                  name="endTime"
                  value={newSlot.endTime}
                  onChange={handleNewSlotChange}
                  required
                  placeholder="e.g. 10:00 AM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Input
                  label="Room Number"
                  name="roomNumber"
                  value={newSlot.roomNumber}
                  onChange={handleNewSlotChange}
                  required
                  placeholder="e.g. 102"
                />
                <Dropdown
                  label="Assigned Faculty member"
                  name="facultyId"
                  value={newSlot.facultyId}
                  onChange={handleNewSlotChange}
                  required
                  options={[
                    { value: '', label: '-- Select Instructor --' },
                    ...teachers.map(t => ({
                      value: t.facultyId || t._id,
                      label: `${t.facultyfullname || t.name} (${t.facultyId || 'N/A'})`
                    }))
                  ]}
                />
              </div>

              <div className="flex gap-4 border-top pt-4 justify-end">
                <Button type="submit" variant="primary">Add Slot</Button>
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
