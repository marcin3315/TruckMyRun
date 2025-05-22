//zarządzanie historią biegów
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  runs: [], // lista zakończonych biegów
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addRunToHistory: (state, action) => {
      state.runs.push(action.payload);
      saveHistoryToStorage([...state.runs]);
    },
    clearHistory: (state) => {
      state.runs = [];
      AsyncStorage.removeItem('@runHistory');
    },
    setHistoryFromStorage: (state, action) => {
      state.runs = action.payload || [];
    },
  },
});

//Funkcja pomocnicza do zapisu
const saveHistoryToStorage = async (runs) => {
  try {
    await AsyncStorage.setItem('@runHistory', JSON.stringify(runs));
  } catch (e) {
    console.warn('Błąd zapisu historii:', e);
  }
};

//Funkcja do pobrania historii (do wywołania przy starcie)
export const loadHistoryFromStorage = () => async (dispatch) => {
  try {
    const data = await AsyncStorage.getItem('@runHistory');
    const parsed = data ? JSON.parse(data) : [];
    dispatch(setHistoryFromStorage(parsed));
  } catch (e) {
    console.warn('Błąd odczytu historii:', e);
  }
};

export const { addRunToHistory, clearHistory, setHistoryFromStorage } = historySlice.actions;
export default historySlice.reducer;
