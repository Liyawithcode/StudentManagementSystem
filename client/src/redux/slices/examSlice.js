import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examService } from '../../services/examService.js';

export const fetchExamSchedules = createAsyncThunk('exams/fetchSchedules', async (_, thunkAPI) => {
  try {
    const data = await examService.getExamSchedules();
    return data.schedules || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const fetchAllResults = createAsyncThunk('exams/fetchAllResults', async (_, thunkAPI) => {
  try {
    const data = await examService.getAllResults();
    return data.results || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const examSlice = createSlice({
  name: 'exams',
  initialState: {
    schedules: [],
    results: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExamSchedules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExamSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchExamSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllResults.fulfilled, (state, action) => {
        state.results = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export default examSlice.reducer;
