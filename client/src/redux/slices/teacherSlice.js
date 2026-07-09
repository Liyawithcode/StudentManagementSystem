import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teacherService } from '../../services/teacherService.js';

export const fetchTeachers = createAsyncThunk('teachers/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await teacherService.getAllTeachers();
    return data.faculties || data.teachers || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const teacherSlice = createSlice({
  name: 'teachers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default teacherSlice.reducer;
