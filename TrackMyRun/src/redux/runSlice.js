//zarządzanie aktywnym biegiem
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRunning: false,
  startTime: null,
  duration: 0,
  locations: [], 
};

const runSlice = createSlice({
  name: 'run',
  initialState,
  reducers: {
    startRun: (state) => {
      state.isRunning = true;
      state.startTime = Date.now();
      state.locations = [];
      state.duration = 0;
    },
    stopRun: (state) => {
      state.isRunning = false;
    },
    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },
    updateDuration: (state) => {
      state.duration = Date.now() - state.startTime;
    },
    resetRun: () => initialState,
  },
});

export const { startRun, stopRun, addLocation, updateDuration, resetRun } = runSlice.actions;
export default runSlice.reducer;
