import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { noticeService } from '../../services/noticeService.js';

export const fetchNotices = createAsyncThunk('notices/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await noticeService.getNotices();
    return data.notices || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const noticeSlice = createSlice({
  name: 'notices',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default noticeSlice.reducer;
