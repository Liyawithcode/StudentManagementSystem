import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studentService } from '../../services/studentService.js';

export const fetchStudents = createAsyncThunk('students/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await studentService.getAllStudents();
    return data.students || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchStudentById = createAsyncThunk('students/fetchById', async (id, thunkAPI) => {
  try {
    const data = await studentService.getStudentById(id);
    return data.student || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const studentSlice = createSlice({
  name: 'students',
  initialState: {
    list: [],
    currentStudent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentStudent } = studentSlice.actions;
export default studentSlice.reducer;
