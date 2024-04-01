import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark';

export interface AppSliceState {
  theme: ThemeType;
  incognitoMode: boolean;
  incognitoTime: number;
  whitelisted: WhitelistedUrl[];
}

const initialState: AppSliceState = {
  theme: 'light',
  incognitoMode: false,
  incognitoTime: 0,
  whitelisted: [],
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
      if (action.payload) {
        state.incognitoTime = new Date().getTime();
      }
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

