import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark';

export interface AppSliceState {
  theme: ThemeType;
}

const initialState: AppSliceState = {
  theme: 'light',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
    }
  },
  extraReducers: builder => {
  }
});

export const {
  setTheme
} = appSlice.actions;

export default appSlice.reducer;

