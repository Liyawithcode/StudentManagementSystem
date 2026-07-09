import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { feeService } from '../../services/feeService.js';

export const fetchAllFees = createAsyncThunk('fees/fetchAll', async (_, thunkAPI) => {
  try {
    const data = await feeService.getAllFees();
    return data.fees || data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const feeSlice = createSlice({
  name: 'fees',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default feeSlice.reducer;
