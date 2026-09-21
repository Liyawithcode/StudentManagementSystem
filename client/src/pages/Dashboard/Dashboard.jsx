import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../redux/slices/dashboardSlice.js';
import Header from '../../components/layout/Header.jsx';
import AttendanceChart from '../../components/charts/AttendanceChart.jsx';
import StudentChart from '../../components/charts/StudentChart.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Button from '../../components/common/Button.jsx';
import { Link } from 'react-router-dom';
import { feeService } from '../../services/feeService.js';
import { groupService } from '../../services/groupService.js';
import { apiCall } from '../../redux/api/apiSlice.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { formatCurrency } from '../../utils/helpers.js';
import { toast } from '../../utils/toast.js';
import {
  FiUsers,
  FiBookOpen,
  FiBell,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity,
  FiSearch,
  FiPlus,
  FiChevronRight,
  FiChevronLeft,
  FiBook,
  FiHome,
  FiMapPin,
  FiGrid,
  FiFileText,
  FiUserCheck,
  FiLayers,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser
} from 'react-icons/fi';
import './dashboard.css';

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  // State for interactive features
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [noticeSearch, setNoticeSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showSecondaryStats, setShowSecondaryStats] = useState(false);
  const [calendarDate, setCalendarDate] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [studentFees, setStudentFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [facultyLeaveNotices, setFacultyLeaveNotices] = useState([]);
  const [myStudentLeaves, setMyStudentLeaves] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Fetch student fees, faculty leave notices, and student's own leaves
  useEffect(() => {
    const loadStudentData = async () => {
      if (user?.role === 'student') {
        const studentIdentifier = user?.studentId || user?._id;
        setFeesLoading(true);
        try {
          const [feeRes, notifRes, facLeaveRes, myLeaveRes] = await Promise.all([
            feeService.getFeesByStudent(user?._id || user?.studentId).catch(() => ({ fees: [] })),
            apiCall('get', '/communication/notifications').catch(() => null),
            apiCall('get', '/students/faculty-leaves').catch(() => null),
            apiCall('get', `/students/leave/${studentIdentifier}`).catch(() => null),
          ]);

          setStudentFees(feeRes?.fees || []);
          if (myLeaveRes?.leaves) {
            setMyStudentLeaves(myLeaveRes.leaves);
          }

          let compiledNotices = [];

          // 1. From Announcement MongoDB model
          if (notifRes?.notifications || notifRes?.notices) {
            const list = notifRes.notifications || notifRes.notices || [];
            const leaveAnnouncements = list.filter(
              (n) => n.isLeaveNotice || (n.title && n.title.toLowerCase().includes('faculty leave'))
            );
            compiledNotices.push(...leaveAnnouncements);
          }

          // 2. From Leave MongoDB model for Faculty
          if (facLeaveRes?.leaves && Array.isArray(facLeaveRes.leaves)) {
            facLeaveRes.leaves.forEach((l) => {
              const title = `Faculty Leave Notice: ${l.applicantId}`;
              if (!compiledNotices.some((c) => c.title === title || (c.facultyId && c.facultyId === l.applicantId))) {
                compiledNotices.push({
                  _id: l._id,
                  title: `Faculty Leave Notice (${l.applicantId})`,
                  content: `Faculty member (${l.applicantId}) requested leave from ${new Date(l.startDate).toLocaleDateString()} to ${new Date(l.endDate).toLocaleDateString()}. Reason: ${l.reason}`,
                  author: l.applicantId,
                  createdAt: l.createdAt,
                  status: l.status,
                  isLeaveNotice: true,
                });
              }
            });
          }

          setFacultyLeaveNotices(compiledNotices);
        } catch (err) {
          console.error('Failed to load student leave data:', err);
        } finally {
          setFeesLoading(false);
        }
      }
    };
    loadStudentData();
  }, [user]);

  const [facultyLeavesList, setFacultyLeavesList] = useState([]);
  const [isLeaveApprovalModalOpen, setIsLeaveApprovalModalOpen] = useState(false);
  const [updatingLeaveId, setUpdatingLeaveId] = useState(null);

  // Fetch faculty leave applications for faculty/admin view & approval
  const fetchFacultyLeavesData = async () => {
    if (user?.role === 'faculty' || user?.role === 'admin') {
      try {
        const res = await apiCall('get', '/faculties/leave/all').catch(() =>
          apiCall('get', '/admins/leaves').catch(() => null)
        );
        if (res && res.leaves) {
          setFacultyLeavesList(res.leaves);
        }
      } catch (err) {
        console.error('Failed to fetch faculty leaves:', err);
      }
    }
  };

  useEffect(() => {
    fetchFacultyLeavesData();
  }, [user]);

  const handleFacultyLeaveStatus = async (id, status) => {
    setUpdatingLeaveId(id);
    try {
      const res = await apiCall('put', `/faculties/leave/${id}/status`, { status }).catch(() =>
        apiCall('put', `/admins/leaves/${id}`, { status })
      );
      if (res && res.success) {
        toast.success(`Faculty leave request ${status.toLowerCase()}!`);
        setFacultyLeavesList((prev) =>
          prev.map((item) => (item._id === id ? { ...item, status } : item))
        );
        dispatch(fetchDashboardStats());
      } else {
        toast.error(res?.message || 'Failed to update leave status');
      }
    } catch (err) {
      toast.error('Error updating leave status');
    } finally {
      setUpdatingLeaveId(null);
    }
  };

  if (loading && !stats) {
    return <Loader />;
  }

  // Helper to format greeting and name
  const getDisplayName = () => {
    if (!user) return 'Academic Member';
    if (user.role === 'admin') return user.adminfullname || user.name || 'Administrator';
    if (user.role === 'faculty') {
      return user.facultyfullname || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') || user.name || 'Faculty Member';
    }
    const first = user.firstName || '';
    const last = user.lastName || '';
    return `${first} ${last}`.trim() || user.name || 'Student';
  };

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning';
    if (hrs < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Fallback / standard statistics from API or default mocked database values
  const displayStats = stats ? {
    studentsCount: stats.students,
    teachersCount: stats.faculty,
    coursesCount: stats.courses,
    libraryBooks: stats.libraryBooks !== undefined ? stats.libraryBooks : 1280,
    hostelRooms: stats.hostelRooms !== undefined ? stats.hostelRooms : 120,
    transportRoutes: stats.transportRoutes !== undefined ? stats.transportRoutes : 18,
    unpaidFeesInvoices: stats.unpaidFeesInvoices !== undefined ? stats.unpaidFeesInvoices : 5,
    programLabels: stats.programLabels,
    programDataPoints: stats.programDataPoints,
    attendanceLabels: stats.attendanceLabels,
    attendanceDataPoints: stats.attendanceDataPoints,
    recentNotices: stats.recentNotices || [
      { id: '1', title: 'Summer Vacations Announcement', date: '2026-06-25', category: 'General', postedBy: 'Dean of Academics' },
      { id: '2', title: 'Final Semester Examinations Schedule', date: '2026-06-22', category: 'Academic', postedBy: 'Controller of Exams' },
      { id: '3', title: 'Annual Sports Day Registrations Open', date: '2026-06-18', category: 'Events', postedBy: 'Sports Committee' },
    ],
  } : {
    studentsCount: 1540,
    teachersCount: 82,
    coursesCount: 24,
    libraryBooks: 1280,
    hostelRooms: 120,
    transportRoutes: 18,
    unpaidFeesInvoices: 5,
    recentNotices: [
      { id: '1', title: 'Summer Vacations Announcement', date: '2026-06-25', category: 'General', postedBy: 'Dean of Academics' },
      { id: '2', title: 'Final Semester Examinations Schedule', date: '2026-06-22', category: 'Academic', postedBy: 'Controller of Exams' },
      { id: '3', title: 'Annual Sports Day Registrations Open', date: '2026-06-18', category: 'Events', postedBy: 'Sports Committee' },
    ],
  };

  const getRoleCards = () => {
    const role = user?.role || 'admin';

    if (role === 'student') {
      const pendingFeesAmount = stats?.pendingFeesAmount !== undefined ? stats.pendingFeesAmount : 0;
      return [
        {
          label: "Attendance Rate",
          val: stats?.attendanceRate !== undefined ? `${stats.attendanceRate}%` : "95.0%",
          change: stats?.assignedClass || user?.class || "Class 10",
          changeType: "info-badge",
          desc: "Recorded attendance rate",
          icon: <FiUserCheck />,
          color: "hsl(224, 76%, 48%)",
          glow: "rgba(30, 64, 175, 0.12)"
        },
        {
          label: "Academic Performance",
          val: stats?.performance !== undefined && stats?.performance > 0 ? `${stats.performance}%` : "88.5%",
          change: "Term Grade",
          changeType: "positive",
          desc: "Cumulative average percentage",
          icon: <FiTrendingUp />,
          color: "hsl(262, 83%, 58%)",
          glow: "rgba(99, 102, 241, 0.12)"
        },
        {
          label: "Enrolled Courses",
          val: stats?.courses !== undefined ? stats.courses : 4,
          change: "Current Sem",
          changeType: "info-badge",
          desc: "Registered this term",
          icon: <FiBookOpen />,
          color: "hsl(142, 72%, 29%)",
          glow: "rgba(16, 185, 129, 0.12)"
        },
        {
          label: "Pending Fees",
          val: formatCurrency(pendingFeesAmount),
          change: stats?.unpaidFeesInvoices > 0 ? `${stats.unpaidFeesInvoices} Pending` : "No Dues",
          changeType: stats?.unpaidFeesInvoices > 0 ? "negative" : "positive",
          desc: "Outstanding payment due",
          icon: <FiDollarSign />,
          color: "hsl(38, 92%, 50%)",
          glow: "rgba(245, 158, 11, 0.12)"
        }
      ];
    }

    if (role === 'faculty') {
      return [
        {
          label: "Assigned Subjects",
          val: stats?.subjects !== undefined ? stats.subjects : 3,
          change: user?.department || "General",
          changeType: "info-badge",
          desc: "Subjects allocated to teach",
          icon: <FiBook />,
          color: "hsl(224, 76%, 48%)",
          glow: "rgba(30, 64, 175, 0.12)"
        },
        {
          label: "Weekly Lectures",
          val: stats?.weeklyClasses !== undefined ? stats.weeklyClasses : 8,
          change: "Scheduled",
          changeType: "positive",
          desc: "Lectures scheduled this week",
          icon: <FiCalendar />,
          color: "hsl(262, 83%, 58%)",
          glow: "rgba(99, 102, 241, 0.12)"
        },
        {
          label: "My Students",
          val: stats?.students !== undefined ? stats.students : 35,
          change: "Class & Dept",
          changeType: "info-badge",
          desc: "Enrolled in assigned department",
          icon: <FiUsers />,
          color: "hsl(142, 72%, 29%)",
          glow: "rgba(16, 185, 129, 0.12)"
        },
        {
          label: "Pending Leaves",
          val: stats?.pendingLeaves !== undefined ? stats.pendingLeaves : 0,
          change: stats?.pendingLeaves > 0 ? "Awaiting Review" : "All Approved",
          changeType: stats?.pendingLeaves > 0 ? "negative" : "positive",
          desc: "Leave requests pending approval",
          icon: <FiFileText />,
          color: "hsl(38, 92%, 50%)",
          glow: "rgba(245, 158, 11, 0.12)"
        }
      ];
    }

    // Default: Admin
    return [
      {
        label: "Total Students",
        val: displayStats.studentsCount,
        change: "+4.8%",
        changeType: "positive",
        desc: "Enrolled in dynamic programs",
        icon: <FiUsers />,
        color: "hsl(224, 76%, 48%)",
        glow: "rgba(30, 64, 175, 0.12)"
      },
      {
        label: "Total Faculty",
        val: displayStats.teachersCount,
        change: "+2 new",
        changeType: "positive",
        desc: "Active professors & advisors",
        icon: <FiUsers />,
        color: "hsl(262, 83%, 58%)",
        glow: "rgba(99, 102, 241, 0.12)"
      },
      {
        label: "Active Courses",
        val: displayStats.coursesCount,
        change: "6 Depts",
        changeType: "info-badge",
        desc: "Across all semesters",
        icon: <FiBookOpen />,
        color: "hsl(142, 72%, 29%)",
        glow: "rgba(16, 185, 129, 0.12)"
      },
      {
        label: "Unpaid Fees Invoices",
        val: displayStats.unpaidFeesInvoices,
        change: "Pending",
        changeType: "negative",
        desc: "Fee reports outstanding",
        icon: <FiDollarSign />,
        color: "hsl(38, 92%, 50%)",
        glow: "rgba(245, 158, 11, 0.12)"
      }
    ];
  };

  const getSecondaryStats = () => {
    const role = user?.role || 'admin';

    if (role === 'student') {
      return [
        {
          label: "Books Issued",
          val: stats?.libraryBooks !== undefined ? stats.libraryBooks : 0,
          desc: "Books currently borrowed",
          icon: <FiBook />,
          color: "hsl(199, 89%, 48%)",
          glow: "rgba(56, 189, 248, 0.12)",
          link: "/library"
        },
        {
          label: "My Hostel Room",
          val: stats?.hostelRooms !== undefined ? stats.hostelRooms : "Not Allocated",
          desc: "Allocated campus room",
          icon: <FiHome />,
          color: "hsl(350, 89%, 60%)",
          glow: "rgba(244, 63, 94, 0.12)",
          link: "/hostels"
        },
        {
          label: "My Transport Route",
          val: stats?.transportRoutes !== undefined ? stats.transportRoutes : "Not Assigned",
          desc: "Assigned shuttle service",
          icon: <FiMapPin />,
          color: "hsl(271, 91%, 65%)",
          glow: "rgba(168, 85, 247, 0.12)",
          link: "/transport"
        }
      ];
    }

    // Admin & Faculty
    return [
      {
        label: "Library Inventory",
        val: displayStats.libraryBooks,
        desc: "Total reference books",
        icon: <FiBook />,
        color: "hsl(199, 89%, 48%)",
        glow: "rgba(56, 189, 248, 0.12)",
        link: "/library"
      },
      {
        label: "Hostel Allocations",
        val: displayStats.hostelRooms,
        desc: "Rooms currently allocated",
        icon: <FiHome />,
        color: "hsl(350, 89%, 60%)",
        glow: "rgba(244, 63, 94, 0.12)",
        link: "/hostels"
      },
      {
        label: "Transport Routes",
        val: displayStats.transportRoutes,
        desc: "Active shuttle buses",
        icon: <FiMapPin />,
        color: "hsl(271, 91%, 65%)",
        glow: "rgba(168, 85, 247, 0.12)",
        link: "/transport"
      }
    ];
  };

  // Detailed notices body descriptions
  const noticeDescriptions = {
    '1': 'This is to inform all students and faculty members that the campus will remain closed for summer vacations starting from July 22, 2026, to August 31, 2026. Normal academic activities and administrative offices will resume on September 1, 2026. Students residing in hostels must vacate their rooms by July 21. Have a wonderful and safe summer break!',
    '2': 'The final semester exam schedule for all undergraduate courses has been published. Examinations are scheduled to commence on July 15, 2026, and will conclude on July 20, 2026. Hall tickets will be issued starting July 5. Please ensure all outstanding tuition fees are cleared prior to hall ticket collection. Best of luck with your preparations!',
    '3': 'Registrations for the Annual Sports Meet 2026 are now officially open. Events include track & field athletics, football, basketball, table tennis, and chess. Interested students can register via the portal or visit the physical sports department desk. The last date to submit registrations is July 5, 2026. Join us to celebrate teamwork and sportsmanship!'
  };

  // Interactive events list mapped to calendar
  const academicEvents = [
    { id: 'e1', date: '2026-07-05', title: 'Annual Sports Day Registrations Close', time: '05:00 PM', type: 'sports', tagColor: 'var(--warning)', tagBg: 'var(--warning-bg)' },
    { id: 'e2', date: '2026-07-08', title: 'Guest Lecture: Future of AI & Ethics', time: '02:00 PM - 04:00 PM', type: 'academic', tagColor: 'var(--primary)', tagBg: 'var(--primary-glow)' },
    { id: 'e3', date: '2026-07-15', title: 'Final Semester Examinations Start', time: '10:00 AM', type: 'exam', tagColor: 'var(--danger)', tagBg: 'var(--danger-bg)' },
    { id: 'e4', date: '2026-07-22', title: 'Summer Vacations Commence', time: 'All Day', type: 'holiday', tagColor: 'var(--success)', tagBg: 'var(--success-bg)' },
  ];

  // Render Calendar Helper
  const renderCalendar = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-date-cell empty-date" />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const today = new Date();
      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      const hasEvent = academicEvents.some(evt => evt.date === dateStr);

      cells.push(
        <div
          key={`day-${day}`}
          className={`calendar-date-cell ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}`}
          title={hasEvent ? academicEvents.find(evt => evt.date === dateStr).title : undefined}
        >
          {day}
        </div>
      );
    }
    return cells;
  };

  // Filter Notices (including Faculty Leave Notices)
  const allNoticesCombined = [
    ...facultyLeaveNotices.map((fn) => ({
      id: fn._id || fn.id || String(Math.random()),
      title: fn.title,
      content: fn.content,
      date: fn.createdAt ? new Date(fn.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      category: 'Academic',
      postedBy: fn.author || 'Faculty Mentor',
    })),
    ...displayStats.recentNotices,
  ];

  const filteredNotices = allNoticesCombined.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      (notice.postedBy && notice.postedBy.toLowerCase().includes(noticeSearch.toLowerCase())) ||
      (notice.content && notice.content.toLowerCase().includes(noticeSearch.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || notice.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-entrance" style={{ maxWidth: '1400px', margin: '0 auto' }}>

      {/* Welcome Greeting Banner */}
      <div className="welcome-banner">
        <div className="welcome-text-container">
          <h1 className="welcome-title">{getGreeting()}, {getDisplayName()}!</h1>
          <p className="welcome-subtitle">
            {user?.role === 'student'
              ? `Assigned Class: ${user?.class || stats?.assignedClass || 'Class 10'} • Student ID: ${user?.studentId || 'ST-2026-0001'}`
              : user?.role === 'faculty'
                ? `Department: ${user?.department || 'General Academics'} • Faculty ID: ${user?.facultyId || 'FAC-2026-001'}`
                : 'Welcome to your administrative command center. Real-time reports and academic updates.'}
          </p>
          <div className="welcome-meta-info">
            <div className="welcome-meta-item">
              <FiCalendar />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="welcome-meta-item">
              <FiActivity />
              <span style={{ textTransform: 'capitalize' }}>Role: {user?.role || 'admin'} Portal</span>
            </div>
            <Link to="/" className="dashboard-home-btn">
              <FiHome />
              <span>Homepage</span>
            </Link>
          </div>
        </div>
        <div className="welcome-illustration">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </div>
      </div>

      {/* Live Premium Faculty Leave Alerts Banner for Students */}
      {user?.role === 'student' && facultyLeaveNotices.length > 0 && (
        <div className="faculty-leave-alert-container">
          <div className="faculty-leave-header-row">
            <div className="faculty-leave-title-box">
              <div className="faculty-leave-bell-wrapper">
                <FiBell />
              </div>
              <div>
                <h4 className="faculty-leave-title-text">
                  Faculty Leave Alerts
                  <span className="faculty-leave-count-badge">{facultyLeaveNotices.length}</span>
                </h4>
                <p className="faculty-leave-subtitle">
                  Notifications sent by faculty mentors in your assigned student groups
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-column gap-3">
            {facultyLeaveNotices.map((notif, idx) => {
              const authorName = notif.author || 'Faculty Mentor';
              const initials = authorName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();

              return (
                <div key={notif._id || idx} className="faculty-leave-item-card">
                  <div className="faculty-leave-card-top">
                    <div className="faculty-leave-avatar-box">
                      <div className="faculty-avatar-circle">{initials}</div>
                      <div>
                        <h5 className="faculty-leave-item-title">{notif.title}</h5>
                      </div>
                    </div>
                    <span className="faculty-on-leave-pill">
                      <span className="pulse-dot-red" />
                      Faculty On Leave
                    </span>
                  </div>

                  <p
                    style={{
                      margin: '0 0 0.75rem 0',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                      lineHeight: '1.5',
                      fontWeight: 500,
                    }}
                  >
                    {notif.content}
                  </p>

                  <div className="faculty-leave-footer-row">
                    <span>
                      Posted by <strong>{authorName}</strong>
                    </span>
                    <span>
                      <FiCalendar style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Student Personal Leave Status Section */}
      {user?.role === 'student' && myStudentLeaves.length > 0 && (
        <div
          className="card mb-4"
          style={{
            borderLeft: '4px solid var(--primary, #3b82f6)',
            background: 'var(--bg-card, #ffffff)',
          }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <FiFileText style={{ color: 'var(--primary)', fontSize: '1.25rem' }} />
              <h4 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 600 }}>
                My Leave Application Status ({myStudentLeaves.length})
              </h4>
            </div>
            <Link to="/leaves">
              <span className="badge badge-info" style={{ cursor: 'pointer' }}>
                View All Applications <FiChevronRight style={{ fontSize: '0.7rem' }} />
              </span>
            </Link>
          </div>
          <div className="flex flex-column gap-2">
            {myStudentLeaves.slice(0, 3).map((l) => (
              <div
                key={l._id}
                className="p-3 flex justify-between items-center"
                style={{
                  background: 'var(--bg-body, #f9fafb)',
                  borderRadius: 'var(--radius-md, 8px)',
                  border: '1px solid var(--border-color, #e5e7eb)',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Leave: {formatDate(l.startDate)} to {formatDate(l.endDate)}
                  </strong>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Reason: {l.reason}
                  </p>
                </div>
                <span
                  className={`badge ${l.status === 'Approved'
                    ? 'badge-success'
                    : l.status === 'Rejected'
                      ? 'badge-danger'
                      : 'badge-warning'
                    }`}
                >
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Faculty Leave Approval Dashboard Banner */}
      {(user?.role === 'faculty' || user?.role === 'admin') && (
        <div className="faculty-leave-portal-card page-entrance">
          <div className="faculty-leave-portal-header">
            <div className="faculty-leave-portal-title-group">
              <div className="faculty-leave-portal-icon-wrapper">
                <FiFileText />
              </div>
              <div>
                <h4 className="faculty-leave-portal-heading">
                  Faculty Leave Management & Approval Portal
                </h4>
                <p className="faculty-leave-portal-subheading">
                  Review leave applications submitted by faculty members and grant instant approvals via popup
                </p>
              </div>
            </div>
            <Button
              variant="warning"
              size="sm"
              onClick={() => setIsLeaveApprovalModalOpen(true)}
            >
              <FiFileText style={{ marginRight: '6px' }} />
              Open Leave Approval Popup ({facultyLeavesList.filter((l) => l.status === 'pending').length} Pending)
            </Button>
          </div>

          {facultyLeavesList.length > 0 ? (
            <div className="faculty-leave-portal-grid">
              {facultyLeavesList.slice(0, 4).map((leave) => (
                <div key={leave._id} className="leave-request-card">
                  <div className="leave-card-top-row">
                    <span className="leave-applicant-chip">
                      <FiUser style={{ fontSize: '0.85rem' }} /> Applicant: {leave.applicantId}
                    </span>
                    <span
                      className={`leave-status-pill ${leave.status === 'Approved'
                        ? 'approved'
                        : leave.status === 'Rejected'
                          ? 'rejected'
                          : 'pending'
                        }`}
                    >
                      {leave.status === 'Approved' && <FiCheckCircle />}
                      {leave.status === 'Rejected' && <FiXCircle />}
                      {leave.status === 'pending' && <FiClock />}
                      {leave.status}
                    </span>
                  </div>

                  <div className="leave-dates-box">
                    <FiCalendar className="leave-dates-icon" />
                    <span>{formatDate(leave.startDate)} &mdash; {formatDate(leave.endDate)}</span>
                  </div>

                  <p className="leave-reason-quote" title={leave.reason}>
                    <strong>Reason:</strong> {leave.reason}
                  </p>

                  <div className="leave-card-footer">
                    <span>
                      Type: <strong>{leave.applicantType || 'Faculty'}</strong>
                    </span>

                    {leave.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          disabled={updatingLeaveId === leave._id}
                          onClick={() => handleFacultyLeaveStatus(leave._id, 'Approved')}
                        >
                          <FiCheckCircle style={{ marginRight: '4px' }} /> Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={updatingLeaveId === leave._id}
                          onClick={() => handleFacultyLeaveStatus(leave._id, 'Rejected')}
                        >
                          <FiXCircle style={{ marginRight: '4px' }} /> Reject
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setIsLeaveApprovalModalOpen(true)}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No active leave applications recorded yet.
            </p>
          )}
        </div>
      )}

      {/* Dynamic Role-Based Quick Actions */}
      <div className="quick-actions-card">
        <h4 className="quick-actions-title">
          <FiGrid /> Quick Portal Shortcuts
        </h4>
        <div className="quick-actions-grid">
          {user?.role === 'admin' && (
            <>
              <Link to="/groups" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--primary)' }}><FiLayers /></span>
                <span>Student Groups</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsLeaveApprovalModalOpen(true)}
                className="quick-action-btn"
                style={{ border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', width: '100%' }}
              >
                <span className="quick-action-icon" style={{ color: 'var(--warning)' }}><FiFileText /></span>
                <span>Approve Faculty Leaves</span>
              </button>
              <Link to="/students/add" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--accent)' }}><FiPlus /></span>
                <span>Add Student</span>
              </Link>
              <Link to="/notice/add" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--success)' }}><FiBell /></span>
                <span>Add Notice</span>
              </Link>
            </>
          )}
          {user?.role === 'faculty' && (
            <>
              <Link to="/groups" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--primary)' }}><FiLayers /></span>
                <span>My Student Groups</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsLeaveApprovalModalOpen(true)}
                className="quick-action-btn"
                style={{ border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', width: '100%' }}
              >
                <span className="quick-action-icon" style={{ color: 'var(--warning)' }}><FiFileText /></span>
                <span>Approve Faculty Leaves ({facultyLeavesList.filter(l => l.status === 'pending').length})</span>
              </button>
              <Link to="/leaves" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--warning)' }}><FiFileText /></span>
                <span>Apply for Leave</span>
              </Link>
              <Link to="/attendance/mark" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--accent)' }}><FiUserCheck /></span>
                <span>Mark Attendance</span>
              </Link>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <Link to="/groups" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--primary)' }}><FiLayers /></span>
                <span>Student Groups</span>
              </Link>
              <Link to="/leaves" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--warning)' }}><FiFileText /></span>
                <span>Apply Leave</span>
              </Link>
              <Link to="/attendance" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--accent)' }}><FiActivity /></span>
                <span>My Attendance</span>
              </Link>
              <Link to="/exams/result" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--success)' }}><FiBookOpen /></span>
                <span>View Results</span>
              </Link>
            </>
          )}
        </div>
      </div>


      {/* Premium Stats Grid */}
      <div className="premium-stats-grid">
        {getRoleCards().map((card, idx) => (
          <div
            key={idx}
            className="premium-stat-card"
            style={{ '--stat-color': card.color, '--stat-glow-color': card.glow }}
          >
            <div className="stat-details">
              <span className="stat-label">{card.label}</span>
              <div className="stat-value-container">
                <span className="stat-val">{card.val}</span>
                {card.change && (
                  <span className={`stat-change ${card.changeType === 'positive' ? 'positive' : card.changeType === 'negative' ? 'negative' : 'info-badge'}`}>
                    {card.changeType === 'positive' && <FiTrendingUp />}
                    {card.changeType === 'negative' && <FiTrendingDown />}
                    {card.change}
                  </span>
                )}
              </div>
              <span className="stat-desc">{card.desc}</span>
            </div>
            <div className="stat-icon-wrapper">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Collapsible Secondary Metrics Panel */}
      <button
        className="secondary-stats-toggle"
        onClick={() => setShowSecondaryStats(!showSecondaryStats)}
      >
        <span>{showSecondaryStats ? 'Hide Secondary Metrics' : 'Show Secondary Campus Metrics'}</span>
        <span style={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }}>
          {showSecondaryStats ? <FiChevronRight style={{ transform: 'rotate(-90deg)' }} /> : <FiChevronRight style={{ transform: 'rotate(90deg)' }} />}
        </span>
      </button>

      {showSecondaryStats && (
        <div className="secondary-stats-grid">
          {getSecondaryStats().map((secStat, idx) => (
            <Link
              key={idx}
              to={secStat.link}
              className="premium-stat-card animate-fade-in"
              style={{ '--stat-color': secStat.color, '--stat-glow-color': secStat.glow }}
            >
              <div className="stat-details">
                <span className="stat-label">{secStat.label}</span>
                <div className="stat-value-container">
                  <span className="stat-val">{secStat.val}</span>
                </div>
                <span className="stat-desc">{secStat.desc}</span>
              </div>
              <div className="stat-icon-wrapper">
                {secStat.icon}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Student Fee Records Section */}
      {user?.role === 'student' && (
        <div className="card mt-4 student-fees-section">
          <div className="flex justify-between items-center mb-4">
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiDollarSign style={{ color: 'var(--warning)' }} /> My Fee Records
            </h4>
            <Link to="/fees">
              <span className="badge badge-info" style={{ cursor: 'pointer' }}>View All <FiChevronRight style={{ fontSize: '0.7rem' }} /></span>
            </Link>
          </div>

          {feesLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading fee records...</div>
          ) : studentFees.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <FiDollarSign style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No fee records found for your account.</p>
            </div>
          ) : (
            <div className="student-fees-table-wrapper">
              <table className="student-fees-table">
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentFees.map((fee) => (
                    <tr key={fee._id}>
                      <td style={{ fontWeight: 500 }}>#{fee._id ? fee._id.slice(-6).toUpperCase() : 'N/A'}</td>
                      <td>{fee.feeType || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(fee.feeAmount)}</td>
                      <td>{formatDate(fee.dueDate)}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {fee.paymentMethod || 'CASH'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${fee.feeStatus === 'Paid' ? 'badge-success' :
                          fee.feeStatus === 'Partial' ? 'badge-warning' :
                            'badge-danger'
                          }`}>
                          {fee.feeStatus === 'Paid' ? '✓ Paid' :
                            fee.feeStatus === 'Partial' ? '◐ Partial' :
                              '✗ Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Fee Summary Cards */}
              <div className="fee-summary-row">
                <div className="fee-summary-card" style={{ borderLeft: '3px solid var(--success)' }}>
                  <span className="fee-summary-label">Total Paid</span>
                  <span className="fee-summary-value" style={{ color: 'var(--success)' }}>
                    {formatCurrency(studentFees.filter(f => f.feeStatus === 'Paid').reduce((sum, f) => sum + (f.feeAmount || 0), 0))}
                  </span>
                </div>
                <div className="fee-summary-card" style={{ borderLeft: '3px solid var(--danger)' }}>
                  <span className="fee-summary-label">Total Pending</span>
                  <span className="fee-summary-value" style={{ color: 'var(--danger)' }}>
                    {formatCurrency(studentFees.filter(f => f.feeStatus !== 'Paid').reduce((sum, f) => sum + (f.feeAmount || 0), 0))}
                  </span>
                </div>
                <div className="fee-summary-card" style={{ borderLeft: '3px solid var(--primary)' }}>
                  <span className="fee-summary-label">Total Records</span>
                  <span className="fee-summary-value" style={{ color: 'var(--primary)' }}>
                    {studentFees.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Analytical Charts Row */}
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, margin: 0 }}>Weekly Attendance Performance</h4>
            <span className="badge badge-success">Target: 95%+</span>
          </div>
          <AttendanceChart labels={displayStats.attendanceLabels} dataPoints={displayStats.attendanceDataPoints} />
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, margin: 0 }}>Program-wise Enrollments</h4>
            <span className="badge badge-info">Regular Term</span>
          </div>
          <StudentChart labels={displayStats.programLabels} dataPoints={displayStats.programDataPoints} />
        </div>
      </div>

      {/* Two Columns: Noticeboard & Academic Event Calendar */}
      <div className="dashboard-details-row">

        {/* Noticeboard Section */}
        <div className="card">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiBell style={{ color: 'var(--accent)' }} /> Bulletins Noticeboard
          </h4>

          {/* Noticeboard tabs categories filter */}
          <div className="noticeboard-tabs">
            {['All', 'General', 'Academic', 'Events'].map(cat => (
              <button
                key={cat}
                className={`notice-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar inside Noticeboard */}
          <div className="noticeboard-search-bar">
            <FiSearch style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search announcements..."
              value={noticeSearch}
              onChange={(e) => setNoticeSearch(e.target.value)}
              className="noticeboard-search-input"
            />
          </div>

          {/* Notices Card list */}
          <div className="notice-card-list">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="premium-notice-card"
                  onClick={() => setSelectedNotice(notice)}
                >
                  <div className="notice-card-header">
                    <h5 className="notice-card-title">{notice.title}</h5>
                    <span className="notice-card-date">{notice.date}</span>
                  </div>
                  <p className="notice-card-body">
                    {noticeDescriptions[notice.id] ? noticeDescriptions[notice.id].substring(0, 110) + '...' : 'Click to read detailed circular description...'}
                  </p>
                  <div className="notice-footer-meta">
                    <span className={`badge ${notice.category === 'Academic' ? 'badge-info' :
                      notice.category === 'Events' ? 'badge-success' : 'badge-warning'
                      }`}>
                      {notice.category || 'General'}
                    </span>
                    <span className="notice-posted-by">
                      <span className="poster-avatar-mini">
                        {(notice.postedBy || 'AD')[0]}
                      </span>
                      {notice.postedBy || 'Admin'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <FiBell style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No notices found matching search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Academic Calendar / Events Widget */}
        <div className="calendar-card flex flex-column">
          <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiCalendar style={{ color: 'var(--primary)' }} /> Academic Scheduler
          </h4>

          {/* Month Indicator and header */}
          <div className="calendar-header">
            <span className="calendar-month">
              {calendarDate.toLocaleString('default', { month: 'long' })} {calendarDate.getFullYear()}
            </span>
            <div className="flex gap-2">
              <button className="calendar-nav-btn" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} aria-label="Previous Month"><FiChevronLeft /></button>
              <button className="calendar-nav-btn" onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} aria-label="Next Month"><FiChevronRight /></button>
            </div>
          </div>

          {/* Day Names Row */}
          <div className="calendar-days-grid">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="calendar-day-label">{day}</div>
            ))}
            {renderCalendar()}
          </div>

          {/* Upcoming timeline events list */}
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Upcoming Events</span>
            <div className="upcoming-events-list">
              {academicEvents.map((evt) => (
                <div key={evt.id} className="event-timeline-item">
                  <div className="event-badge">
                    <FiCalendar />
                  </div>
                  <div className="event-details">
                    <span className="event-title-text">{evt.title}</span>
                    <span className="event-time">{evt.date} • {evt.time}</span>
                    <span className="event-tag-pill" style={{ background: evt.tagBg, color: evt.tagColor }}>
                      {evt.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Circular Detailed Dialog Modal */}
      <Modal
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        title="Bulletin Announcement"
      >
        {selectedNotice && (
          <div className="notice-modal-details">
            <h3 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {selectedNotice.title}
            </h3>
            <div className="notice-modal-meta">
              <span>Category: <strong>{selectedNotice.category || 'General'}</strong></span>
              <span>Posted: <strong>{selectedNotice.date}</strong></span>
            </div>
            <div className="notice-modal-content">
              <p>{noticeDescriptions[selectedNotice.id] || 'Announcement detailed body text...'}</p>
            </div>
            <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Author: <strong>{selectedNotice.postedBy || 'System Administrator'}</strong></span>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedNotice(null)}
                style={{ padding: '0.4rem 1rem' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Faculty Leave Request Approval Modal Popup */}
      <Modal
        isOpen={isLeaveApprovalModalOpen}
        onClose={() => setIsLeaveApprovalModalOpen(false)}
        title="Faculty Leave Request Approval"
        size="lg"
      >
        <div className="p-1">
          <div className="modal-leave-summary-banner">
            <div className="modal-leave-summary-left">
              <div className="modal-leave-summary-icon">
                <FiFileText />
              </div>
              <div>
                <h5 className="modal-leave-summary-title">
                  Pending Approvals ({facultyLeavesList.filter((l) => l.status === 'pending').length})
                </h5>
                <p className="modal-leave-summary-desc">
                  Review faculty leave applications and take quick actions
                </p>
              </div>
            </div>
            <span className="modal-portal-chip">Faculty Portal</span>
          </div>

          {facultyLeavesList.length === 0 ? (
            <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FiFileText style={{ fontSize: '2.5rem', marginBottom: '0.5rem', opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No faculty leave applications found in the system.</p>
            </div>
          ) : (
            <div className="flex flex-column gap-3" style={{ maxHeight: '460px', overflowY: 'auto', paddingRight: '4px' }}>
              {facultyLeavesList.map((leave) => (
                <div key={leave._id} className="leave-request-card">
                  <div className="leave-card-top-row">
                    <span className="leave-applicant-chip">
                      <FiUser style={{ fontSize: '0.85rem' }} /> Applicant: {leave.applicantId}
                    </span>
                    <span
                      className={`leave-status-pill ${leave.status === 'Approved'
                        ? 'approved'
                        : leave.status === 'Rejected'
                          ? 'rejected'
                          : 'pending'
                        }`}
                    >
                      {leave.status === 'Approved' && <FiCheckCircle />}
                      {leave.status === 'Rejected' && <FiXCircle />}
                      {leave.status === 'pending' && <FiClock />}
                      {leave.status}
                    </span>
                  </div>

                  <div className="leave-dates-box">
                    <FiCalendar className="leave-dates-icon" />
                    <span>{formatDate(leave.startDate)} &mdash; {formatDate(leave.endDate)}</span>
                  </div>

                  <p className="leave-reason-quote">
                    <strong>Reason:</strong> {leave.reason}
                  </p>

                  <div className="leave-card-footer">
                    <span>
                      Submitted: <strong>{formatDate(leave.createdAt)}</strong>
                    </span>

                    {leave.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          variant="success"
                          size="sm"
                          disabled={updatingLeaveId === leave._id}
                          onClick={() => handleFacultyLeaveStatus(leave._id, 'Approved')}
                        >
                          <FiCheckCircle style={{ marginRight: '4px' }} />
                          {updatingLeaveId === leave._id ? 'Updating...' : 'Approve'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={updatingLeaveId === leave._id}
                          onClick={() => handleFacultyLeaveStatus(leave._id, 'Rejected')}
                        >
                          <FiXCircle style={{ marginRight: '4px' }} />
                          {updatingLeaveId === leave._id ? 'Updating...' : 'Reject'}
                        </Button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        Decision: <strong style={{ textTransform: 'capitalize' }}>{leave.status}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Button variant="secondary" onClick={() => setIsLeaveApprovalModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Dashboard;

