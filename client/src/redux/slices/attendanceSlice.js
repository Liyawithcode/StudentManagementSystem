import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { attendanceService } from '../../services/attendanceService.js';

export const fetchStudentAttendance = createAsyncThunk('attendance/fetchStudent', async (params, thunkAPI) => {
  try {
    const data = await attendanceService.getStudentAttendance(params);
    return data.attendance || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    studentAttendance: [],
    courseAttendance: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.studentAttendance = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
