import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark';

export interface AppSliceState {
  theme: ThemeType;
  incognitoMode: boolean;
}

const initialState: AppSliceState = {
  theme: 'light',
  incognitoMode: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppState(state, action: PayloadAction<AppSliceState>) {
      state = {
        ...state,
        ...action.payload,
      };
    },
    setTheme(state, action: PayloadAction<ThemeType>) {
      state.theme = action.payload;
    },
    setIncognitoMode(state, action: PayloadAction<boolean>) {
      state.incognitoMode = action.payload;
    }
  },
  extraReducers: builder => {
  }
});

export const {
  setTheme,
  setIncognitoMode,
  setAppState,
} = appSlice.actions;

export default appSlice.reducer;

