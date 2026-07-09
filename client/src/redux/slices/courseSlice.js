import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { courseService } from '../../services/courseService.js';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await courseService.getAllCourses();
    return data.courses || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchSubjects = createAsyncThunk('courses/fetchSubjects', async (_, thunkAPI) => {
  try {
    const data = await courseService.getSubjects();
    return data.subjects || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    coursesList: [],
    subjectsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.coursesList = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.subjectsList = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export default courseSlice.reducer;
