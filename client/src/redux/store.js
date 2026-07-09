import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import studentReducer from './slices/studentSlice.js';
import teacherReducer from './slices/teacherSlice.js';
import courseReducer from './slices/courseSlice.js';
import attendanceReducer from './slices/attendanceSlice.js';
import examReducer from './slices/examSlice.js';
import feeReducer from './slices/feeSlice.js';
import noticeReducer from './slices/noticeSlice.js';
import dashboardReducer from './slices/dashboardSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    courses: courseReducer,
    attendance: attendanceReducer,
    exams: examReducer,
    fees: feeReducer,
    notices: noticeReducer,
    dashboard: dashboardReducer,
  },
});
