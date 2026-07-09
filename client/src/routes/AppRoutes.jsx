import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout.jsx';

// Route guards
import PrivateRoute from './PrivateRoute.jsx';
import PublicRoute from './PublicRoute.jsx';

// Auth Pages
import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';
import ForgotPassword from '../pages/Auth/ForgotPassword.jsx';
import ResetPassword from '../pages/Auth/ResetPassword.jsx';
import VerifyOTP from '../pages/Auth/VerifyOTP.jsx';

// Pages
import Dashboard from '../pages/Dashboard/Dashboard.jsx';
import Home from '../pages/Home/Home.jsx';

// Students
import StudentList from '../pages/Students/StudentList.jsx';
import AddStudent from '../pages/Students/AddStudent.jsx';
import EditStudent from '../pages/Students/EditStudent.jsx';
import StudentProfile from '../pages/Students/StudentProfile.jsx';
import StudentDetails from '../pages/Students/StudentDetails.jsx';

// Teachers
import TeacherList from '../pages/Teachers/TeacherList.jsx';
import AddTeacher from '../pages/Teachers/AddTeacher.jsx';
import EditTeacher from '../pages/Teachers/EditTeacher.jsx';
import TeacherProfile from '../pages/Teachers/TeacherProfile.jsx';

// Courses
import CourseList from '../pages/Courses/CourseList.jsx';
import AddCourse from '../pages/Courses/AddCourse.jsx';
import EditCourse from '../pages/Courses/EditCourse.jsx';
import Timetable from '../pages/Courses/Timetable.jsx';

// Subjects
import SubjectList from '../pages/Subjects/SubjectList.jsx';
import AddSubject from '../pages/Subjects/AddSubject.jsx';
import EditSubject from '../pages/Subjects/EditSubject.jsx';

// Attendance
import AttendanceList from '../pages/Attendance/AttendanceList.jsx';
import MarkAttendance from '../pages/Attendance/MarkAttendance.jsx';
import AttendanceReport from '../pages/Attendance/AttendanceReport.jsx';

// Exams
import ExamList from '../pages/Exams/ExamList.jsx';
import AddExam from '../pages/Exams/AddExam.jsx';
import Marks from '../pages/Exams/Marks.jsx';
import Result from '../pages/Exams/Result.jsx';

// Fees
import FeeList from '../pages/Fees/FeeList.jsx';
import CollectFee from '../pages/Fees/CollectFee.jsx';
import FeeReport from '../pages/Fees/FeeReport.jsx';

// Departments
import DepartmentList from '../pages/Departments/DepartmentList.jsx';
import AddDepartment from '../pages/Departments/AddDepartment.jsx';
import EditDepartment from '../pages/Departments/EditDepartment.jsx';

// Notices
import NoticeList from '../pages/Notice/NoticeList.jsx';
import AddNotice from '../pages/Notice/AddNotice.jsx';
import NoticeDetails from '../pages/Notice/NoticeDetails.jsx';

// Profile & Settings
import Profile from '../pages/Profile/Profile.jsx';
import ChangePassword from '../pages/Profile/ChangePassword.jsx';
import Settings from '../pages/Settings/Settings.jsx';

// Library, Hostels & Transport
import LibraryList from '../pages/Library/LibraryList.jsx';
import HostelList from '../pages/Hostels/HostelList.jsx';
import TransportList from '../pages/Transport/TransportList.jsx';

// 404
import NotFound from '../pages/NotFound/NotFound.jsx';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />

      {/* Public Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />

        {/* Students */}
        <Route path="students" element={<StudentList />} />
        <Route path="students/add" element={<PrivateRoute allowedRoles={['admin']}><AddStudent /></PrivateRoute>} />
        <Route path="students/edit/:id" element={<PrivateRoute allowedRoles={['admin', 'student']}><EditStudent /></PrivateRoute>} />
        <Route path="students/profile/:id" element={<StudentProfile />} />
        <Route path="students/details/:id" element={<StudentDetails />} />

        {/* Teachers */}
        <Route path="teachers" element={<TeacherList />} />
        <Route path="teachers/add" element={<PrivateRoute allowedRoles={['admin']}><AddTeacher /></PrivateRoute>} />
        <Route path="teachers/edit/:id" element={<PrivateRoute allowedRoles={['admin', 'faculty']}><EditTeacher /></PrivateRoute>} />
        <Route path="teachers/profile/:id" element={<TeacherProfile />} />

        {/* Courses */}
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/add" element={<PrivateRoute allowedRoles={['admin']}><AddCourse /></PrivateRoute>} />
        <Route path="courses/edit/:id" element={<PrivateRoute allowedRoles={['admin']}><EditCourse /></PrivateRoute>} />
        <Route path="timetable" element={<Timetable />} />

        {/* Subjects */}
        <Route path="subjects" element={<SubjectList />} />
        <Route path="subjects/add" element={<PrivateRoute allowedRoles={['admin']}><AddSubject /></PrivateRoute>} />
        <Route path="subjects/edit/:id" element={<PrivateRoute allowedRoles={['admin']}><EditSubject /></PrivateRoute>} />

        {/* Attendance */}
        <Route path="attendance" element={<AttendanceList />} />
        <Route path="attendance/mark" element={<PrivateRoute allowedRoles={['admin', 'faculty']}><MarkAttendance /></PrivateRoute>} />
        <Route path="attendance/report" element={<AttendanceReport />} />

        {/* Exams */}
        <Route path="exams" element={<ExamList />} />
        <Route path="exams/add" element={<PrivateRoute allowedRoles={['admin', 'faculty']}><AddExam /></PrivateRoute>} />
        <Route path="exams/marks" element={<PrivateRoute allowedRoles={['admin', 'faculty']}><Marks /></PrivateRoute>} />
        <Route path="exams/result" element={<Result />} />

        {/* Fees */}
        <Route path="fees" element={<FeeList />} />
        <Route path="fees/collect" element={<PrivateRoute allowedRoles={['admin']}><CollectFee /></PrivateRoute>} />
        <Route path="fees/report" element={<FeeReport />} />

        {/* Departments */}
        <Route path="departments" element={<DepartmentList />} />
        <Route path="departments/add" element={<PrivateRoute allowedRoles={['admin']}><AddDepartment /></PrivateRoute>} />
        <Route path="departments/edit/:id" element={<PrivateRoute allowedRoles={['admin']}><EditDepartment /></PrivateRoute>} />

        {/* Notices */}
        <Route path="notice" element={<NoticeList />} />
        <Route path="notice/add" element={<PrivateRoute allowedRoles={['admin']}><AddNotice /></PrivateRoute>} />
        <Route path="notice/details/:id" element={<NoticeDetails />} />

        {/* Profile & Settings */}
        <Route path="profile" element={<Profile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
        <Route path="settings" element={<PrivateRoute allowedRoles={['admin']}><Settings /></PrivateRoute>} />

        {/* Library, Hostels & Transport */}
        <Route path="library" element={<LibraryList />} />
        <Route path="hostels" element={<HostelList />} />
        <Route path="transport" element={<TransportList />} />
      </Route>

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
