//zarządzanie aktywnym biegiem
import { createSlice } from "@reduxjs/toolkit";
import { calculateDistance } from "../utils/calculateDistance";

const initialState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  locations: [],
};

const runSlice = createSlice({
  name: "run",
  initialState,
  reducers: {
    startRun: (state) => {
      state.isRunning = true;
      state.isPaused = false;
      state.startTime = Date.now();
      state.locations = [];
    },
    stopRun: (state) => {
      state.isRunning = false;
    },
    pauseRun: (state) => {
      state.isPaused = true;
    },

    resumeRun: (state) => {
      state.isPaused = false;
    },

    addLocation: (state, action) => {
      const { latitude, longitude, timestamp } = action.payload || {};
      const isPaused = state.isPaused;

      // Sprawdza poprawność danych
      const isValid =
        typeof latitude === "number" &&
        typeof longitude === "number" &&
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180;

      if (!isValid) {
        console.warn("Nieprawidłowe dane lokalizacji:", action.payload);
        return; // nie dodaje błędnych danych
      }

      // dodaj punkt tylko jeśli nie zapauzowany
      state.locations.push({
        latitude,
        longitude,
        timestamp,
        paused: isPaused,
      });
    },

    resetRun: () => initialState,
  },
});

//selector do obliczania dystansu w czasie rzeczywistym na podstawie lokalizacji
export const selectDistance = (state) => {
  const allLocations = state.run.locations;

  // 🔍 odfiltrowujemy punkty tylko z aktywnego biegu (nie zapauzowane)
  const activeLocations = allLocations.filter((loc) => !loc.paused);

  if (activeLocations.length < 2) return 0;

  // 📏 obliczamy dystans w km
  return calculateDistance(activeLocations);
};

export const { startRun, stopRun, addLocation, resetRun, pauseRun, resumeRun } =
  runSlice.actions;
export default runSlice.reducer;
