import {Action, combineReducers} from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import {configureStore, ThunkAction} from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import createChromeStorage from 'redux-persist-chrome-storage';
import {appSlice, AppSliceState} from "~redux/slices/app.slice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {authSlice, AuthSliceState} from "~redux/slices/auth.slice";

const storage = createChromeStorage(chrome, 'local');

const combinedReducer = combineReducers({
  app: persistReducer<any>({
    key: 'app',
    storage,
    stateReconciler: autoMergeLevel2,
  }, appSlice.reducer),
  auth: persistReducer<any>({
    key: 'auth',
    storage,
    stateReconciler: autoMergeLevel2,
    blacklist: ['privateKey', 'loggedIn'],
  }, authSlice.reducer),
});

export const store = configureStore({
  reducer: persistReducer({
    key: 'hide-my-history',
    storage,
    blacklist: ['auth']
  }, combinedReducer),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);

export interface RootState {
  app: AppSliceState;
  auth: AuthSliceState;
}

export type AppDispatch = typeof store.dispatch;

export type AppThunkAction<R> = ThunkAction<R, RootState, unknown, Action>;


export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
