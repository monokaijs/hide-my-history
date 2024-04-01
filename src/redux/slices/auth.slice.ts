import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type ThemeType = 'light' | 'dark';

export interface AuthSliceState {
  loggedIn: boolean;
  privateKey?: string;
  encryptedPrivateKey?: string;
  publicKey?: string;
}

const initialState: AuthSliceState = {
  loggedIn: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthData(state, action: PayloadAction<Partial<AuthSliceState>>) {
      return {
        ...state,
        ...action.payload,
      }
    }
  },
  extraReducers: builder => {
  }
});

export const {
  setAuthData
} = authSlice.actions;

export default authSlice.reducer;

