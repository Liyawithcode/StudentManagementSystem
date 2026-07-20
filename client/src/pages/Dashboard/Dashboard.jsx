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
import { formatDate } from '../../utils/dateFormatter.js';
import { formatCurrency } from '../../utils/helpers.js';
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
  FiUserCheck
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

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Fetch student fees when user is a student
  useEffect(() => {
    const loadStudentFees = async () => {
      if (user?.role === 'student') {
        const studentIdentifier = user?._id || user?.studentId;
        setFeesLoading(true);
        try {
          const res = await feeService.getFeesByStudent(studentIdentifier);
          setStudentFees(res.fees || []);
        } catch (err) {
          console.error('Failed to load student fees:', err);
        } finally {
          setFeesLoading(false);
        }
      }
    };
    loadStudentFees();
  }, [user]);

  if (loading && !stats) {
    return <Loader />;
  }

  // Helper to format greeting and name
  const getDisplayName = () => {
    if (!user) return 'Academic Member';
    if (user.role === 'admin') return user.adminfullname || 'Administrator';
    const first = user.firstName || '';
    const last = user.lastName || '';
    return `${first} ${last}`.trim() || 'Academic Member';
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
          val: stats?.attendanceRate !== undefined ? `${stats.attendanceRate}%` : "92.5%",
          change: "Active",
          changeType: "info-badge",
          desc: "Based on class records",
          icon: <FiUserCheck />,
          color: "hsl(224, 76%, 48%)",
          glow: "rgba(30, 64, 175, 0.12)"
        },
        {
          label: "Academic Performance",
          val: stats?.performance !== undefined && stats?.performance > 0 ? `${stats.performance}%` : "85.0%",
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
          change: "Allocated",
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
          val: stats?.students !== undefined ? stats.students : 120,
          change: "Department-wide",
          changeType: "info-badge",
          desc: "Students in your department",
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

  // Filter Notices
  const filteredNotices = displayStats.recentNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      (notice.postedBy && notice.postedBy.toLowerCase().includes(noticeSearch.toLowerCase()));
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
            Welcome to your administrative command center. Here is your real-time report, schedule tracking, and academic updates.
          </p>
          <div className="welcome-meta-info">
            <div className="welcome-meta-item">
              <FiCalendar />
              <span>Thursday, July 2, 2026</span>
            </div>
            <div className="welcome-meta-item">
              <FiActivity />
              <span style={{ textTransform: 'capitalize' }}>Role: {user?.role || 'admin'} Portal</span>
            </div>
          </div>
        </div>
        <div className="welcome-illustration">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
        </div>
      </div>

      {/* Dynamic Role-Based Quick Actions */}
      <div className="quick-actions-card">
        <h4 className="quick-actions-title">
          <FiGrid /> Quick Portal Shortcuts
        </h4>
        <div className="quick-actions-grid">
          {user?.role === 'admin' && (
            <>
              <Link to="/students/add" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--primary)' }}><FiPlus /></span>
                <span>Add Student</span>
              </Link>
              <Link to="/attendance/mark" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--accent)' }}><FiUserCheck /></span>
                <span>Mark Attendance</span>
              </Link>
              <Link to="/fees/collect" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--warning)' }}><FiDollarSign /></span>
                <span>Collect Fees</span>
              </Link>
              <Link to="/notice/add" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--success)' }}><FiBell /></span>
                <span>Add Notice</span>
              </Link>
            </>
          )}
          {user?.role === 'faculty' && (
            <>
              <Link to="/attendance/mark" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--accent)' }}><FiUserCheck /></span>
                <span>Mark Attendance</span>
              </Link>
              <Link to="/exams/marks" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--primary)' }}><FiFileText /></span>
                <span>Add Exam Marks</span>
              </Link>
              <Link to="/notice/add" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--success)' }}><FiBell /></span>
                <span>Add Notice</span>
              </Link>
            </>
          )}
          {user?.role === 'student' && (
            <>
              <Link to="/profile" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--primary)' }}><FiUsers /></span>
                <span>View Profile</span>
              </Link>
              <Link to="/attendance/report" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--accent)' }}><FiActivity /></span>
                <span>My Attendance</span>
              </Link>
              <Link to="/exams/result" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--success)' }}><FiBookOpen /></span>
                <span>View Results</span>
              </Link>
              <Link to="/fees" className="quick-action-btn">
                <span className="quick-action-icon" style={{ color: 'var(--warning)' }}><FiDollarSign /></span>
                <span>My Fees</span>
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
          <AttendanceChart />
        </div>
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, margin: 0 }}>Program-wise Enrollments</h4>
            <span className="badge badge-info">Regular Term</span>
          </div>
          <StudentChart />
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

    </div>
  );
};

export default Dashboard;

